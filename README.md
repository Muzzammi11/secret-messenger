Anonymous Messenger 🕵️‍♂️

A modern, secure, and anonymous messaging platform built with Next.js and Firebase. Create an account to get your unique public link, share it, and receive anonymous messages from anyone.
✨ Features

    🔐 Secure Accounts: Full user authentication with Email & Password via Firebase Auth.

    🔗 Unique Public Links: Each user gets a personalized, shareable URL for receiving messages.

    🔒 Protected Profile: A private, server-protected route (/profile) for users to view and manage their messages.

    ⚡ Real-time Updates: Messages appear in your inbox instantly without needing a page refresh, powered by Firebase Firestore.

    🗑️ Full Data Control: Delete individual messages or permanently delete your entire account and all associated data.

    📱 Fully Responsive: A seamless experience on both desktop and mobile devices.

    🎨 Modern UI/UX: A beautiful, intuitive interface with loading states and smooth transitions.

🚀 Live Demo

Visit the live application to see it in action! (Link to your deployed application)
🛠️ Tech Stack

    Framework: Next.js (App Router)

    Authentication: Firebase Authentication

    Database: Firebase Firestore

    Styling: CSS3 with Custom Properties

    Deployment: Vercel (Recommended)

📋 Prerequisites

Before running this project, make sure you have:

    Node.js (v18 or newer)

    npm, yarn, or pnpm

    A Google Firebase account

    Git

🔧 Installation

    Clone the repository

    git clone [https://github.com/yourusername/secret-messenger.git](https://github.com/yourusername/secret-messenger.git)
    cd secret-messenger

    Install dependencies

    npm install

    Set up Firebase

        Go to the Firebase Console.

        Create a new project.

        Go to Authentication -> Sign-in method and enable Email/Password.

        Go to Firestore Database and create a new database in Production mode.

        Navigate to Project Settings -> Your apps -> Web to get your Firebase configuration keys.

    Environment Variables
    Create a .env.local file in the root of your project and add your Firebase config keys:

    NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
    NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.storage.bucket
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
    NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

    Run the development server

    npm run dev

    Open your browser and navigate to http://localhost:3000.

🏗️ Project Structure

The project follows the Next.js App Router structure, separating public and private routes.

secret-messenger/
├── app/
│   ├── [username]/           # PUBLIC: Page for anyone to send a message
│   │   └── page.tsx
│   ├── profile/              # PRIVATE: Protected route for the user's profile
│   │   ├── loading.tsx       # Loading spinner for the profile page
│   │   └── page.tsx
│   ├── login/                # Login page
│   │   └── page.tsx
│   ├── globals.css           # Global styles
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Homepage (Registration/Sign Up page)
├── components/
│   ├── OwnerView.tsx         # Component for the authenticated user's profile view
│   ├── MessageForm.tsx       # Component for the public message sending form
│   └── Footer.tsx
├── firebase/
│   └── config.ts             # Firebase initialization
└── ...

🎯 How It Works
For Message Receivers:

    Register: Create an account with your email, password, and a unique username on the homepage.

    View Your Profile: After registering or logging in, you are automatically taken to your secure profile page at /profile.

    Get Your Link: Copy your unique public link (e.g., yoursite.com/your-username) from your profile.

    Share: Share this link on social media or with friends.

    Receive Messages: Check your profile page to see new messages arrive in real-time.

    Manage: Delete individual messages or your entire account securely from your profile.

For Message Senders:

    Visit someone's public anonymous link (e.g., yoursite.com/username).

    Write your anonymous message and click "Send".

    The message is delivered instantly and anonymously.

🔐 Security & Privacy

    Secure Authentication: User accounts are protected with Firebase Authentication (Email & Password).

    Protected Routes: The profile page is a protected route, ensuring only the logged-in owner can access their inbox.

    Anonymous Messaging: No personal information is collected from message senders.

    Secure Firestore Rules: Database rules are configured to prevent unauthorized access to messages.

    Complete Data Deletion: Users can permanently delete their account, messages, and authentication record.

🤝 Contributing

    Fork the repository

    Create your feature branch (git checkout -b feature/AmazingFeature)

    Commit your changes (git commit -m 'Add some AmazingFeature')

    Push to the branch (git push origin feature/AmazingFeature)

    Open a Pull Request

📝 License

This project is licensed under the MIT License - see the LICENSE file for details.
🙏 Acknowledgments


    Powered by Next.js and Firebase

    Inspired by the need for anonymous communication

📞 Support

If you have any questions or need help, please open an issue on GitHub.