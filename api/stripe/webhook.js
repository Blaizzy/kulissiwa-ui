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
    const rawBody = Buffer(await request.text());
    let event;
  
    try{
        event = stripe.webhooks.constructEventAsync(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
        console.error(`⚠️  Webhook signature verification failed.`);
        return new Response(JSON.stringify({ received: false }), { status: 400 });
    }

    let subscription;
    let status;
  
    // Handle the event
    switch (event.type) {

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
