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

**Optimized for API 33+:** The project is fully compatible with **Android 13 (Tiramisu)**, **Android 14 (Upside Down Cake)**, and the latest **Android 15 (Vanilla Ice Cream)**.

**Note:** The current version is best viewed in **light-mode**.


### How to Install

* **Physical Device:** Transfer the `.apk` to your phone and open it to install.
* **Emulator:** Simply **drag and drop** the `.apk` file onto your running Android Emulator screen.
* **Device Farm:** Upload the `.apk` to services like BrowserStack or AWS Device Farm for testing on virtual hardware.

---

### Steps I followed to run the app directly in an Android Emulator from VS Code terminal:

**Run the following commands from the project root:**

**1. ionic cap run android**

[ERROR] Error while getting Capacitor CLI version. Is Capacitor installed?

**2. npm install @capacitor/core @capacitor/cli**

**3. ionic cap run android**

**The app is expected to launch in the Android emulator after completing the above steps.**

---

## 📦 Project Structure

* `src/components`: Reusable UI elements (Segment Control, Dynamic List Views).
* `src/pages`: Main views (Timeline, Wallet, Schedule, Settings).
* `src/services`: Logic for the Filesystem, Firebase Sync, Shared Preferences Manager, Network status, Device Identifer Manager, Disk Storage Manager and Haptics Services.
* `android/`: The native Android Studio project folder.

---

## REFERENCES:

	1.	Ionic (2025) Segment UI Component. Available at: https://ionicframework.com/docs/api/segment
	2.	Ionic (2025) ION LIST UI Component. Available at: https://ionicframework.com/docs/api/list
	3.	Ionic (2025) IonItemSliding UI Component. Available at: https://ionicframework.com/docs/api/item-sliding
	4.	Ionic (2025) Segment UI Component. Available at: https://ionicframework.com/docs/api/segment
	5.	NPM (2025) react-chartjs-2 docs. Available at: https://www.npmjs.com/package/react-chartjs-2
	6.	Firebase (2025) Firebase JavaScript API reference. Available at: https://firebase.google.com/docs/reference/js/storage.md?authuser=0#storage_package
	7.	Ionic (2025) IonSelect UI Component. Available at: https://ionicframework.com/docs/api/select
	8.	Ionic (2025) Ion Fab UI component. Available at: https://ionicframework.com/docs/api/fab
	9.	Ionic (2025) ion-progress-bar api docs. Available at: https://ionicframework.com/docs/api/progress-bar
	10.	Ionic (2025) @capacitor/device plugin. Available at: https://capacitorjs.com/docs/apis/device
	11.	Ionic (2025) Filesystem Capacitor Plugin API. Available at: https://ionicframework.com/docs/native/filesystem
	12.	Ionic (2025) Local Notifications Native Plugin, docs Available at: https://ionicframework.com/docs/native/local-notifications
	13.	Ionic (2025) Network Capacitor Plugin API. Available at: https://ionicframework.com/docs/native/network
	14.	Ionic (2025) Preferences Capacitor Plugin. Available at: https://capacitorjs.com/docs/apis/preferences
	15.	Ionic (2025) Haptics Capacitor Plugin API. Available at: https://ionicframework.com/docs/native/haptics

  ---
