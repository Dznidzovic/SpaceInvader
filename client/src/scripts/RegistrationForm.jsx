import React from 'react'
import "bootstrap/dist/css/bootstrap.min.css"
import "../styles/background.css"
import { useState,useEffect} from "react";
import axios from 'axios'
import { useHref } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const RegistrationForm = () => {
  const navigate = useNavigate();
  const [username,setUsername] = useState("");
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [data, setData] = useState([])
  const [alreadyTakenState,setAlreadyTakenState] = useState(true);
  const [detailsCheck,setdetailsCheck] = useState(false);
  var nonStateDetailCheck = false;
  var regAllowed = true;
  //Fetching data from the server
  useEffect(() => {
    
    const fetchData = async () =>{
      try {
        const {data: response} = await axios.get('http://localhost:4000/app/login');
        setData(response);
      } catch (error) {
        console.error(error.message);
      }
    }

    fetchData();
  }, []);
  //checking if the details are long enough
  function checkDetails(){
    if(username.length<3 || email.length<6 || password.length<3){
      setdetailsCheck(true)
      nonStateDetailCheck = true;
    }
    else{
      setdetailsCheck(false);
      nonStateDetailCheck = false;
    }
  }

  function RegisterFnc(e){
      //preventing default pehaviour
      e.preventDefault()
      //if the details pass length check, procceed to equality check
      checkDetails()
      //storing all the details and checking if they already exist, if not, send a post request to the database
      if(nonStateDetailCheck===false){
      let AccInfo = {
        UserName:username,
        Email:email,
        password:password,
        highestScore:0
      }
      
      data.forEach((acc)=>{
        if(AccInfo.Email===acc.email || AccInfo.UserName===acc.username){
          regAllowed = false;
          setAlreadyTakenState(false);
        }
      }
      )
      if(regAllowed){
        const account = { 
          username:AccInfo.UserName, email:AccInfo.Email, password:AccInfo.password,highestScore:AccInfo.highestScore
        };
        axios.post('http://localhost:4000/app/signup', account)
        .then((res)=>{
          alert("Succesfully registered. Proceed to log in.")
          navigate('/login');
        }).catch(err=>console.log(err));
        
      }
      }
      
      

  }

 
  
  function usernameChange(event){
    setUsername(event.target.value)

  }
  function emailChange(event){
    setEmail(event.target.value)
  }
  function passwordChange(event){
    setPassword(event.target.value);
  }





  return (
    <div className='register-page'>
      
        <div className='container'> 
       
        <header>Welcome To The Space Invader</header>
        
            <div className='form-div'>
            
                <form onSubmit={RegisterFnc} >
                {detailsCheck===true?<p className='pregister'>Length of the details is too short.</p>:""}
                {alreadyTakenState===false?<p className='pregister'>Email or Username already used.</p>:""}
                    <input type="text" placeholder='Username' onChange={usernameChange} value={username} />
                    <br />
                    <input type="text" placeholder='Email' onChange={emailChange} value={email} />
                    <br />
                    <input type="password" placeholder='Password' onChange={passwordChange} value={password} />
                    <br />
                    <input type="submit" className="button" value="Register" />
                    <br />
                    <Link to="/login">Already have an account? Log in</Link>
                </form>
            </div>
        </div>
    </div>
  )
}

export default RegistrationForm