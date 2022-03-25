import Phaser from "phaser";

const Planet = new Phaser.Class({
  initialize: function Planet() {
    this.type = "";
    this.planets = ["wet_animate", "dry_animate", "moon_animate", "lava_animate"];
  },

  drawPlanet: function (space, x, y) {
    if (this.planet != null) {
      this.planet.destroy();
    }
    this.type = this.planets[Phaser.Math.RND.integerInRange(0, 3)];
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

export default Planet;
