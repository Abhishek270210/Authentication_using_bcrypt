import React,{useState} from 'react'
import {Typography,Container,TextField,Button} from '@material-ui/core';
import axios from 'axios';

const initialFormData={Firstname:'',Lastname:'',Email:'',Password:'',Confirmpassword:'' };
const Auth = () => {

    const [signup,setSignup]=useState(false);
    const [formData,setFormData]=useState(initialFormData);
    const [curr_user,setCurr_user]=useState(false);

    const handleSignup=()=>{
        setSignup(!signup);
        setFormData(initialFormData);
    }

    const handleChange=(e)=>{
        setFormData({...formData,[e.target.name]:e.target.value});
    }

    const handleSignin=async()=>{
        console.log(formData);
        if(signup && formData.Password!==formData.Confirmpassword)
        {
           alert("Password don't match !!");
           setFormData({...formData,Password:'',Confirmpassword:''});
        }
        else
        {
        const {data}=await axios.post(`http://localhost:5000/${signup ? "signup":"login"}`,formData);
        console.log(data);
        setFormData(initialFormData);
        if(data.status===200)
        {
        await setCurr_user(true);
        // alert(data.message);
        }
        else
        alert(data.message);
        }
    }

    const handleLogout=async()=>{
        await setCurr_user(false);
        await setSignup(false);
        // alert("Logged out successfully");
    }

    return (
          !curr_user ?
            (<Container style={{textAlign:'center',marginTop:"100px",width:"25%"}}>
                <Typography label="First Name" variant="h3" component="h2" style={{marginBottom:"5%"}}  >{signup ? "Signup":"Login"}</Typography>
            {
               signup ? 
               <>
               <TextField label="First Name" type="email" name="Firstname" value={formData.Firstname} variant="outlined" fullWidth style={{marginBottom:"5%"}} onChange={(e)=>handleChange(e)} ></TextField>
               <TextField label="Last Name" name="Lastname" value={formData.Lastname} variant="outlined" fullWidth style={{marginBottom:"5%"}} onChange={(e)=>handleChange(e)} ></TextField>
               </>:null
            }
                <TextField label="Email" name="Email" value={formData.Email} variant="outlined" fullWidth style={{marginBottom:"5%"}} onChange={(e)=>handleChange(e)} ></TextField>
                <TextField label="Password" type="password" name="Password" value={formData.Password} variant="outlined" fullWidth style={{marginBottom:"5%"}} onChange={(e)=>handleChange(e)}></TextField>
                {
                    signup ?
                   <TextField label="Confirm Password" type="password" name="Confirmpassword" value={formData.Confirmpassword} variant="outlined" fullWidth style={{marginBottom:"5%"}} onChange={(e)=>handleChange(e)}></TextField>
                   :null
                }
                <Button variant="contained" color="primary"fullWidth style={{marginBottom:"5%"}} onClick={handleSignin}  >Sign In</Button>
                <Button variant="contained" fullWidth style={{marginBottom:"5%"} } onClick={handleSignup}>{signup ? "Existing Account ?":"Create Account ?"}</Button>
            </Container>)
            :(
                <Container style={{margin:"10%",textAlign:"center"}}>
                <h3>you have successfully logged in <br></br> click on the button below to log out</h3>
                <Button variant="contained" color="secondary" onClick={handleLogout}>Log Out</Button>
                </Container>
            )
    )
}

export default Auth

