<template>
   <div>
      <UCard v-if="!succeed">
         <template #header>login page</template>

         <form @submit.prevent="loginHandler">
            <UFormGroup
               label="Email"
               name="email"
               class="mb-4"
               help="You will receive an email with the login link"
               :required="true"
            >
               <UInput type="email" placeholder="Email" required v-model="email" />
            </UFormGroup>

            <UButton
               type="submit"
               variant="solid"
               color="black"
               :loading="pending"
               :disabled="pending"
            >
               Sign-in
            </UButton>
         </form>
      </UCard>
      <UCard v-else>
         <template #header>email has been send!</template>

         <p class="mb-4">
            an email has sent to
            <strong>{{ email }}</strong>
            with a login link
         </p>
         <p>
            <strong>Important!</strong>
            the email expires in 5 minutes
         </p>
      </UCard>
   </div>
</template>

<script lang="ts" setup>
const succeed = ref<boolean>(false);
const pending = ref<boolean>(false);
const { toastError } = useAppToast();
const email = ref<string>("");
const supabase = useSupabaseClient();

const redirectUrl = useRuntimeConfig().public.baseUrl;

useRedirectAuthenticated();

const loginHandler = async () => {
   pending.value = true;
   try {
      const { error } = await supabase.auth.signInWithOtp({
         email: email.value,
         options: {
            emailRedirectTo: `${redirectUrl}/confirm`,
         },
      });

      if (error) {
         toastError("something went wrong!", error.message);
      } else {
         succeed.value = true;
      }
   } finally {
      pending.value = false;
   }
};
</script>

<style></style>
