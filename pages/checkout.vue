<template>

    <section>
    <h1>Checkout</h1>
    <div class="pricing" v-for="price in prices" :key="price.id">
        <div class="product">
            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="14px" height="16px" viewBox="0 0 14 16" version="1.1">
            <!-- SVG content omitted for brevity -->
            </svg>
            <div class="description">
            <h3>{{ price.product.name }}</h3>
            <h5>{{ price.unit_amount_decimal / 100 }} / {{ price.recurring.interval }}</h5>
            </div>
        </div>
        <form @submit.prevent="handleSubmit" method="POST">
            <!-- Add a hidden field with the price ID -->
            <input type="hidden" name="price_id" :value="price.id"/>
            <button id="checkout-and-portal-button" type="submit">Checkout</button>
        </form>
    </div>
    </section>

  </template>

<script>
import { useAuthStore } from '@/stores/index'
export default {
  name: 'Checkout',
  data() {
    const store = useAuthStore();
    return {
        prices: [],
        store: store,
    }
  },
  async mounted() {
    try {
        const response = await fetch('/api/stripe/get-prices');
        const data = await response.json();
        if (data) {
            this.prices = data.data;
        } else {
            console.error("Error fetching prices:", data.message);
        }
    }catch (error) {
        console.error("Error fetching prices:", error);
    }
  },methods: {
    async handleSubmit(event) {
      const priceId = event.target.price_id.value;

      try {
        const response = await fetch('/api/stripe/create-checkout-session', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({ 
                price_id: priceId,
                user_id: this.store.user_session.user.id,
                customer_email: this.store.user_session.user.email, 
            }),
        });

        const session = await response.json();

        if (session.url) {
            window.location.href = session.url;
        } else {
            console.error('Failed to retrieve checkout URL');
        }
      } catch (error) {
            console.error('Error during checkout:', error);
      }
    }
  },
}
</script>
