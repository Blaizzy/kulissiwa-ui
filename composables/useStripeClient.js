import { loadStripe } from '@stripe/stripe-js';

export default function useStripeClient() {
    const stripe = loadStripe(process.env.STRIPE_PUBLISHABLE_KEY);
    return stripe;
}