<template>

<div
    v-show="showModal"
    class="fixed inset-0 flex justify-center z-50 overflow-y-auto"
    :class="{ 'opacity-0 pointer-events-none': !showModal }">
        <div class="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div class="bg-white rounded-lg shadow-lg w-4/5 xl:w-1/2 z-50 flex flex-col text-black dark:text-gray-200 dark:bg-neutral-900">
                <div class="flex justify-between px-4 pt-4 pb-4 sticky top-0 z-10 max-h-20 rounded-t-lg">
                    <div class="flex flex-1 justify-center text-3xl">
                        <h1 class="font-regular mr-1">Kulissiwa</h1>
                        <h3 class="animated-gradient-text font-bold">Pro</h3>
                    </div>
                <div>
                <button
                @click="closeModal()"
                class=" px-2 text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-400"
                >
                    <ClientOnly>
                        <i class="fas fa-times" ></i>
                    </ClientOnly>
                </button>
            </div>
        </div>
        <div class="md:flex items-center justify-center space-x-4 mx-4 bg-white rounded-lg dark:bg-neutral-900 pb-4">
          <div class="md:w-1/2 parent-card space-x-2 bg-white p-2 px-4 dark:bg-inherit">
            <div class="flex items-center justify-between py-2 px-2">
              <div class="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 mr-1">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75" />
                </svg>

                <h3 class="text-lg"> Upload Documents </h3>
              </div>

            </div>
            <p class="font-light text-gray-500 dark:text-gray-400">Ask anything to your PDFs, Docx, text, and get answers in seconds.</p>
          </div>
          <div class="md:w-1/2 parent-card md:space-x-2 bg-white p-2 md:px-4 dark:bg-inherit">
            <div class="flex items-center justify-between py-2 md:px-2">
              <div class="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 mr-1">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
                </svg>
                <h3 class="text-lg"> Powerful AI Models </h3>
              </div>

            </div>
            <p class="font-light text-gray-500 dark:text-gray-400">Access GPT-4, Mixtral and Gemini Pro for more accurate answers.</p>
          </div>
        </div>

      <div class="flex flex-col md:flex-row items-center justify-center md:space-x-4 mx-4 bg-white rounded-lg dark:bg-neutral-900 pb-4">
        <div v-show="isLoading" class="flex space-x-4 bg-white px-2 py-10 dark:bg-neutral-900">
          <LoadingIndicatorModal />
        </div>

        <div class="w-full mb-2 md:mb-0 md:w-1/2 parent-card space-x-2 bg-white p-2 mpx-4 rounded-lg border-2 border-gray-200 dark:bg-neutral-800 dark:border-none"
          v-for="price in prices" :key="price.id">

            <div class="flex items-center justify-between py-2 px-2"
            >
              <h3
              class="text-sky-500 text-lg" v-if="price.recurring.interval == 'month'"
              > Monthly </h3>
              <h3 class="text-sky-500 text-lg" v-else
              > Yearly </h3>
              <p class="text-sm font-regular bg-sky-200 dark:text-gray-300 dark:bg-neutral-700 px-2 py-1 rounded-full" v-if="price.recurring.interval != 'month'"> Save $40 a year </p>
            </div>

            <div class="flex items-end">
              <h5 class="text-2xl font mr-1 dark:text-gray-200"> ${{ price.unit_amount_decimal / 100 }}</h5>
            </div>

            <p class="text-md font-light text-gray-500 dark:text-gray-400"
            :class="{ 'mb-10': price.recurring.interval == 'month', 'mb-4': price.recurring.interval != 'month'}"
            > billed per {{ price.recurring.interval }} </p>

            <p class="text-md font-light text-sky-500" v-if="price.recurring.interval != 'month'"> <ClientOnly><i class="fas fa-check text-sky-600 pr-1"></i></ClientOnly> 14 day free trial </p>

            <div class="flex">
              <div class="flex-grow py-2 mr-1">
                <form @submit.prevent="handleSubmit" method="POST">
                  <!-- Add a hidden field with the price ID -->
                  <input type="hidden" name="price_id" :value="price.id"/>
                  <button id="checkout-and-portal-button" class="w-full text-md bg-sky-600 font-medium rounded-lg px-2 py-2 text-white dark:text-neutral-900 hover:bg-sky-600/80" type="submit"> Get Started <i class="fa-solid fa-arrow-right"></i>
                  </button>
                </form>
              </div>

            </div>

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
    props: {
        showModal: {
            type: Boolean,
            required: true,
        }
    },
    setup(props) {
        const showModal = ref(props.showModal)
        watchEffect(() => {
            showModal.value = props.showModal
        })
        return {
            showModal
        }
    },
    data() {
      const store = useAuthStore();
      const { trackEvent, identifyUser } = useMixpanel();
      return {
          prices: [],
          store: store,
          isLoading: false,
          trackEvent: trackEvent,
          identifyUser: identifyUser,
      }
    },
    async mounted() {
      this.isLoading = true;
      try {
          const response = await fetch('/api/stripe/get-prices');
          const data = await response.json();
          // sort prices by price
          data.data.sort((a, b) => a.unit_amount_decimal - b.unit_amount_decimal);

          if (data) {
              this.prices = data.data.filter(price => price.product && price.product.active);

          } else {
              console.error("Error fetching prices:", data.message);
          }
      }catch (error) {
          console.error("Error fetching prices:", error);
      }
      this.isLoading = false;
    },
    methods: {
      closeModal() {
        this.$emit("close-modal");
      },

      async handleSubmit(event) {
        const priceId = event.target.price_id.value;

        // (Mixpanel) Identify user by email and track event
        this.trackEvent('Created Checkout Session', {
            'price_id': priceId,
            'price': this.prices.find(price => price.id === priceId).unit_amount_decimal,
            'interval': this.prices.find(price => price.id === priceId).recurring.interval,
        });

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
