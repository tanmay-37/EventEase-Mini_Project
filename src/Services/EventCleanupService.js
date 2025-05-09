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
    console.log("Starting cleanup process...");
    const eventsRef = collection(db, "events");
    const eventsSnapshot = await getDocs(eventsRef);
    const currentDateTime = new Date();

    console.log(`Found ${eventsSnapshot.docs.length} events to check`);

    for (const eventDoc of eventsSnapshot.docs) {
      const eventData = eventDoc.data();
      console.log("Checking event:", eventData.title);

      const eventStartDate = new Date(eventData.startDate);
      const eventStartTime = eventData.startTime;
      
      // Convert event time to Date object
      const [hours, minutes] = eventStartTime.split(':');
      eventStartDate.setHours(parseInt(hours), parseInt(minutes));

      // Add 2 hours to event start time
      const eventEndDateTime = new Date(eventStartDate.getTime() + (2 * 60 * 60 * 1000));

      console.log("Event start:", eventStartDate);
      console.log("Event end (after 2 hours):", eventEndDateTime);
      console.log("Current time:", currentDateTime);

      if (currentDateTime > eventEndDateTime) {
        console.log("Event expired, moving to recent events:", eventData.title);
        
        try {
          // Store in recentEvents first
          await addDoc(collection(db, "recentEvents"), {
            ...eventData,
            originalEventId: eventDoc.id,
            archivedAt: Timestamp.now()
          });

          // Get and process registrations
          const registrationsRef = collection(db, "registrations");
          const registrationsQuery = query(
            registrationsRef, 
            where("eventId", "==", eventDoc.id)
          );
          const registrationsSnapshot = await getDocs(registrationsQuery);

          console.log(`Processing ${registrationsSnapshot.docs.length} registrations`);

          // Update registrations
          for (const regDoc of registrationsSnapshot.docs) {
            const regData = regDoc.data();
            await addDoc(collection(db, "recentEvents"), {
              ...eventData,
              userId: regData.userId,
              registrationId: regDoc.id,
              originalEventId: eventDoc.id,
              archivedAt: Timestamp.now()
            });
          }

          // Finally remove the original event
          await deleteDoc(doc(db, "events", eventDoc.id));
          console.log("Successfully moved event to recent events");
        } catch (error) {
          console.error("Error processing event:", error);
        }
      } else {
        console.log("Event not expired yet");
      }
    }

    return true;
  } catch (error) {
    console.error("Error in cleanup process:", error);
    return false;
  }
};