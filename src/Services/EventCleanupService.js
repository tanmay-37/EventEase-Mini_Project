import { db } from "../firebase";
import { 
  collection, 
  getDocs, 
  doc, 
  deleteDoc, 
  addDoc, 
  query, 
  where, 
  Timestamp 
} from "firebase/firestore";

export const cleanupExpiredEvents = async () => {
  try {
    // Get all events
    const eventsRef = collection(db, "events");
    const eventsSnapshot = await getDocs(eventsRef);
    const currentDate = new Date();

    for (const eventDoc of eventsSnapshot.docs) {
      const eventData = eventDoc.data();
      const endDate = new Date(eventData.endDate);

      // Check if event has expired
      if (endDate < currentDate) {
        // Store in pastCreatedEvents for host
        await addDoc(collection(db, "pastCreatedEvents"), {
          ...eventData,
          originalEventId: eventDoc.id,
          archivedAt: Timestamp.now()
        });

        // Store in recentEvents for users who registered
        const registrationsRef = collection(db, "registrations");
        const registrationsQuery = query(registrationsRef, where("eventId", "==", eventDoc.id));
        const registrationsSnapshot = await getDocs(registrationsQuery);

        for (const regDoc of registrationsSnapshot.docs) {
          const regData = regDoc.data();
          await addDoc(collection(db, "recentEvents"), {
            ...eventData,
            userId: regData.userId,
            originalEventId: eventDoc.id,
            archivedAt: Timestamp.now()
          });
        }

        // Delete the expired event
        await deleteDoc(doc(db, "events", eventDoc.id));
      }
    }

    return true;
  } catch (error) {
    console.error("Error cleaning up expired events:", error);
    return false;
  }
};