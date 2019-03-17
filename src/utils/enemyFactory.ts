import Enemy from "../entities/enemies/enemy";
import MainScene from "../scenes/mainScene";
import SpiderDog from "../entities/enemies/spiderDog/spiderDog";
import spriteSheetConfig from "../../assets/spriteSheets/spriteSheet.json";

export default class EnemyFactory {

    scene: Phaser.Scene = null;

    /**
     * The group the enemies shots will be in
     */
    shotGroup: Phaser.GameObjects.Group;

    /**
     * The key to the texture
     */
    textureKey: string = null;

    /**
     * @param scene the scene the factory belongs to
     * @param textureKey the spriteSheet key for textures
     */
    constructor(scene: Phaser.Scene, textureKey: string) {
        this.scene = scene;
        this.textureKey = textureKey;
        this.createAnimations();
        this.shotGroup = this.scene.add.group();
    }

    generateEnemiesFromMap(map): Phaser.GameObjects.Sprite[] {
        const enemies = map.getObjectLayer("enemies").objects.map((enemy: any) => {
            if (enemy.name === "enemy") {
                return new Enemy(this.scene as MainScene, enemy.x + enemy.width / 2, enemy.y - enemy.height / 2,
                    this.textureKey, this.shotGroup);
            } else if (enemy.name = "spiderDog") {
                return new SpiderDog(this.scene as MainScene, enemy.x + enemy.width / 2, enemy.y - enemy.height / 2,
                    this.textureKey, false);
            }
        });
        return enemies;
    }

    getEnemiesShotGroup(): any {
        return this.shotGroup;
    }

    private createAnimations(): any {
        this.scene.anims.create({
            key: "enemy",
            frames: this.scene.anims.generateFrameNumbers(this.textureKey, { start: 51, end: 56 }),
            frameRate: 10,
            repeat: -1,
        });
        this.scene.anims.create({
            key: "fireBall",
            frames: this.scene.anims.generateFrameNumbers(this.textureKey, { start: 76, end: 79 }),
            frameRate: 24,
            repeat: -1,
        });
        this.scene.anims.create({
            key: "fireBallExplodes",
            frames: this.scene.anims.generateFrameNumbers(this.textureKey, { start: 131, end: 137 }),
            frameRate: 15,
        });
        this.scene.anims.create({
            key: "enemyDestroy",
            frames: this.scene.anims.generateFrameNumbers(this.textureKey, { start: 170, end: 177 }),
            frameRate: 15,
        });
        this.scene.anims.create({
            key: "spiderDogWalk",
            frames: this.scene.anims.generateFrameNumbers(this.textureKey,
                {
                    start: spriteSheetConfig.content.spiderDog.walk.from,
                    end: spriteSheetConfig.content.spiderDog.walk.to
                }),
            frameRate: 15,
            repeat: -1,
        });
        this.scene.anims.create({
            key: "spiderDogAttack",
            frames: this.scene.anims.generateFrameNumbers(this.textureKey,
                {
                    start: spriteSheetConfig.content.spiderDog.attack.from,
                    end: spriteSheetConfig.content.spiderDog.attack.to
                }),
            frameRate: 15,
            repeat: -1,
        });
    }
}