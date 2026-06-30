import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, orderBy, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { RecentLocationData } from '@/types';


export const useRecentLocations = (limitCount: number = 5) => {
  const [locations, setLocations] = useState<RecentLocationData[]>([]);

  useEffect(() => {
    const q = query(
      collection(db, 'locations'),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );
    
    return onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as RecentLocationData[];
      setLocations(data);
    });
  }, [limitCount]);

  return locations;
};