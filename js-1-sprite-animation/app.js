let playerState = 'fall'; 
const dropdown = document.getElementById('animations')
dropdown.addEventListener('change' , function (e) {
    playerState = e.target.value;
} )


const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
const CANVAS_WIDTH = canvas.width = 600;
const CANVAS_HEIGHT = canvas.height = 600;

const playerImage = new Image();
playerImage.src = 'https://www.frankslaboratory.co.uk/downloads/shadow_dog.png'
 
// sprite image width and height
const spriteWidth = 575;
const spriteHeight = 523;


// x frame and y frame
// let frameX = 0;
// let frameY = 0;

// slow down the animate 
let gameFrame = 0;
let staggerFrame = 4;

// make the array of the spite animation
const spriteAnimations = [];
const animationState = [
    {
        name : 'idle',
        frames : 7,
    },

    {
        name : 'jump',
        frames : 7,
    },
    {
        name : 'fall',
        frames : 7,
    },
    {
        name : 'run',
        frames : 9,
    },
    {
        name : 'dizzy',
        frames : 11,
    },
    {
        name : 'sit',
        frames : 5,
    },
    {
        name : 'roll',
        frames : 7,
    },
    {
        name : 'bite',
        frames : 7,
    },
    {
        name : 'ko',
        frames : 12,
    },
    {
        name : 'getHit',
        frames : 4,
    },
    
];

animationState.forEach((state , index) => {
    let frames = {
        loc: [],
    }

    for(let j =0 ; j< state.frames ; j++){
        let positionX = j * spriteWidth;
        let positionY = index * spriteHeight;
        frames.loc.push({x:positionX , y:positionY})
    }
    spriteAnimations[state.name] = frames;
   
});
console.log(spriteAnimations)


function animate(){
ctx.clearRect(0 , 0 , CANVAS_HEIGHT , CANVAS_WIDTH);
// ctx.fillRect(x , 50 , 100 , 100);
// ctx.drawImage(image , sx , sy , sw , sh , dx , dy , dw , dh);

// just simple calculation to manage the speed of the image
let position = Math.floor(gameFrame/staggerFrame) % spriteAnimations[playerState].loc.length;
let frameX = spriteWidth * position;
let frameY = spriteAnimations[playerState].loc[position].y;

// --------------------------------------- //

// this code is for drawing the image setting its sizing and fixing
ctx.drawImage(playerImage , frameX  , frameY , spriteWidth , spriteHeight , 0 ,0 , spriteWidth , spriteHeight)

// this is the method to manage the speed of the image
// if(gameFrame % staggerFrame === 0){
// if(frameX < 6) frameX++;
// else frameX = 0;    
// }

gameFrame++;


// ctx.drawImage(playerImage , 0 ,)
requestAnimationFrame(animate);

}

animate()
