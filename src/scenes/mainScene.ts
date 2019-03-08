import Player from "../Entities/player";
import MainSceneHUD from "./mainSceneHUD";

export default class MainScene extends Phaser.Scene {

  player: Player;
  map: Phaser.Tilemaps.Tilemap;

  constructor() {
    super({
      key: "mainScene"
    });
  }

  create() {

    // Sound management
    this.sound.play('mainTheme', { volume: 0.05, loop: true });
    this.sound.add("playerJump");
    this.sound.add("playerDie");
    this.sound.add("playerAttack");
    this.sound.add("victory", { volume: 0.1 });

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

    // Enable HUD
    this.scene.launch('mainSceneHUD'); // score may be passed here as object : { playerScore: X }
    this.events.on('shutdown', () => {
      this.events.removeListener('shutdown');
      this.scene.stop('mainSceneHUD');
    });

    // Gems management
    const gems = this.generateGems();

    this.physics.add.collider(gems, ground);

    // create player
    this.player = new Player(this, spawnPoint.x, spawnPoint.y, "spriteSheet");

    // add collider between player and the platforms group
    this.physics.add.collider(this.player, ground);
    // add collider between player and gems
    this.physics.add.overlap(this.player, gems, (player, gem) => {
      gem.destroy();
      if ((<Phaser.GameObjects.Sprite>gem).scaleX === 2) {
        // darker sound for big gem
        // TODO find a better way to filter
        this.sound.play('gemPickedUp', { volume: 0.2, detune: -600 });
      } else {
        this.sound.play('gemPickedUp', { volume: 0.2 });
      }
      this.player.setData('score', this.player.getData('score') + 1);
      (this.scene.get('mainSceneHUD') as MainSceneHUD).updatePlayerScore(this.player.getData('score'));
    });

    // Camera management
    this.cameras.main.setZoom(3);
    // this.cameras.main.centerOn(0, 0);

    this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
    this.cameras.main.startFollow(this.player);

    this.setDebugGraphics.call(this, ground);

    // TODO camera fadeout complete will always lead to death... fix it
    this.cameras.main.once("camerafadeoutcomplete", () => {
      this.sound.stopAll();
      this.scene.start('dieScene');
    });
  }

  update(time) {
    this.player.update(time);

    if (this.player.getData('score') === 10) {
      this.sound.stopAll();
      this.scene.start('winScene');
    }

    if (this.player.getData('isDead') === true) {
      const cam = this.cameras.main;
      cam.shake(250, 0.005);
      cam.fade(250, 30, 0, 0);
    }
  }

  private displayHUD(): Phaser.GameObjects.Text {
    // TODO due to the camera zoom, the position seems weird... improve it with wisdom :P
    const hud = this.add.text(270, 203, '0 / 10 gems', {
      font: "8px monospace bold",
      fill: "#ffffff",
    })
      .setDepth(30)
      .setScrollFactor(0);
    return hud;
  }

  private generateGems() {
    const gems = this.map.createFromObjects('objects', 50, { key: 'spriteSheet', frame: 49 });

    this.anims.create({
      key: "gem",
      frames: this.anims.generateFrameNumbers("spriteSheet", { start: 49, end: 55 }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.play('gem', gems);

    gems.forEach(gem => {
      this.physics.world.enableBody(gem);
    });

    // createFromObject do not get the scale 2 into account... TODO : chek why and pull request ? :)
    gems.filter(gem => gem.scaleX === 2).forEach(gem => {
      gem.setData('big', true);
      (<Phaser.Physics.Arcade.Body>gem.body).height = 32;
      (<Phaser.Physics.Arcade.Body>gem.body).width = 32;
    });

    return gems;
  }

  private setDebugGraphics(ground) {
    // Help text that has a "fixed" position on the screen
    // TODO make this displayer :P
    // this.add
    //   .text(16, 16, 'Arrow keys to move\nPress "D" to show hitboxes', {
    //     font: "18px monospace",
    //     fill: "#000000",
    //     padding: { x: 20, y: 10 },
    //     backgroundColor: "#ffffff"
    //   })
    //   .setScrollFactor(0)
    //   .setDepth(30);

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
