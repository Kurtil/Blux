import Player from "../entities/player/player";
import MainSceneHUD from "./mainSceneHUD";
import EnemyFactory from "../utils/enemyFactory";
import GemFactory from "../utils/gemFactory";
import Gem from "../entities/gem";
import FireBall from "../entities/fireBall";
import PlayerShot from "../entities/player/playerShot";
import Enemy from "../entities/enemy";

export default class MainScene extends Phaser.Scene {

  DEBUG = false;

  player: Player = null;
  map: Phaser.Tilemaps.Tilemap = null;
  enemies: Phaser.GameObjects.Sprite[] = null;
  ground: Phaser.Tilemaps.StaticTilemapLayer = null;

  constructor() {
    super({
      key: "mainScene"
    });
  }

  create() {

    this.sound.play('mainTheme', { volume: 0.05, loop: true });

    // Map management
    this.map = this.make.tilemap({ key: 'map' });
    const tileset = this.map.addTilesetImage("BluxSpriteSheet", "spriteSheet");

    this.map.createStaticLayer("background", tileset);
    this.map.createStaticLayer("foreground01", tileset).setScrollFactor(0.9, 0.95).setDepth(10);
    this.map.createStaticLayer("foreground02", tileset).setScrollFactor(0.8, 0.95).setDepth(10);;
    this.ground = this.map.createStaticLayer("ground", tileset);
    this.ground.setCollisionByProperty({ collides: true });

    const spawnPoint: any = this.map.findObject("spawn", obj => obj.name === "spawn");
    const signs = this.map.createFromObjects('signs', 95, { key: 'spriteSheet', frame: 94 })
      .map(sign => (this.physics.world.enableBody(sign), (sign.body as Phaser.Physics.Arcade.Body).setAllowGravity(false), sign));

    // Enable HUD
    this.scene.add('mainSceneHUD', MainSceneHUD, true); // score may be passed here as object : { playerScore: X }
    this.events.once('shutdown', () => {
      this.scene.remove('mainSceneHUD');
    });

    // Entities creations
    this.player = new Player(this, spawnPoint.x, spawnPoint.y, "spriteSheet");
    const shotGroup = this.player.shotGroup;
    const gems = (new GemFactory(this, 'spriteSheet')).generateGemsFromMap(this.map);
    const enemyFactory = new EnemyFactory(this, 'spriteSheet');
    this.enemies = enemyFactory.generateEnemiesFromMap(this.map);

    // Physic management
    this.physics.add.collider(this.player, this.ground);
    this.physics.add.collider(this.player, this.enemies);
    this.physics.add.overlap(this.player, enemyFactory.getEnemiesShotGroup(), (player: Player, fireball: FireBall) => {
      player.onHit();
      (this.scene.get('mainSceneHUD') as MainSceneHUD).updatePlayerLife(player.life);
      fireball.hit();
    });
    this.physics.add.collider(enemyFactory.getEnemiesShotGroup(), this.ground, (fireball: FireBall) => fireball.hit());

    this.physics.add.overlap(signs, this.player, sign =>
      // TODO why key message does not work here ???
      (this.scene.get('mainSceneHUD') as MainSceneHUD).displayInformations(sign.data.get('0').value));

    this.physics.add.overlap(this.player, gems, (player, gem: Gem) => {
      gem.onPickedUp();
      player.setData('score', player.getData('score') + 1);
      (this.scene.get('mainSceneHUD') as MainSceneHUD).updatePlayerScore(player.getData('score'));
    });

    this.physics.add.collider(shotGroup, this.ground, (shot: PlayerShot) => shot.hit());
    this.physics.add.overlap(shotGroup, enemyFactory.getEnemiesShotGroup(), (playerShot: PlayerShot, fireBall: FireBall) => {
      fireBall.hit();
      playerShot.hit();
    });
    this.physics.add.overlap(shotGroup, this.enemies, (shot: PlayerShot, enemy: Enemy) => {
      shot.hit();
      enemy.hit();
    });

    // Camera management
    this.cameras.main.setZoom(3);
    this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
    this.cameras.main.startFollow(this.player);
    // TODO camera fadeout complete will always lead to death... fix it
    this.cameras.main.once("camerafadeoutcomplete", () => {
      this.sound.stopAll();
      this.scene.start('dieScene');
    });

    this.setDebugGraphics(this.DEBUG);
  }

  update(time) {
    this.enemies.forEach(enemy => enemy.update(time));
    this.player.update(time);

    if (this.player.getData('score') === 10) {
      this.sound.stopAll();
      this.scene.start('winScene');
    }

    if (this.player.getData('isDead') === true) {
      this.cameras.main.fade(250, 30, 0, 0);
    }
  }

  private setDebugGraphics(displayed: boolean) {
    let graphics;
    const toggleDebugGraphics = () => {
      if (!displayed) {
        graphics = this.add
          .graphics()
          .setAlpha(0.75)
          .setDepth(20);
        this.physics.world.createDebugGraphic();
        (this.ground as any).renderDebug(graphics, {
          tileColor: null, // Color of non-colliding tiles
          collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255),
          faceColor: new Phaser.Display.Color(40, 39, 37, 255)
        });
      } else {
        this.physics.world.debugGraphic.destroy();
        graphics.destroy();
      }
      displayed = !displayed;
    }
    this.input.keyboard.on("keydown_D", toggleDebugGraphics);
  }
}
