<template>
   <div>
      <UForm :state="state" :schema="schema" @submit.prevent="saveProfile">
         <UFormGroup label="User Name" name="name" class="mb-4">
            <UInput v-model="state.name" />
         </UFormGroup>
         <UFormGroup
            label="Email"
            name="email"
            class="mb-4"
            help="a confirmation email will be sent to both old and new email address if you change email"
         >
            <UInput v-model="state.email" />
         </UFormGroup>

         <UButton
            type="submit"
            variant="solid"
            color="black"
            label="Save"
            :loading="pending"
         />
      </UForm>
   </div>
</template>

<script lang="ts" setup>
import { z } from "zod";
const user = useSupabaseUser();
const supabase = useSupabaseClient();
const pending = ref(false);
const { toastError, toastSuccess } = useAppToast();

const state = ref({
   name: user.value?.user_metadata.full_name,
   email: user.value?.email,
});

const schema = z.object({
   name: z.string().min(2).optional(),
   email: z.string().email(),
});

const saveProfile = async () => {
   pending.value = true;
   try {
      const data: { data: {}; email?: string } = {
         data: {
            full_name: state.value.name,
         },
      };
      if (state.value.email !== user.value?.email) data.email = state.value.email;

      const { error } = await supabase.auth.updateUser(data);
      if (error) throw error;

      toastSuccess("Profile updated", "Your profile updated successfully");
   } catch (error: any) {
      toastError("something went wrong", error.message);
   } finally {
      pending.value = false;
   }
};
</script>

<style></style>
