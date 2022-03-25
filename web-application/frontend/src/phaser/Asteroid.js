import Phaser from "phaser";

const Asteroid = new Phaser.Class({
  initialize: function Asteroid() {
    this.asteroids = [
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
    this.type = undefined;
    this.asteroid = undefined;
    this.counter = -1;
    this.offset = 0;
  },

  getRandomAsteroid: function () {
    return this.asteroids[Phaser.Math.RND.integerInRange(0, 9)];
  },

  spawn_first_asteroid: function (space) {
    this.asteroid = space.add.image(200, -400, this.getRandomAsteroid()).setScale(0.1);
  },

  rain_asteroids: function (space) {
    if (this.counter === -1) {
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
        this.asteroid = space.add.image(400 + 1120 * this.offset, -400, this.getRandomAsteroid()).setScale(0.1);
        this.counter += 1;
      }
    }
  },
});

export default Asteroid;
