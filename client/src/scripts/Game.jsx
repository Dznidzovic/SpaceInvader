import React from 'react'
import '../styles/canvas.css'
import { useRef } from 'react';
import { useEffect,useState } from 'react';
import spaceship from '../images/spaceship.png'
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Route } from 'react-router-dom';
import EndGameSreen from './EndGameSreen';

const Game = ({setuserfnc,setscorefnc,backgroundChangeFnc}) => {
    const [data, setData] = useState([]);
    const {id} = useParams();
    const navigate = useNavigate();
    let user = {};

    
    
   
    //variables for canvas and context refrence
    const canvasRef = useRef(null);
    const contextRef = useRef(null);
    
    
    var gameState = false;
    var playerProjectiles = [];
    var minionProjectiles = [];
    var LivesLeft = 5;
    var enemies = [];
    var explosionParticles = [];
    var starParticles = [];
     
    var velocityConst = 20;
    var currentScore = 0;
    
    var machinegunstate = 'Ready';

     //Class represents player object
     class Player {
        constructor(context){
            this.context = context;
            this.position = {
                x:0,
                y:0
            }
            this.velocity = {
                x:0,
                y:0,
            }
            
            //Loading the image and setting the right size and position of a player
            const image = new Image();
            image.src = spaceship;
            image.alt = "nista";
            image.onload = ()=>{
                this.image = image;
                const scale = 0.4
                this.width = image.width*scale;
                this.height = image.height*scale;
                this.position.x = window.innerWidth/2 - this.width;
                this.position.y = window.innerHeight - this.height - 70;  

            }
            
            
            
            
            
        }
        widthReturn(){
            
            
            
        }
        //Method draws a player on the screen, after the image has loaded
        draw(){
            //Rotating while moving


            if(this.image){
                this.context.drawImage(this.image,this.position.x,this.position.y,this.width,this.height);
            }
            
        }
        //Method constantly draws the player on the screen, due to using requestFrameRate()
        updateMovement(){
            this.draw(this.context)
            //If the player crosses right or left side of the screen, it appears on the other one
            if(this.position.x>=window.innerWidth|| this.position.x<=-this.width){
                if(this.position.x >=(window.innerWidth/4)-50){
                    this.position.x = 1;
                }
                else {
                    this.position.x = window.innerWidth - this.width;
                }
                
            }
            //If the player crosses top side of the screen, it appears on the bottom side
            if(this.position.y>=window.innerHeight-this.height-30){
                this.position.y = window.innerHeight-this.height-29;
            }
            //If the player tries to cross the bottom side of the screen, plane will be stopped and returned to existing location
            if(this.position.y<=0){
                this.position.y = window.innerHeight-this.height-29;
            }
            //increases the horizontal and vertical values of position by current velocity values
            this.position.x += this.velocity.x;
            this.position.y += this.velocity.y;
            //Checking if the minion projectile collides with the player, if it does, it decrements life points and destroys the projetile 
            minionProjectiles.forEach((el,index)=>{
                if((el.position.x<=this.position.x+this.width-this.width/2 && el.position.x>= this.position.x-this.width/2 ) && (el.position.y<=this.position.y+this.height&& el.position.y>= this.position.y)){
                    //If collision is detected, spawn multiple random particles
                    for(let i=0;i<15;i++){
                        explosionParticles.push(new Particle({
                            context:this.context,
                            position: {
                                x:this.position.x+this.width/2,
                                y:this.position.y+this.height/2
                            },
                            velocity:{
                                x:(Math.random()-0.5)*2,
                                y:(Math.random()-0.5)*2
                            },
                            radius:20,
                            color:'red'                  
                            
                        }))
                    }
                    el.delete = true;
                    minionProjectiles.splice(index,1);
                }
               })
              
        }
        
    }
    
    //Class represents an enemy that falls down with constant speed and shoots bullets, enemies are destroyed when shot down or they cross the bottom of the screen
    class Enemy {
        constructor(context){
            

            //fires off when enemy is shot
            this.delete = false;
            //holds the reference to canvas context
            this.context = context;
            this.width = 100;
            this.height = 100;
            this.position = {
                x:Math.floor(Math.random()*(window.innerWidth-this.width*2)+this.width/4),
                y:0

            }
            
            
            
       
            this.animate=()=>{
                //increase y component every frame so it appears to fall down
                this.position.y+=5;
                //if enemy reaches the bottom of the screen, we lose 1 life point
                if(this.position.y>= window.innerHeight){
                    LivesLeft-=1;
                    //if our life points reach 0,game is over
                    gameState=LivesLeft===0?true:false;
                }
                //each time enemy is destroyed, score increments;
                if(this.delete===true){
                    currentScore++;
                }
                //when the enemy is destroyed, remove it from the list of enemies
                if (this.position.y>= window.innerHeight || this.delete===true){
                    enemies.splice(enemies.indexOf(this),1);
                    return;
                }
                //Enemy styling
                context.fillStyle = '#ffa812';
                context.fillRect(this.position.x,this.position.y,this.width,this.height);
                //first line
                context.beginPath();
                context.moveTo(this.position.x+this.width/10, this.position.y+this.height/10);
                context.lineTo(this.position.x+this.width/2.5,this.position.y+this.height/3);
                context.stroke();
                //second line
                context.beginPath();
                context.moveTo(this.position.x+this.width-this.width/10, this.position.y+this.height/10);
                context.lineTo(this.position.x+this.width/2.5+20,this.position.y+this.height/3);
                context.stroke();
                //firt eye
                context.beginPath();
                context.arc(this.position.x+this.width*1/3, this.position.y+this.height/2,5, 0, 2 * Math.PI);
                context.stroke();
                //second eye
                context.beginPath();
                context.arc(this.position.x+this.width*4/6, this.position.y+this.height/2,5, 0, 2 * Math.PI);
                context.stroke();
                //mouth
                context.beginPath();
                context.arc(this.position.x+this.width/2, this.position.y+this.height*5/6,20,1* Math.PI, 0);
                context.stroke();
                
                //Checking if player projectile collides with an enemy in the given frame, if it does, delete both the projectile and the enemy
                playerProjectiles.forEach((el,index)=>{
                 if((el.position.x<=this.position.x+this.width  && el.position.x>= this.position.x) && (el.position.y<=this.position.y+this.height && el.position.y>= this.position.y-this.height)){
                    //When collision is detected spawn multiple particles to represent an explosion
                    for(let i=0;i<15;i++){
                        explosionParticles.push(new Particle({
                            context:this.context,
                            position: {
                                x:this.position.x+this.width/2,
                                y:this.position.y+this.height/2
                            },
                            velocity:{
                                x:(Math.random()-0.5)*2,
                                y:(Math.random()-0.5)*2
                            },
                            radius:20,
                            color:'#ffa812'                  
                            
                        }))
                    }
                    this.delete = true;
                    el.delete = true;
                    
                 }
                })
                //Calls our function around 60 times a second;
                requestAnimationFrame(this.animate);
                
               
                
        
                
            }
            this.animate()
            
            
        }
        
        
        
        }
    //When instanced, creates Minion projectiles
    class MinionProjectiles{
        //Initial spawn position is provided by X and Y values which represent current minion position
        constructor(context,enemy){
            this.delete = false;
            this.context = context
            this.position = {
                x:enemy.position.x,
                y:enemy.position.y,
               
            }
            this.animate = ()=>{
                //Projectile speed
                this.position.y += 20;
                //this.delete will only fire off when minion projectiles collides with the player
                //if that happens we want to decrement our life points and remove the given projectile from the minionProjectiles list
                if(this.delete===true){
                    minionProjectiles.splice(minionProjectiles.indexOf(this),1);
                    LivesLeft-=1;
                    gameState=LivesLeft===0?true:false;
                    return;
                    
                }
                //if the projectile reaches the bottom, remove it from the list and return so the function stops executing,therefore succesfully deleting the projectile from the game
                if (this.position.y>=window.innerHeight){
                    minionProjectiles.splice(minionProjectiles.indexOf(this),1);
                    return;
                }
                //Calling the function 60 times a second
                requestAnimationFrame(this.animate);
                //Styling
                context.fillStyle = 'red';
                context.fillRect(this.position.x+enemy.width/2,this.position.y+enemy.height/2,10,10);
                
               
                
            }
            this.animate();
    }
}
    //Class represents Player projectiles, they work the same way as MinionProjectiles, just stored in different list and spawn location and movement is different
    class PlaneProjectiles {
        constructor(context,X,Y){
            this.delete = false;
            this.context = context
            //Initial spawn position is provided by X and Y values which represent current player position
            this.position = {
                x:X,
                y:Y
            }
            this.animate = ()=>{
                //Projectile speed
                this.position.y -=20;
                //If the bullet crosses the top of the screen or hits an enemy, delete it
                if (this.position.y<=0 || this.delete===true){
                    playerProjectiles.splice(playerProjectiles.indexOf(this),1);
                    return;
                }
                requestAnimationFrame(this.animate);
                //Styling
                context.fillStyle = 'red';
                context.fillRect(this.position.x,this.position.y,10,10);
                
               
                
            }
            this.animate();
    
            
            
        }
       
        
        
    }
    //Class represents randomly instantiated objects that represent stars in the background and have nothing to do with the game dynamics
    class starParticle {
        constructor({context,position,velocity,radius,color}){
            this.context = context;
            this.position =position;
            this.velocity = velocity;
            this.radius = radius;
            this.color = color;
            
            

        }
        draw(){
           this.context.beginPath();
           this.context.arc(this.position.x,this.position.y,this.radius,0,2*Math.PI)
           this.context.fillStyle = this.color;
           this.context.fill()
           this.context.closePath();
        }
        update(){
            if(this.delete){
                return;
            }
            this.draw();
            this.position.x+=this.velocity.x;
            this.position.y+=this.velocity.y;

        }
    }
    //Class represents objects instantiated when there is a collision between other 2 objects
    class Particle {
        constructor({context,position,velocity,radius,color}){
            this.context = context;
            this.position =position;
            this.velocity = velocity;
            this.radius = radius;
            this.color = color;
            this.delete = false;
            setTimeout(()=>{
                this.delete=true;
                explosionParticles.splice(explosionParticles.indexOf(this),1);
            },600)
        }
        draw(){
           this.context.beginPath();
           this.context.arc(this.position.x,this.position.y,this.radius,0,2*Math.PI)
           this.context.fillStyle = this.color;
           this.context.fill()
           this.context.closePath();
        }
        update(){
            if(this.delete){
                return;
            }
            this.draw();
            this.position.x+=this.velocity.x;
            this.position.y+=this.velocity.y;
        }
    }
   
    
    //Using useEffect so we get the reference to canvas, only after the component has fully rendered
     useEffect(()=>{
        //Storing canvas reference into local variable
        const canvas = canvasRef.current;
        //Setting up canvas settings
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        //storing canvas context
        const context = canvas.getContext("2d");
        contextRef.current = context;
        context.lineCap = "round";
        context.strokeStyle = "black";
        context.lineWidth = 5;
        //Instantiating player class first and calling the draw method
        const player = new Player(context);
        player.draw();
        

        //Spawning stars in the background
        for(let i = 0;i<100;i++){
            starParticles.push(new starParticle({
                context:context,
                position: {
                    x:Math.random()*window.innerWidth,
                    y:Math.random()*window.innerHeight
                },
                velocity:{
                    x:0,
                    y:1
                },
                radius:Math.random()*3,
                color:'white'                  
                
            }))

        
    }
        //Next 3 variables will be used to periodically spawn more and more enemies
        var i = 0;
        var k = 1;
        var delimiter = 100;
        function animate(){
            if(gameState){
                const fetchData = async () =>{
                    try {
                      const {data: response} = await axios.get('http://localhost:4000/app/login');
                      setData(response);
                      
                      response.forEach((el,index)=>{
                        if(el._id===id){
                            user = el;
                        }
                        })
                        if(user.highestScore<currentScore){
                            
                            (()=>{
                                axios.put(`http://localhost:4000/app/${user._id}`,
                                {
                                    username:user.username,
                                    email:user.email,
                                    password:user.password,
                                    highestScore:currentScore
                                }
                                ).then(res=>console.log(res)).catch(err=>console.log(err))
                            }
                            )();
                        }
                    setuserfnc(user);
                    setscorefnc(currentScore);
                    backgroundChangeFnc();
                    navigate(`/end/${user._id}`);
                    } 
                    catch (error) {
                      console.error(error.message);
                    }
                  }
                  
                fetchData();
                
                return;
            }
            //incrementing i every frame, so after every 1000 frames,the delimiter decreases, therefore making enemy spawning more frequent
            i++
            if(i>1000*k){
                //Incrementing player speed, when more enemies spawn
                velocityConst+=1;
                if(velocityConst>25){
                    velocityConst = 25;
                }
                delimiter = Math.round(delimiter*0.9);
                k++;
            }
            //canvas colour
            context.fillStyle = 'black';
            context.fillRect(0,0,canvas.width,canvas.height);
            //score text
            context.font = "30px fantasy";
            context.fillStyle = "#845EC2";
            context.fillText(`Current Score:${currentScore}`, window.innerWidth-300, 100);
            //lives left text
            context.font = "30px fantasy";
            context.fillStyle = "#845EC2";
            context.fillText(`Lives Left:${LivesLeft}`, window.innerWidth-300, 150);
            context.font = "30px fantasy";
            context.fillStyle = "#845EC2";
            context.fillText(`Press Z For Machine Gun(${machinegunstate})`, 100, window.innerHeight-100);
           
    
            //Calling the function 60 times a second
            requestAnimationFrame(animate);
            //This results in player and ceratin utilites being drawn and available in every frame
            player.updateMovement();
            //Spawning Enemies
            //The lower the delimeter, the more often this condition executes, therefore resulting in spawning the enemies and their projectiles
            if(i%delimiter===0){
                const enemy = new Enemy(context);
                enemies.push(enemy);
                //Every time an enemy is spawned, an enemy projectiles is spawned aswell
                const minionProjectile = new MinionProjectiles(context,enemy);
                minionProjectiles.push(minionProjectile);
                 
            
            }
            
            
            //Updating the animation of all the explosion particles present in the current frame
            explosionParticles.forEach((el)=>{
               
                el.update();
            })
            //Updating the animations of star particles present in the current frame
            //If a particle leaves the screen, another random particle spawns
            starParticles.forEach((el)=>{
                el.update();
                if(el.position.y>=window.innerHeight){
                    starParticles.splice(starParticles.indexOf(el),1);
                    starParticles.push(new starParticle({
                        context:context,
                        position: {
                            x:Math.random()*window.innerWidth,
                            y:Math.random()*window.innerHeight
                        },
                        velocity:{
                            x:0,
                            y:1
                        },
                        radius:Math.random()*3,
                        color:'white'                  
                        
                    }))
                }
                
            })
             
        }
        animate();
        //When mouseDown is registered, spawn a playerProjectile at the player location and fire it off in the sky, untill it reaches the top or hits an enemy
        window.addEventListener("mousedown",renderProjectiles)
        
        //Add event listener for player movement, if the action is registered, the velocity changes in that moment, and the position of the player is updated at the given frame
        window.addEventListener('keydown',({key})=>{
            if(key==='a'){
                player.velocity.x = -velocityConst;
            }
            else if(key==='d'){
                player.velocity.x = velocityConst;
            }
            else if (key==='w'){
                player.velocity.y = -velocityConst;
            }
            else if (key==='s'){
                player.velocity.y = velocityConst;
            }
            //Setting up the machine gun ability, it is allowed to be used once and lasts for 10 seconds
            else if (key==='z' && machinegunstate==='Ready'){
                machinegunstate = 'Using';
                setTimeout(()=>{
                        machinegunstate = 'Used';
                },10000)
                
            }
        })
        //Once the player has stopped pressing the key, set the corresponding velocity to 0, so the player object stops moving
        window.addEventListener('keyup',({key})=>{
            if(key==='a'){
                player.velocity.x = 0;
            }
            else if(key==='d'){
                player.velocity.x = 0;
            }
            else if (key==='w'){
                player.velocity.y = 0;
            }
            else if (key==='s'){
                player.velocity.y = 0;
            }
            
        })
        function renderProjectiles(){
                    //Checking if machine gun is allowed
                    if(machinegunstate==='Using'){
                        const projectile = new PlaneProjectiles(context,player.position.x+player.width/2,player.position.y);
                        playerProjectiles.push(projectile);
                        requestAnimationFrame(renderProjectiles);
                        return;  
                    }
                    //If machine gun is disabled, shoot proper projectiles
                    else{
                        const projectile = new PlaneProjectiles(context,player.position.x+player.width/2,player.position.y);
                        playerProjectiles.push(projectile);
                    }
                
                
        }   
        
    },[])
    

    

    return (
        <canvas ref={canvasRef}></canvas>
        )
}

export default Game