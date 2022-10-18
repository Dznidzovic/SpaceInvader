import React from 'react'
import "bootstrap/dist/css/bootstrap.min.css"
import "../styles/background.css"
import { useState,useEffect } from "react";
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
const LoginForm = ({LoginAllowedFnc}) => {
  const navigate = useNavigate();
  const [username,setUsername] = useState("");
  const [password,setPassword] = useState("");
  const [data, setData] = useState([])
  const [wrongLogin,setWrongLogin] = useState(false);
  let loginState = false;
  
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
 
  function wrongLoginChange(){
    setWrongLogin(true)
  }
  
  function usernameChange(event){
    setUsername(event.target.value)
    
  }
  function passwordChange(event){
    setPassword(event.target.value);
  }
  function LogInClick(e){
    e.preventDefault()
    data.forEach((acc)=>{
      if(username===acc.username && password ===acc.password){
        LoginAllowedFnc();
        navigate(`/lobby/${acc._id}`);
        loginState = true;
      }
      
    })
    if(!loginState)
      wrongLoginChange();
  }




  return (
    <div>
       
        
        <div className='container'> 
        <header >Log in</header>
            <div className='form-div'>
                <form onSubmit={LogInClick}>
                {wrongLogin===true?<p className='pregister'>Failed Authentication. Try again.</p>:""}
                    <input type="text" placeholder='Username' onChange={usernameChange} value={username} />
                    <br />
                    <input type="password" placeholder='Password' onChange={passwordChange} value={password} />
                    <br />
                    <input type="submit" className="button" value="Log In" />
                    <br />
                    <Link to="/">Dont have an account? Register</Link>
                </form>
            </div>
        </div>
    </div>
  )
}

export default LoginForm