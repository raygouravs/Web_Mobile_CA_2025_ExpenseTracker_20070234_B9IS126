# GR Expense Tracker

## Academic Project Information

**Web and Mobile Technologies CA 2025**

**Module Title:** Web and Mobile Technologies

**Module Code:** B9IS126

**Module Leader:** Ehtisham Yasin

**Student Name:** Gourav Sankar Ray

**Student Number:** 20070234

**Institution:** Dublin Business School

---

## 📱 Project Description
A user-friendly mobile app focused on privacy that helps you manage your finances. GR Expense Tracker offers a sleek and simple interface to keep track of your cash flow, visualize your spending habits, and ensure your data is safely backed up.

---

## 🚀 Technologies Used

This project is developed with the **Ionic Framework** using **React** and **TypeScript** for robust development.

* **Frontend:** React, TypeScript, HTML5, CSS3
* **Framework:** Ionic Framework (Mobile UI components)
* **MBaaS:** Firebase cloud storage
* **Native Engine:** Capacitor
* **Capacitor Plugins:**
* `Filesystem`: Local data storage and management.
* `Network`: Real-time connectivity monitoring for cloud sync.
* `Haptics`: Physical vibration feedback on user interactions.
* `Preferences`: Lightweight persistent key-value storage.
* `Local Notifications`: Transaction reminders and budget alerts.
* `Device`: Unique device identification for secure cloud backup.
* `Toast`: Native-style feedback messages.



---

## ✨ Features

### 📅 Timeline

Easily manage your daily finances by adding or deleting income and expense entries. The timeline features a **dynamic bar chart** that provides an immediate visual summary of your recent cash flow.

### 👛 Wallet

Get a high-level view of your financial health. The Wallet includes:

* **Monthly Bar Charts:** Track your cash flow trends over time.
* **Category Breakup:** Intuitive **doughnut charts** that visualize exactly where your money goes (Expenses) and where it comes from (Income).

### 🔔 Scheduled Transactions

Set reminders for subscriptions or bills and receive **Local Notifications** directly on your device when the reminder date arrives.

### ⚙️ Settings & Security

* **Budgeting:** Set a monthly spending limit. The app monitors your habits and sends an alert when you hit your budget.
* **Cloud Sync:** Securely back up your local JSON data to the cloud (Firebase) to ensure your records are never lost.

---

## 🛠️ Build & Installation

### Generating the APK

To build the Android package, follow these steps:

1. **Open the Android Project:**
In your VS Code terminal, run the following command to launch Android Studio:

`npx cap open android`


2. **Build in Android Studio:**
* Wait for Gradle to finish syncing.
* Go to **Build** > **Build Bundle(s) / APK(s)** > **Build APK(s)**.
* Once complete, a notification will appear with a link to "Locate" the `.apk` file.


### Android Compatibility & API Standards

The application is built and tested to follow the latest Android architectural standards, ensuring a seamless experience on modern hardware:

**Optimized for API 33+:** The project is fully compatible with Android 13 (Tiramisu), Android 14 (Upside Down Cake), and the latest Android 15 (Vanilla Ice Cream).


### How to Install

* **Physical Device:** Transfer the `.apk` to your phone and open it to install.
* **Emulator:** Simply **drag and drop** the `.apk` file onto your running Android Emulator screen.
* **Device Farm:** Upload the `.apk` to services like BrowserStack or AWS Device Farm for testing on virtual hardware.

---

## 📦 Project Structure

* `src/components`: Reusable UI elements (Segment Control, Dynamic List Views).
* `src/pages`: Main views (Timeline, Wallet, Schedule, Settings).
* `src/services`: Logic for Filesystem, Firebase Sync, Shared Preferences Manager, Network status, Device Identifer Manager, Disk Storage Manager and Haptics Service.
* `android/`: The native Android Studio project folder.

---
