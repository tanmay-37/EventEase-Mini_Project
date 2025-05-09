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
    return <p className="text-center mt-5">🔄 Loading profile...</p>;
  }

   return (
    <div className="min-h-screen p-6 bg-[#F5F3FF]"
      style={{
        backgroundImage: "url('/images/doodad.png')",
        backgroundSize: "500px",
        backgroundPosition: "left",
      }}>
      <div className="max-w-2xl mx-auto bg-white/30 backdrop-blur-lg shadow-xl rounded-2xl p-8 mt-10 border border-white/30">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-[#4A3F74]">My Profile</h2>
          <button 
            onClick={() => setIsEditing(!isEditing)} 
            className="px-4 py-2 bg-[#A084E8] hover:bg-[#8C72D4] text-white rounded-lg transition-colors shadow-md"
          >
            {isEditing ? "Cancel" : "Edit"}
          </button>
        </div>

        {/* Profile Fields */}
        <div className="space-y-6">
          {/* First Name */}
          <div className="relative">
            <p className="text-[#4A3F74] font-semibold mb-1">First Name</p>
            {isEditing ? (
              <input 
                type="text"
                name="firstName"
                value={editableProfile.firstName} 
                onChange={handleChange}
                className="w-full bg-white/50 border border-[#A084E8]/30 rounded-lg px-4 py-2 focus:outline-none focus:border-[#A084E8] transition-colors"
              />
            ) : (
              <p className="px-4 py-2 bg-white/50 rounded-lg text-[#4A3F74]">
                {profile.firstName || "N/A"}
              </p>
            )}
          </div>

          {/* Last Name */}
          <div className="relative">
            <p className="text-[#4A3F74] font-semibold mb-1">Last Name</p>
            {isEditing ? (
              <input 
                type="text"
                name="lastName"
                value={editableProfile.lastName} 
                onChange={handleChange}
                className="w-full bg-white/50 border border-[#A084E8]/30 rounded-lg px-4 py-2 focus:outline-none focus:border-[#A084E8] transition-colors"
              />
            ) : (
              <p className="px-4 py-2 bg-white/50 rounded-lg text-[#4A3F74]">
                {profile.lastName || "N/A"}
              </p>
            )}
          </div>

          {/* Username/Host Name */}
          <div className="relative">
            <p className="text-[#4A3F74] font-semibold mb-1">
              {userType === "host" ? "Host Name" : "Username"}
            </p>
            {isEditing ? (
              <input 
                type="text"
                name="userName"
                value={editableProfile.userName} 
                onChange={handleChange}
                className="w-full bg-white/50 border border-[#A084E8]/30 rounded-lg px-4 py-2 focus:outline-none focus:border-[#A084E8] transition-colors"
              />
            ) : (
              <p className="px-4 py-2 bg-white/50 rounded-lg text-[#4A3F74]">
                {profile.userName || "N/A"}
              </p>
            )}
          </div>

          {/* Email */}
          <div className="relative">
            <p className="text-[#4A3F74] font-semibold mb-1">Email</p>
            <p className="px-4 py-2 bg-white/50 rounded-lg text-[#4A3F74]">
              {profile.email}
            </p>
          </div>

          {/* Designation */}
          <div className="relative">
            <p className="text-[#4A3F74] font-semibold mb-1">Designation</p>
            <p className="px-4 py-2 bg-white/50 rounded-lg text-[#4A3F74] capitalize">
              {userType}
            </p>
          </div>

          {/* Save Button */}
          {isEditing && isModified && (
            <button 
              onClick={handleSave}
              className="w-full bg-[#A084E8] hover:bg-[#8C72D4] text-white py-3 rounded-lg mt-6 font-semibold shadow-md transition-colors"
            >
              Save Changes
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyProfile;