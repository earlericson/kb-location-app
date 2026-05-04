import { db } from "@/lib/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { BusinessLocation } from "@/types";
import MapMain from "@/features/map/components/map-main";

export default async function MapPage() {
    // 1. Fetch data from Firestore (Server-side fetching)
    // const querySnapshot = await getDocs(collection(db, "locations"));


    // ONLY fetch what has been explicitly 'published' via the Sync button
    const q = query(
        collection(db, "locations"), 
        where("status", "==", "published")
    );
    
    const querySnapshot = await getDocs(q);

    const rawData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));


    // This "cleans" the entire array of all non-plain objects instantly
    const businessData = JSON.parse(JSON.stringify(rawData));
    return (
        <div className="w-full">
            <MapMain initialData={businessData} />
        </div>
    );
}
