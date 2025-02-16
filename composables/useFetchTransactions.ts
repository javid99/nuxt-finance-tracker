export const useFetchTransactions = (
   period: ComputedRef<{ from: Date; to: Date } | undefined>
) => {
   const supabase = useSupabaseClient();

   const transactions = ref<any[]>([]);
   const isLoading = ref(false);

   const income = computed(() => {
      return transactions.value.filter((t) => t.type === "Income");
   });

   const expense = computed(() => {
      return transactions.value.filter((t) => t.type === "Expense");
   });

   const incomeCount = computed(() => {
      return (<any>income.value).length;
   });

   const expenseCount = computed(() => {
      return (<any>expense.value).length;
   });

   const incomeTotal = computed((): number => {
      return (<any>income.value).reduce(
         (sum: number, transaction: { amount: number }) => (sum += transaction.amount),
         0
      );
   });

   const expenseTotal = computed((): number => {
      return (<any>expense.value).reduce(
         (sum: number, transaction: { amount: number }) => (sum += transaction.amount),
         0
      );
   });

   const fetchTransactions = async () => {
      isLoading.value = true;
      try {
         const { data } = await useAsyncData(
            `transactions-${period.value?.from.toDateString()}-${period.value?.to.toDateString()}`,
            async () => {
               const { data, error } = await supabase
                  .from("transactions")
                  .select()
                  .gte("created_at", period.value?.from.toISOString())
                  .lte("created_at", period.value?.to.toISOString())
                  .order("created_at", { ascending: false });

               if (error) return [];

               return data;
            }
         );

         return data.value;
      } finally {
         isLoading.value = false;
      }
   };

   const refresh = async () => (transactions.value = (await fetchTransactions()) ?? []);

   watch(period, async () => await refresh());

   const groupedByDate = computed(() => {
      const grouped: { [index: string]: any[] } = {};

      for (const transaction of transactions.value) {
         const date = transaction.created_at.split("T")[0];

         if (!grouped[date]) grouped[date] = [];

         grouped[date].push(transaction);
      }

      // NOTE Sort in frontend
      /* const sortedKeys = Object.keys(grouped).sort().reverse();
    let sortedList: { [index: string]: any } = {};
    for (const key of sortedKeys) {
       sortedList[key] = grouped[key];
    } */

      return grouped;
   });

   return {
      transactions: {
         all: transactions,
         income,
         expense,
         incomeTotal,
         expenseTotal,
         incomeCount,
         expenseCount,
         grouped: {
            byDate: groupedByDate,
         },
      },
      isLoading,
      refresh,
   };
};
