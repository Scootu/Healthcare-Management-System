import { Box, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { Sidebar, Menu, MenuItem } from 'react-pro-sidebar';
import HomeIcon from '@mui/icons-material/Home';
import PeopleIcon from '@mui/icons-material/People';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import DoctorIcon from '@mui/icons-material/LocalHospital';
import BarChartIcon from '@mui/icons-material/BarChart';
import LocalPharmacyIcon from '@mui/icons-material/LocalPharmacy';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useState } from "react";
export default function SidebarContainer({ setOpenSidebar }:{ setOpenSidebar: (open: boolean) => void}) {
    let path = location.pathname;
    if (path === "") path = "/";
    const [active, setActive] = useState(path);
    return (
        <Box
        sx={{ height: "100vh",width: "100%",overflow: "hidden", zIndex:3}}
        >
            <Box sx={{
                height: "8vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderBottom: "1px solid var(--border-color)"
             }}>
            <Typography variant="h4">Dashboard</Typography>
            </Box>
            <Box sx={{ 
                height: "92vh",
                overflowY: "auto",
                width: "100%",
                pr: 1,
                mt: 2,
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-end",
                gap: 2,
                position: "relative",
                "& .css-dip3t8 ":{
                    background: "transparent",
                },
                "& .ps-sidebar-root":{
                    position: "absolute",
                    border: "none !important",
                    width: "100% !important",
                    minWidth: "100% !important",
                    height: "100% !important",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-end",
                    justifyContent: "flex-start",
                    padding: 0,
                    gap: 2,
                },
                "& .ps-menu-button:hover":{
                    backgroundColor: "transparent !important",
                    color: "var(--active-menu-item-color) !important"
                },
                "& .ps-active": {
                    backgroundColor: "var(--active-menu-item-bg) !important",
                    color: "var(--active-menu-item-color) !important",
                    borderRadius: "8px 0 0 8px",
                },
                "& .ps-menu-label": {
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    justifyContent: "flex-start",
                },
               "& .ps-menu-root ul":{
                    width: "100% !important",
                    height: "100% !important",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-end",
                    justifyContent: "flex-start",
                    padding: 0,
                    gap: 1,
               }

            }}

                >
                    <Sidebar>
                        <Menu
                            menuItemStyles={{
                            button: {
                                [`&.active`]: {
                                backgroundColor: 'var(--active-menu-item-bg) !important',
                                color: 'var(--active-menu-item-color) !important',
                                },
                            },
                            }}
                        >
                             <MenuItem component={<Link to="/dashboard" />} active={active === "/dashboard"} onClick={() => {
                                setActive("/dashboard");
                                setOpenSidebar(false);
                                }}>
                                <HomeIcon sx={{ mr: 1 }} /> Home
                            </MenuItem>
                            <MenuItem component={<Link to="/profile" />} active={active === "/profile"} onClick={() => {
                                setActive("/profile");
                                setOpenSidebar(false);
                                }}>
                                <AccountCircleIcon sx={{ mr: 1 }} /> Profile
                            </MenuItem>
                            <MenuItem component={<Link to="/users" />} active={active === "/users"} onClick={() => {
                                setActive("/users");
                                setOpenSidebar(false);
                                }}>
                                <PeopleIcon sx={{ mr: 1 }} /> Users
                            </MenuItem>
                            <MenuItem component={<Link to="/adduser" />} active={active === "/adduser"} onClick={() => {
                                setActive("/adduser");
                                setOpenSidebar(false);
                                }
                                }>
                                <PersonAddIcon sx={{ mr: 1 }} /> Add User
                            </MenuItem>
                            <MenuItem component={<Link to="/doctors" />} active={active === "/doctors"} onClick={() => {
                                setActive("/doctors");
                                setOpenSidebar(false);
                                }
                                }>
                                <DoctorIcon sx={{ mr: 1 }} /> Doctors
                            </MenuItem>
                            <MenuItem component={<Link to="/adddoctor" />} active={active === "/adddoctor"} onClick={() => {
                                setActive("/adddoctor");
                                setOpenSidebar(false);
                                }
                                }>
                                <PersonAddIcon sx={{ mr: 1 }} /> Add Doctor
                            </MenuItem>
                            <MenuItem component={<Link to="/barchart" />} active={active === "/barchart"} onClick={() => {
                                            setActive("/barchart");
                                            setOpenSidebar(false);
                                            }}>
                                <BarChartIcon sx={{ mr: 1 }} /> Bar Chart
                            </MenuItem>
                            <MenuItem component={<Link to="/pharmacy" />} active={active === "/pharmacy"} onClick={() => {
                                            setActive("/pharmacy");
                                            setOpenSidebar(false);
                                            }}>
                                <LocalPharmacyIcon sx={{ mr: 1 }} /> Pharmacy
                            </MenuItem>
                        </Menu>
                        </Sidebar>
                </Box>
        </Box>
    );
    }
