let xF=0;
let h=innerHeight;
let w=innerWidth;
let col=['#ffffff', '#000000','#ffff00', '#00ffff','#ff00ff','#ff0000', '#00ff00', '#0000ff']
   
const canv1 =document.querySelector('#canv1');
const canv2 =document.querySelector('#canv2');
const lostP =document.querySelector('#lostP');
const para  =document.querySelector('#para');
const retay =document.querySelector('#retay');

function fxF(fx){
    xF=fx;
canv1.height=h*xF;
canv1.width=w*xF;
canv2.height=h*xF;
canv2.width=w*xF;

//initial configs */
ctx = canv1.getContext('2d');
ctx.lineWidth =xF*2;
ctx.strokeStyle='#111111';
ctx.fillStyle='#ff5500aa';
ctx.lineCap ='round';
ctx.font=`${15*xF}px sans-seif`;

cty = canv2.getContext('2d');
cty.lineWidth =xF;
cty.strokeStyle='#111111';
cty.font=xF*50+'px Alternity';
cty.fillText('Welcome',w/2*xF-cty.measureText('Welcome').width/2,h/2*xF-50*xF) ;
cty.fillStyle='#00bfff55';
}; 
window.onload =_=>fxF(2);
//-------------------------------------------



//-------------------------------------------
//bo1 info */
let bot1={
    x:w/2, 
    y:h/2,
    size:4, 
    speed:2,
    ang:Math.PI/2,
    score:0, 
};
//-------------------------------------------



//-------------------------------------------
//move */
function main(){
    ctx.clearRect(0,0,w*xF,h*xF);
    plotE(charG);
    drawBot()
    bot1.x+=(bot1.ang)?xF*bot1.speed*Math.sin(bot1.ang):0;
    bot1.y+=(bot1.ang)?xF*bot1.speed*Math.cos(bot1.ang):0;
    checkR();
    writeScore();
    reqF1=requestAnimationFrame(main);
    checkR();
}
//-------------------------------------------



//-------------------------------------------
//checks if energy absorbed ?  creates : return
const quotes=[
    'Your bot ran out of green-energy!🍃', 
    'Your bot jumped to molecular 📡state!☄️', 
    'Your bot lost in the outer space!🐾'
    ];

let inOuterSpace=[0,0];
function checkR(){
     let dx=Math.sqrt((charG[0]-bot1.x)**2+(charG[1]-bot1.y)**2);
     
    //checks if bot reaches green fuel
    if (dx<=(charG[2]*xF+5*bot1.size)){
        charG=[Math.round(Math.random()*w),Math.round(Math.random()*h),5+Math.random()*2*xF];
        bot1.speed+=.5;
        bot1.score+=1;
        bot1.size+=(bot1.size>40)?0:.5;
    }
    
    //checks if bot is out of fuel (green energy) 
    else if(bot1.speed<=0){gameOver(0)}
    
    //checks if bot was in outer space more than 5s
    else if(bot1.x>w||bot1.x<0||bot1.y>h||bot1.y<0){
        if(inOuterSpace[0]){
            let dt=Date.now()-inOuterSpace[1];
            if(dt>5000){gameOver(2)};
        }
        else{
            inOuterSpace=[1,Date.now()];
            canv1.style.backgroundColor='#ffeeee';
        };
    }
    else if(inOuterSpace[0]){
        inOuterSpace=[0, 0];
        canv1.style.backgroundColor='#E5E5F7';
    };
     
    //energy consumption
    bot1.speed-=.001;
    bot1.size-=.002;
     
    //random charge movement
    charG[0]+=(-1+Math.random()*2)*bot1.speed*xF;
    charG[1]+=(-1+Math.random()*2)*bot1.speed*xF;
    charG[0]=(charG[0]>=w)?5:(charG[0]<=0)?w:charG[0];
    charG[1]=(charG[1]>=h)?5:(charG[1]<=0)?h:charG[1];
 };
//-------------------------------------------



//-------------------------------------------
//gameOver function
function gameOver(q){
    canv1.style.zIndex=3;
    para.innerHTML=quotes[q];
    lostP.style.top='50%';
    cancelAnimationFrame(reqF1);
};

//Reserect or retray function 
retay.onclick=_=>reserect();
function reserect(){
    canv1.style.zIndex=1;
    lostP.style.top='-50%';
    bot1={x:w/2,y:h/2,size:4,speed:2,ang:Math.PI/2,score:0};
    
};
//-------------------------------------------



//-------------------------------------------
//to draw bot */
function drawBot(bot=bot1){
    let x=bot.x*xF;
    let y=bot.y*xF;
    let sz=bot.size*xF;
    let p=[
            Math.sin(bot.ang)*sz,
            Math.cos(bot.ang)*sz, 
            Math.sin(bot.ang+Math.PI/2)*sz, 
            Math.cos(bot.ang+Math.PI/2)*sz, 
            Math.sin(bot.ang-Math.PI/2)*sz, 
            Math.cos(bot.ang-Math.PI/2)*sz
        ];
    try{
        ctx.beginPath();
        ctx.arc(x, y, 2.5*sz,0,2*Math.PI);
        ctx.moveTo(x+7*p[0],y+7*p[1]);
        ctx.lineTo(x+4*p[2],y+4*p[3]);
        ctx.lineTo(x+4*p[4],y+4*p[5]);
        ctx.lineTo(x+7*p[0],y+7*p[1]);
        ctx.stroke();
        ctx.fill();
    }catch(err){gameOver(1)};
};


//to draw Controller and find angle */
function contrlr(x,y){
    x*=xF;
    y*=xF;
    
    let t=[touches[0][0]*xF,touches[0][1]*xF];
    let dxy=[t[0]-x,t[1]-y];
    let rad=Math.atan(dxy[0]/dxy[1]);
    rad=(t[1]>=y)?rad-=Math.PI:rad;
    bot1.ang=rad;
    
    let r= Math.sqrt(dxy[0]**2+dxy[1]**2);
    r=(r>45*xF)?45*xF:r;
    let x1=t[0]+r*Math.sin(rad);
    let y1=t[1]+r*Math.cos(rad);
    
    cty.clearRect(0,0,w*xF,h*xF)
    cty.beginPath();
    cty.arc(t[0],t[1],45*xF,0,2*Math.PI);
    cty.stroke();
    cty.fill();
    
    cty.beginPath();
    cty.arc(x1,y1,20*xF,0,2*Math.PI);
    cty.stroke()
    cty.fill();
};

//To Plot energy [x, y, r,]
var charG=[70,100,5];
function plotE([x,y, r]){
    ctx.save();
    ctx.strokeStyle='#ffffff';
    ctx.fillStyle='#25C40A';
    ctx.beginPath();
    ctx.arc(x*xF,y*xF,r*xF,0,2*Math.PI);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
};

//Writes score
function writeScore(){
    ctx.fillText(`score : ${bot1.score}`,5*xF,15*xF);
};
//-------------------------------------------



//-------------------------------------------
//Event listeners */
var reqF1,touches=[];
canv2.addEventListener('touchstart',(ev)=>{
    if(ev.touches.length>1){return};
    let x=ev.touches[0].clientX;
    let y=ev.touches[0].clientY;
    touches=[[x, y]];
    contrlr(x, y);
    main();
});

canv2.addEventListener('touchmove',(ev)=>{
    if(ev.touches.length>1){return};
    let x=ev.touches[0].clientX;
    let y=ev.touches[0].clientY;
    touches[1]=[x, y];
    contrlr(x, y);
});


canv2.addEventListener('touchend',(ev)=>{
    cty.clearRect(0,0,w*xF,h*xF);
    cancelAnimationFrame(reqF1);
});
canv2.addEventListener('touchcancel', (ev)=>{
    cty.clearRect(0,0,w*xF,h*xF)
    cancelAnimationFrame(reqF1);
});

/**/