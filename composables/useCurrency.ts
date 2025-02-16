export const useCurrency = (amount: Ref<number>) => {
   const currency = computed(() => {
      return new Intl.NumberFormat("en-IN", {
         style: "currency",
         currency: "EUR",
      }).format(amount.value);
   });

   return {
      currency,
   };
};
