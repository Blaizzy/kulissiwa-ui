<script setup>
import { useAuthStore } from '~/stores';

definePageMeta({
  middleware: 'auth',
});
</script>
<template>
    <div class="flex flex-col h-full w-full">
     
     <div class="flex justify-between items-center pb-4 px-4 pt-4 border-b border-gray-200 w-full bg-white relative"> <!-- Added relative here -->
         <div class="flex">
             <h1 class="text-xl font-semibold">Billing</h1>
          </div>
      
         <!-- Other billing-related content can go here -->
    </div>
    <div class="flex mt-4 px-4 text-sm py-2">

      <button class="py-2 px-2 rounded-full hover:scale-105 animated-gradient-bg text-white" @click="redirectToBillingPortal">
        <ClientOnly>
          <span class="text-md mr-1">Manage Subscription</span>
          <i class="fa-solid fa-up-right-from-square h-3 w-3"></i>
        </ClientOnly>
      </button>
    </div>
  </div>

</template>

<script>
export default {
  data() {
    const store= useAuthStore();
    return {
      store: store,
    }
  },

  methods: {
    async redirectToBillingPortal() {
      const supabase = await useSupabaseClient();
      const { data, error } = await supabase
        .from('subscriptions')
        .select('stripe_customer_id')
        .eq('user_id', this.store.user_session.user.id)
        .single();
        
      if (error) {
        console.error('Error getting subscription:', error);
        return;
      }
      if (!data) {
        console.error('No subscription found for this user');
        return;
      }
      const stripe_customer_id = data.stripe_customer_id;
      // Here you'll call your server to create a billing portal session and get the URL.
      // For simplicity, let's use fetch:
      try {
        const response = await fetch('/api/stripe/create-portal-session', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: new URLSearchParams({ customer_id: stripe_customer_id })
          // Add any necessary data like session_id if needed
        });

        const data = await response.json();
        
        if (data && data.url) {
          window.location.href = data.url; // Redirect to the portal
        }
      } catch (error) {
        console.error('Error redirecting to billing portal:', error);
      }
    },
  },
}
</script>

<style>

</style>