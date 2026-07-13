import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { statusStyles } from '@/features/map/components/map-marker-color';
import { AreaChartData } from '@/types';


export const useAreaChartData = (collectionName: string, days: number) => {
  const [data, setData] = useState<AreaChartData[]>([]);

  // useEffect(() => {
  //   let q = query(collection(db, collectionName));

  //   if (days > 0) {
  //     const cutoffDate = new Date();
  //     cutoffDate.setDate(cutoffDate.getDate() - days);
  //     q = query(q, where('createdAt', '>=', Timestamp.fromDate(cutoffDate)));
  //   }

  //   return onSnapshot(q, (snapshot) => {
  //     const dailyStats: Record<string, AreaChartData> = {};

  //     snapshot.forEach((doc) => {
  //       const docData = doc.data();
  //       const createdAt = docData.createdAt;

  //       // Safely extract date
  //       const dateObj = createdAt instanceof Timestamp ? createdAt.toDate() : new Date(createdAt);
  //       const dateKey = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  //       if (!dailyStats[dateKey]) {
  //         // Initialize with 0 for all status types defined in constants
  //         const initialStatusCounts = Object.keys(statusStyles).reduce((acc, status) => ({
  //           ...acc,
  //           [status]: 0
  //         }), {} as Record<string, number>);

  //         dailyStats[dateKey] = { date: dateKey, ...initialStatusCounts };
  //       }

  //       // Increment count if status exists
  //       if (docData.status && typeof dailyStats[dateKey][docData.status] === 'number') {
  //         // 2. We use 'as number' here to inform TypeScript that we have verified 
  //         // the type is a number via the 'typeof' check above
  //         (dailyStats[dateKey][docData.status] as number) += 1;
  //       }
  //     });

  //     setData(Object.values(dailyStats).sort((a, b) =>
  //       new Date(a.date).getTime() - new Date(b.date).getTime()
  //     ));
  //   });
  // }, [collectionName, days]);


  useEffect(() => {
    let q = query(collection(db, collectionName));

    if (days > 0) {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);
      q = query(q, where('createdAt', '>=', Timestamp.fromDate(cutoffDate)));
    }

    return onSnapshot(q, (snapshot) => {
      const dailyStats: Record<string, AreaChartData> = {};

      snapshot.forEach((doc) => {
        const docData = doc.data();
        const createdAt = docData.createdAt;

        // 1. Robust Date Normalization
        let dateObj: Date;
        if (createdAt instanceof Timestamp) {
          dateObj = createdAt.toDate();
        } else if (createdAt?.seconds) {
          dateObj = new Date(createdAt.seconds * 1000);
        } else {
          dateObj = new Date(createdAt);
        }

        // Skip if date is invalid
        if (isNaN(dateObj.getTime())) return;

        const dateKey = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

        // 2. Normalize Status (Trims whitespace)
        const rawStatus = docData.status as string;
        const status = rawStatus ? rawStatus.trim() : "Unknown";

        // 3. Initialize Date Bucket
        if (!dailyStats[dateKey]) {
          const initialStatusCounts = Object.keys(statusStyles).reduce((acc, s) => ({
            ...acc,
            [s]: 0
          }), {} as Record<string, number>);

          dailyStats[dateKey] = { date: dateKey, ...initialStatusCounts };
        }

        // 4. Safe Increment with Type Assertion
        // 'status' is now a string, and dailyStats[dateKey] is guaranteed
        // to have been initialized with numeric values for all keys in statusStyles
        if (Object.prototype.hasOwnProperty.call(dailyStats[dateKey], status)) {
          (dailyStats[dateKey][status as keyof typeof dailyStats[typeof dateKey]] as number) += 1;
        }
      });

      setData(Object.values(dailyStats).sort((a, b) =>
        new Date(a.date).getTime() - new Date(b.date).getTime()
      ));
    });
  }, [collectionName, days]);

  return data;
};