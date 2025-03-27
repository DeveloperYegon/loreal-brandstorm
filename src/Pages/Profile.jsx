import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import {jwtDecode} from "jwt-decode";
import Logout from "./Logout";
import 'react-toastify/dist/ReactToastify.css';

function Profile() {
  const [errorMessages, setErrorMessages] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState({ name: "", email: "", skinType: "", concerns: [], lifestyle: "", Environ: "" });

  const skinTypes = ["Oily", "Dry", "Combination", "Sensitive", "Normal"];
  const lifestyle= ["Active", "Sedentary", "Moderate", "Highly Active","workaholic","Gym Rat"];
  const Environ= ["Dry Climate","Significant Sun Exposure"," Humid Climate", "Urban", "Rural", "Coastal"];
  const concerns = ["Acne", "Hyperpigmentation", "Razor Bumps", "Aging", "Dull Skin"];

  //  Extract userId from JWT token
  const token = localStorage.getItem('authToken');
  if (!token) {
    window.location.href = '/login';
  }
  let userId = null;
  try {
    const decodedToken = jwtDecode(token);
    userId = decodedToken.userId; // Extract user ID from token
  } catch (error) {
    console.error(" Error decoding token:", error);
  }

  console.log("User ID:", userId);

  // Fetch user data
  useEffect(() => {

    if (!userId) {
      console.error(" User ID is undefined.");
      return;
    }
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`http://localhost:5001/api/user/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("User data:", response.data);
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
        if (error.response && error.response.status === 401) {
          localStorage.removeItem("authToken");
          window.location.href = "/login"; 
        } else {
          setErrorMessages("Error fetching user data. Please try again later.");
        }
      } finally {
          setIsLoading(false);
      }
    };
    fetchUserData();
  }, [userId, token]);// Ensure useEffect re-runs if token changes

  // Handle input change (including checkboxes)
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setUser((prev) => ({
        ...prev,
        concerns: Array.isArray(prev.concerns) 
          ? checked 
            ? [...prev.concerns, value] 
            : prev.concerns.filter(c => c !== value)
          : [value], // Ensure it's an array
      }));
    } else {
      setUser({ ...user, [name]: value });
    }
  };

  //  Save updated profile
  const handleSave = async (e) => {
    e.preventDefault();
    console.log(user);
    try {
      setIsLoading(true);
      await axios.put(`http://localhost:5001/api/user/${userId}`,user,{
        headers: { Authorization: `Bearer ${token}` },
      
      } );
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error("Error updating profile. Please try again later.");
      console.error("Error updating profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="h-full p-5 bg-white rounded-[10px]">

      <h1 className="md:text-5xl text-center text-2xl my-10">Welcome here: <span className="text-[#F13934] md:text-5xl text-2xl">{user.name}</span> ?</h1>
      <div className=' md:w-1/2 rounded-[10px] m-auto p-5'>
        <h3 className='text-center py-5 font-bold text-[#F13934] text-2xl'>Update Profile</h3>
        <hr className='w-[80%] h-1 m-auto bg-black' />

        {errorMessages && <div className='text-center py-3 text-red-600'>{errorMessages}</div>}

        <form className="flex m-5 p-3 flex-col">
          <label className="font-bold py-3" htmlFor="name">Name:</label>
          <input className="bg-slate-300 border p-3 rounded-xl" type="text" name="name" value={user.name || ""} onChange={handleChange} placeholder="Enter your name"/>

          <label className="font-bold py-3" htmlFor="email">Email:</label>
          <input className="bg-slate-300 border p-3 rounded-xl" type="email" name="email" value={user.email || ""} disabled/>

          <label className="font-bold py-3" htmlFor="role">Role:</label>
          <input className="bg-slate-300 border p-3 rounded-xl" type="text" value={user.role || ""} disabled />


          <label className="font-bold py-3" htmlFor="concerns">User Concerns/Preferences:</label>
          <div className="flex flex-wrap">
            {concerns.map((concern) => (
              <label key={concern} className="flex items-center mr-4">
                <input type="checkbox" name="concerns" className="mr-2 bg-[#F0BA30]" value={concern} checked={Array.isArray(user.concerns) && user.concerns.includes(concern)} onChange={handleChange}/>
                {concern}
              </label>
            ))}
          </div>

          <label className="font-bold py-3" htmlFor="skinType">Skin Type:</label>
          <select name="skinType" className="bg-slate-300 border p-3 rounded-xl" value={user.skinType || ""} onChange={handleChange}>
            <option value="">Select Skin Type</option>
            {skinTypes.map((type) => <option key={type} value={type}>{type}</option>)}
          </select>

         

          <label className="font-bold py-3" htmlFor="lifestyle">Lifestyle:</label>
          <select name="lifestyle" className="bg-slate-300 border p-3 rounded-xl" id="lifestyle" value={user.lifestyle || ""} onChange={handleChange}>
            <option value=""> Select lifestyle</option>
            {lifestyle.map((type) => <option key={type} value={type}>{type}</option>)}
          </select>


          <label className="font-bold py-3" htmlFor="Environ">Environmental Factors:</label>
            <select name="Environ" id="Environ" className="bg-slate-300 border p-3 rounded-xl" value={user.Environ || "" } onChange={handleChange}>
              <option value="">Select Environmental factors</option>
              {Environ.map((type) => <option key={type} value={type}>{type}</option>)}
            </select>

          {/*  Correct Save Button */}
          <button className="bg-[#000] text-white px-4 py-2 rounded-lg mt-3" onClick={handleSave} disabled={isLoading}>
            {isLoading ? "Saving..." : "Save"}
          </button>
        </form>

        <ToastContainer />
      </div>

      <Logout/>
    </main>
  );
}

export default Profile;
