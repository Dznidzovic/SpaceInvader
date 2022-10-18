import React from 'react'

import { Link } from 'react-router-dom'
import '../styles/background.css'

const EndGameSreen = ({user,score,backgroundStateFnc}) => {
 
  return (
    <div className='endgame'>
        <div className='endscorecontainer'>
            <p>Your Score</p>
            <br />
            <p className='endscore'>{score}</p>
        </div>
        
        <div className='buttons'>
            
            <Link to={`/game/${user._id}`}><button onClick={backgroundStateFnc}>Play Again</button></Link>
            <br />
            <Link to={`/lobby/${user._id}`}><button>Exit</button></Link>
        </div>
    </div>
  )
}

export default EndGameSreen