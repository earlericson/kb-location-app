import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  QuerySnapshot,
  DocumentData,
  where
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { BusinessLocation } from "@/types";

type BusinessStatus = BusinessLocation['status']

export function useBusinessQuery(status: 'all' | BusinessStatus) {
  const queryClient = useQueryClient();
  const queryKey = ["business-status", status];

  // 1. Define the TanStack Query
  const queryInfo = useQuery<BusinessLocation[]>({
    queryKey,
    queryFn: () => {
      // This is a placeholder. The real data comes from the listener below.
      // But we provide an empty array so the UI has a valid initial state.
      return [];
    },
    // We set staleTime to Infinity because the onSnapshot listener 
    // is responsible for keeping the data fresh.
    staleTime: Infinity,
  });

  // 2. Set up the Real-time Listener
  useEffect(() => {
    // Reference the collection and sort by creation date
    let q = query(collection(db, "locations"), orderBy("createdAt", "desc"));

    // Add status filter if it's not "all"
    if (status !== 'all') {
      q = query(q, where("status", "==", status));
    }

    const unsubscribe = onSnapshot(q, (snapshot: QuerySnapshot<DocumentData>) => {
      const locations = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        // Ensure the createdAt is converted to a JS Date if it exists
        createdAt: doc.data().createdAt?.toDate() || new Date(),
      })) as BusinessLocation[];

      // Directly update the TanStack Query cache with new data
      queryClient.setQueryData(queryKey, locations);
    }, (error) => {
      console.error("Firestore Listener Error:", error);
    });

    // Cleanup: Stop listening when the component unmounts
    return () => unsubscribe();
  }, [queryClient, status, queryKey]);

  return queryInfo;
}