// // app/[username]/page.tsx

// import Link from 'next/link';
// import { db } from '../../firebase/config';
// import { doc, getDoc } from 'firebase/firestore';
// import MessageForm from '@/components/MessageForm'; // Import the new client component

// // A simple component for the "Not Found" state
// function UserNotFound() {
//   return (
//     <div className="content-wrapper" style={{ paddingTop: '6.5rem', textAlign: 'center' }}>
//       <div className="card">
//         <h1>User Not Found</h1>
//         <p style={{ margin: '1rem 0' }}>The profile you are looking for does not exist.</p>
//         <Link href="/"  style={{ textDecoration: 'none', display: 'inline-block', width: 'auto' }}>
//           Go to Homepage
//         </Link>
//       </div>
//     </div>
//   );
// }

// // Note: This is now an async Server Component. No "use client" directive.
// export default async function PublicMessagePage({ params }: { params: { username: string } }) {
//   const username = params.username;

//   // Perform the check on the server
//   const userDocRef = doc(db, "users", username);
//   const userDocSnap = await getDoc(userDocRef);

//   // If the user doesn't exist, return the Not Found UI immediately.
//   if (!userDocSnap.exists()) {
//     return <UserNotFound />;
//   }

//   // If the user exists, render the interactive MessageForm client component.
//   return <MessageForm username={username} />;
// }
// app/[username]/page.tsx
import Link from 'next/link';
import { db } from '../../firebase/config';
import { doc, getDoc } from 'firebase/firestore';
import MessageForm from '@/components/MessageForm'; // Import the new client component

// A simple component for the "Not Found" state
function UserNotFound() {
  return (
    <div className="content-wrapper" style={{ paddingTop: '6.5rem', textAlign: 'center' }}>
      <div className="card">
        <h1>User Not Found</h1>
        <p style={{ margin: '1rem 0' }}>The profile you are looking for does not exist.</p>
        <Link href="/"  style={{ textDecoration: 'none', display: 'inline-block', width: 'auto' }}>
          Go to Homepage
        </Link>
      </div>
    </div>
  );
}

// Update the interface to match Next.js 15 expectations
interface PageProps {
  params: Promise<{ username: string }>;
}

// Note: This is now an async Server Component. No "use client" directive.
export default async function PublicMessagePage({ params }: PageProps) {
  // Await the params since it's now a Promise
  const { username } = await params;
  
  // Perform the check on the server
  const userDocRef = doc(db, "users", username);
  const userDocSnap = await getDoc(userDocRef);
  
  // If the user doesn't exist, return the Not Found UI immediately.
  if (!userDocSnap.exists()) {
    return <UserNotFound />;
  }
  
  // If the user exists, render the interactive MessageForm client component.
  return <MessageForm username={username} />;
}