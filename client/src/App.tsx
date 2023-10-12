import {Grid, Paper, useTheme} from "@mui/material"
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import About from "./components/About";
import CodeRoom from "./pages/CodeRoom";
import Home from './pages/Home';
import NotFound from "./pages/NotFound";


function App() {
  const theme = useTheme();

  return (
    <>
      <Grid container flexDirection={"column"} flexWrap={"nowrap"} sx={{height: '100vh'}}>
        <Grid item>
          <Navbar />
        </Grid>
        <Grid item flex={1}>
          <Paper
              sx={{
                height: '100%',
                backgroundColor: theme.palette.background.default,
                borderRadius: '0px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}
          >

            <Routes>
              <Route path="/about" element={<About />} />
              <Route path="/" element={<Home />} />
              <Route path="/room/:roomId/:participant?" element={<CodeRoom />} />
              <Route path='*' element={<NotFound />}/>
            </Routes>

          </Paper>
        </Grid>
      </Grid>
    </>
  )
}

export default App
