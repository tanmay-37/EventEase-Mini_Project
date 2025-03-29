  import { useState, useEffect } from "react";
  import { collection, query, where, onSnapshot } from "firebase/firestore";
  import { db } from "../../firebase";
  import { UserAuth } from "../../context/AuthContext";

  const OverviewPanel = () => {
    const { user } = UserAuth();
    const [data, setData] = useState({ events: 0, registrations: 0, revenue: 0 });

    useEffect(() => {
      if (!user) return;

      // Firestore real-time listener
      const q = query(collection(db, "events"), where("userId", "==", user.uid));

      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const eventsCount = querySnapshot.docs.length;
        let totalRevenue = 0, totalRegistrations = 0;

        querySnapshot.docs.forEach(doc => {
          totalRegistrations += doc.data().registrations || 0;
          totalRevenue += doc.data().revenue || 0;
        });

        setData({ events: eventsCount, registrations: totalRegistrations, revenue: totalRevenue });
      });

      // Cleanup function to unsubscribe when component unmounts
      return () => unsubscribe();
    }, [user]);

    return (
      <div className="p-6 bg-white/30 backdrop-blur-lg shadow-lg border border-white/30 rounded-2xl">
        <h2 className="text-xl font-semibold text-[#4A3F74]">Dashboard Overview</h2>
        <p className="text-[#4A3F74] font-medium">Total Events: {data.events}</p>
        <p className="text-[#4A3F74] font-medium">Total Registrations: {data.registrations}</p>
        <p className="text-[#4A3F74] font-medium">
          Revenue: ₹{new Intl.NumberFormat('en-IN').format(data.revenue)}
        </p>
      </div>
    );
  };

  export default OverviewPanel;