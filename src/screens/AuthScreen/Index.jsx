import { useState } from "react";
import { Container , Stack , TextField , Button , Typography } from "@mui/material";
import imgLogo from "../../assets/Logo.svg"
import ImageEl from "../../components/utils/imageEl";
import { signInWithEmailAndPassword , createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";
import useStore from "../../store";

    const initForm = {
            email : '',
            password : '',
    }

const AuthScreen = () => {

    const[loading, setLoading] = useState(false);
    const[isLogin, setIsLogin] = useState(true);
    const[form,setForm] = useState(initForm);
    const { setToastr } = useStore();


    const handleChange = (event) => 
        setForm(oldform => ({...oldform,[event.target.name]:event.target.value,
    }));

    const handleAuth = async () => {
        try {
          setLoading(true);
          if (isLogin) {
            await signInWithEmailAndPassword(auth, form.email, form.password);
          } else {
            await createUserWithEmailAndPassword(auth, form.email, form.password);
          }
        } catch (err) {
            const msg = err.code.split("auth/")[1].split("-").join(" ");
            console.log(msg)
            setToastr(msg);
            setLoading(false); 
        }
      };

    const authText = isLogin ? "Do not have an account?" : "Already have an account?" ;

    return <Container 
    maxWidth="xs"
    sx={{
        mt : 10,
    }} >
        <Stack mb={6} spacing={4} alignItems="center" textAlign="center" >

            <ImageEl sx={{mt:10}} src={imgLogo} alt="Flow_Board" />
            <Typography color="rgba(255,255,255,0.6)">
                Visualize Your Workflow For Increased  Productivity.
                <br/>
                Access Your Tasks Anytime, Anywhere
            </Typography>

        </Stack>
        
        <Stack spacing={2}>
            <TextField value={form.email}    name="email"    onChange={handleChange} label="Email"    />
            <TextField value={form.password} name="password" onChange={handleChange} label="Password" />

            <Button disabled={ loading || !form.email.trim() || !form.password.trim() } size="large" variant="contained" onClick={handleAuth} >
            { isLogin ? "Login" : "Register" }   
            </Button>

            <Typography sx={{ cursor:'pointer', }} onClick={() => setIsLogin( o => !o)} mt={3} alignItems="center">
                {authText}
            </Typography>
        </Stack>

    </Container>
}

export default AuthScreen;