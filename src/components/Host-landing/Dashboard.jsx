import OverviewPanel from "./OverviewPanel";
import EventManagement from "./EventManagement";
import CreateEventBtn from "./CreateEventBtn";

const Dashboard = () => {
  return (
    <div className="min-h-screen flex flex-col p-4 lg:p-6 bg-[#F5F3FF]"
    style={{
        backgroundImage: "url('/images/doodad.png')",
        backgroundSize: "500px",
        backgroundPosition: "left",
      }}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-grow">
          <OverviewPanel />
          <EventManagement />
        <div className="md:col-span-2">
          <CreateEventBtn />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
