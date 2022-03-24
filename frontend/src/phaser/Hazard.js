import Phaser from "phaser";

const Hazard = new Phaser.Class({
  initialize: function Hazard() {
    this.hazards = ["black_animate", "galaxy_animate", "star_animate"];
    this.type = undefined;
    this.hazard = undefined;
  },

  drawHazard: function (space, x, y) {
    if (this.hazard != null) {
      this.hazard.destroy();
    }
    this.type = this.hazards[Phaser.Math.RND.integerInRange(0, 2)];
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

export default Hazard;
