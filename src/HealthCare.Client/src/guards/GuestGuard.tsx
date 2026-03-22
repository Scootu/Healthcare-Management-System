import type{ ReactNode, FC } from "react";
import { useEffect, useState } from "react";
import { validateToken } from "../api/validateToken";
import { Spin } from "antd";
import { Box } from "@mui/material";
import { Navigate } from "react-router-dom";
interface GuestGuardProps {
    children: ReactNode;
}
 const GuestGuard: FC<GuestGuardProps> = ({ children })=>{
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null); 
    useEffect(
        ()=>{
            const checkAuth = async()=>{
                try{
                    const valid = await validateToken();
                    setIsAuthenticated(valid);
                }
                catch{
                    setIsAuthenticated(false);
                }   
            }
            checkAuth();
        }, [])
    if(isAuthenticated === null){
        return (
            <Box
            sx={{
                display: "flex",    
                justifyContent: "center",
                alignItems: "center",
                height: "100vh",
                width: "100vw",
                backgroundColor: "var(--bg-color)",
            }}
            >
            <Spin style={{
                color: "var(--blue-color) !important"
            }}/>
            </Box>
         )
    }
    if(isAuthenticated){
        return <Navigate to="/" replace />;
    }
    return (
        <>
            {children}
        </>
    )
}

export default GuestGuard;