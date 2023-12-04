import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
let stripe;
let supabase;
try {
    stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
} catch (error) {
    console.error('Failed to require Stripe:', error);
}

try{
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_KEY;
    supabase = createClient(supabaseUrl, supabaseKey);
} catch (error) {
    console.error('Failed to import Supabase:', error);
}

export const config = {
    runtime: 'edge',
};

const BASE_URL = process.env.BASE_URL;

async function handleCustomerCreated(customerId, user_id) {
    try {
        const { data, error } = await supabase
            .from('subscriptions')
            .insert([
                {
                    user_id: user_id,
                    stripe_customer_id: customerId,
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
};

async function getOrCreateStripeCustomer(customerEmail) {
    // Retrieve the Customer by Email
    let customers = await stripe.customers.list({ email: customerEmail, limit: 1 });
    
    if (customers.data.length) {
        const customerId = customers.data[0].id;
        // Check for Active Subscriptions
        let subscriptions = await stripe.subscriptions.list({ customer: customerId, status: 'active' });
        
        // Return consistent object type
        return {
            customerId: customerId,
            hasActiveSubscription: subscriptions.data.length > 0
        };
    }

    // If customer doesn't exist, return null
    return null;
}

export default async function createCheckoutSession(request) {
    if (request.method !== 'POST') {
        return new Response(JSON.stringify('Method not allowed'), { status: 405 });
    }
    
    const body = new URLSearchParams(await request.text());
    const priceId = body.get('price_id');
    const user_id = body.get('user_id');
    const customerEmail = body.get('customer_email');
    const customerData = await getOrCreateStripeCustomer(customerEmail);
    let sessionData = {
        billing_address_collection: 'auto',
        line_items: [
            {
                price: priceId,
                quantity: 1,
            },
        ],
        metadata: {
            user_id: user_id,
        },
        mode: 'subscription',
        success_url: `${BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${BASE_URL}/cancel`,
    };

    if (customerData) {
        if (customerData.hasActiveSubscription) {
            console.log(`Customer ${customerData.customerId} has an active subscription, redirecting to billing portal.`);
            const portalSession = await stripe.billingPortal.sessions.create({
                customer: customerData.customerId,
                return_url: `${BASE_URL}/billing`,
            });
            return new Response(JSON.stringify(portalSession), {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // If customer exists, use their ID
        sessionData.customer = customerData.customerId;
    } else {
        // Otherwise, use the email to create a new customer
        try {
            const customer = await stripe.customers.create({
                email: customerEmail,
            });
            await handleCustomerCreated(customer.id, user_id);
            sessionData.customer = customer.id;
        } catch (error) {
            return new Response(JSON.stringify(error), {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            });
        }
    }

    try {
        const session = await stripe.checkout.sessions.create(sessionData);

        return new Response(JSON.stringify(session), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        return new Response(JSON.stringify(error), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
