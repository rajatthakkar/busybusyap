import React, { useEffect, useState } from 'react';
import { useAuth } from '../Context/AuthContext';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

function Login() {
const {signinWithGoogle,loginWithSiteEmailPass,currentUser}=useAuth();
const [email,setEmail]=useState("");
const [password,setPassword]=useState("");
const [loading,setLoading]=useState(false);
const navigate=useNavigate();

const handleSubmit=async (e)=>{
    e.preventDefault();
setLoading(true);
try {
    await loginWithSiteEmailPass(email,password);
    navigate('/');
    toast.success("User logged in successfully");
} catch (error) {
    console.log(error);
    toast.error("Invalid credentials! Please signup!");
}
setLoading(false);
setEmail("");
setPassword("");
}

const handleSigninWithGoogle=async()=>{
    setLoading(true);
    try {
        await signinWithGoogle();
        navigate("/");
        toast.success("User logged in successfully through google");
    } catch (error) {
        console.log(error);
        toast.error("User could not be logged in");
    }
    setLoading(false);

}

const handleResetPassword=()=>{
    
    navigate('/forgotpassword')
}
//if user already authenticated, navigate to home page.
useEffect(()=>{
    if(currentUser){
        navigate("/");
    }
})
    return (
        <>   

        <form onSubmit={(e)=>handleSubmit(e)}>
        <div className="flex flex-col justify-center items-center v-screen ">
            <h2 className='text-orange-500 text-3xl font-bold m-4'>Existing User Login</h2>
            
            <div className="flex justify-between items-center gap-3 w-4/5 m-3">
                <label htmlFor="email" className="text-sm font-medium text-gray-700">Email:</label>
                <input type="email" id="email" name="email" placeholder="Enter your email" className="border rounded-md px-3 py-2 mt-1 w-4/5"onChange={(e)=>setEmail(e.target.value)} required />
            </div>
            <div className="flex justify-between items-center gap-3 w-4/5 m-3">
                <label htmlFor="password" className="text-sm font-medium text-gray-700">Password:</label>
                <input type="password" id="password" name="password" placeholder="Enter your password" className="border rounded-md px-3 py-2 mt-1 w-4/5" onChange={(e)=>setPassword(e.target.value)} required/>
            </div>
            <div className="flex justify-start items-center gap-3 w-4/5 m-3">
                <button type="submit" className="bg-blue-500 text-white font-bold py-2 px-4 rounded">Signin</button>
            </div>
            <div  className="flex justify-between items-center gap-3 w-4/5 m-3">
            <p className='hover:text-orange-600 cursor-pointer italic' onClick={handleResetPassword}>Forgot password?</p>
            </div>
            <div  className="flex justify-between items-center gap-3 w-4/5 m-3">
            <p className=' cursor-pointer italic'>Don't have an account? <span  onClick={()=>navigate('/signup')}className='text-blue-800 hover:text-orange-600'>&nbsp;SignUp Now</span></p>
            </div>
            
        </div>
        </form>
        </>
    );
}

export default Login;
