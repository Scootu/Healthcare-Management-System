import { Box, Typography, useMediaQuery, Button, Grid, Modal } from "@mui/material";
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import CloseIcon from '@mui/icons-material/Close';
import useMode from "../contexts/Mode/useMode";
import type{ FC } from "react";
import { useState } from "react";
import SidebarContainer from "../features/global/Sidebar";
import { Outlet } from "react-router-dom";
const DashboardLayout:FC = () => {
    const isMobile = useMediaQuery("(max-width: 600px)");
    const isPad = useMediaQuery("(max-width: 900px)");
    const isLaptop = useMediaQuery("(max-width: 1200px)");
        const { mode, toggleMode }=useMode();
        const [openLogout, setOpenLogout] = useState<boolean>(false);
        const [openSidebar, setOpenSidebar] = useState<boolean>(false);
        const confirmLogout = () => {
            localStorage.removeItem("api-auth-token");
            setOpenLogout(false);
            window.location.reload();
        }
        { /** Mobile View */}
    if(isMobile){
        return (
            <Box sx={{ height: "100vh", width: "100vw", overflow: "hidden", backgroundColor: "var(--bg-color)" }} >
                {/* logout modal */}
                 <Modal
                    open={openLogout}
                    onClose={() => setOpenLogout(false)}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                    sx={{
                        display:"flex",
                        alignItems:"center",
                        justifyContent:"center",

                    }}
                    >
                        <Box sx={{ bgcolor: 'var(--bg-color-modal)', p: 3, borderRadius: 1, minWidth: 300 }}>
                            <Typography sx={{color: "var(--text-color)"}}>Are you sure you want to logout?</Typography>
                            <Box sx={{display:"flex",justifyContent:"end",gap:2,mt:2}}>
                                <Button variant="contained" color="error" onClick={confirmLogout}>Logout</Button>
                                <Button variant="outlined" color="primary" onClick={() => setOpenLogout(false)}>Cancel</Button>
                            </Box>
                        </Box>
                  </Modal>
                
                {/* navbar */}
                <Box sx={{ height: "8vh", width: "100vw", borderBottom: "1px solid var(--border-color)", display: "flex", alignItems: "center", justifyContent: "space-between", px: 2 }} >
                    <Box
                        sx={{ display: "flex", alignItems: "center", gap: 2 }}
                    >
                          <Button
                          sx={{
                            backgroundColor:  "transparent" ,
                            color: "var(--text-color)",
                            transition: "all 1s ease",
                            minWidth: "fit-content",
                            p: 0,
                          }}
                          onClick={()=> setOpenSidebar(!openSidebar)}>
                            {openSidebar ? <CloseIcon sx={{ color: "var(--error-color)", cursor: "pointer" }} /> 
                            : <MenuIcon sx={{ color: "var(--primary-color)", cursor: "pointer" }} />}
                          </Button>
                       <Typography variant="h6" color="var(--text-color)" >Dashboard</Typography>
                    </Box>
                    <Box
                        sx={{ display: "flex", alignItems: "center", gap: 2, mr: 4 }}
                    >
                        <Button
                        onClick={()=> setOpenLogout(true)}
                        sx={{
                            backgroundColor:  "transparent" ,
                            transition: "all 1s ease",
                            minWidth: "fit-content",
                            p: 0
                        }}
                        >
                        <LogoutIcon sx={{ color: "var(--error-color)", cursor: "pointer" }} />
                        </Button>
                         <Button onClick={toggleMode}
                            sx={{
                                backgroundColor:  "transparent" ,
                                color: "var(--text-color)",
                                transition: "all 1s ease",
                                minWidth: "fit-content",
                                p: 0,
                                "&:focus": {
                                outline: "none",
                                        },
                                "&:hover": {
                                backgroundColor: "transparent",
                                transform: "scale(1.1)",
                                transition: "transform 0.3s ease",
                                }
                            }}
                            >
                          {mode==="light"?<DarkModeIcon/>:<LightModeIcon/>}
                         </Button>
                    </Box>
                </Box>
                {/* side bar */}
                <Modal
                open={openSidebar}
                onClose={() => setOpenSidebar(false)}
                sx={{
                    height: "92vh",
                    width: openSidebar ? "200px" : "0vw",
                    position: "absolute",
                    top: "8vh",
                    left: 0,
                    backgroundColor: "var(--blue-color)",
                    color: "var(--text-color)",
                    transition: "width 1s in-out",
                    overflow: "hidden",
                    zIndex: 2
                }}
                >

                    <SidebarContainer setOpenSidebar={setOpenSidebar} />

                </Modal>

                {/* content */}
                <Box sx={{ height: "92vh", width: "100vw", overflowY: "auto",zIndex: 1 }} >
                    <Outlet />
                </Box>
            </Box>
        )

    }
    return (
       <Box sx={{ height: "100vh", width: "100vw", display: "flex",overflow: "hidden", backgroundColor: "var(--bg-color)" }} >
        <Grid container sx={{ height: "100vh", width: "100vw" }} >
            <Grid size={isPad? 4 : isLaptop? 3 : 2} sx={{ borderRight: "1px solid var(--border-color)" }}>
                <Box
                sx={{
                    width: "100%",
                    height: "100vh",
                    display: "flex",
                    alignItems: "center",
                    flexDirection: "column",
                    color: "var(--text-color)",
                    boxSizing: "border-box",
                    textAlign: "center",
                    backgroundColor: "var(--blue-color)",
                    transition: "all 1s ease",
                    py: 2
                }}
                >
                    <SidebarContainer setOpenSidebar={setOpenSidebar} />
                    </Box>
            </Grid>
            <Grid size={isPad? 8 : isLaptop? 9 : 10} sx={{ height: "100vh", overflow: "hidden" }}>
                <Box sx={{ height: "100vh",width: "100%", padding: 2, boxSizing: "border-box" }} >
                    {/* logout modal  */}
                    <Modal
                    open={openLogout}
                    onClose={() => setOpenLogout(false)}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                    sx={{
                        display:"flex",
                        alignItems:"center",
                        justifyContent:"center",

                    }}
                    >
                        <Box sx={{ bgcolor: 'var(--bg-color-modal)', p: 3, borderRadius: 1, minWidth: 300 }}>
                            <Typography sx={{color: "var(--text-color)"}}>Are you sure you want to logout?</Typography>
                            <Box sx={{display:"flex",justifyContent:"end",gap:2,mt:2}}>
                                <Button variant="contained" color="error" onClick={confirmLogout}>Logout</Button>
                                <Button variant="outlined" color="primary" onClick={() => setOpenLogout(false)}>Cancel</Button>
                            </Box>
                        </Box>
                    </Modal>
                {/* navbar */}
                <Box sx={{ height: "8vh", width: "100%", borderBottom: "1px solid var(--border-color)", display: "flex", alignItems: "center", justifyContent: "space-between"}} >
                    <Box
                        sx={{ display: "flex", alignItems: "center", gap: 2 }}
                    >
                        <></>
                    </Box>
                    <Box
                        sx={{ display: "flex", alignItems: "center", gap: 2 }}
                    >
                        <Button
                        sx={{
                            backgroundColor:  "transparent" ,
                            transition: "all 1s ease",
                            minWidth: "fit-content",
                            p: 0,
                        }}
                        onClick={()=> setOpenLogout(true)}
                        >
                        <LogoutIcon  sx={{ color: "var(--error-color)", cursor: "pointer" }} />
                        </Button>
                         <Button onClick={toggleMode}
                            sx={{
                                backgroundColor:  "transparent" ,
                                color: "var(--text-color)",
                                transition: "all 1s ease",
                                minWidth: "fit-content",
                                p: 0,
                                "&:focus": {
                                outline: "none",
                                        },
                                "&:hover": {
                                backgroundColor: "transparent",
                                transform: "scale(1.1)",
                                transition: "transform 0.3s ease",
                                }
                            }}
                            >
                        {mode==="light"?<DarkModeIcon/>:<LightModeIcon/>}
                         </Button>
                    </Box>
                </Box>
                {/* content */}
                <Box sx={{ height: "92vh", width: "100%", overflowY: "auto" }} >
                    <Outlet />
                </Box>
            </Box>
            </Grid>
        </Grid>
        </Box>
    )
}

export default DashboardLayout;