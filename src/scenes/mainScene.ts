import spriteSheetConfig from "../../assets/spriteSheets/spriteSheet.json";
import Player from "../entities/player/player";
import MainSceneHUD from "./mainSceneHUD";
import EnemyFactory from "../utils/enemyFactory";
import GemFactory from "../utils/gemFactory";
import Gem from "../entities/gem";
import FireBall from "../entities/fireBall";
import PlayerShot from "../entities/player/playerShot";
import Enemy from "../entities/enemy";
import Heart from "../entities/heart";
import ExtraLife from "../entities/extraLife";
import MainScenePause from "./mainScenePause";

export default class MainScene extends Phaser.Scene {

  DEBUG = false;

  player: Player = null;
  map: Phaser.Tilemaps.Tilemap = null;
  enemies: Phaser.GameObjects.Sprite[] = null;
  ground: Phaser.Tilemaps.StaticTilemapLayer = null;
  heartGroup: Phaser.GameObjects.Group = null;
  extraLifeGroup: Phaser.GameObjects.Group = null;

  constructor() {
    super({
      key: "mainScene"
    });
  }

  create() {

    this.sys.sound.volume = 0.2;
    // this.cameras.main.roundPixels = true;

    this.sound.play("mainTheme", { volume: 0.25, loop: true });

    // Map management
    this.map = this.make.tilemap({ key: "map" });
    const tileset = this.map.addTilesetImage("BluxSpriteSheet", spriteSheetConfig.name);

    this.map.createStaticLayer("background", tileset);
    this.map.createStaticLayer("foreground01", tileset).setScrollFactor(0.9, 0.95).setDepth(10);
    this.map.createStaticLayer("foreground02", tileset).setScrollFactor(0.8, 0.95).setDepth(10);
    this.ground = this.map.createStaticLayer("ground", tileset);
    this.ground.setCollisionByProperty({ collides: true });

    const spawnPoint: any = this.map.findObject("spawn", obj => obj.name === "spawn");
    const signs = this.map.createFromObjects("signs", 95, { key: spriteSheetConfig.name, frame: 94 })
      .map(sign => (this.physics.world.enableBody(sign), (sign.body as Phaser.Physics.Arcade.Body)
        .setAllowGravity(false), sign));

    // Entities creations
    this.player = new Player(this, spawnPoint.x, spawnPoint.y, spriteSheetConfig.name);
    const shotGroup = this.player.shotGroup;
    const gems = (new GemFactory(this, spriteSheetConfig.name)).generateGemsFromMap(this.map);
    const enemyFactory = new EnemyFactory(this, spriteSheetConfig.name);
    this.enemies = enemyFactory.generateEnemiesFromMap(this.map);

    // Enable HUD and pause
    this.scene.add("mainSceneHUD", MainSceneHUD, true, { player: this.player });
    this.scene.add("mainScenePause", MainScenePause, false);
    this.events.once("shutdown", () => {
      this.scene.remove("mainSceneHUD");
      this.scene.remove("mainScenePause");
    });

    // Heart management TOTO refacto like global pick up factory
    this.heartGroup = this.add.group();
    this.extraLifeGroup = this.add.group();

    // Physic management
    this.physics.add.collider(this.player, this.ground);
    this.physics.add.collider(this.player, this.enemies);
    this.physics.add.overlap(this.player, enemyFactory.getEnemiesShotGroup(),
      (player: Player, fireball: FireBall) => {
        player.onHit();
        (this.scene.get("mainSceneHUD") as MainSceneHUD).updatePlayerLife(player.life, player.maxLife);
        fireball.hit();
      });
    this.physics.add.collider(enemyFactory.getEnemiesShotGroup(), this.ground,
      (fireball: FireBall) => fireball.hit());

    this.physics.add.overlap(signs, this.player, sign =>
      // TODO why key message does not work here ???
      (this.scene.get("mainSceneHUD") as MainSceneHUD).displayInformations(sign.data.get("0").value));

    this.physics.add.overlap(this.player, gems, (player, gem: Gem) => {
      gem.onPickedUp();
      player.setData("score", player.getData("score") + 1);
      (this.scene.get("mainSceneHUD") as MainSceneHUD).updatePlayerScore(player.getData("score"));
    });

    this.physics.add.collider(shotGroup, this.ground, (shot: PlayerShot) => shot.hit());
    this.physics.add.overlap(shotGroup, enemyFactory.getEnemiesShotGroup(),
      (playerShot: PlayerShot, fireBall: FireBall) => {
        fireBall.hit();
        playerShot.hit();
      });
    this.physics.add.overlap(shotGroup, this.enemies, (shot: PlayerShot, enemy: Enemy) => {
      shot.hit();
      enemy.hit();
    });

    this.physics.add.overlap(this.player, this.heartGroup, (player: Player, heart: Heart) => {
      if (player.pickLife()) {
        heart.onPickedUp();
        (this.scene.get("mainSceneHUD") as MainSceneHUD).updatePlayerLife(player.life, player.maxLife);
      }
    });

    this.physics.add.overlap(this.player, this.extraLifeGroup, (player: Player, extraLife: ExtraLife) => {
      player.maxLife++;
      extraLife.onPickedUp();
      (this.scene.get("mainSceneHUD") as MainSceneHUD).updatePlayerLife(player.life, player.maxLife);
    });

    // Camera management
    this.cameras.main.setZoom(3);
    this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
    this.cameras.main.startFollow(this.player);
    // TODO camera fadeout complete will always lead to death... fix it
    this.cameras.main.once("camerafadeoutcomplete", () => {
      this.sound.stopAll();
      this.scene.start("dieScene");
    });

    this.setDebugGraphics(this.DEBUG);

    // pause key
    this.input.keyboard.on("keydown-P", () => {
      this.pause();
    });
  }

  update(time) {
    this.enemies.forEach(enemy => enemy.update(time));
    this.player.update(time);

    if (this.player.getData("score") === 10) {
      this.sound.stopAll();
      this.scene.start("winScene");
    }

    if (this.player.getData("isDead") === true) {
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
    };
    this.input.keyboard.on("keydown_D", toggleDebugGraphics);
  }

  private pause() {
    this.scene.pause("mainSceneHUD");
    this.scene.pause();
    this.sound.pauseAll();
    this.scene.launch("mainScenePause");
  }
}
