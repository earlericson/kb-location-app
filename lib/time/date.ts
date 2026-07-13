import { Timestamp } from 'firebase/firestore';

/**
 * Safely converts various date formats (Firestore Timestamp, ISO String, or Date)
 */
export const formatDate = (dateValue: unknown): string => {
    if (!dateValue) return '---';

    // Check if it's a Firestore Timestamp
    if (dateValue instanceof Timestamp) {
        return dateValue.toDate().toLocaleDateString();
    }

    // Check if it's a valid Date object
    if (dateValue instanceof Date) {
        return dateValue.toLocaleDateString();
    }

    // Check if it's a string (like an ISO string)
    if (typeof dateValue === 'string') {
        const parsedDate = new Date(dateValue);
        return isNaN(parsedDate.getTime()) ? 'Invalid Date' : parsedDate.toLocaleDateString();
    }

    return '---';
};