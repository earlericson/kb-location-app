import { useState, useEffect } from 'react';
import { collection, query, onSnapshot, where, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { RadialBarData } from '@/types';


export const useRadialChartData = (collectionName: string, days: number) => {
  const [counts, setCounts] = useState<RadialBarData>({ total: 0 });

  useEffect(() => {
    // Start with a base query
    let q = query(collection(db, collectionName));

    // If 'days' is provided and > 0, apply the date filter
    if (days > 0) {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);
      q = query(q, where('createdAt', '>=', Timestamp.fromDate(cutoffDate)));
    }

    return onSnapshot(q, (snapshot) => {
      const newCounts: RadialBarData = { total: 0 };

      snapshot.forEach((doc) => {
        const data = doc.data();
        // Fallback to 'unknown' if status field is missing
        const status = (data.status as string)?.toLowerCase() || 'unknown';

        newCounts[status] = (newCounts[status] || 0) + 1;
        newCounts.total++;
      });

      setCounts(newCounts);
    });
  }, [collectionName, days]); // Dependency added here: re-runs when days change

  return counts;
};