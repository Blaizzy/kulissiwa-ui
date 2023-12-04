<template>

  <div class="flex flex-col h-full w-full">
     
    <div class="flex justify-between items-center pb-4 px-4 pt-4 mb-8 border-b border-gray-200 w-full bg-white relative"> <!-- Added relative here -->
      <div class="flex">
        <h1 class="text-2xl font-semibold">Choose your plan</h1>
      </div>
    </div>
    <div class="flex items-center justify-center space-x-4 bg-white px-2">
      <div v-show="isLoading" class="flex items-center justify-center space-x-4 bg-white px-2">
        <LoadingIndicator />
      </div>
      <div class="w-1/4 parent-card space-x-2 bg-white p-2 px-4 rounded-lg border-2 border-gray-200"
        v-for="price in prices" :key="price.id">

          <div class="rounded-full p-3"
          >
            <h3 
            :class="{'animated-gradient-text font-bold text-2xl': price.product.name == 'Pro', 'text-gray-700 font-semibold text-lg': price.product.name != 'Pro'}"
            >{{ price.product.name }}</h3>
          </div>
          <div class="flex items-center py-1">
            <p class="text-sm text-gray-400 break-words">{{ price.product.description }}</p>
          </div>
          <div class="flex items-end py-3">
              <h5 class="text-5xl font-bold mr-1"> ${{ price.unit_amount_decimal / 100 }}</h5>
              <p class="text-sm font-semibold text-gray-400"> / {{ price.recurring.interval }}</p>
          </div>
          <div class="py-2">
            <p class="text-sm text-gray-700">You get:</p>
            <div v-for="feature in price.product.features" :key="feature" class="flex items-center space-x-2">
              <ClientOnly>
                <i class="fa-solid fa-circle-check text-xs text-gray-600"></i>
              </ClientOnly>
              <p class="text-sm text-gray-700">{{ feature.name }}</p>
            </div>
          </div>
          <div class="flex flex-col justify-items-center items-center">
            <div class="flex py-2">
              <form @submit.prevent="handleSubmit" method="POST">
                <!-- Add a hidden field with the price ID -->
                <input type="hidden" name="price_id" :value="price.id"/>
                <button id="checkout-and-portal-button" class="text-sm animated-gradient-bg font-medium rounded-lg px-2 py-2 text-white hover:scale-110" type="submit"> Subscribe <i class="fa-solid fa-arrow-right"></i>
                </button>
              </form>
            </div>
            <div class="flex flex-col text-center">
              <p class="text-xs text-gray-400 font-semibold">
                <i class="fa-solid fa-arrow-rotate-right"></i>
                14-day money-back guarantee
              </p>
              <p class="text-xs text-gray-400">
                By clicking the purchase button above you agree with our terms.
              </p>
            </div>
          </div>

      </div> 
    </div>
  </div>
  

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
        isLoading: false,
    }
  },
  async mounted() {
    this.isLoading = true;
    try {
        const response = await fetch('/api/stripe/get-prices');
        const data = await response.json();
        
        if (data) {
            this.prices = data.data.filter(price => price.product && price.product.active);
        } else {
            console.error("Error fetching prices:", data.message);
        }
    }catch (error) {
        console.error("Error fetching prices:", error);
    }
    this.isLoading = false;
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
