import { useNavigate } from "react-router-dom";

const CreateEventBtn = () => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate("/create-events")}
      className="px-6 py-3 bg-[#4A3F74] text-white font-semibold rounded-2xl shadow-lg transition-all duration-300 hover:bg-[#3A2F64] hover:shadow-xl"
    >
      Create New Event
    </button>
  );
};

export default CreateEventBtn;