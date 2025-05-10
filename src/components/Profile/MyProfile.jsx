import { useState, useEffect } from "react";
import { db } from "../../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { UserAuth } from "../../context/AuthContext";

const MyProfile = () => {
  const { userId, userType } = UserAuth();
  const [profile, setProfile] = useState(null);
  const [editableProfile, setEditableProfile] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [isModified, setIsModified] = useState(false);

  useEffect(() => {
    if (!userId) return;

    const fetchUserProfile = async () => {
      try {
        console.log("Fetching profile for:", userId, "User Type:", userType);

        let userRef = doc(db, userType === "host" ? "hosts" : "users", userId);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          console.log("Profile found:", userSnap.data());
          const data = userSnap.data();

          setProfile(data);
          setEditableProfile({
            firstName: data.firstName || "",
            lastName: data.lastName || "",
            userName: userType === "host" ? data.hostName || "" : data.userName || "",
            email: data.email || "",
          });
        } else {
          console.error("❌ User profile not found in Firestore!");
        }
      } catch (error) {
        console.error("🔥 Error fetching profile:", error);
      }
    };

    fetchUserProfile();
  }, [userId, userType]);

  const handleChange = (e) => {
    setEditableProfile({ ...editableProfile, [e.target.name]: e.target.value });
    setIsModified(true);
  };

  const handleSave = async () => {
    try {
      let userRef = doc(db, userType === "host" ? "hosts" : "users", userId);

      await updateDoc(userRef, {
        firstName: editableProfile.firstName,
        lastName: editableProfile.lastName,
        ...(userType === "host"
          ? { hostName: editableProfile.userName }
          : { userName: editableProfile.userName }),
      });

      setProfile(editableProfile);
      setIsEditing(false);
      setIsModified(false);
      console.log("✅ Profile updated successfully!");
    } catch (error) {
      console.error("⚠️ Error updating profile:", error);
    }
  };

  if (!profile) {
    return <p className="text-center mt-5 text-[#F1F5F9]">🔄 Loading profile...</p>;
  }

  return (
    <div className="min-h-screen bg-[#0F172A] px-4 py-8 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#38BDF8] rounded-full mix-blend-multiply filter blur-xl opacity-20"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-[#F59E0B] rounded-full mix-blend-multiply filter blur-xl opacity-20"></div>
      </div>

      {/* Background Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: "url('/images/doodad.png')",
          backgroundSize: "500px",
          backgroundPosition: "left",
        }}
      />

      <div className="max-w-2xl mx-auto relative z-10">
        <div className="bg-[#1E293B]/80 backdrop-blur-sm rounded-2xl p-8 
          border border-[#38BDF8]/20 shadow-[0_0_30px_rgba(56,189,248,0.2)]">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-[#F1F5F9] relative inline-block">
              My Profile
              <div className="absolute -bottom-2 left-0 h-1 w-24 
                bg-gradient-to-r from-[#38BDF8] to-[#F59E0B] rounded-full"></div>
            </h2>
            <button 
              onClick={() => setIsEditing(!isEditing)} 
              className="px-4 py-2 bg-[#0F172A]/50 text-[#F1F5F9] rounded-xl
                border border-[#38BDF8]/20 hover:border-[#38BDF8]/40
                shadow-[0_0_20px_rgba(56,189,248,0.1)]
                hover:shadow-[0_0_25px_rgba(56,189,248,0.2)]
                transition-all duration-300"
            >
              {isEditing ? "Cancel" : "Edit"}
            </button>
          </div>

          {/* Profile Fields */}
          <div className="space-y-6">
            {/* Field Template - repeat for each field */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-[#F1F5F9]/80">First Name</label>
              {isEditing ? (
                <input 
                  type="text"
                  name="firstName"
                  value={editableProfile.firstName} 
                  onChange={handleChange}
                  className="w-full p-3 bg-[#0F172A]/50 border border-[#38BDF8]/20 rounded-xl
                    text-[#F1F5F9] placeholder-[#F1F5F9]/30 focus:outline-none
                    focus:border-[#38BDF8]/40 focus:ring-2 focus:ring-[#38BDF8]/20
                    transition-all"
                />
              ) : (
                <div className="p-3 bg-[#0F172A]/50 border border-[#38BDF8]/20 rounded-xl
                  text-[#F1F5F9]">
                  {profile.firstName || "N/A"}
                </div>
              )}
            </div>

            {/* Last Name */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-[#F1F5F9]/80">Last Name</label>
              {isEditing ? (
                <input 
                  type="text"
                  name="lastName"
                  value={editableProfile.lastName} 
                  onChange={handleChange}
                  className="w-full p-3 bg-[#0F172A]/50 border border-[#38BDF8]/20 rounded-xl
                    text-[#F1F5F9] placeholder-[#F1F5F9]/30 focus:outline-none
                    focus:border-[#38BDF8]/40 focus:ring-2 focus:ring-[#38BDF8]/20
                    transition-all"
                />
              ) : (
                <div className="p-3 bg-[#0F172A]/50 border border-[#38BDF8]/20 rounded-xl
                  text-[#F1F5F9]">
                  {profile.lastName || "N/A"}
                </div>
              )}
            </div>

            {/* Username/Host Name */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-[#F1F5F9]/80">
                {userType === "host" ? "Host Name" : "Username"}
              </label>
              {isEditing ? (
                <input 
                  type="text"
                  name="userName"
                  value={editableProfile.userName} 
                  onChange={handleChange}
                  className="w-full p-3 bg-[#0F172A]/50 border border-[#38BDF8]/20 rounded-xl
                    text-[#F1F5F9] placeholder-[#F1F5F9]/30 focus:outline-none
                    focus:border-[#38BDF8]/40 focus:ring-2 focus:ring-[#38BDF8]/20
                    transition-all"
                />
              ) : (
                <div className="p-3 bg-[#0F172A]/50 border border-[#38BDF8]/20 rounded-xl
                  text-[#F1F5F9]">
                  {profile.userName || profile.hostName || "N/A"}
                </div>
              )}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-[#F1F5F9]/80">Email</label>
              <div className="p-3 bg-[#0F172A]/50 border border-[#38BDF8]/20 rounded-xl
                text-[#F1F5F9]">
                {profile.email}
              </div>
            </div>

            {/* Designation */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-[#F1F5F9]/80">Designation</label>
              <div className="p-3 bg-[#0F172A]/50 border border-[#38BDF8]/20 rounded-xl
                text-[#F1F5F9] capitalize">
                {userType}
              </div>
            </div>

            {/* Save Button */}
            {isEditing && isModified && (
              <button 
                onClick={handleSave}
                className="w-full bg-gradient-to-r from-[#38BDF8] to-[#F59E0B]
                  text-[#0F172A] font-semibold py-4 rounded-xl mt-6
                  shadow-[0_0_20px_rgba(56,189,248,0.3)]
                  hover:shadow-[0_0_25px_rgba(56,189,248,0.5)]
                  transition-all duration-300 relative group overflow-hidden"
              >
                <span className="relative z-10">Save Changes</span>
                <div className="absolute inset-0 bg-white/20 group-hover:bg-transparent 
                  transition-colors duration-300"></div>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;