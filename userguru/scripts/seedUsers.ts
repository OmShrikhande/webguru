import { db, auth } from "../lib/firebase"; // Assuming you have firebase initialized
import { collection, doc, setDoc, addDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";

// Function to create a demo user
const createUser = async (email: string, password: string, role: "admin" | "user") => {
  try {
    // Create a Firebase Auth user
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Add user details to Firestore
    const userRef = doc(db, "users", user.uid);
    await setDoc(userRef, {
      email: email,
      role: role,
      firstName: "Demo",
      lastName: "User",
      avatarUrl: "https://photosrush.com/wp-content/uploads/cute-whatsapp-dp-2.jpg", // Example avatar URL
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    console.log(`User with email ${email} added successfully!`);

    return user.uid;
  } catch (error) {
    console.error("Error creating user: ", error);
    throw error;
  }
};

// Function to add demo attendance record
const addAttendance = async (userId: string, status: "present" | "absent" | "late", date: string) => {
  try {
    const attendanceRef = collection(db, "users", userId, "attendance");
    await addDoc(attendanceRef, {
      status: status,
      timestamp: date, // 'YYYY-MM-DD' format
      date: new Date(date),
    });

    console.log(`Attendance for ${status} on ${date} added successfully!`);
  } catch (error) {
    console.error("Error adding attendance: ", error);
  }
};

// Function to add demo settings
const addSettings = async () => {
  try {
    const settingsRef = doc(db, "settings", "attendanceSettings");
    await setDoc(settingsRef, {
      attendanceLock: false, // Example setting, lock attendance after a certain hour
      allowLateCheckIn: true, // Allow users to check in late
      maxAbsentDays: 5, // Max allowed absent days before action is taken
    });

    console.log("Attendance settings added successfully!");
  } catch (error) {
    console.error("Error adding settings: ", error);
  }
};

// Seed the database with demo data
const seedData = async () => {
  try {
    // Create demo users
    const user1Id = await createUser("admin@example.com", "password123", "admin");
    const user2Id = await createUser("user@example.com", "password123", "user");

    // Add demo attendance records for these users
    await addAttendance(user1Id, "present", "2025-04-01");
    await addAttendance(user1Id, "absent", "2025-04-02");
    await addAttendance(user2Id, "late", "2025-04-01");
    await addAttendance(user2Id, "present", "2025-04-02");

    // Add demo settings
    await addSettings();

    console.log("Demo data added successfully!");
  } catch (error) {
    console.error("Error seeding data: ", error);
  }
};

// Run the seed function
seedData();
