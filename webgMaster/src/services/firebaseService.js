import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  getDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../config/firebase';

// Collection references
const alertsCollection = collection(db, 'alerts');

// Alert services
export const alertService = {
  // Create a new alert
  createAlert: async (alertData) => {
    try {
      const docRef = await addDoc(alertsCollection, {
        ...alertData,
        timestamp: serverTimestamp(),
        status: 'active'
      });
      return { id: docRef.id, ...alertData };
    } catch (error) {
      console.error("Error creating alert: ", error);
      throw error;
    }
  },

  // Get all alerts
  getAllAlerts: async () => {
    try {
      const q = query(alertsCollection, orderBy('timestamp', 'desc'));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error("Error getting alerts: ", error);
      throw error;
    }
  },

  // Get alerts by route number
  getAlertsByRoute: async (routeNumber) => {
    try {
      const q = query(
        alertsCollection, 
        where('routeNumber', '==', routeNumber),
        orderBy('timestamp', 'desc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error("Error getting alerts by route: ", error);
      throw error;
    }
  },

  // Get a single alert by ID
  getAlertById: async (alertId) => {
    try {
      const alertDoc = await getDoc(doc(db, 'alerts', alertId));
      if (alertDoc.exists()) {
        return { id: alertDoc.id, ...alertDoc.data() };
      } else {
        throw new Error("Alert not found");
      }
    } catch (error) {
      console.error("Error getting alert: ", error);
      throw error;
    }
  },

  // Update an alert
  updateAlert: async (alertId, alertData) => {
    try {
      const alertRef = doc(db, 'alerts', alertId);
      await updateDoc(alertRef, alertData);
      return { id: alertId, ...alertData };
    } catch (error) {
      console.error("Error updating alert: ", error);
      throw error;
    }
  },

  // Delete an alert
  deleteAlert: async (alertId) => {
    try {
      await deleteDoc(doc(db, 'alerts', alertId));
      return { id: alertId };
    } catch (error) {
      console.error("Error deleting alert: ", error);
      throw error;
    }
  }
};

export default alertService;