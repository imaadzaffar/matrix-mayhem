import Phaser from "phaser";

const Rocket = new Phaser.Class({
  initialize: function Rocket() {
    this.state = 0; // 0 is not present in scene, 1 is stationary, 2 is flying
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

export default Rocket;
