import Stripe from 'stripe';
let stripe;
try {
    stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
} catch (error) {
    console.error('Failed to import Stripe:', error);

}

export const config = {
    runtime: 'edge',
};

const BASE_URL = process.env.BASE_URL;

export default async function createCheckoutSession(request) {

    if (request.method === 'POST') {
        const body = new URLSearchParams(await request.text());
        const customer_id = body.get('customer_id');
        try {
            const portalSession = await stripe.billingPortal.sessions.create({
                customer: customer_id,
                return_url: `${BASE_URL}/settings/account`,
            });

            return new Response(JSON.stringify({ url: portalSession.url }), {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            });
        } catch (error) {
            console.error('Stripe error:', error);
            return new Response(JSON.stringify(error), {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            });
        }
    } else {
        return new Response(JSON.stringify('Method not allowed'), { status: 405 });
    }
}
