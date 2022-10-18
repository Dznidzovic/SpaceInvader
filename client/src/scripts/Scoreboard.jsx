import React from 'react';
import {useState,useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import '../styles/scoreboard.css'


const Scoreboard = () => {
  const [data, setData] = useState([]);
  const {id} = useParams();
  //using state variable to sort display of rank of the current user
  let state = false;
  let user = {};
  //function to sort the object
  function compare(a,b) {
    if ( a.highestScore < b.highestScore ){
      return 1;
    }
    if ( a.highestScore > b.highestScore ){
      return -1;
    }
    return 0;
  }
  //fetching all the accounts and then finding the current user by id in the path
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
    //applying sort function
    data.sort(compare)
  
  return (
    <div className='scoreboardcontainer'>
      <header className='rankingsheader'>Rankings</header>
      <ul>
        
        {data.map((el,index)=>{
          
          if(index<5){
            if(el.username===user.username){
              state = true;
              
              
            }
            return <li>{index+1}.{el.username}: {el.highestScore}</li>
            
          
          }else if(index===5&&!state){
            
            return <div>
              <p className='yourrank'>Your Rank</p>
              <li className='currentuser' >{data.indexOf(user)+1}.{user.username}: {user.highestScore}</li>
            </div>
          }
         
          
        })}
        
      </ul>
      <Link className='lobbybutton' to={`/lobby/${user._id}`}> <button style={{position:'absolute',top:'50%',left:'50%'}}>Lobby</button></Link> 
        
        
        
    </div>
  )
}

export default Scoreboard