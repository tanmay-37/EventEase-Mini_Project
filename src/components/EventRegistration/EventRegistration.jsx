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
      <div className="min-h-screen bg-purple-100 flex items-center justify-center"
      style={{
          backgroundImage: "url('/images/doodad.png')",
          backgroundSize: "500px",
          backgroundPosition: "left",
        }}>
        <div className="bg-white shadow-2xl rounded-lg p-8 max-w-lg w-full">
          <h2 className="text-3xl font-bold mb-6">Event Registration</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Reusable Input Field Component */}
            {[
              { label: "Full Name", name: "fullName", type: "text", placeholder: "Enter your full name", required: true },
              { label: "Email", name: "email", type: "email", placeholder: "Enter your email", required: true },
              { label: "WhatsApp Number", name: "whatsapp", type: "tel", placeholder: "Enter WhatsApp number", required: true },
              { label: "GitHub Profile", name: "github", type: "url", placeholder: "Enter GitHub profile URL" },
              { label: "LinkedIn Profile", name: "linkedin", type: "url", placeholder: "Enter LinkedIn profile URL" },
              { label: "Nationality", name: "nationality", type: "text", placeholder: "Enter your nationality" },
              { label: "College/University", name: "college", type: "text", placeholder: "Enter college/university name" }
            ].map(({ label, name, type, placeholder, required }) => (
              <div key={name}>
                <label className="block text-sm font-medium text-gray-700">{label}</label>
                <input
                  type={type}
                  name={name}
                  value={formData[name]}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all"
                  placeholder={placeholder}
                  required={required}
                />
              </div>
            ))}

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

            {/* Upload Screenshot */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Upload Payment Screenshot</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all"
                required
              />
              {loading && <p className="text-blue-500">Uploading...</p>}
            </div>

            <button
              type="submit"
              className={`mt-3 bg-gradient-to-r from-[#A084E8] to-[#8C72D4] text-white font-semibold py-2 px-6 text-lg rounded-lg shadow-md hover:shadow-xl hover:from-[#8C72D4] hover:to-[#705EBB] transition-all duration-300 w-full ${loading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"}`}
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