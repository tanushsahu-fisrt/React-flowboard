import { CssBaseline, ThemeProvider } from "@mui/material";
import { useEffect } from "react";
import theme from "./theme";
import {BrowserRouter , Navigate,  Route , Routes } from "react-router-dom"
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import useStore from "./store";

import AppLoader from "./components/layout/AppLoader";
import AuthScreen from "./screens/AuthScreen";
import BoardsScreen from "./screens/BoardsScreen";
import BoardScreen from "./screens/BoardScreen";

import PublicOnlyRutes from "./components/utils/PublicOnlyRoute";
import PrivateOnlyRoute from "./components/utils/PrivateOnlyRoute";
import SnackBarManager from "./components/layout/SnackBarManager";

const App = () => {


  const { loader , setLoginStatus } = useStore();

 
  useEffect( () => { 
    const unsub = onAuthStateChanged(auth , (user) => {
      setLoginStatus(!!user);
    })

    return () => unsub();
  },[])

  if(loader) return <AppLoader />;

  return(
    <ThemeProvider theme={theme}>
      <CssBaseline /> 
      <SnackBarManager />
      
      <BrowserRouter>
      <Routes>
        <Route 
        path="/" 
        element={<PublicOnlyRutes Component={AuthScreen} />} 
        />
        <Route 
        path="/boards" 
        element={<PrivateOnlyRoute Component={BoardsScreen} />} 
        />
        <Route 
        path="/boards/:boardId" 
        element={<PrivateOnlyRoute Component={BoardScreen} />} 
        /> 
        <Route 
        path="*" 
        element={<Navigate to="/"  replace/> } 
        />
      </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App;