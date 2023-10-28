import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
let stripe;
let supabase;
const { Buffer } = require('buffer');
try {
    stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
} catch (error) {
    console.error('Failed to import Stripe:', error);

}

try {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_KEY;
    supabase = createClient(supabaseUrl, supabaseKey);
} catch (error) {
    console.error('Failed to import Supabase:', error);
}


export const config = {
    runtime: 'edge',
};

async function handleCustomerDeleted(customer) {
    try {
        const { data, error } = await supabase
            .from('subscriptions')
            .delete()
            .eq('stripe_customer_id', customer.id)

        if (error) {
            console.error('Failed to delete subscription in Supabase:', error);
            
        }
        if (data) {
            console.log(`Subscription ${data[0].id} deleted in Supabase.`);
        }
    } catch (err) {
        console.error("error", err);
    }
};


async function handleSubscription(subscription, status) {
    // Step 1: Extract Product ID
    let productID = subscription.items.data[0].price.product;

    // Step 2: Fetch product details from Stripe
    try {
        const product = await stripe.products.retrieve(productID);
        const productName = product.name;

        // Update subscription in Supabase
        const { data, error } = await supabase
            .from('subscriptions')
            .update({
                plan_name: productName,
                status: status
            })
            .eq('stripe_customer_id', subscription.customer);
        
        if (error) {
            console.error('Failed to update subscription in Supabase:', error);
        } else {
            console.log(`Subscription ${subscription.id} updated in Supabase.`);
        }


    } catch (err) {
        console.error("Failed to retrieve product from Stripe:", err);
    }
};

export default async function webhookHandler(request) {
    const sig = request.headers.get('stripe-signature');
    const rawBody = Buffer.from(await request.text());
    let event;
  
    try {
        event = await stripe.webhooks.constructEventAsync(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
        console.error(`⚠️  Webhook signature verification failed.`);
        return new Response(JSON.stringify({ received: false }), { status: 400 });
    }

    console.log(`🔔  Received event: ${event.type}`);

    let subscription;
    let status;
    let customer;
    // Handle the event
    switch (event.type) {
        case 'checkout.session.completed':
            const session = event.data.object;
            const customerId = session.customer;
            const metadata = session.metadata;
            console.log("Updating customer:", customerId, "with metadata:", metadata);

            try {
                const updatedCustomer = await stripe.customers.update(customerId, {
                    name: session.customer_details.name,
                    address: session.customer_details.address,
                    phone: session.customer_details.phone,
                    tax_exempt: session.customer_details.tax_exempt,
                    tax_ids: session.customer_details.tax_ids,
                    metadata: metadata,
                });
            } catch (err) {
                console.error("Failed to update customer in Stripe:", err);
            }
            break;
        
        case 'customer.deleted':
            customer = event.data.object;
            console.log(`Customer ${customer.id} deleted.`);
            // Delete subscription in Supabase
            await handleCustomerDeleted(customer);
            break;

        case 'customer.subscription.created':
            subscription = event.data.object;
            status = subscription.status;
            console.log(`Subscription status is ${status}.`);
            // Create subscription in Supabase
            await handleSubscription(subscription, status);
            break;

        case 'customer.subscription.updated':
            subscription = event.data.object;
            status = subscription.status;
            if (subscription.cancel_at_period_end) {
                status = 'canceled';
            }
            console.log(`Subscription status is ${status}.`);
            // Update subscription in Supabase
            await handleSubscription(subscription, status);
            break;

        default:
            return new Response(JSON.stringify({ received: true }));
    }
  
    // Return a response to Stripe to acknowledge receipt of the event
    return new Response(JSON.stringify({ received: true }));
}
