import { useContext, useEffect } from "react";
import { ColorModeContext } from "../theme/CustomThemeProvider";
import { Box, AppBar, Toolbar, Typography, Button, useTheme } from "@mui/material";
import ThemeSwitch from "../theme/ThemeSwitch";
import { Link } from "react-router-dom"
import Clock from "./Clock";

export default function Navbar() {
    const theme = useTheme();
    const colorMode = useContext(ColorModeContext);

    useEffect(() => {
      document.body.style.backgroundColor = theme.palette.background.default;
    }, [])
    
    return (
        <Box sx={{ flexGrow: 1 }}>
        <AppBar 
         position="static" 
         sx={{
            backgroundColor: theme.palette.background.default,
            color: theme.palette.primary.contrastText,
            boxShadow: '0',
         }}>
        <Toolbar>
          <Typography component={Link} to="/" variant="h6" sx={{  color: theme.palette.primary.contrastText, textDecoration: 'none', }}>
            Home
          </Typography>
          <Box sx={{flexGrow:1}}/>
          <ThemeSwitch checked={theme.palette.mode === "dark"} onClick={colorMode.toggleColorMode} />
        </Toolbar>
      </AppBar>
      </Box>
    );
}