// // app/profile/page.tsx

// "use client";


// import OwnerView from "@/components/OwnerView"; 
// import { useAuthState } from "react-firebase-hooks/auth";
// import { auth, db } from "@/firebase/config";
// import { useRouter } from "next/navigation";
// import { useEffect, useState } from "react";
// import { collection, query, where, getDocs } from "firebase/firestore";

// export default function ProfilePage() { 
//     const [currentUser, authLoading] = useAuthState(auth);
//     const router = useRouter();
//     const [username, setUsername] = useState<string | null>(null);
//     const [isLoadingUsername, setIsLoadingUsername] = useState(true);

//     useEffect(() => {

       
        
//         if (!authLoading && !currentUser) {
//             router.push('/login');
//             return;
//         }

//         if (currentUser) {
//             const findUsername = async () => {
//                 const usersRef = collection(db, "users");
//                 const q = query(usersRef, where("uid", "==", currentUser.uid));
//                 const querySnapshot = await getDocs(q);

//                 if (!querySnapshot.empty) {
//                     const userDoc = querySnapshot.docs[0];
//                     setUsername(userDoc.id);
//                 } else {
//                     console.error("User profile not found in Firestore!");
//                     router.push('/');
//                 }
//                 setIsLoadingUsername(false);
//             };
//             findUsername();
//         }
//     }, [currentUser, authLoading, router]);

 

//     if (currentUser && username) {
        
//         return <OwnerView username={username} currentUser={currentUser} />;
//     }

//     return null;
// }
// app/profile/page.tsx

"use client";

import OwnerView from "@/components/OwnerView"; 
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "@/firebase/config";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";

export default function ProfilePage() { 
    const [currentUser, authLoading] = useAuthState(auth);
    const router = useRouter();
    const [username, setUsername] = useState<string | null>(null);

    useEffect(() => {
        if (!authLoading && !currentUser) {
            router.replace('/login');
            return;
        }

        if (currentUser) {
            const findUsername = async () => {
                const usersRef = collection(db, "users");
                const q = query(usersRef, where("uid", "==", currentUser.uid));
                const querySnapshot = await getDocs(q);

                if (!querySnapshot.empty) {
                    const userDoc = querySnapshot.docs[0];
                    setUsername(userDoc.id);
                } else {
                    console.error("User profile not found in Firestore!");
                    router.replace('/');
                }
            };
            findUsername();
        }
    }, [currentUser, authLoading, router]);

    // --- THIS IS THE KEY CHANGE ---
    // While waiting for authentication or the username fetch,
    // we render our own spinner component.
    if (authLoading || !username) {
        return (
            <div className="loading-screen">
                <div className="spinner"></div>
            </div>
        );
    }

   if (currentUser && username) {
        return <OwnerView username={username} currentUser={currentUser} />;
    }
    // If for any reason the data isn't ready, render nothing.
    return null;
}