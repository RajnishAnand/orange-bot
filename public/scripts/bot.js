export function drawBot(ctx,{x,y,rad},color="#ff5500d0",size=10){
  ctx.save();
  ctx.fillStyle = color;
  ctx.strokeStyle = "#000000";

  const p=[
    Math.sin(rad) * size,
    Math.cos(rad) * size, 

    Math.sin(rad + Math.PI/2) * size, 
    Math.cos(rad + Math.PI/2) * size, 

    Math.sin(rad - Math.PI/2) * size, 
    Math.cos(rad - Math.PI/2) * size,
  ];
     
  ctx.beginPath();
  ctx.arc(x, y, 2.5*size,0,2*Math.PI);
  ctx.moveTo(x+7*p[0],y+7*p[1]);
  ctx.lineTo(x+4*p[2],y+4*p[3]);
  ctx.lineTo(x+4*p[4],y+4*p[5]);
  ctx.lineTo(x+7*p[0],y+7*p[1]);
  ctx.stroke();
  ctx.fill();

  ctx.restore();
}

