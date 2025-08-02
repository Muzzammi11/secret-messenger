# Anonymous Messenger 🕵️‍♂️

A modern, anonymous messaging platform built with Next.js and Firebase. Share your unique link and receive anonymous messages from friends, family, or anyone who has your link.


## ✨ Features

- **🔗 Unique Anonymous Links**: Each user gets a personalized URL to share
- **👤 Anonymous Messaging**: Send messages without revealing your identity
- **📱 Responsive Design**: Works seamlessly on desktop and mobile devices
- **⚡ Real-time Updates**: Messages appear instantly using Firebase
- **🗑️ Message Management**: Delete individual messages or entire account
- **🎨 Modern UI**: Beautiful, intuitive interface with smooth animations
- **🔒 Privacy Focused**: No personal information required to send messages
- **📊 Message History**: View all received messages with time

## 🚀 Live Demo

Visit the live application to see it in action!

## 🛠️ Tech Stack

- **Frontend**: Next.js 15.4.1, React 19.1.0, TypeScript
- **Backend**: Firebase Firestore 
- **Styling**: CSS3 with custom animations


## 📋 Prerequisites

Before running this project, make sure you have:

- Node.js 18+ installed
- npm or yarn package manager
- Firebase account and project
- Git

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/secret-messenger.git
   cd secret-messenger
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up Firebase**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project
   - Enable Firestore Database
   - Enable Authentication (Email/Password)
   - Get your Firebase configuration

4. **Environment Variables**
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

5. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Project Structure

```
secret-messenger/
├── app/                    # Next.js app directory
│   ├── [username]/        # Dynamic user profile pages
│   ├── admin/             # Admin panel
│   ├── login/             # Login page
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # Reusable components
│   ├── Footer.tsx         # Footer component
│   └── ParticlesComponent.tsx
├── firebase/              # Firebase configuration
│   └── config.ts
├── public/                # Static assets
└── package.json
```

## 🎯 How It Works

### For Message Senders:
1. Visit someone's anonymous link (e.g., `yoursite.com/username`)
2. Write your anonymous message
3. Click "Send Message"
4. The message is delivered instantly and anonymously

### For Message Receivers:
1. Register to get your unique anonymous link
2. Share your link on social media or with friends
3. Receive anonymous messages in your inbox
4. Delete messages or your entire account when needed

## 🔐 Security & Privacy

- **Anonymous Messaging**: No personal information is collected from message senders
- **Secure Storage**: All data is stored securely in Firebase Firestore
- **Account Deletion**: Users can completely delete their account and all associated data
- **Message Privacy**: Only the account owner can view their received messages



## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments


- Powered by Next.js and Firebase
- Inspired by the need for anonymous communication

## 📞 Support

If you have any questions or need help, please open an issue on GitHub.

---

