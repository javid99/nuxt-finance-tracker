<template>
   <div
      class="grid grid-cols-3 py-4 border-b border-gray-200 dark:border-gray-800 text-gray-900 dark:text-gray-100"
   >
      <div class="flex items-center justify-between space-x-4 col-span-2">
         <div class="flex items-center space-x-1">
            <UIcon :name="icon" :class="isIncome ? 'text-green-600' : 'text-red-600'" />
            <div class="">{{ transaction.description }}</div>
         </div>
         <div class="">
            <UBadge color="white" v-if="transaction.category">
               {{ transaction.category }}
            </UBadge>
         </div>
      </div>
      <div class="flex items-center justify-end space-x-2">
         <div class="">{{ currency }}</div>
         <div class="">
            <UDropdown :items="items" :popper="{ placement: 'bottom-start' }">
               <UButton
                  color="white"
                  variant="ghost"
                  trailing-icon="i-heroicons-ellipsis-horizontal"
                  :loading="isLoading"
               />
            </UDropdown>

            <AddTransaction
               v-model="isOpen"
               :transaction="transaction"
               @saved="emit('edited')"
            />
         </div>
      </div>
   </div>
</template>

<script lang="ts" setup>
const props = defineProps({
   transaction: {
      type: Object,
      default: null,
   },
});

const { amount } = toRefs(props.transaction);

const isIncome = computed(() => {
   return props.transaction.type === "Income";
});

const icon = computed(() => {
   return isIncome.value ? "i-heroicons-arrow-up-right" : "i-heroicons-arrow-down-left";
});

const emit = defineEmits(["deleted", "edited"]);

const isOpen = ref(false);

const { currency } = useCurrency(amount);

const isLoading = ref(false);
const supabase = useSupabaseClient();
const { toastError, toastSuccess } = useAppToast();

const deleteTransaction = async () => {
   isLoading.value = true;

   try {
      const { error } = await supabase
         .from("transactions")
         .delete()
         .eq("id", props.transaction.id);
      toastSuccess("Transaction deleted.");
      emit("deleted", props.transaction.id);
   } catch (error) {
      toastError("error occurred!");
   } finally {
      isLoading.value = false;
   }
};

const items = [
   [
      {
         label: "Edit",
         icon: "i-heroicons-pencil-square-20-solid",
         click: () => {
            isOpen.value = true;
         },
      },
      {
         label: "Delete",
         icon: "i-heroicons-trash-20-solid",
         click: deleteTransaction,
      },
   ],
];
</script>

<style></style>
