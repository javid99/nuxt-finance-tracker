<template>
   <div
      class="grid grid-cols-2 py-4 border-b border-gray-200 dark:border-gray-800 text-gray-500 dark:text-gray-400 font-bold"
   >
      <div class="flex items-center justify-between">{{ date }}</div>
      <div class="flex items-center justify-end mr-10">{{ currency }}</div>
   </div>
</template>

<script lang="ts" setup>
const props = defineProps({
   transactions: {
      type: Array,
      default: () => [],
   },
   date: String,
});

const sum = computed(() => {
   let sum = 0;
   for (const transaction of props.transactions as {
      type: "Income" | "Expense";
      amount: number;
   }[]) {
      if (transaction.type === "Income") {
         sum += transaction.amount;
      } else {
         sum -= transaction.amount;
      }
   }

   return sum;
});

const { currency } = useCurrency(sum);
</script>

<style></style>
