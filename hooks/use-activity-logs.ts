import { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, limit, where, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase'; // Adjust path to your firebase config
import { ActivityLog } from '@/types';

interface LogOptions {
    limit?: number;
    startDate?: Date | null;
    endDate?: Date | null;
}


export const useActivityLogs = ({ limit: logLimit = 50, startDate, endDate }: LogOptions) => {
    const [logs, setLogs] = useState<ActivityLog[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // 1. Reference the 'activityLogs' collection
        const logsRef = collection(db, 'activity_logs');

        // 2. Create a query ordered by timestamp (newest first)
        let logsQuery = query(logsRef, orderBy('timestamp', 'desc'), limit(logLimit));

        // Apply filters if dates are provided
        if (startDate) {
            logsQuery = query(logsQuery, where('timestamp', '>=', Timestamp.fromDate(startDate)));
        }
        if (endDate) {
            logsQuery = query(logsQuery, where('timestamp', '<=', Timestamp.fromDate(endDate)));
        }

        // 3. Subscribe to real-time updates
        const unsubscribe = onSnapshot(
            logsQuery,
            (snapshot) => {
                const fetchedLogs = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                })) as ActivityLog[];

                setLogs(fetchedLogs);
                setIsLoading(false);
            },
            (err) => {
                console.error("Error fetching logs:", err);
                setError("Failed to load activity logs.");
                setIsLoading(false);
            }
        );

        // Cleanup subscription on unmount
        return () => unsubscribe();
    }, [logLimit, startDate, endDate]);

    return { logs, isLoading, error };
};