import React, { useState } from "react";
import { addDoc, collection, serverTimestamp, runTransaction, doc, increment } from "firebase/firestore";
import { db } from "../../firebase";
import { getAuth } from "firebase/auth";
import { useNavigate, useParams } from "react-router-dom";

const EventRegistration = () => {
  const navigate = useNavigate();
  const { id: eventId } = useParams();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    whatsapp: "",
    github: "",
    linkedin: "",
    nationality: "",
    college: "",
    paymentScreenshot: "",
  });

  const [loading, setLoading] = useState(false);
  const [showPaymentQR, setShowPaymentQR] = useState(false); // Toggle payment QR visibility

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle file upload for payment screenshot
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setFormData((prev) => ({
          ...prev,
          paymentScreenshot: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      alert("You must be logged in to register for this event.");
      return;
    }

    if (!eventId) {
      console.error("Invalid eventId:", eventId);
      alert("Invalid Event ID. Please try again.");
      return;
    }

    try {
      setLoading(true);

      // Firestore document references
      const eventRef = doc(db, "events", eventId);
      const registrationsRef = collection(db, "registrations");

      // Firestore transaction for atomic updates
      await runTransaction(db, async (transaction) => {
        // Get event document
        const eventDoc = await transaction.get(eventRef);

        if (!eventDoc.exists()) {
          throw new Error("Event does not exist.");
        }

        // Add registration entry
        await addDoc(registrationsRef, {
          ...formData,
          eventId,
          userId: user.uid,
          createdAt: serverTimestamp(),
        });

        // Increment registration count in event document
        transaction.update(eventRef, { registrationCount: increment(1) });
      });

      alert("Registered successfully!");
      navigate(`/event-details/${eventId}`);
    } catch (error) {
      console.error("Error registering:", error);
      alert("Failed to register. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F172A] px-4 py-8 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#38BDF8] rounded-full mix-blend-multiply filter blur-xl opacity-20"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-[#F59E0B] rounded-full mix-blend-multiply filter blur-xl opacity-20"></div>
      </div>
  
      <div 
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: "url('/images/doodad.png')",
          backgroundSize: "500px",
          backgroundPosition: "left",
        }}
      />
  
      <div className="max-w-2xl mx-auto relative z-10">
        <div className="bg-[#1E293B]/80 backdrop-blur-sm rounded-2xl p-6 sm:p-8 
          border border-[#38BDF8]/20 shadow-[0_0_30px_rgba(56,189,248,0.2)]">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#F1F5F9] mb-8 text-center relative">
            Event Registration
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 h-1 w-24 
              bg-gradient-to-r from-[#38BDF8] to-[#F59E0B] rounded-full"></div>
          </h2>
  
          <form onSubmit={handleSubmit} className="space-y-6">
            {[
              { label: "Full Name", name: "fullName", type: "text", placeholder: "Enter your full name", required: true },
              { label: "Email", name: "email", type: "email", placeholder: "Enter your email", required: true },
              { label: "WhatsApp Number", name: "whatsapp", type: "tel", placeholder: "Enter WhatsApp number", required: true },
              { label: "GitHub Profile", name: "github", type: "url", placeholder: "Enter GitHub profile URL" },
              { label: "LinkedIn Profile", name: "linkedin", type: "url", placeholder: "Enter LinkedIn profile URL" },
              { label: "Nationality", name: "nationality", type: "text", placeholder: "Enter your nationality" },
              { label: "College/University", name: "college", type: "text", placeholder: "Enter college/university name" },
            ].map(({ label, name, type, placeholder, required }) => (
              <div key={name} className="space-y-2">
                <label className="text-sm font-semibold text-[#F1F5F9]/80">{label}</label>
                <input
                  type={type}
                  name={name}
                  value={formData[name]}
                  onChange={handleChange}
                  className="w-full p-3 bg-[#0F172A]/50 border border-[#38BDF8]/20 rounded-xl
                    text-[#F1F5F9] placeholder-[#F1F5F9]/30 focus:outline-none
                    focus:border-[#38BDF8]/40 focus:ring-2 focus:ring-[#38BDF8]/20
                    transition-all"
                  placeholder={placeholder}
                  required={required}
                />
              </div>
            ))}
  
            {formData.paymentScreenshot && (
              <div className="relative group rounded-xl overflow-hidden">
                <div className="absolute -inset-1 bg-gradient-to-r from-[#38BDF8] to-[#F59E0B] 
                  rounded-xl blur opacity-20 group-hover:opacity-30 transition duration-300"></div>
                <img
                  src={formData.paymentScreenshot}
                  alt="Payment Screenshot"
                  className="w-full h-48 object-cover rounded-xl relative"
                />
              </div>
            )}
  
            {/* View Payment QR Button */}
            <button
              type="button"
              onClick={() => setShowPaymentQR(!showPaymentQR)}
              className="w-full bg-[#0F172A]/50 text-[#F1F5F9] font-medium py-3 rounded-xl
                border border-[#38BDF8]/20 hover:border-[#38BDF8]/40
                shadow-[0_0_20px_rgba(56,189,248,0.1)]
                hover:shadow-[0_0_25px_rgba(56,189,248,0.2)]
                transition-all duration-300"
            >
              {showPaymentQR ? "Hide Payment QR" : "View Payment QR"}
            </button>
  
            {/* Display QR Code if button is clicked */}
            {showPaymentQR && (
              <div className="mt-4 flex flex-col items-center space-y-3">
                <h3 className="text-lg font-semibold text-[#F1F5F9]">Scan to Pay</h3>
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-[#38BDF8] to-[#F59E0B] 
                    rounded-xl blur opacity-20 group-hover:opacity-30 transition duration-300"></div>
                  <img
                    src="/QRCODE.jpeg"
                    alt="Payment QR Code"
                    className="w-40 h-40 object-cover rounded-xl relative"
                  />
                </div>
              </div>
            )}
  
            {/* Upload Screenshot */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-[#F1F5F9]/80">Upload Payment Screenshot</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="w-full p-3 bg-[#0F172A]/50 border border-[#38BDF8]/20 rounded-xl
                  text-[#F1F5F9] file:bg-[#38BDF8]/10 file:border-0
                  file:text-[#38BDF8] file:font-medium file:mr-4
                  file:py-2 file:px-4 file:rounded-lg
                  hover:file:bg-[#38BDF8]/20
                  focus:outline-none focus:border-[#38BDF8]/40
                  focus:ring-2 focus:ring-[#38BDF8]/20
                  transition-all"
                required
              />
            </div>
  
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#38BDF8] to-[#F59E0B]
                text-[#0F172A] font-semibold py-4 rounded-xl mt-6
                shadow-[0_0_20px_rgba(56,189,248,0.3)]
                hover:shadow-[0_0_25px_rgba(56,189,248,0.5)]
                transition-all duration-300 relative group overflow-hidden
                disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="relative z-10">
                {loading ? "Submitting..." : "Register"}
              </span>
              <div className="absolute inset-0 bg-white/20 group-hover:bg-transparent 
                transition-colors duration-300"></div>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EventRegistration;
