import {drawBot} from "./bot.js";

console.log("Ready!");
const canv1 =document.querySelector('#canv1');
const canv2 =document.querySelector('#canv2');

function adjustScreen(){
 canv1.height = devicePixelRatio * innerHeight;
 canv1.width  = devicePixelRatio * innerWidth;
 canv2.height = devicePixelRatio * innerHeight;
 canv2.width  = devicePixelRatio * innerWidth;
}

adjustScreen();

const sz= 10*devicePixelRatio;
const ctx = canv1.getContext("2d");
const cty = canv2.getContext("2d");

cty.fillStyle= "#00bfff77";
ctx.fillStyle= "#000000";
ctx.strokeStyle = "#c0c0c0"
ctx.lineWidth = devicePixelRatio;
ctx.font = sz+"px sans-seif";

const socket = io();
let pos = [[0,0],[0,0]];
let rad = Math.PI;

socket.on("update", function(data){
  const me = {...data[socket.id]};
  delete data[socket.id];

  ctx.beginPath();
  for(let i = 0; i<canv1.width;i+=60){
    for(let j = 0; j<canv1.height;j+=60){
      const x = i+ (me.x%60);
      const y = j+ (me.y%60);
      ctx.rect(x,y,20,20)
    }
  }
  ctx.clearRect(0,0,canv1.width,canv1.height);
  ctx.stroke();
  ctx.fillText(JSON.stringify(me,null," "),0,sz);

  
  for(let [_,p] of Object.entries(data))
    // if(p.x<canv1.width && p.y<canv1.height && p.x>-1 && p.y>-1)
      drawBot(ctx,{
        x: canv1.width/2 + me.x-p.x,
        y: canv1.height/2+ me.y-p.y, 
        rad: p.rad+Math.PI
      },p.color); 

   drawBot(ctx,{
    x: canv1.width/2,
    y: canv1.height/2,
    rad: rad
  },me.color)
});


canv2.addEventListener("touchstart",(e)=>{
  pos[0]=[e.touches[0].clientX,e.touches[0].clientY]
});
canv2.addEventListener("touchmove",(e)=>{
  pos[1]=[e.touches[0].clientX,e.touches[0].clientY]
  controller();
  socket.emit("movement",Math.PI+rad);
});
canv2.addEventListener("touchend",(_)=>{
  cty.clearRect(0,0,canv2.width,canv2.height)
  socket.emit("movement",NaN);
});
canv2.addEventListener("touchcancel",(_)=>{
  cty.clearRect(0,0,canv2.width,canv2.height)
  socket.emit("movement",NaN);
});

//to draw Controller and find angle */
function controller(){
  const dx = pos[1][0]-pos[0][0];
  const dy = pos[1][1]-pos[0][1];
  let [x,y] = pos[0];
  rad = Math.atan(dx/dy);

  rad = (pos[1][1]<y)? rad-Math.PI : rad;
  // bot1.ang=rad;
  
  let r= Math.sqrt(dx**2+dy**2);
  r=(r>45)?45:r;
  let x1 = x + r*Math.sin(rad);
  let y1 = y + r*Math.cos(rad);

  x*=devicePixelRatio;
  y*=devicePixelRatio;
  x1*=devicePixelRatio;
  y1*=devicePixelRatio;
  
  cty.clearRect(0,0,canv2.width,canv2.height)
  cty.beginPath();
  cty.arc(x,y,45*devicePixelRatio,0,2*Math.PI);
  cty.stroke();
  cty.fill();
  
  cty.beginPath();
  cty.arc(x1,y1,20*devicePixelRatio,0,2*Math.PI);
  cty.stroke()
  cty.fill();

};

