import Phaser from "phaser";

import Rocket from "./Rocket";
import Planet from "./Planet";
import Hazard from "./Hazard";
import Asteroid from "./Asteroid";

//These are the following game states:
//0 - in rest mode
//1 - currently resetting
//2 - correct animation currently playing
//3 - initial incorrect animation currently playing
//4 - waiting on last chance
//5 - last chance success currently playing
//6 - game over
const Game = new Phaser.Class({
  initialize: function Game(space) {
    this.game_state = 0;

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
      this.game_state = 1;
    });
  },

  reset: function (space) {
    space.add.displayList.removeAll();
    space.add.image(960, 540, "space");
    //this.text.destroy()
    this.text = new Text(space);

    this.text.makeTitleScreen(space);
    this.text.startButton.on("pointerdown", () => {
      this.game_state = 1;
    });

    this.game_state = 0;
  },

  startGame: function (space) {
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

  questionCorrect: function (space) {
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

  questionIncorrect: function (space) {
    if (this.assetup) {
      this.rocket.moving_missile(space, 960, this.rocket.rocket.y);
      this.hazard.drawHazard(space, 960, -1000);
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

  gameOver: function (space) {
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

  lastChance: function (space) {
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

export default Game;
