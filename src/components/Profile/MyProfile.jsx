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
    <div className="max-w-md mx-auto bg-white shadow-md rounded-lg p-6 mt-10">
      {/* Header with Single Edit Button */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">My Profile</h2>
        <button 
          onClick={() => setIsEditing(!isEditing)} 
          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-700"
        >
          {isEditing ? "Cancel" : "Edit"}
        </button>
      </div>

      {/* First Name */}
      <div className="mb-3">
        <p className="text-gray-600 font-semibold">First Name:</p>
        {isEditing ? (
          <input 
            type="text"
            name="firstName"
            value={editableProfile.firstName} 
            onChange={handleChange}
            className="w-full border rounded px-2 py-1 mt-1"
          />
        ) : (
          <p className="text-gray-900">{profile.firstName || "N/A"}</p>
        )}
      </div>

      {/* Last Name */}
      <div className="mb-3">
        <p className="text-gray-600 font-semibold">Last Name:</p>
        {isEditing ? (
          <input 
            type="text"
            name="lastName"
            value={editableProfile.lastName} 
            onChange={handleChange}
            className="w-full border rounded px-2 py-1 mt-1"
          />
        ) : (
          <p className="text-gray-900">{profile.lastName || "N/A"}</p>
        )}
      </div>

      {/* Username (or Host Name) */}
      <div className="mb-3">
        <p className="text-gray-600 font-semibold">
          {userType === "host" ? "Host Name" : "Username"}:
        </p>
        {isEditing ? (
          <input 
            type="text"
            name="userName"
            value={editableProfile.userName} 
            onChange={handleChange}
            className="w-full border rounded px-2 py-1 mt-1"
          />
        ) : (
          <p className="text-gray-900">{editableProfile.userName || "N/A"}</p>
        )}
      </div>

      {/* Email (Non-editable) */}
      <div className="mb-3">
        <p className="text-gray-600 font-semibold">Email:</p>
        <p className="text-gray-900">{profile.email}</p>
      </div>

      {/* Designation */}
      <div className="mb-3">
        <p className="text-gray-600 font-semibold">Designation:</p>
        <p className="text-gray-900 capitalize">{userType}</p> 
      </div>

      {/* Save Button */}
      {isEditing && isModified && (
        <button 
          onClick={handleSave} 
          className="bg-purple-500 text-white px-4 py-2 rounded mt-3 hover:bg-purple-700 w-full"
        >
          Save Changes
        </button>
      )}
    </div>
  );
};

export default MyProfile;
