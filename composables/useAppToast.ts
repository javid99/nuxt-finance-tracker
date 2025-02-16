export const useAppToast = () => {
   const toast = useToast();
   return {
      toastSuccess: (title: string, description?: string) => {
         toast.add({
            title,
            icon: "i-heroicons-check-circle",
            color: "green",
            description,
         });
      },
      toastError: (title: string, description?: string) => {
         toast.add({
            title,
            description,
            icon: "i-heroicons-exclamation-circle",
            color: "red",
         });
      },
   };
};
