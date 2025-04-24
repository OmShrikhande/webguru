import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useAuth } from "./useAuth";

export const useAttendance = () => {
  const { user } = useAuth();

  const markAttendance = async () => {
    if (!user) return;
    const now = new Date();
    await addDoc(collection(db, "attendance"), {
      uid: user.uid,
      name: user.displayName,
      email: user.email,
      timestamp: now.toISOString(),
    });
  };

  const getMyAttendance = async () => {
    if (!user) return [];
    const q = query(collection(db, "attendance"), where("uid", "==", user.uid));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  };

  return { markAttendance, getMyAttendance };
};
