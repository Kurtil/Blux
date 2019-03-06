import Player from "../Entities/player";

export default class MainScene extends Phaser.Scene {

  player: Player;
  map: Phaser.Tilemaps.Tilemap;

  constructor() {
    super({
      key: "mainScene"
    });
  }

  preload() {
    this.load.spritesheet("spriteSheet", "assets/spriteSheets/BluxSpriteSheet.png", {
      frameWidth: 16,
      frameHeight: 16
    });
    this.load.tilemapTiledJSON("map", "assets/tileMaps/tileMap01.json");
    this.load.audio("playerJump", "assets/sounds/jump.wav");
    this.load.audio("playerDie", "assets/sounds/die.wav");
    this.load.audio("mainTheme", "assets/sounds/mainTheme.wav");
  }

  create() {

    // Sound management
    this.sound.play('mainTheme', { volume: 0.1, loop: true });
    this.sound.add("playerJump");
    this.sound.add("playerDie");

    // Map management
    this.map = this.make.tilemap({ key: 'map' });

    const tileset = this.map.addTilesetImage("BluxSpriteSheet", "spriteSheet");

    const background = this.map.createStaticLayer("background", tileset);
    const ground = this.map.createStaticLayer("ground", tileset);
    const foreground01 = this.map.createStaticLayer("foreground01", tileset);
    const foreground02 = this.map.createStaticLayer("foreground02", tileset);

    foreground01.setScrollFactor(0.9, 0.95).setDepth(10);
    foreground02.setScrollFactor(0.8, 0.95).setDepth(10);

    ground.setCollisionByProperty({ collides: true });

    const spawnPoint: any = this.map.findObject("objects", obj => obj.name === "spawn");

    // create player
    this.player = new Player(this, spawnPoint.x, spawnPoint.y, "Player");

    // add collider between player and the platforms group
    this.physics.add.collider(this.player, ground);

    // Camera management
    this.cameras.main.setZoom(3);
    this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
    this.cameras.main.startFollow(this.player);

    this.setDebugGraphics.call(this, ground);
  }

  update(time) {
    this.player.update(time);

    if (this.player.getData('isDead') === true) {
      const cam = this.cameras.main;
      cam.shake(250, 0.005);
      cam.fade(250, 30, 0, 0);

      cam.once("camerafadeoutcomplete", () => {
        this.sound.stopAll();
        this.scene.start('dieScene');
      });
    }
  }

  private setDebugGraphics(ground) {
    // Help text that has a "fixed" position on the screen
    // TODO make this displayer :P
    this.add
      .text(16, 16, 'Arrow keys to move\nPress "D" to show hitboxes', {
        font: "18px monospace",
        fill: "#000000",
        padding: { x: 20, y: 10 },
        backgroundColor: "#ffffff"
      })
      .setScrollFactor(0)
      .setDepth(30);

    // DEBUG RENDERING
    // Debug graphics
    this.input.keyboard.once("keydown_D", event => {
      // Turn on physics debugging to show player's hitbox
      this.physics.world.createDebugGraphic();

      // Create worldLayer collision graphic above the player, but below the help text
      const graphics = this.add
        .graphics()
        .setAlpha(0.75)
        .setDepth(20);
      ground.renderDebug(graphics, {
        tileColor: null, // Color of non-colliding tiles
        collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
        faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
      });
    });
  }
}
