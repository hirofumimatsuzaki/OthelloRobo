import { Component,ElementRef,OnInit } from '@angular/core';
import * as p5 from 'p5';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit{
  canvasX=400;
  canvasY=400;
  choice = 0;
  flipCount = 0;
  pass = false;
  roboCount = 0;
  rC = 0;  
  timer=0;
  timerStart=false;
  
   board = [
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 1, 2, 0, 0, 0],
  [0, 0, 0, 2, 1, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0]
];
  turn = 1;
  s = 50;
  col:number;
  row:number; 
  kururi = 0;
  count = 60;
  white = 0;
  black = 0;
  who="白の番です";
  ishidden = false;
  maxCount = 0;
  rCount:any;
//let button1, button2, button3, button4;
  possible = false;

  constructor(private el:ElementRef) {}
ngOnInit(){
  const p5obj=new p5(p=> {
    p.setup=()=>{
      this.setup(p);
    };
    p.draw=()=>{
      this.draw(p);
    };
  },this.el.nativeElement);
}
setup(p){
  this.canvasX=p.displayWidth;
  this.s=this.canvasX/8;
  const c=document.querySelector('#canvasContainer');
  p.createCanvas(this.canvasX,this.canvasX).parent(c);
}
draw(p){
  p.background(0, 140, 0);
  if (this.turn == 1) {　　//白の番です
   this.who="白の番です";
  }
  if (this.turn == 2) {　//黒の番です
    this.who="黒の番です";
  }
  if (this.count == 0) {　//カウントが0になったら結果を表示
    this.result();
  }
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      p.line(j * this.s, 0, j * this.s, p.height);
      p.line(0, i * this.s, p.width, i * this.s);
      if (this.board[i][j] == 1) {
        p.fill(255);
        p.ellipse(i * this.s + this.s/2, j * this.s + this.s/2, this.s*0.8, this.s*0.8);
      }
      if (this.board[i][j] == 2) {
        p.fill(0);
        p.ellipse(i * this.s + this.s/2, j * this.s + this.s/2, this.s*0.8, this.s*0.8);
      }
    }
  }
  
  if (this.turn == 2 && this.choice == 1) {   //ターンが２（黒）で対戦ロボにした場合

    let countR = [];    //変更することができるrowの場所を保存する変数
    let countC = [];    //変更することができるcolの場所を保存する変数
    let rC = 0;   //選択可能な場所を保存していく変数
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        if (this.getpos(i, j) == 0) {   //ボード上にコマが置いてないところで
          this.check(i, j);   //チェック関数で置けるかをチェックしていく
          if (this.flipCount == 0) {   // 駒が一つも変わらないところは
            this.board[this.row][this.col] = 0;   //何も置かない
          } else {   //もし駒がひっくり返る場所の時
            rC++;//選択可能な場所の数を増やす
            countR[rC] = this.row;　  //変更することができるrowの場所を保存する
            countC[rC] = this.col;    //変更することができるcolの場所を保存する
            this.board[countR[rC]][countC[rC]] = 0;//いったん駒は消しておく
            
          }
          if(rC==0){ //置く場所が無ければスキップ
            this.turn = 1;
          }
          
        }
      }
    }

    let choice=p.int(p.random(1,rC));    //選択可能な場所からランダムに一つ選ぶ    
    this.reverseC(countR[choice], countC[choice]);//ひっくり返す。
  }
  if(p.mouseIsPressed) {
    this.row = p.floor(p.mouseX / this.s);
    this.col = p.floor(p.mouseY / this.s);
    this.rCount = 0;
    if (this.getpos(this.row, this.col) == 0) {
      if (this.turn == 1) {
        this.kururi = 0;
        this.board[this.row][this.col] = 1;
        this.flipCount = 0;
        for (let i = -1; i < 2; i++) {
          for (let j = -1; j < 2; j++) {
            this.serachReverse(this.row, this.col, i, j);
          }
        }
        this.turn = 2;
        
        if (this.kururi == 0) {
          this.board[this.row][this.col] = 0;
          this.turn = 1;
          this.count++;
        }
        this.count--;
      } else if (this.turn == 2 && this.choice == 2) {
        this.kururi = 0;
        this.flipCount = 0;
        this.board[this.row][this.col] = 2;
  
        for (let i = -1; i < 2; i++) {
          for (let j = -1; j < 2; j++) {
            this.serachReverse(this.row, this.col, i, j);
          }
        }
        this.turn = 1;
       
        if (this.kururi == 0) {
          this.board[this.row][this.col] = 0;
          this.turn = 2;
          this.count++;
        }
        this.count--;
      }
    }
  }
}
reverseC(ro:number, co:number) {
  this.board[ro][co] = 2;
  for (let i = -1; i < 2; i++) {
    for (let j = -1; j < 2; j++) {
        this.serachReverse(ro, co, i, j);
    }
  }
  this.count--;
  this.turn = 1;
}
 getpos(x:number, y:number) {
  let xin = x >= 0 && x < 8;
  let yin = y >= 0 && y < 8;
  if (xin && yin) {
    return this.board[x][y];
  } else {
    return 0;
  }
}

setpos(x:number, y:number, num:number) {
  let xin = x >= 0 && x < 8;
  let yin = y >= 0 && y < 8;
  if (xin && yin) {
    this.board[x][y] = num;
  }
}
serachReverse(x:number, y:number, vx:number, vy:number) {
  let state = this.getpos(x, y);
  let Opponent;
  if (state == 1) {
    Opponent = 2;
  } else {
    Opponent = 1;
  }
  let hit = false;
  let step = 0;
  let stepx = x + vx;
  let stepy = y + vy;
  while (!hit) {

    if (this.getpos(stepx, stepy) == 0) {
      hit = true;
    }

    if (this.getpos(stepx, stepy) == Opponent) {
      stepx += vx;
      stepy += vy;
      step++;
    }
    if (step == 0) {
      if (this.getpos(stepx, stepy) == state) {
        hit = true;
      }
    }
    if (step >= 1) {
      if (this.getpos(stepx, stepy) == state) {
        hit = true;
        this.kururi++;
        let fillx = stepx;
        let filly = stepy;
        for (let i = 0; i < step; i++) {
          fillx -= vx;
          filly -= vy;
          this.setpos(fillx, filly, state);
          this.flipCount++;
        }
      }
    }
  }
}
checkReverse(x:number, y:number, vx:number, vy:number) {
  let state = this.getpos(x, y);
  let Opponent;
  if (state == 1) {
    Opponent = 2;
  } else {
    Opponent = 1;
  }
  let hit = false;
  let step = 0;
  let stepx = x + vx;
  let stepy = y + vy;
  while (!hit) {

    if (this.getpos(stepx, stepy) == 0) {
      hit = true;
    }

    if (this.getpos(stepx, stepy) == Opponent) {
      stepx += vx;
      stepy += vy;
      step++;
    }
    if (step == 0) {
      if (this.getpos(stepx, stepy) == state) {
        hit = true;
      }
    }
    if (step >= 1) {
      if (this.getpos(stepx, stepy) == state) {
        hit = true;
        this.kururi++;
        let fillx = stepx;
        let filly = stepy;
        for (let i = 0; i < step; i++) {
          // fillx -= vx;
          // filly -= vy;
          // setpos(fillx, filly, state);
          this.flipCount++;
        }
      }
    }
  }
}


 result() {
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      let c = this.getpos(i, j);
      if (c == 1) {
        this.white++;
      } else if (c == 2) {
        this.black++;
      }
    }
  }
  if (this.white > this.black) {
   // p.fill(255, 0, 0);
   // p.text("white Win!", 100, 200);
  } else {
   // p.fill(255, 0, 0);
   // p.text("Black Win!", 100, 200);
  }
}
check(r:number, c:number) {
  this.row = r;
  this.col = c;
  this.kururi = 0;
  this.flipCount = 0;
  this.board[this.row][this.col] = 2;
  for (let i = -1; i < 2; i++) {
    for (let j = -1; j < 2; j++) {
      this.checkReverse(this.row, this.col, i, j);
    }
  }
}
 mode1(){
  this.ishidden=true;
  this.choice = 1;
 }
 mode2(){
  this.ishidden=true;
  this.choice = 2;
 }
 skip(){

 }
 restart(){

 }
}
