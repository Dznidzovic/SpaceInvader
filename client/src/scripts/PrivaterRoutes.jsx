import React from 'react'
import { Outlet,Navigate } from 'react-router-dom'

const PrivaterRoutes = ({loginAllowed}) => {
    
    return (
        loginAllowed?<Outlet/>:<Navigate to={'/login'}/>
    )
}

export default PrivaterRoutes