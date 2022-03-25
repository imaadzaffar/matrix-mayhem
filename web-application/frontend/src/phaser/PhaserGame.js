import Phaser from "phaser";

const config = {
  type: Phaser.AUTO,
  parent: "phaser-container",
  width: 1920,
  height: 1080,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 200 },
    },
  },
  scene: {
    preload: preload,
    create: create,
    update: update,
  },
};

function preload() {
  //This describes all the asset imports for the background, planets, hazards, rocket / rocket animations#
  //To call use any of these assets you have to use them.
  // The following assets can be called by using quotation marks from within functions (with associated animations if sprite)
  // background - 'space'
  // wet planet - 'planet1' (animation: "wet_animate")
  // dry planet - 'planet2' (animation: "dry_animate")
  // no atmosphere - 'planet3' (animation: "moon_animate")
  // lava planet - 'planet4' (animation: "lava_animate")
  // black hole - 'blackHole' (animation: "black_animate")
  // star - 'star' (animation: "star_animate")
  // galaxy - 'galaxy' (animation: "galaxy_animate")
  // rocket static - "stationary_missile"
  // rocket moving - 'missile' (animation: 'rocket')
  // asteroids (theres 10 of them, replace the number at the end from 1 to 10) - 'asteroid1'

  this.load.setPath("assets/");
  this.load.image("space", "Space Background1.png");

  this.load.spritesheet("planet", "wetPlanetSheet.png", {
    frameWidth: 500,
    frameHeight: 500,
  });
  this.load.spritesheet("planet2", "marsPlanetSheet.png", {
    frameWidth: 250,
    frameHeight: 250,
  });
  this.load.spritesheet("planet3", "moonPlanetSheet.png", {
    frameWidth: 250,
    frameHeight: 250,
  });
  this.load.spritesheet("planet4", "lavaPlanetSheet.png", {
    frameWidth: 250,
    frameHeight: 250,
  });

  this.load.spritesheet("blackHole", "blackHoleSheet.png", {
    frameWidth: 500,
    frameHeight: 500,
  });
  this.load.spritesheet("star", "starSheet.png", {
    frameWidth: 500,
    frameHeight: 500,
  });
  this.load.spritesheet("galaxy", "galaxySheet.png", {
    frameWidth: 250,
    frameHeight: 250,
  });
  this.load.spritesheet("missile", "missile_flying.png", {
    frameWidth: 141,
    frameHeight: 517,
  });
  this.load.image("stationary_missile", "missile.png");

  this.load.image("asteroid1", "asteroid1.png");
  this.load.image("asteroid2", "asteroid2.png");
  this.load.image("asteroid3", "asteroid3.png");
  this.load.image("asteroid4", "asteroid4.png");
  this.load.image("asteroid5", "asteroid5.png");
  this.load.image("asteroid6", "asteroid6.png");
  this.load.image("asteroid7", "asteroid7.png");
  this.load.image("asteroid8", "asteroid8.png");
  this.load.image("asteroid9", "asteroid9.png");
  this.load.image("asteroid10", "asteroid10.png");

  this.load.image("title", "title.png");
  this.load.image("button", "correct.png");
}

let mayhem = undefined;

function create() {
  const planets = ["wet_animate", "dry_animate", "moon_animate", "lava_animate"];
  const hazards = ["black_animate", "galaxy_animate", "star_animate"];
  const asteroids = [
    "asteroid1",
    "asteroid2",
    "asteroid3",
    "asteroid4",
    "asteroid5",
    "asteroid6",
    "asteroid7",
    "asteroid8",
    "asteroid9",
    "asteroid10",
  ];
  //Creation of all the animations
  this.anims.create({
    key: "wet_animate",
    frames: this.anims.generateFrameNumbers("planet"),
    frameRate: 7,
    repeat: -1,
  });

  this.anims.create({
    key: "dry_animate",
    frames: this.anims.generateFrameNumbers("planet2"),
    frameRate: 7,
    repeat: -1,
  });

  this.anims.create({
    key: "moon_animate",
    frames: this.anims.generateFrameNumbers("planet3"),
    frameRate: 7,
    repeat: -1,
  });

  this.anims.create({
    key: "lava_animate",
    frames: this.anims.generateFrameNumbers("planet4"),
    frameRate: 7,
    repeat: -1,
  });

  this.anims.create({
    key: "star_animate",
    frames: this.anims.generateFrameNumbers("star"),
    frameRate: 14,
    repeat: -1,
  });

  this.anims.create({
    key: "black_animate",
    frames: this.anims.generateFrameNumbers("blackHole"),
    frameRate: 7,
    repeat: -1,
  });

  this.anims.create({
    key: "galaxy_animate",
    frames: this.anims.generateFrameNumbers("galaxy"),
    frameRate: 7,
    repeat: -1,
  });

  this.anims.create({
    key: "rocket",
    frames: this.anims.generateFrameNumbers("missile"),
    frameRate: 10,
    repeat: -1,
  });

  var Text = new Phaser.Class({
    initialize: function Text(space) {
      this.font = "128px Impact";
      this.fill = "#7200FF";

      this.text = space.add.text(700, 800, "", {
        font: this.font,
        fill: this.fill,
      });

      this.title = undefined;
      this.startButton = undefined;
      this.reset = undefined;

      this.text.depth = 1;
    },

    generateText: function (string) {
      this.text.setText([string]);
    },

    makeTitleScreen: function (space) {
      this.title = space.add.image(960, 300, "title").setScale(2);
      this.startButton = space.add.text(660, 840, "Click to start!!!!", { fill: "#0f0" }).setScale(3);
      this.startButton.depth = 5;
      this.startButton.setInteractive();
    },

    deleteTitleScreen: function (space) {
      this.title.destroy();
      this.startButton.destroy();
    },

    reset_alt: function (space) {
      if (this.reset != null) {
        this.reset.destroy();
      } else {
        this.reset = space.add.text(500, 940, "Click to return to title screen", { fill: "#0f0" }).setScale(3);
      }
    },
  });

  var Rocket = new Phaser.Class({
    initialize: function Rocket() {
      this.state = 0; //0 is not present in scene, 1 is stationary, 2 is flying
      this.rocket = undefined;
      this.scale = 0.5;
    },

    stationary_draw: function (space, x, y) {
      if (this.rocket != null) {
        this.rocket.destroy();
      }
      this.rocket = space.add.image(x, y, "stationary_missile").setScale(this.scale);
      this.rocket.depth = 1;
    },

    moving_missile: function (space, x, y) {
      if (this.rocket != null) {
        this.rocket.destroy();
      }
      this.rocket = space.add.sprite(x, y).setScale(this.scale);
      this.rocket.depth = 1;
      this.rocket.play("rocket");
    },

    spin_shrink: function () {
      if (this.scale < 0.01) {
        this.rocket.destroy();
        this.scale = 0.5;
        return true;
      }
      this.rocket.setScale(this.scale);
      this.rocket.angle += 30;
      this.scale += -0.03;
      return false;
    },

    addY: function (y) {
      this.rocket.y += y;
    },
  });

  var Planet = new Phaser.Class({
    initialize: function Planet() {
      this.type = undefined;
      this.planet = undefined;
    },

    draw_planet: function (space, x, y) {
      if (this.planet != null) {
        this.planet.destroy();
      }
      this.type = planets[Phaser.Math.RND.integerInRange(0, 3)];
      if (this.type !== "wet_animate") {
        this.planet = space.add.sprite(x, y).setScale(5);
      } else {
        this.planet = space.add.sprite(x, y).setScale(2.5);
      }

      this.planet.play(this.type);
    },

    addY: function (y) {
      this.planet.y += y;
    },
  });

  var Hazard = new Phaser.Class({
    initialize: function Hazard() {
      this.type = undefined;
      this.hazard = undefined;
    },

    draw_hazard: function (space, x, y) {
      if (this.hazard != null) {
        this.hazard.destroy();
      }
      this.type = hazards[Phaser.Math.RND.integerInRange(0, 2)];
      if (this.type !== "galaxy_animate") {
        this.hazard = space.add.sprite(x, y).setScale(2.5);
      } else {
        this.hazard = space.add.sprite(x, y).setScale(5);
      }

      this.hazard.play(this.type);
    },

    addY: function (y) {
      this.hazard.y += y;
    },
  });

  var Asteroid = new Phaser.Class({
    initialize: function Asteroid() {
      this.type = undefined;
      this.asteroid = undefined;
      this.counter = -1;
      this.offset = 0;
    },

    spawn_first_asteroid: function (space) {
      this.asteroid = space.add.image(200, -400, asteroids[Phaser.Math.RND.integerInRange(0, 9)]).setScale(0.1);
    },

    rain_asteroids: function (space) {
      if (this.counter == -1) {
        this.spawn_first_asteroid(space);
        this.counter += 1;
      }

      this.offset = Phaser.Math.RND.integerInRange(0, 1);
      if (this.counter < 5) {
        console.log(this.counter);
        if (this.asteroid.y < 1500) {
          this.asteroid.angle += 2;
          this.asteroid.y += 20;
        } else {
          this.asteroid.destroy();
          this.asteroid = space.add
            .image(400 + 1120 * this.offset, -400, asteroids[Phaser.Math.RND.integerInRange(0, 9)])
            .setScale(0.1);
          this.counter += 1;
        }
      }
    },
  });

  var Game = new Phaser.Class({
    initialize: function Game(space) {
      this.game_state = 0;
      //These are the folloqing game states:
      //0 - in rest mode
      //1 - currently resetting
      //2 - correct animation currently playing
      //3 - initial incorrect animation currently playing
      //4 - waiting on last chance
      //5 - last chance success currently playing
      //6 - game over

      this.assetup = true;
      this.next_planet = false;
      space.add.image(960, 540, "space");
      this.rocket = new Rocket();
      this.plan = new Planet();
      this.hazard = new Hazard();
      this.asteroid = new Asteroid();
      this.text = new Text(space);

      this.text.makeTitleScreen(space);
      this.text.startButton.on("pointerdown", () => {
        mayhem.game_state = 1;
      });
    },

    reset: function (space) {
      space.add.displayList.removeAll();
      space.add.image(960, 540, "space");
      //this.text.destroy()
      this.text = new Text(space);

      this.text.makeTitleScreen(space);
      this.text.startButton.on("pointerdown", () => {
        mayhem.game_state = 1;
      });

      this.game_state = 0;
    },

    start: function (space) {
      if (this.assetup) {
        this.plan.draw_planet(space, 960, -2000);
        this.rocket.moving_missile(space, 960, 600);
        this.assetup = false;
      }

      if (this.plan.planet.y < 1500) {
        this.plan.addY(10);
        return;
      } else if (this.rocket.rocket.y < 850) {
        this.rocket.addY(10);
        console.log("hello2");
        return;
      } else if (this.rocket.rocket.y > 849) {
        console.log("hello3");
        this.rocket.stationary_draw(space, 960, this.rocket.rocket.y);
        this.game_state = 0;
        this.assetup = true;
        return;
      }
    },

    correct: function (space) {
      if (this.assetup) {
        this.rocket.moving_missile(space, 960, this.rocket.rocket.y);
        this.text.generateText("CORRECT");
        this.assetup = false;
      }
      if (this.rocket.rocket.y > 600 && this.next_planet === false) {
        this.rocket.addY(-((850 - this.rocket.rocket.y) / 16 + 1));
      } else if (this.plan.planet.y < 1800 && this.next_planet === false) {
        this.plan.addY(10);
      } else if (this.asteroid.counter < 5) {
        this.asteroid.rain_asteroids(space);
      } else if (this.plan.planet.y > 1799 && this.next_planet === false) {
        this.plan.draw_planet(space, 960, -1000);
        this.next_planet = true;
      } else if (this.plan.planet.y < 1500) {
        this.plan.addY(10);
      } else if (this.rocket.rocket.y < 850) {
        console.log(this.rocket.rocket);
        this.rocket.addY((850 - this.rocket.rocket.y) / 16 + 1);
      } else {
        this.rocket.stationary_draw(space, 960, this.rocket.rocket.y);
        this.text.generateText("");
        this.asteroid.counter = 0;
        this.next_planet = false;
        this.assetup = true;
        this.game_state = 0;
      }
    },

    incorrect: function (space) {
      if (this.assetup) {
        this.rocket.moving_missile(space, 960, this.rocket.rocket.y);
        this.hazard.draw_hazard(space, 960, -1000);
        this.text.generateText("LAST CHANCE");
        this.assetup = false;
      }
      if (this.rocket.rocket.y > 650) {
        this.rocket.addY(-((850 - this.rocket.rocket.y) / 16 + 1));
      } else if (this.plan.planet.y < 2750) {
        this.plan.addY(10);
        this.hazard.addY(10);
      } else {
        this.plan.planet.destroy();
        this.assetup = true;
        this.game_state = 4;
      }
    },

    game_over: function (space) {
      if (this.assetup) {
        this.text.generateText("GAME OVER");
        this.text.reset_alt(space);
        this.text.reset.setInteractive();
        this.text.reset.on("pointerdown", () => {
          this.reset(space);
        });
        this.assetup = false;
      }

      if (this.rocket.scale > 0) {
        this.rocket.addY(-((850 - this.rocket.rocket.y) / 16 + 1));
        this.rocket.spin_shrink();
      } else {
        this.rocket.scale = 0.5;
        this.assetup = true;
        this.rocket.rocket.destroy();
        this.game_state = 0;
      }
    },

    last_chance: function (space) {
      if (this.assetup) {
        this.plan.draw_planet(space, 960, -1000);
        this.text.generateText("CORRECT");
        this.assetup = false;
      }

      if (this.hazard.hazard.y < 2750) {
        this.plan.addY(10);
        this.hazard.addY(10);
      } else if (this.rocket.rocket.y < 850) {
        this.rocket.addY((850 - this.rocket.rocket.y) / 16 + 1);
      } else {
        this.rocket.stationary_draw(space, 960, this.rocket.rocket.y);
        this.text.generateText("");
        this.hazard.hazard.destroy();
        this.assetup = true;
        this.game_state = 0;
      }
    },
  });

  mayhem = new Game(this);

  this.cursors = this.input.keyboard.addKeys("LEFT,RIGHT,UP,DOWN");
}

function update() {
  if (mayhem.game_state === 1) {
    mayhem.text.deleteTitleScreen(this);
    mayhem.start(this);
  }

  if (this.cursors.UP.isDown && mayhem.game_state === 0) {
    mayhem.game_state = 2;
  } else if (this.cursors.DOWN.isDown && mayhem.game_state === 0) {
    mayhem.game_state = 3;
  } else if (this.cursors.DOWN.isDown && mayhem.game_state === 4) {
    mayhem.game_state = 6;
  } else if (this.cursors.UP.isDown && mayhem.game_state === 4) {
    mayhem.game_state = 5;
  }

  if (mayhem.game_state === 2) {
    mayhem.correct(this);
  } else if (mayhem.game_state === 3) {
    mayhem.incorrect(this);
  } else if (mayhem.game_state === 5) {
    mayhem.last_chance(this);
  } else if (mayhem.game_state === 6) {
    mayhem.game_over(this);
  }
}

export default new Phaser.Game(config);