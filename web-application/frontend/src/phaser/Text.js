import Phaser from "phaser";

const Text = new Phaser.Class({
  initialize: function Text(space) {
    this.font = "128px Impact";
    this.fill = "#7200FF";

    this.textMain = space.add.text(700, 800, "", {
      font: this.font,
      fill: this.fill,
    });

    this.textTitle = undefined;
    this.buttonStart = undefined;
    this.textReset = undefined;

    this.textMain.depth = 1;
  },

  generateText: function (string) {
    this.textMain.setText([string]);
  },

  makeTitleScreen: function (space) {
    this.textTitle = space.add.image(960, 300, "title").setScale(2);
    this.buttonStart = space.add.text(660, 840, "Click to start!!!!", { fill: "#0f0" }).setScale(3);
    this.buttonStart.depth = 5;
    this.buttonStart.setInteractive();
  },

  deleteTitleScreen: function (space) {
    this.textTitle.destroy();
    this.buttonStart.destroy();
  },

  reset: function (space) {
    if (this.textReset != null) {
      this.textReset.destroy();
    } else {
      this.textReset = space.add.text(500, 940, "Click to return to title screen", { fill: "#0f0" }).setScale(3);
    }
  },
});

export default Text;
