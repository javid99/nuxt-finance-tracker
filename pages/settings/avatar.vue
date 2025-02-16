<template>
   <div>
      <div class="mb-4">
         <UFormGroup
            label="Current avatar"
            class="w-full"
            help="This would be blank by default"
         >
            <UAvatar :src="url" size="3xl" />
         </UFormGroup>
      </div>

      <div class="mb-4">
         <UFormGroup
            label="New avatar"
            class="w-full"
            name="avatar"
            help="After choosing an image click Save to actually upload the new avatar"
         >
            <UInput type="file" ref="fileInput" />
         </UFormGroup>
      </div>

      <UButton
         type="submit"
         color="black"
         variant="solid"
         label="Save"
         :loading="uploading"
         :disabled="uploading"
         @click="saveAvatar"
      />
   </div>
</template>

<script setup lang="ts">
const supabase = useSupabaseClient();
const user = useSupabaseUser();

// We need to get the actual avatar URL
const { toastSuccess, toastError } = useAppToast();

const uploading = ref(false);
const fileInput = ref(); // Reference to an input with ref="fileInput" attribute

const { url } = useAvatarUrl();

const saveAvatar = async () => {
   // 1. Get the uploaded file
   const file = fileInput.value.input.files[0];
   //    a) If no file uploaded, show toast error
   if (!file) {
      toastError("first select a file");
      return;
   }

   // 2. Generate the new filename
   const fileExt = file.name.split(".").pop();
   const fileName = `${Math.random()}.${fileExt}`;

   try {
      uploading.value = true;
      // 1. Grab the current avatar URL
      const currentUrl = user.value?.user_metadata.avatar_url;
      // 2. Upload the image to avatars bucket
      const { error } = await supabase.storage.from("avatars").upload(fileName, file);
      if (error) throw error;
      // 3. Update the user metadata with the avatar URL
      await supabase.auth.updateUser({
         data: {
            avatar_url: fileName,
         },
      });
      // 4. (OPTIONALLY) remove the old avatar file
      if (currentUrl) {
         const { error } = await supabase.storage.from("avatars").remove([currentUrl]);
         if (error) throw error;
      }
      // 5. Reset the file input
      fileInput.value.input.value = null;

      toastSuccess("Avatar uploaded");
   } catch (error: any) {
      toastError("Error uploading avatar", error.message);
   } finally {
      uploading.value = false;
   }
};
</script>
