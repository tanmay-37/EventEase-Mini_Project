import React, { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase";
import { useNavigate, useParams } from "react-router-dom";
import imageCompression from "browser-image-compression";

const EventRegistration = () => {
  const navigate = useNavigate();
  const { id } = useParams();

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
  const [showQR, setShowQR] = useState(false);   // To show/hide QR modal
  const MAX_IMAGE_SIZE = 1024 * 1024;  // 1MB

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle image upload and compression
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) {
      alert("Please select an image.");
      return;
    }

    try {
      setLoading(true);

      let compressedFile = file;
      if (file.size > MAX_IMAGE_SIZE) {
        const options = {
          maxSizeMB: 1,         
          maxWidthOrHeight: 1024,
          useWebWorker: true,
        };
        compressedFile = await imageCompression(file, options);
      }

      const reader = new FileReader();
      reader.readAsDataURL(compressedFile);

      reader.onload = () => {
        const base64Image = reader.result;

        if (base64Image.length > 1000000) {
          alert("Screenshot is too large even after compression!");
          return;
        }

        setFormData((prev) => ({ ...prev, paymentScreenshot: base64Image }));
        console.log("Screenshot uploaded successfully.");
      };

      reader.onerror = (error) => {
        console.error("Error converting image:", error);
        alert("Failed to upload image!");
      };
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image!");
    } finally {
      setLoading(false);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.fullName || !formData.email || !formData.whatsapp || !formData.paymentScreenshot) {
      alert("Please fill all required fields and upload the payment screenshot.");
      return;
    }

    setLoading(true);

    try {
      await addDoc(collection(db, "event-registrations"), {
        eventId: id,
        ...formData,
        registeredAt: serverTimestamp(),
      });

      alert("You have successfully registered!");
      navigate(`/event/${id}`);

    } catch (error) {
      console.error("Error registering:", error);
      alert("Failed to register. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white shadow-2xl rounded-lg p-8 max-w-lg w-full">
        <h2 className="text-3xl font-bold mb-6">Event Registration</h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              placeholder="Enter your full name"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              placeholder="Enter your email"
              required
            />
          </div>

          {/* WhatsApp Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700">WhatsApp Number</label>
            <input
              type="tel"
              name="whatsapp"
              value={formData.whatsapp}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              placeholder="Enter WhatsApp number"
              required
            />
          </div>

          {/* GitHub Profile */}
          <div>
            <label className="block text-sm font-medium text-gray-700">GitHub Profile</label>
            <input
              type="url"
              name="github"
              value={formData.github}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              placeholder="Enter GitHub profile URL"
            />
          </div>

          {/* LinkedIn Profile */}
          <div>
            <label className="block text-sm font-medium text-gray-700">LinkedIn Profile</label>
            <input
              type="url"
              name="linkedin"
              value={formData.linkedin}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              placeholder="Enter LinkedIn profile URL"
            />
          </div>

          {/* Nationality */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Nationality</label>
            <input
              type="text"
              name="nationality"
              value={formData.nationality}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              placeholder="Enter your nationality"
            />
          </div>

          {/* College/University */}
          <div>
            <label className="block text-sm font-medium text-gray-700">College/University</label>
            <input
              type="text"
              name="college"
              value={formData.college}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              placeholder="Enter college/university name"
            />
          </div>

          {/* Payment QR Button */}
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setShowQR(true)}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-800 transition"
            >
              View Payment QR
            </button>
          </div>

          {/* Modal to display QR */}
          {showQR && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-xl font-bold mb-4">Scan QR to Pay</h2>
                <img
                  src="/qr-code.png"  
                  alt="Payment QR"
                  className="w-64 h-64"
                />
                <button
                  onClick={() => setShowQR(false)}
                  className="bg-red-500 text-white px-4 py-2 rounded mt-4"
                >
                  Close
                </button>
              </div>
            </div>
          )}

          {/* Upload Screenshot */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Upload Payment Screenshot</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="w-full p-2 border rounded"
              required
            />
            {loading && <p className="text-blue-500">Uploading...</p>}
          </div>

          <button
            type="submit"
            className={`w-full bg-blue-600 text-white p-3 rounded transition ${
              loading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
            }`}
            disabled={loading}
          >
            {loading ? "Submitting..." : "Register"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EventRegistration;
