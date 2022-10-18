import React from 'react'
import '../styles/lobby.css'
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const Lobby = ({backgroundchangeFnc,setloginallowedfnc}) => {
  const [data, setData] = useState([]);
  const {id} = useParams();
  
  let user = {};

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
      data.forEach((el)=>{
        if(el._id===id){
          user = el
        }
      })
  
  
  
  return (
    <div>
      <div >
        <p>{user.username}</p>
        <p className='score'>Highest Score: {user.highestScore}</p>
      </div>
      <div className='buttons'>
        <Link to={`/game/${user._id}`} ><button className='btn1' onClick={backgroundchangeFnc} >Play the Game</button></Link>
        <br />
        <Link to={`/scoreboard/${user._id}`} ><button className='btn1'>Scoreboard</button></Link>
        <br />
        <Link to={'/login'}><button onClick={setloginallowedfnc} className='btn1'>Log out</button></Link>
    </div>
    </div>
    
  )
}

export default Lobby