import React, { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';
import { ToastContainer, toast } from 'react-toastify';
import { useProducts } from '../Context/ProductsContext';

function Navbar() {
    const { currentUser,logout } = useAuth();
    const [loading,setLoading]=useState(false);
const {currentCartUserRef}=useProducts();
    const handleLogout=async()=>{
try {
    setLoading(true);
    await logout();
toast.success("User successfully logged out");
} catch (error) {
    console.log(error);
    toast.error("Something went wrong! User could not be logged out")
}
setLoading(false);
    }
    return (
        <>
               

        <div className='flex justify-between bg-blue-500 h-16 items-center sticky'>
            <div><h1 className='text-3xl font-bold text-orange-600'>&nbsp;BUSYBUY</h1></div>
            <div className='flex gap-3 mr-4'>
            <NavLink to="/" className={({ isActive }) => isActive ? "text-orange-600 font-bold" : "text-gray-600 font-bold"}>Home</NavLink>
                {!currentUser ? (
                    <>
                        <NavLink to="/signin" className={({ isActive }) => isActive ? "text-orange-600 font-bold" : "text-gray-600 font-bold"}>SignIn</NavLink>
                    </>
                ) : (
                    <>
                        <NavLink to={`/users/${currentCartUserRef}/cart`} className={({ isActive }) => isActive ? "text-orange-600 font-bold" : "text-gray-500 font-bold"}>Cart</NavLink>
                        <NavLink to={`/users/${currentCartUserRef}/orders`} className={({ isActive }) => isActive ? "text-orange-600 font-bold" : "text-gray-500 font-bold"}>Orders</NavLink>
                        <NavLink to="/" onClick={handleLogout} className={({ isActive }) => isActive ? "text-orange-600 font-bold" : "text-gray-500 font-bold"}>Logout</NavLink>
                    </>
                )}
            </div>
        </div>
        <Outlet/>
        </>
    );
}

export default Navbar;
