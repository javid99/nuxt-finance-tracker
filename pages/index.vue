<template>
   <section class="flex items-center justify-between mb-10">
      <h1 class="text-4xl font-extrabold">Summary</h1>
      <div>
         <USelectMenu v-model="selectedView" :options="transactionViewOptions" />
      </div>
   </section>

   <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 sm:gap-5 mb-10">
      <Trend
         title="Income"
         color="green"
         :amount="incomeTotal"
         :last-amount="prevIncome"
         :loading="isLoading"
      />
      <Trend
         title="Expense"
         color="red"
         :amount="expenseTotal"
         :last-amount="prevExpense"
         :loading="isLoading"
      />
      <Trend
         title="Investment"
         color="green"
         :amount="4000"
         :last-amount="3000"
         :loading="isLoading"
      />
      <Trend
         title="Saving"
         color="red"
         :amount="4000"
         :last-amount="4500"
         :loading="isLoading"
      />
   </section>

   <section class="flex items-center justify-between">
      <div>
         <h2 class="text-2xl font-extrabold">Transaction</h2>
         <div class="text-gray-500 dark:text-gray-400">
            You have {{ incomeCount }} income and {{ expenseCount }} expenses in this
            period.
         </div>
      </div>
      <div>
         <UButton
            icon="i-heroicons-plus-circle"
            variant="solid"
            color="white"
            label="add"
            @click="openModal"
         />

         <AddTransaction v-model="isOpen" @saved="refresh()" />
      </div>
   </section>

   <section v-if="!isLoading">
      <div v-for="(transactionList, date) in byDate" :key="date" class="mb-10">
         <DailySummary
            :key="transactionList.length"
            :date="date.toString()"
            :transactions="transactionList"
         />
         <Transaction
            v-for="transaction in transactionList"
            :key="transaction.id"
            :transaction="transaction"
            @deleted="refresh()"
            @edited="refresh()"
         />
      </div>
   </section>
   <section v-else>
      <USkeleton class="h-8 w-full" v-for="i in 4" :key="i" />
   </section>
</template>

<script lang="ts" setup>
import { transactionViewOptions } from "~/constants";
const user = useSupabaseUser();
const selectedView = ref(
   user.value?.user_metadata.transaction_view ?? transactionViewOptions[1]
);

const { current, previous } = useSelectedPeriod(selectedView);

const {
   isLoading,
   refresh,
   transactions: {
      incomeCount,
      expenseCount,
      incomeTotal,
      expenseTotal,
      grouped: { byDate },
   },
} = useFetchTransactions(current);
await refresh();

const {
   refresh: prevRefresh,
   transactions: { incomeTotal: prevIncome, expenseTotal: prevExpense },
} = useFetchTransactions(previous);
await prevRefresh();

const isOpen = ref(false);

const openModal = () => {
   isOpen.value = true;
};
</script>

<style></style>
