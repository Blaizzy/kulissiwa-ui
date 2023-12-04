import Stripe from 'stripe';
let stripe;
try {
    stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
} catch (error) {
    console.error('Failed to require Stripe:', error);
}

export const config = {
    runtime: 'edge',
};
   

export default async function getPrices(request) {
    // // Only allow requests from the same origin
    if (request.url !== process.env.BASE_URL + '/api/stripe/get-prices') {
        return new Response(JSON.stringify('Not found'), { status: 404 });
    }
    // // Only allow GET requests
    if (request.method !== 'GET') {
        return new Response(JSON.stringify('Method not allowed'), { status: 405 });
    }
    try {
        const prices = await stripe.prices.list({
            active: true,
            expand: ['data.product'],
        });
        
        return new Response(JSON.stringify(prices), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        })
    } catch (error) {
        return new Response(JSON.stringify(error), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        })
    }
  }