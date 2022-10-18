
import RegistrationForm from './scripts/RegistrationForm';
import LoginForm from './scripts/LoginForm';
import { useState } from 'react';
import Lobby from './scripts/Lobby';
import Game from './scripts/Game';
import EndGameSreen from './scripts/EndGameSreen';
import StarfieldAnimation from 'react-starfield-animation'
import Scoreboard from './scripts/Scoreboard';
import {BrowserRouter,Route,Routes} from 'react-router-dom'
import PrivaterRoutes from './scripts/PrivaterRoutes';


function App() {
  const [loginAllowed, setloginAllowed] = useState(false);
  const [user, setUser] = useState({});
  const [score, setScore] = useState(0);
  const [backgroundTurnOff, setbackgroundTurnOff] = useState(false);
  const setloginAllowedfnc=()=>{
    setloginAllowed(!loginAllowed);
    
  }
  const setUserFnc=(user)=>{
    setUser(user);
  }
  const setScoreState=(score)=>{
    setScore(score);
  }
  const backgroundTurnOffState = ()=>{
    setbackgroundTurnOff(!backgroundTurnOff);
  }

  return (
    <BrowserRouter>
    <div className="wholeapp" >
    {backgroundTurnOff?'':<StarfieldAnimation
        style={{
          position: "absolute",
          width: "100%",
          height: "100%"
        }}
        numParticles={800}
        
        dx={0.000000001} // x speed of stars in px/frame, default 0.05
        dy={0.000000001}
      />}
      <Routes>
      <Route path='/login' element={<LoginForm LoginAllowedFnc={setloginAllowedfnc} />} />
      <Route element={<PrivaterRoutes loginAllowed={loginAllowed}/>}>
          <Route element={<Lobby setloginallowedfnc={setloginAllowedfnc} backgroundchangeFnc={backgroundTurnOffState}/>} path='/lobby/:id' />
          <Route element={<Game backgroundChangeFnc={backgroundTurnOffState} setuserfnc={setUserFnc} setscorefnc={setScoreState}/>} path='/game/:id' />
          <Route element={<Scoreboard/>} path='/scoreboard/:id' />
          <Route  path='/end/:id' element={<EndGameSreen backgroundStateFnc={backgroundTurnOffState} user={user} score={score}/>} />   
      </Route>
      <Route  index element={<RegistrationForm />} />
      <Route path="*" element={<div><p>Error 404 Page Not Found</p></div>}/>
      </Routes>
    </div>
    </BrowserRouter>
  );
}

export default App;
    