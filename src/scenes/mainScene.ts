import spriteSheetConfig from "../../assets/spriteSheets/spriteSheet.json";
import Player from "../entities/player/player";
import MainSceneHUD from "./mainSceneHUD";
import EnemyFactory from "../utils/enemyFactory";
import GemFactory from "../utils/gemFactory";
import FireBall from "../entities/fireBall";
import PlayerShot from "../entities/player/playerShot";
import Enemy from "../entities/enemies/enemy";
import MainScenePause from "./mainScenePause";
import PickUp from "../entities/pickup";
import SwordPickUp from "../entities/swords/swordPickUp";
import Sword from "../entities/swords/sword";
import ForrestSword from "../entities/swords/forrestSword";
import HellSword from "../entities/swords/hellSword";
import StoneSword from "../entities/swords/stoneSword";
import PlayerCommands from "../entities/player/playerCommands.js";

export default class MainScene extends Phaser.Scene {

    DEBUG = false;

    player: Player = null;
    cursors: Phaser.Input.Keyboard.CursorKeys = null;
    map: Phaser.Tilemaps.Tilemap = null;
    enemies: Phaser.GameObjects.Sprite[] = null;
    ground: Phaser.Tilemaps.StaticTilemapLayer = null;
    pickupGroup: Phaser.GameObjects.Group = null;
    hitScore = 10;
    nextScene: string;
    sceneEnding: boolean;

    constructor() {
        super({
            key: "mainScene"
        });
    }

    create() {

        this.sceneEnding = false;

        this.sys.sound.volume = 0.2;
        // this.cameras.main.roundPixels = true;

        this.sound.play("mainTheme", { volume: 0.20, loop: true });

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
        const enemyFactory = new EnemyFactory(this, spriteSheetConfig.name);
        this.enemies = enemyFactory.generateEnemiesFromMap(this.map);

        // Enable HUD and pause
        this.scene.add("mainSceneHUD", MainSceneHUD, true,
            { playerHealth: this.player.health, playerMaxHealth: this.player.maxHealth });
        this.scene.add("mainScenePause", MainScenePause, false);
        this.events.once("shutdown", () => {
            this.scene.remove("mainSceneHUD");
            this.scene.remove("mainScenePause");
        });

        // Pickup management
        this.pickupGroup = this.add.group();
        this.pickupGroup.addMultiple((new GemFactory(this, spriteSheetConfig.name)).generateGemsFromMap(this.map));
        const stoneSword: any = this.map.findObject("weapons", obj => obj.name === "stoneSword");
        const forrestSword: any = this.map.findObject("weapons", obj => obj.name === "forrestSword");
        const hellSword: any = this.map.findObject("weapons", obj => obj.name === "hellSword");
        this.pickupGroup.addMultiple([
            new SwordPickUp(this, stoneSword.x + 8, stoneSword.y - 8, spriteSheetConfig.name,
                spriteSheetConfig.content.stoneSword.frame, StoneSword),
            new SwordPickUp(this, forrestSword.x + 8, forrestSword.y - 8, spriteSheetConfig.name,
                spriteSheetConfig.content.forrestSword.frame, ForrestSword),
            new SwordPickUp(this, hellSword.x + 8, hellSword.y - 8, spriteSheetConfig.name,
                spriteSheetConfig.content.hellSword.frame, HellSword)]);

        // Physic management
        this.physics.add.collider(this.player, this.ground);
        this.physics.add.collider(this.enemies, this.ground);
        this.physics.add.collider(this.player, this.enemies);
        this.physics.add.overlap(this.player, enemyFactory.getEnemiesShotGroup(),
            (player: Player, fireball: FireBall) => {
                player.onHit();
                this.updateHUD();
                fireball.hit();
            });
        this.physics.add.collider(enemyFactory.getEnemiesShotGroup(), this.ground,
            (fireball: FireBall) => fireball.hit());

        this.physics.add.overlap(signs, this.player, sign =>
            // TODO why key message does not work here ???
            (this.scene.get("mainSceneHUD") as MainSceneHUD).displayInformations(sign.data.get("0").value));

        this.physics.add.overlap(this.player, this.pickupGroup, (player: Player, pickup: PickUp | any) => {
            if (player.affect(pickup.getEffect())) {
                pickup.onPickedUp();
                this.updateHUD();
            }
        });

        this.physics.add.collider(shotGroup, this.ground, (shot: PlayerShot) => shot.hit());
        this.physics.add.collider(shotGroup, enemyFactory.getEnemiesShotGroup(),
            (playerShot: PlayerShot, fireBall: FireBall) => {
                fireBall.hit();
                playerShot.hit();
            });
        this.physics.add.collider(shotGroup, this.enemies, (shot: PlayerShot, enemy: Enemy) => {
            enemy.hit(shot.hit());
        });

        // Camera management
        this.cameras.main.setZoom(3);
        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        this.cameras.main.startFollow(this.player);
        this.cameras.main.once("camerafadeoutcomplete", () => {
            this.sound.stopAll();
            this.scene.start(this.nextScene);
        });

        this.setDebugGraphics(this.DEBUG);

        // keys
        this.cursors = this.input.keyboard.createCursorKeys();
        this.input.keyboard.on("keydown-P", () => {
            this.pause();
        });
    }

    update(time) {
        this.enemies.forEach(enemy => enemy.update(time));
        if (!this.sceneEnding) {
            if (this.player.isDead) {
                this.onPlayerDead();
                this.sceneEnding = true;
            } else {
                this.player.update(time, this.parseUserInput(this.cursors));

                if (this.player.score === this.hitScore) {
                    this.onWin();
                    this.sceneEnding = true;
                }
            }
        }
    }

    updateHUD(): any {
        (this.scene.get("mainSceneHUD") as MainSceneHUD).updatePlayerScore(this.player.score);
        (this.scene.get("mainSceneHUD") as MainSceneHUD).updatePlayerLife(this.player.health, this.player.maxHealth);
    }

    private parseUserInput(cursors: Phaser.Input.Keyboard.CursorKeys): PlayerCommands {
        return {
            up: cursors.up.isDown,
            right: cursors.right.isDown,
            left: cursors.left.isDown,
            meleeAttack: cursors.space.isDown,
            rangedAttack: cursors.shift.isDown,
        };
    }

    private onWin() {
        // TODO player should be killed during the fade out... find a way to avoid that.
        this.nextScene = "winScene";
        this.cameras.main.fade(250, 30, 0, 0);
    }

    private onPlayerDead() {
        this.nextScene = "dieScene";
        this.cameras.main.fade(250, 30, 0, 0);
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
