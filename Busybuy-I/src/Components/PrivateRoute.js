import React from 'react'
import { useAuth } from '../Context/AuthContext';

function PrivateRoute({children}) {
    const {currentUser,loading}=useAuth();
    
    if(loading){
        return (
            <span>Loading...Please Wait</span>
        )
    }
        if(currentUser){
            return children;
        }
    
}

export default PrivateRoute
