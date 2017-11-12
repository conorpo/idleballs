var width = 1900;
var height = 800;
var value = 0;
var context;
var level = 0;
var click = {rank:1 ,bDamage:1,cost:10,multi:1.2};
var balls = [
  {active:false,x:200,y:200,dx:.707,dy:.707,color:"#0000ff",radius:20,bDamage:8,rank:0,cost:10,id:0,clone:false},
  {active:false,x:300,y:300,dx:.707,dy:-.707,color:"#00ff00",radius:30,bDamage:200,rank:0,cost:1000,id:1,clone:false},
  {active:false,x:100,y:100,dx:-.707,dy:.707,color:"#ff0000",radius:10,bDamage:15000,rank:0,cost:100000,id:2,clone:false},
  {active:false,x:400,y:400,dx:-.707,dy:-.707,color:"#ffff00",radius:15,bDamage:6666666,rank:0,cost:10000000,id:3,clone:false}
];
var enemies = [];
var shrink = false;
function clickAdd(number) {
  value+= number*click.rank*click.bDamage;
  document.getElementById("value").innerHTML = value;
}
function clickRankUp(){
  if(value>=Math.floor(click.cost*Math.pow(click.multi,click.rank))){
      value -= Math.floor(click.cost*Math.pow(click.multi,click.rank));
      click.rank += 1;
      if(click.rank%100 == 0){
        click.bDamage *= (click.rank/100) + 1;
      }
      document.getElementById("CC").innerHTML = Math.floor(click.cost*Math.pow(click.multi,click.rank));
      document.getElementById("CA").innerHTML = click.rank;
      document.getElementById("value").innerHTML = value;
  }
}
function levelBall(id){
  var tempBall = balls[id];
  if(value>=Math.floor(tempBall.cost*Math.pow(1.07,tempBall.rank))){
    if(tempBall.rank == 0){
      tempBall.active = true;
      document.getElementById(id+"T").innerHTML = "Upgrade";
    }
    value -= Math.floor(tempBall.cost*Math.pow(1.07,tempBall.rank));
    tempBall.rank += 1;
    if(tempBall.rank%100 == 0){
      tempBall.bDamage *= (tempBall.rank/100) + 1;
    }
    if(tempBall.rank%50 == 0){
      balls.push({active:true,x:rand(100,width-100),y:rand(100,height-100),dx:.707,dy:-.707,color:tempBall.color,
        radius:tempBall.radius,id:tempBall.id,clone:true});
    }
    document.getElementById(id+"C").innerHTML = Math.floor(tempBall.cost*Math.pow(1.07,tempBall.rank));
    document.getElementById(id+"A").innerHTML = tempBall.rank;
    document.getElementById("value").innerHTML = value;
  }
}
function init() {
  context= myCanvas.getContext('2d');
  newLevel();
  spawnEnemies();
  setInterval(draw,10);
}
function newLevel() {
  level++;
  document.getElementById("level").innerHTML = level;
  enemies = [];
  if(level%10 == 0){
    shrink = true;
  }
  else if(level%10 == 1){
    shrink = false;
  }
  else{
    spawnEnemies();
  }
}
function spawnEnemies(){
  if(level%10 == 0){
    var healthTemp = Math.floor(10000*Math.pow(1.07,level-1));
    enemies.push({x:width/2,y:height/2,health:healthTemp,sHealth:healthTemp,active:true,radius:(height/2)-100});
    var boss = enemies[0];
    for(var b = 0; b<balls.length;b++){
      if(balls[b].active){
        if(rand(0,100)>=50){
          balls[b].x = 50;
        }
        else{
          balls[b].x = width-50;
        }
      }
    }
  }
  else{
    for(i = 0;i<5;i++){
      var healthTemp = Math.floor(100*Math.pow(1.07,level-1));
      enemies.push({x:rand(100, width-100),y:rand(100, height-100),health:healthTemp,sHealth:healthTemp,active:true,radius:rand(20,60)});
    }
  }
}
function rand(min,max){
  return min + (Math.floor(Math.random() * (max-min)));
}
function levelCheck(){
  var allDisabled = true;
  for(var l = 0; l<enemies.length; l++){
    enemyCheck = enemies[l];
    if(enemyCheck.active){
      allDisabled = false;
    }
  }
  if(allDisabled){
    newLevel();
  }
}
function draw(){
  if(shrink == true&&myCanvas.width > height){
    myCanvas.width *= 0.995
    width *= 0.995
  }
  else if(shrink == true&&myCanvas.width < height){
    myCanvas.width = height;
    width = height;
    spawnEnemies();
  }
  else if(shrink == false&&myCanvas.width <1900){
    myCanvas.width *= 1.005
    width *= 1.005
  }
  else if(shrink == false&&myCanvas.width >1900){
    myCanvas.width = 1900;
    width = 1900;
    spawnEnemies();
  }
  context.clearRect(0,0,width,height);
  for(var i = 0; i<enemies.length; i++){
    var enemyDraw = enemies[i];
    if(enemyDraw.active){
      context.beginPath();
      context.fillStyle="#000000";
      context.arc(enemyDraw.x,enemyDraw.y,enemyDraw.radius,0,Math.PI*2,true);
      context.closePath();
      context.fill();
      context.font = Math.floor(enemyDraw.radius/1.7)+"px Arial";
      context.textAlign="center";
      context.textBaseline="middle";
      context.fillStyle="#FFFFFF";
      context.fillText(Math.ceil((enemyDraw.health/enemyDraw.sHealth)*100)+"%",enemyDraw.x,enemyDraw.y);
    }
  }
  for(var i = 0; i<balls.length; i++){
    var ball = balls[i]
    if(ball.active){
      context.beginPath();
      context.fillStyle=ball.color;
      context.arc(ball.x,ball.y,ball.radius,0,Math.PI*2,true);
      context.closePath();
      context.fill();
      for(var e = 0; e<enemies.length; e++){
        var enemy = enemies[e];
        if(enemy.active){
          if(Math.pow(ball.x-enemy.x,2)+Math.pow(ball.y-enemy.y,2)<=Math.pow(enemy.radius+ball.radius,2)){
            if(ball.clone){
              ball = balls[ball.id];
            }
            if(enemy.health>ball.bDamage*ball.rank)
              {
                enemy.health -= ball.bDamage*ball.rank;
              }
            else
              {
                enemy.active = false;
                value += enemy.sHealth;
                levelCheck();
                document.getElementById("value").innerHTML = value;
              }
            ball = balls[i];
            ball.dx = (ball.x - enemy.x)/Math.sqrt(Math.pow(ball.x-enemy.x,2)+Math.pow(ball.y-enemy.y,2));
            ball.dy = (ball.y - enemy.y)/Math.sqrt(Math.pow(ball.x-enemy.x,2)+Math.pow(ball.y-enemy.y,2));
          }
        }
      }
      if(ball.x<=ball.radius || ball.x>=(width-ball.radius)) ball.dx=-ball.dx;
      if(ball.y<=ball.radius || ball.y>=(height-ball.radius)) ball.dy=-ball.dy;
      ball.x+=ball.dx*4;
      ball.y+=ball.dy*4;
    }
  }
}
