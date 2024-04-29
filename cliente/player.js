function Player(x){
   this.x = x;
   this.y = height/2;
   this.velocityy = 6;
   this.w = 20;
   this.h = 80;
   this.points = 0;

   this.show = function(){
    rectMode(CENTER);
    rect(this.x,this.y,this.w,this.h)
   }

   this.move = function(b){
      if(p.y < mouseY)
       p.y += p.velocityy;
     else if(p.y > mouseY)
       p.y -= p.velocityy;
   }

}
