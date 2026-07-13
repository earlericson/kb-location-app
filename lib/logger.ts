import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

// lib/logger.ts
export const logActivity = async (action: 'Created' | 'Updated' | 'Imported' | 'Synced' | 'Deleted', businessName: string) => {
  const messages = {
    'Created': `New location was added!`,
    'Updated': `The location was updated!`,
    'Imported': `New location was imported!`,
    'Synced': `The location synced successfully!`,
    'Deleted': `The location was removed!`
  };

  await addDoc(collection(db, 'activity_logs'), {
    action,
    businessName,
    message: messages[action], // Save the pre-built string
    timestamp: serverTimestamp(),
  });
};