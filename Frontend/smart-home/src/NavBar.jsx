import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

import { createMuiTheme, ThemeProvider } from "@mui/material";

const theme = createMuiTheme({
	palette: {
		primary: {
			main: "#A4A4A4", // your primary color
		},
		secondary: {
			main: "#00ff00", // your secondary color
		},
	},
});

export default function NavBar() {
	return (
		<ThemeProvider theme={theme}>
			<Box sx={{ flexGrow: 1 }}>
				<AppBar position='static'>
					<Toolbar>
						<Typography variant='h6' component='div' sx={{ flexGrow: 1 }}>
							Your mesh-based smart home
						</Typography>
						<Button color='inherit' sx={{ textTransform: "none" }}>
							Logout
						</Button>
					</Toolbar>
				</AppBar>
			</Box>
		</ThemeProvider>
	);
}
