import React, { useEffect, useState } from 'react';
import { useAuth } from '../Context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {  toast } from 'react-toastify';

function Register() {

    const [username,setUsername]=useState("");
    const [email,setEmail]=useState("");
    const [password,setPassword]=useState("");
    const [cpassword,setCPassword]=useState("");
    const [loading,setLoading]=useState(false);
    const {registerWithSiteEmailPass,currentUser}=useAuth();
    const navigate=useNavigate();

const handleSubmit=async (e)=>{
    e.preventDefault();
    setLoading(true);
if(password!==cpassword){
    toast.error("Passwords don't match");
return;
}else if(password.length<6){
    toast.error("Password must be 6 characters long");
return;
}
try {
    await registerWithSiteEmailPass(username,email,password);
    navigate('/signin');
    toast.success("User successfully registered");
} catch (error) {
    console.log(error);
    toast.error("Failed to register the user");
}

setLoading(false);
setEmail("");
setUsername("");
setCPassword("");
setPassword("");

}
useEffect(()=>{
    if(currentUser){
        navigate('/');
    }
})

    return (
        <>       

        <form onSubmit={(e)=>handleSubmit(e)}>
                    <div className="flex flex-col justify-center items-center v-screen bg-slate-100">
            <h2 className='text-orange-500 text-3xl font-bold m-4'>New User SignUp</h2>
            <div className="flex justify-between items-center gap-3 w-4/5 m-3">
                <label htmlFor="username" className="text-sm font-medium text-gray-700">Username:</label>
                <input type="text" id="username" name="username" placeholder="Enter your username" className="border rounded-md px-3 py-2 mt-1 w-4/5"  onChange={(e)=>setUsername(e.target.value)}  required/>
            </div>
            <div className="flex justify-between items-center gap-3 w-4/5 m-3">
                <label htmlFor="email" className="text-sm font-medium text-gray-700">Email:</label>
                <input type="email" id="email" name="email" placeholder="Enter your email" className="border rounded-md px-3 py-2 mt-1 w-4/5"  onChange={(e)=>setEmail(e.target.value)} required/>
            </div>
            <div className="flex justify-between items-center gap-3 w-4/5 m-3">
                <label htmlFor="password" className="text-sm font-medium text-gray-700">Password:</label>
                <input type="password" id="password" name="password" placeholder="Enter your password" className="border rounded-md px-3 py-2 mt-1 w-4/5"  onChange={(e)=>setPassword(e.target.value)} required/>
            </div>
            <div className="flex justify-between items-center gap-3 w-4/5 m-3">
                <label htmlFor="confirm-password" className="text-sm font-medium text-gray-700">Confirm Password:</label>
                <input type="password" id="confirm-password" name="confirm-password" placeholder="Confirm your password" className="border rounded-md px-3 py-2 mt-1 w-4/5" onChange={(e)=>setCPassword(e.target.value)} required />
            </div>
            <div className="flex justify-between items-center gap-3 w-4/5 m-3">
                <button type="submit" className="bg-blue-500 text-white font-bold py-2 px-4 rounded">Signup</button>
            </div>
        </div>
        </form>
        </>
    );
}

export default Register;
