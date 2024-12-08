import React, { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import AdbIcon from "@mui/icons-material/Adb";

const pages = ["Home", "Filiere", "Matiere", "Emploi", "Reservation"];
const settings = ["Profile", "Logout"];

export default function CoordinateurLayout() {
  const [anchorElUser, setAnchorElUser] = useState(null);
  const navigate = useNavigate(); // Corrected usage of the hook

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleClickUserMenu = (setting) => {
    if (setting === "Logout") {
      navigate("/"); // Navigates to the login page (root)
    }
    if (setting === "Profile") {
      navigate("/Coordinateur/profile_c");
    }
    setAnchorElUser(null);
  };

  return (
    <div className="parent">
      <header>
        <AppBar
          position="static"
          sx={{ backgroundColor: "#D4A017", color: "black" }}
        >
          <Container maxWidth="xl">
            <Toolbar disableGutters sx={{ height: "80px" }}>
              {/* Left section: Icon + LOGO */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  mr: 2,
                  flex: "center",
                }}
              >
                <AdbIcon sx={{ display: "flex", mr: 1 }} />
                <Typography
                  variant="h6"
                  noWrap
                  component="a"
                  href="#app-bar-with-responsive-menu"
                  sx={{
                    fontFamily: "monospace",
                    fontWeight: 700,
                    letterSpacing: ".3rem",
                    color: "inherit",
                    textDecoration: "none",
                  }}
                >
                  Gestion Salle
                </Typography>
              </Box>

              {/* Center section: Pages */}
              <Box
                sx={{
                  flexGrow: 1,
                  display: "flex",
                  justifyContent: "space-evenly",
                  alignItems: "center",
                  height: "90%",
                }}
              >
                {pages.map((page) => (
                  <NavLink
                    style={{ textDecoration: "none", flex: 1 }}
                    key={page}
                    to={`/Coordinateur/${page}`}
                    className={({ isActive }) => (isActive ? "active" : "")} // Add 'active' class when the link is active
                  >
                    <Button
                      sx={{
                        my: 2,
                        display: "block",
                        height: "100%",
                        minWidth: "120px", // Make the button bigger by setting min width
                        fontSize: "1.2rem", // Increase font size
                        padding: "16px 32px", // Add padding to make it larger
                        backgroundColor: "transparent", // Default transparent background
                        color: "black", // Default text color black
                        "&:hover": {
                          backgroundColor: "black", // Hover effect - background turns black
                          color: "#D4A017", // Hover effect - text turns #D4A017
                        },
                        // Active state (when the page is active)
                        "&.active": {
                          backgroundColor: "black", // Active state background color
                          color: "#D4A017", // Active state text color
                        },
                      }}
                    >
                      {page}
                    </Button>
                  </NavLink>
                ))}
              </Box>

              {/* Right section: Profile Pic */}
              <Box sx={{ flex: "end", margin: "10px" }}>
                <Tooltip title="Open settings">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar
                      alt="Remy Sharp"
                      src="/static/images/avatar/2.jpg"
                    />
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ mt: "45px" }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  {settings.map((setting) => (
                    <MenuItem
                      key={setting}
                      onClick={() => handleClickUserMenu(setting)}
                    >
                      <Typography sx={{ textAlign: "center" }}>
                        {setting}
                      </Typography>
                    </MenuItem>
                  ))}
                </Menu>
              </Box>
            </Toolbar>
          </Container>
        </AppBar>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
