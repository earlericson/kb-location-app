import { useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  serverTimestamp 
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { BusinessFormValues } from "@/types/business";

export function useBusinessMutations() {
  const queryClient = useQueryClient();
  const queryKey = ["business-locations"];

  // 1. CREATE: Add a new business
  const createMutation = useMutation({
    mutationFn: async (newData: BusinessFormValues) => {
      const docRef = await addDoc(collection(db, "locations"), {
        ...newData,
        createdAt: serverTimestamp(), // Best practice: use server time
      });
      return docRef.id;
    },
    onSuccess: () => {
      // Refresh the table data automatically
      queryClient.invalidateQueries({ queryKey });
    },
  });

  // 2. UPDATE: Modify an existing business
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: BusinessFormValues }) => {
      const docRef = doc(db, "locations", id);
      await updateDoc(docRef, {
        ...data,
        updatedAt: serverTimestamp(),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  // 3. DELETE: Remove a business
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const docRef = doc(db, "locations", id);
      await deleteDoc(docRef);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  // Exporting functions and loading states
  return {
    // Actions
    createBusiness: createMutation.mutateAsync,
    updateBusiness: updateMutation.mutateAsync,
    deleteBusiness: deleteMutation.mutateAsync,
    
    // Loading States (for your Submit/Delete buttons)
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    
    // Errors (optional but helpful)
    createError: createMutation.error,
    deleteError: deleteMutation.error,
  };
}