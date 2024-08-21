import React, { useState } from 'react'
import { useAuth } from '../Context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {  toast } from 'react-toastify';

function ResetPassword() {
const [email,setEmail]=useState("");
const [loading,setLoading]=useState(false);
const {resetPwd}=useAuth();
const navigate=useNavigate();

const handleSubmit=async (e)=>{
    e.preventDefault();
    setLoading(true);
    try {
        await resetPwd(email);
        toast.success("Check yor mail! Reset Password link sent");
        navigate("/");
    } catch (error) {
        console.log(error);
        toast.error("Mail could not be sent! please check your email.")
    }
    setLoading(false);
    setEmail("");
}

    return (
        <>       
        <form onSubmit={(e)=>handleSubmit(e)}>
        <div className="flex flex-col justify-center items-center v-screen ">
            <h2 className='text-orange-500 text-3xl font-bold m-4'>Forgot Password</h2>
            
            <div className="flex justify-between items-center gap-3 w-4/5 m-3">
                <label htmlFor="email" className="text-sm font-medium text-gray-700">Enter login email</label>
                <input type="email" id="email" name="email" placeholder="Enter your email" className="border rounded-md px-3 py-2 mt-1 w-4/5"onChange={(e)=>setEmail(e.target.value)} required />
            </div>
              <div className="flex justify-start items-center gap-3 w-4/5 m-3">
                <button type="submit" className="bg-blue-500 text-white font-bold py-2 px-4 rounded">Reset Password</button>
            </div>
        </div>
        </form>
        </>
    );
}

export default ResetPassword
