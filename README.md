### SENG 31323 - Mobile Computing Technology
### SE/2021/036 - Hasinthaka Piyumal Senanayaka

# 📱 Habit Tracker App

A beautifully designed mobile application that helps users build and maintain healthy habits using visual tracking, streaks, and detailed statistics.

---

## 📖 Project Description

**Habit Tracker** is a feature-rich mobile app built with **React Native CLI** that enables users to:

- Create and manage habits
- Track progress on a daily, weekly, or monthly basis
- Visualize performance using engaging charts and animations
- Maintain streaks and build consistency

The app offers a modern, clean UI with smooth animations and support for both **light and dark themes**.

---

## ✨ Key Features

- ✅ Create & manage customizable habits (`daily`, `weekly`, `monthly`)
- 📆 Calendar view for reviewing past performance
- 🔥 Track streaks & visualize progress
- 🎨 Beautiful animated onboarding experience
- 📊 Statistics dashboard with progress charts
- 🌓 Light/Dark theme toggle
- 🔐 User authentication & profile management
- 🎉 Habit completion animations with confetti
- 📱 Responsive design for Android and iOS

---

## ⚙️ Technologies Used

| Technology                    | Purpose                               |
| ----------------------------- | ------------------------------------- |
| **React Native CLI**          | Core mobile app framework             |
| **TypeScript**                | Type-safe development                 |
| **AsyncStorage**              | Local data persistence                |
| **React Navigation**          | App routing & screen transitions      |
| **React Native Vector Icons** | Iconography                           |
| **React Native Reanimated**   | Smooth, performant animations         |
| **Gesture Handler**           | Touch interactions                    |
| **React Native SVG**          | SVG rendering                         |
| **Chart Kit**                 | Progress and analytics charts         |
| **React Native Calendar**     | Calendar view integration             |
| **Status Bar Height**         | Device-safe UI handling               |
| **Zod**                       | Schema-based form and data validation |

---

## 🏗️ Application Structure

### 🔄 Animations & Visual Effects

- **Onboarding Animations:**

  - Slide transitions between screens
  - Interactive illustrations
  - Animated progress indicators

- **UI Animations:**

  - Confetti effects on habit completion
  - Spring modal transitions
  - Theme toggle with smooth transition

---

## 🚀 Onboarding Experience

| Screen          | Description                                    |
| --------------- | ---------------------------------------------- |
| **Welcome**     | App intro with animated logo                   |
| **Features**    | Key highlights with illustrations              |
| **Habit Types** | Explains daily, weekly, monthly tracking       |
| **Streaks**     | Visuals on streak tracking with animation      |
| **Get Started** | Registration/login flow with smooth navigation |

---

## 🛠 Installation & Setup

### 🔧 Prerequisites

- Node.js (v16+)
- npm or yarn
- React Native CLI
- Android Studio (Android)
- Xcode (macOS for iOS development)

### 📥 Getting Started

```bash
# 1. Clone the repository
git clone https://github.com/HasinthakaPiyumal/HabitFlow.git
cd habit-tracker

# 2. Install dependencies
npm install

# 3. (macOS only) Install iOS pods
cd ios && pod install && cd ..

# 4. Start Metro bundler
npm start

# 5. Run the app
npx react-native run-android  # for Android
npx react-native run-ios      # for iOS (macOS only)
```

---

## 📲 Usage

1. **Launch App** → Experience onboarding
2. **Create Account** → Register/login
3. **Add Habits** → Choose name, description, frequency
4. **Track Habits** → Mark as done daily/weekly/monthly
5. **View Stats** → Monitor your streaks & performance
6. **Customize** → Toggle theme & manage profile in settings

---

## 🧰 Troubleshooting

### Build Errors (iOS/Android)

```bash
# Clean build (Android)
cd android && ./gradlew clean

# Clean pods (iOS)
cd ios && pod deintegrate && pod install
```

### Metro Issues

```bash
npx react-native start --reset-cache
```

---

## Demo



https://github.com/user-attachments/assets/037ce209-0781-4a3e-a515-d99bad54d8b3


