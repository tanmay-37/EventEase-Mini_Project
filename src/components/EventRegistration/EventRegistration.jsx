import React, { useState, useEffect } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase";
import { getAuth } from "firebase/auth";
import { useNavigate, useParams } from "react-router-dom";  // ✅ Import useParams

const EventRegistration = () => {
  const navigate = useNavigate();
  const { id: eventId } = useParams();  // ✅ Extract eventId from route params

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    whatsapp: "",
    github: "",
    linkedin: "",
    nationality: "",
    college: "",
    paymentScreenshot: ""
  });

  const [loading, setLoading] = useState(false);

  // ✅ Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setFormData((prev) => ({
          ...prev,
          paymentScreenshot: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

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

      const registrationData = {
        ...formData,
        eventId,  // ✅ Add eventId dynamically from route
        userId: user.uid,
        createdAt: serverTimestamp(),
      };

      await addDoc(collection(db, "registrations"), registrationData);
      alert("Registered successfully!");
      navigate(`/event/${eventId}`);

    } catch (error) {
      console.error("Error registering:", error);
      alert("Failed to register. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-6">Event Registration</h2>
      <form onSubmit={handleSubmit} className="space-y-4">

        <input
          type="text"
          name="fullName"
          placeholder="Full Name"
          value={formData.fullName}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />

        <input
          type="text"
          name="whatsapp"
          placeholder="WhatsApp No"
          value={formData.whatsapp}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />

        <input
          type="text"
          name="github"
          placeholder="GitHub Profile"
          value={formData.github}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />

        <input
          type="text"
          name="linkedin"
          placeholder="LinkedIn Profile"
          value={formData.linkedin}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />

        <input
          type="text"
          name="nationality"
          placeholder="Nationality"
          value={formData.nationality}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />

        <input
          type="text"
          name="college"
          placeholder="College/University"
          value={formData.college}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />

        <label className="block text-sm font-medium text-gray-700">Upload Payment Screenshot</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          required
          className="w-full p-2 border rounded"
        />

        {formData.paymentScreenshot && (
          <img
            src={formData.paymentScreenshot}
            alt="Payment Screenshot"
            className="w-full h-48 object-cover rounded-md mt-2"
          />
        )}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700 transition"
          disabled={loading}
        >
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  );
};

export default EventRegistration;
