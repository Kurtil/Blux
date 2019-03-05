export default class MainScene extends Phaser.Scene {
  player: Phaser.Physics.Arcade.Sprite;
  cursors: Phaser.Input.Keyboard.CursorKeys;
  speed = 140;
  jumpSoundDelay = 100;
  lastPlayedJumpTime = 0;
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
    this.load.audio("mainTheme", "assets/sounds/mainTheme.wav");
  }

  create() {

    this.sound.play('mainTheme', { volume: 0.1, loop: true });

    this.map = this.make.tilemap({ key: 'map' });

    const tileset = this.map.addTilesetImage("BluxSpriteSheet", "spriteSheet");

    const background = this.map.createStaticLayer("background", tileset);
    const ground = this.map.createStaticLayer("ground", tileset);
    const foreground01 = this.map.createStaticLayer("foreground01", tileset);
    const foreground02 = this.map.createStaticLayer("foreground02", tileset);

    foreground01.setScrollFactor(0.9, 0.95).setDepth(10);
    foreground02.setScrollFactor(0.8, 0.95).setDepth(10);

    // remember that you can play with properties like this :
    ground.setCollisionByProperty({ collides: true });

    const spawnPoint: any = this.map.findObject("objects", obj => obj.name === "spawn");

    this.cameras.main.setZoom(3);

    // create player
    // dynamic by default
    this.player = this.physics.add.sprite(spawnPoint.x, spawnPoint.y - 16, "spriteSheet")
      .setSize(12, 16);
    //.setOffset(0, 45);

    // this.player.setCollideWorldBounds(true);

    // This means when it lands after jumping it will bounce ever so slightly.
    // this.player.setBounce(0.2);
    // collide with the limit of the world
    // this.player.setCollideWorldBounds(true);

    // player.body.setGravityY(300);

    // add collider between player and the platforms group
    ground.setCollision(0)
    this.physics.add.collider(this.player, ground);

    this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
    this.cameras.main.startFollow(this.player);

    // Animations
    this.anims.create({
      key: "walk",
      frames: this.anims.generateFrameNumbers("spriteSheet", { start: 0, end: 11 }),
      frameRate: 10,
      repeat: -1
    });

    this.anims.create({
      key: "idle",
      frames: this.anims.generateFrameNumbers("spriteSheet", { start: 47, end: 48 }),
      frameRate: 2
    });

    this.anims.create({
      key: "jump",
      frames: [{ key: "spriteSheet", frame: 32 }],
      frameRate: 20
    });

    this.anims.create({
      key: "land",
      frames: [{ key: "spriteSheet", frame: 34 }],
      frameRate: 20
    });

    this.anims.create({
      key: "attack",
      frames: this.anims.generateFrameNumbers("spriteSheet", { start: 14, end: 30 }),
      frameRate: 24,
      repeat: 0
    });

    this.anims.create({
      key: "dye",
      frames: this.anims.generateFrameNumbers("spriteSheet", { start: 35, end: 45 }),
      frameRate: 24,
      repeat: 0
    });

    this.sound.add("playerJump");

    this.cursors = this.input.keyboard.createCursorKeys();

    this.setDebugGraphics.call(this, ground);
  }

  update(time) {
    this.player.setVelocityX(0);
    // Controlls
    // TODO implement state machine for player controls and animations
    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-this.speed);
      this.player.setFlipX(true);
      this.player.anims.play("walk", true);
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(this.speed);
      this.player.setFlipX(false);
      this.player.anims.play("walk", true);
    } else if (this.cursors.down.isDown) {
      this.player.anims.play('dye', true);
    } else if (this.cursors.space.isDown) {
      this.player.anims.play('attack', true);
    } else {
      this.player.anims.play("idle", true);
    }
    if (this.cursors.up.isDown && this.player.body.blocked.down) {
      this.player.setVelocityY(-200);
      this.player.anims.play("jump");
      // TODO play only if not already playing
      if (time - this.lastPlayedJumpTime > this.jumpSoundDelay) {
        this.sound.play("playerJump", { volume: 0.2, detune: Math.random() * 50 - 25 });
        this.lastPlayedJumpTime = time;
      }
    }

    // Fly
    if (!this.player.body.blocked.down) {
      if (this.player.body.velocity.y <= 0) {
        this.player.anims.play('jump', true);
      } else {
        this.player.anims.play('land', true)
      }
    }

    // DEAD Logic (every out of map excepted the top)
    if (this.player.x > this.map.width * this.map.tileWidth ||
      this.player.x < 0 ||
      this.player.y > this.map.height * this.map.tileHeight) {

      const cam = this.cameras.main;
      cam.shake(250, 0.005);
      cam.fade(250, 30, 0, 0);

      cam.once("camerafadeoutcomplete", () => {
        this.sound.stopAll();
        this.scene.start('startMenuScene');
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
