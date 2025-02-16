<template>
   <UModal v-model="isOpen" @close="resetForm">
      <UCard>
         <template #header>{{ isEditing ? "Edit" : "Add" }} transaction</template>

         <UForm
            :schema="schema"
            :state="state"
            :validate-on="['submit']"
            @submit.prevent="onSubmit"
         >
            <UFormGroup
               :required="true"
               label="Transaction Type"
               name="type"
               class="mb-4"
            >
               <USelect
                  placeholder="select a transaction type"
                  :options="type"
                  v-model="state.type"
                  :disabled="isEditing"
               />
            </UFormGroup>

            <UFormGroup :required="true" name="amount" label="Amount" class="mb-4">
               <UInput type="number" placeholder="Amount" v-model.number="state.amount" />
            </UFormGroup>

            <UFormGroup
               :required="true"
               name="created_at"
               label="Transaction Date"
               class="mb-4"
            >
               <UInput
                  type="date"
                  placeholder="Transaction Date"
                  icon="i-heroicons-calendar-days-20-solid"
                  v-model="state.created_at"
               />
            </UFormGroup>

            <UFormGroup
               hint="optional"
               name="description"
               label="Description"
               class="mb-4"
            >
               <UInput
                  type="text"
                  placeholder="Description"
                  v-model="state.description"
               />
            </UFormGroup>

            <UFormGroup
               :required="true"
               label="Category"
               name="category"
               class="mb-4"
               v-if="state.type === 'Expense'"
            >
               <USelect
                  placeholder="select a category"
                  :options="category"
                  v-model="state.category"
               />
            </UFormGroup>

            <UButton type="submit" :loading="isLoading">Submit</UButton>
         </UForm>
      </UCard>
   </UModal>
</template>

<script lang="ts" setup>
import { z } from "zod";
import { category, type } from "~/constants";
import type { Database } from "~/supabase";

const supabase = useSupabaseClient<Database>();
const { toastError, toastSuccess } = useAppToast();

const props = defineProps({
   transaction: {
      type: Object,
      required: false,
   },
});

const isEditing = computed(() => {
   return !!props.transaction;
});

const emit = defineEmits(["saved"]);

const optionValues = category.map((o) => o.value) as [string, ...string[]];

const defaultSchema = z.object({
   description: z.string().optional(),
   amount: z.number().positive("Amount needs to be more than 0"),
   created_at: z.string(),
});

const incomeSchema = z.object({
   type: z.literal("Income"),
});

const expenseSchema = z.object({
   type: z.literal("Expense"),
   category: z.enum(optionValues),
});

const savingSchema = z.object({
   type: z.literal("Saving"),
});

const investmentSchema = z.object({
   type: z.literal("Investment"),
});

const schema = z.intersection(
   z.discriminatedUnion("type", [
      incomeSchema,
      expenseSchema,
      savingSchema,
      investmentSchema,
   ]),
   defaultSchema
);

const initialValue = isEditing.value
   ? {
        type: props.transaction?.type,
        amount: props.transaction?.amount,
        created_at: props.transaction?.created_at.split("T")[0],
        description: props.transaction?.description,
        category: props.transaction?.category,
     }
   : {
        type: undefined,
        amount: 0,
        created_at: undefined,
        description: undefined,
        category: undefined,
     };

let state = ref({ ...initialValue });

const isLoading = ref(false);

const onSubmit = async () => {
   isLoading.value = true;
   try {
      const { error } = await supabase
         .from("transactions")
         .upsert({ ...state.value, id: props.transaction?.id });

      if (!error) {
         toastSuccess("inserting successful");
         resetForm();
         emit("saved");
         isOpen.value = false;

         return;
      }

      throw Error;
   } catch (e: any) {
      toastError("inserting unsuccessful");
   } finally {
      isLoading.value = false;
   }
};

const isOpen = defineModel<boolean>();

const resetForm = () => {
   state.value = { ...initialValue };
};
</script>

<style></style>
