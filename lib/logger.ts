import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export const logActivity = async (action: 'Created' | 'Updated' | 'Synced' , businessName: string) => {
  try {
    await addDoc(collection(db, 'activity_logs'), {
      action,
      businessName,
      timestamp: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error logging activity:", error);
  }
};