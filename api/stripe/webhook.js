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
    const user_id = customer.metadata.user_id;
    try {
        const { data, error } = await supabase
            .from('subscriptions')
            .delete()
            .eq('user_id', user_id);

        if (error) {
            console.error('Failed to delete subscription in Supabase:', error);
        }
        if (data) {
            console.log(`Subscription ${data[0].id} deleted in Supabase.`);
        }
    } catch (err) {
        console.error("error", err);
    }
}
async function handleCustomerCreated(customer) {
    const user_id = customer.metadata.user_id;
    try {
        const { data, error } = await supabase
            .from('subscriptions')
            .insert([
                {
                    user_id: user_id,
                    stripe_customer_id: customer.id,
                    status: 'pending',
                },
            ]);

        if (error) {
            console.error('Failed to insert subscription in Supabase:', error);
        }
        if (data) {
            console.log(`Subscription ${data[0].id} inserted in Supabase.`);
        }
    } catch (err) {

        console.error("Failed to retrieve product from Stripe:", err);
    }
}

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
}
export default async function webhookHandler(request) {
    const sig = request.headers.get('stripe-signature');
    const rawBody = Buffer.from(await request.text());
    let event;
  
    try {
        event = stripe.webhooks.constructEventAsync(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
        console.error(`⚠️  Webhook signature verification failed.`);
        return new Response(JSON.stringify({ received: false }), { status: 400 });
    }

    let subscription;
    let status;
    let customer;
    // Handle the event
    switch (event.type) {
        case 'checkout.session.completed':
            const session = event.data.object;
            const customerId = session.customer;
            const metadata = session.metadata;

            // Update the customer with metadata from the session
            await stripe.customers.update(customerId, {
                metadata: metadata
            });
            break;
        case 'customer.created':
            customer = event.data.object;
            console.log(`Customer ${customer.id} created.`);
            console.log(`Customer email: ${customer.email}.`);
            console.log(`Customer user_id: ${customer.metadata}.`);
            // Then define and call a method to handle the customer created.
            // handleCustomerCreated(customer);
            break;
        case 'customer.deleted':
            customer = event.data.object;
            console.log(`Customer ${customer.id} deleted.`);
            console.log(`Customer email: ${customer.email}.`);
            console.log(`Customer user_id: ${customer.metadata}.`);
            // Then define and call a method to handle the customer deleted.
            // handleCustomerDeleted(customer);
            break;
        case 'customer.subscription.created':
            subscription = event.data.object;
            status = subscription.status;
            console.log(`Subscription status is ${status}.`);
            // Then define and call a method to handle the subscription created.
            // handleSubscriptionCreated(subscription);
            await handleSubscription(subscription, status);
            break;
        case 'customer.subscription.deleted':
            subscription = event.data.object;
            status = subscription.status;
            if (subscription.cancel_at_period_end) {
                status = 'canceled';
            }
            console.log(`Subscription status is ${status}.`);
            // Then define and call a method to handle the subscription deleted.
            // handleSubscriptionDeleted(subscription);
            await handleSubscription(subscription, status);
            break;
        case 'customer.subscription.updated':
            subscription = event.data.object;
            status = subscription.status;
            if (subscription.cancel_at_period_end) {
                status = 'canceled';
            }
            console.log(`Subscription status is ${status}.`);
    
            await handleSubscription(subscription, status);
            break;

        default:
            return new Response(JSON.stringify({ received: true }));
    }
  
    // Return a response to Stripe to acknowledge receipt of the event
    return new Response(JSON.stringify({ received: true }));
}
