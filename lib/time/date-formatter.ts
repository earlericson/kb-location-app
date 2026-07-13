// src/utils/dateFormatter.ts
import { Timestamp } from 'firebase/firestore';

export const formatDate = (timestamp: Timestamp | Date): string => {
    const date = timestamp instanceof Timestamp ? timestamp.toDate() : timestamp;
    return date.toISOString().split('T')[0]; // The fastest way to get YYYY-MM-DD
};