const express = require('express');
const http = require('http');

const app = express();
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.use(express.static(__dirname+"/public/"));
app.get('/', (_, res) => {
  res.sendFile(__dirname+"/public/index.html");
});

const port = process.env.PORT||3000;
server.listen(port, () => {
  console.log('listening on port:'+port);
});

const renderSpeed= 50;
const Players = [];

class Player {
  v = [0,0];
  x = 0;
  y = 0;
  rad = 0;
  speed = 5;
  constructor (socket){
    this.socket = socket;
    this.color = [
      "#ff5500dd",
      "#00bfffdd",
      "#00000055",
      "#fcc300dd"
    ][Math.floor(Math.random()*4)];
    this.run();
  }
  run(){
    this.socket.on("movement",(rad)=>{
      if(rad==null)return this.v= [0,0];
      rad = rad>2*Math.PI?.01:rad;
      this.v = [Math.sin(rad),Math.cos(rad)];
      this.rad = rad;
    });
    setInterval(()=>{
      this.x+=Math.round(this.v[0]*this.speed);
      this.y+=Math.round(this.v[1]*this.speed);
    },renderSpeed);
  }
  get position (){
    return {x:this.x,y:this.y,rad:this.rad,color:this.color}
  }
}

io.on("connection", function(socket){
  const i = Players.length;
  const p = new Player(socket);
  p.socket.on("disconnect",()=>{
    delete Players[i];
    console.log(`Player left: ${p.socket.id}`);
  })
  Players.push(p);
  console.log(`New Player: ${socket.id} (${p.color})`);
})

setInterval(function(){
  const positions = {};
  for(let p of Players)  
    if(p)positions[p.socket.id]=p.position;
  io.emit("update",positions);
},renderSpeed)
 
