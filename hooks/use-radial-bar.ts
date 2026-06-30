import { useState, useEffect } from 'react';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { RadialBarData } from '@/types';

export const useRadialChartData = (collectionName: string) => {
  const [counts, setCounts] = useState<RadialBarData>({ published: 0, draft: 0, total: 0 });

  useEffect(() => {
    const q = query(collection(db, collectionName));
    
    return onSnapshot(q, (snapshot) => {
      let draftCount = 0;
      let publishedCount = 0;

      snapshot.forEach((doc) => {
        const data = doc.data();
        if (data.status === 'published') publishedCount++;
        else draftCount++;
      });

      setCounts({
        published: publishedCount,
        draft: draftCount,
        total: draftCount + publishedCount
      });
    });
  }, [collectionName]);

  return counts;
};