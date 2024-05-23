var warna = '000000';
var gameWidth = 288;
var gameHeight = 512;
var bird;
var game;
window.onload = function(){



  var config = {

    width: gameWidth,
    height: gameHeight,
    backgroundColor: warna,
    scene: [Scene1, Scene2],
    physics: {
      default: 'arcade',
      arcade: {
          debug: true,

      }
    }
  };

  game = new Phaser.Game(config);
}

class Scene1 extends Phaser.Scene {
  constructor() {
    super("bootGame");
  }

  preload(){
    this.load.image('bird', 'assets/sprites/bluebird-midflap.png')
    this.load.image("background", "assets/sprites/background-day.png");
    this.load.image('base', "assets/sprites/base.png");
    this.load.image('pipe', "assets/sprites/pipe-green.png");
    this.load.audio('hit', "assets/audio/hit.wav");
  }

  create(){
    this.add.text(200,200, "Loading Game!").setOrigin(0,0);
    this.scene.start("playGame");
  }
}

var myScore = 0;
var pipeUp;
var pipeDown;
var speedPipe = 5;
var totalTime = 1;
var timerEvent;
var pipes;

var hitsfx;

var scoreDisplay;
let scoreText;

var spawnUp;
var spawnDown;
var trigger;

var spawnedPipeUp;
var spawnedPipeDown;
const min = -100;
const max = 100;

class Scene2 extends Phaser.Scene {
  constructor() {
    super("playGame")
  }


movePipe(pipeUp, pipeDown = undefined, speed){
  pipeUp.x += -speed;
  pipeDown.x += -speed;
}



getRandomFloat(min, max) {
    return Math.random() * (max - min) + min;
}

  create(){
    this.add.image(0,0, "background").setOrigin(0,0);
    this.add.image(0,400, "base").setOrigin(0,0);
    this.add.image(0,0, "base").setOrigin(0,0).flipY = true;

    //var textStyle = { fontSize: '200px' };

    //scoreText = this.add.text(gameWidth/2 ,gameHeight/2 + -100, textStyle).setOrigin(0.5);


    const textStyle = { fontSize: '100px', fill: '#fff' };
    scoreText = this.add.text(gameWidth/2, gameHeight/2 + -100, myScore, textStyle);
    scoreText.setOrigin(0.5);

    // cursors = this.input.keyboard.createCursorKeys();
    this.spaceBar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);


    bird = this.physics.add.sprite(100, 300, 'bird');
    bird.setPosition(gameWidth/2 + -100,gameHeight/2).setOrigin(0.5);
    bird.setGravityY(800);
    //bird.setGravityX(800); // Menambahkan gravitasi pada burung
    pipes = this.physics.add.group();
    timerEvent = this.time.addEvent({ delay: 1800, callback: this.onTimerTick, callbackScope: this, loop: true });
    //this.physics.add.collider(bird, pipes);
    this.physics.add.overlap(bird, pipes, function(){
      bird.setPosition(gameWidth/2 + -100,gameHeight/2).setOrigin(0.5);
      spawnedPipeUp.destroy();
      spawnedPipeDown.destroy();
      trigger.destroy();
      myScore = 0;
      console.log("Hit the pipe");
    })
  }

  spawnPipe(){
    const randomY = this.getRandomFloat(min, max);

    pipeUp = this.add.sprite(0,0,'pipe')
    pipeUp.setPosition(gameWidth/2 + 150,gameHeight/2 + -200 + randomY).flipY = true;
    pipes.add(pipeUp);
    spawnedPipeUp = pipeUp;
    pipeDown = this.add.sprite(0,0,'pipe');
    pipeDown.setPosition(gameWidth/2 + 150,gameHeight/2 + 200 + randomY).flipY = false;

    trigger = this.physics.add.sprite(gameWidth/2 + 150, gameHeight/2 + randomY)
    trigger.alpha = 0;
    this.physics.add.overlap(bird,trigger, function(){
      console.log("score");
      myScore += 1;
      trigger.destroy();
    });
    pipes.add(pipeDown);
    spawnedPipeDown = pipeDown;
  }


  onTimerTick() {
    var maxTime = totalTime;
      totalTime--;
      if (totalTime === 0) {
          // Logika ketika waktu habis
          if(pipeUp){
            spawnedPipeUp.destroy();
            spawnedPipeDown.destroy();
          }
          totalTime = maxTime;
          this.spawnPipe();
          //console.log("time out and reset time");

          // Misalnya:
          // game over atau tindakan lainnya
      }
  }


  update(){
    scoreDisplay = myScore.toString();
    scoreText.setText(scoreDisplay);
    if (Phaser.Input.Keyboard.JustDown(this.spaceBar)){
        //console.log("Klik space");
        bird.setVelocityY(-330)
        bird.setVelocityX(0); // Beri burung gaya untuk terbang ke atas saat spasi ditekan
    }
    if(!pipeUp || !pipeDown) return;
    this.movePipe(pipeUp, pipeDown,speedPipe);
    trigger.x += -speedPipe;


    //movePipe += -5;
  }

  testFunction(){
    console.log("Test");
  }
}
