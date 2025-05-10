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
          // Get registrations count first
          const registrationsRef = collection(db, "registrations");
          const registrationsQuery = query(
            registrationsRef, 
            where("eventId", "==", eventDoc.id)
          );
          const registrationsSnapshot = await getDocs(registrationsQuery);
          const registrationCount = registrationsSnapshot.size;

          // Store main event in recentEvents with registration count
          await addDoc(collection(db, "recentEvents"), {
            ...eventData,
            originalEventId: eventDoc.id,
            registrationCount: registrationCount,
            isMainEvent: true, // Flag to identify the main event record
            archivedAt: Timestamp.now()
          });

          console.log(`Processing ${registrationsSnapshot.docs.length} registrations`);

          // Store individual registration records
          const registrationPromises = registrationsSnapshot.docs.map(regDoc => {
            const regData = regDoc.data();
            return addDoc(collection(db, "recentEvents"), {
              ...eventData,
              userId: regData.userId,
              registrationId: regDoc.id,
              originalEventId: eventDoc.id,
              registrationCount: registrationCount,
              isRegistration: true, // Flag to identify registration records
              archivedAt: Timestamp.now()
            });
          });

          // Wait for all registration records to be stored
          await Promise.all(registrationPromises);

          // Delete original event and its registrations
          await deleteDoc(doc(db, "events", eventDoc.id));
          
          // Delete all registrations for this event
          for (const regDoc of registrationsSnapshot.docs) {
            await deleteDoc(doc(db, "registrations", regDoc.id));
          }

          console.log("Successfully moved event and registrations to recent events");
        } catch (error) {
          console.error("Error processing event:", error);
          throw error; // Rethrow to handle in outer catch block
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