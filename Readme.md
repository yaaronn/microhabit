🎮 MicroHabit — Gamified Habit Tracker
MicroHabit is a mobile application designed to make habit building engaging, consistent, and fun. By combining daily habit tracking with virtual pet progression, MicroHabit turns self-improvement into a rewarding game.

✨ Key Features
🕹️ Gamified Progress: Completing daily habits grants experience points (XP) and rewards that help nurture and level up your virtual Pet Avatar.

📊 Visual Habit Tracking: Easily create, manage, and monitor custom daily habits with intuitive progress cards and streak counters.

☁️ Cloud Sync & Persistence: Powered by Supabase to ensure your habits, pet stats, and user profile data seamlessly sync across devices.

⚡ Modern UI & Performance: Built with a modular React Native architecture for smooth animations, fluid navigation, and responsive feedback.

🛠️ Tech Stack
Frontend: React Native (Expo SDK), TypeScript

State Management: Zustand (for fast, lightweight global state)

Backend & Database: Supabase (PostgreSQL, Authentication, Real-time Database)

Navigation & UI: React Navigation, custom modular component architecture

📁 Project Architecture
Plaintext
microhabit/
├── api/          # Supabase client & network requests
├── components/   # Reusable UI elements (habits/, pet/, common/)
├── hooks/        # Custom React hooks for habits & pet state
├── screens/      # Application screens (Home, Habit Details, Pet View)
├── stores/       # Zustand global state stores
├── types/        # TypeScript interfaces & type definitions
└── utils/        # Helper functions & formatting utilities