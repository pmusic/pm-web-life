var World = function(x,y){
  this.x = x;
  this.y = y;
  this.times = function(){
      return this.x * this.y;
  };
  this.fourtimes = function(){
      return 4 * times();
      };
  this.Name = function(a,b){
      this.a = a;
      this.b = b;
      this.reverse = function(){
          var z = this.a;
          this.a = this.b;
          this.b = z;
      };
  };
  this.aname = new this.Name('mr','smith');
  this.bname = new this.Name('mrs','jones');
};

a = new World(1,2);
console.log(a.fourtimes());
console.log(a.aname);
a.aname.reverse();
console.log(a.aname);