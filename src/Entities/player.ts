import Entity from "./entity";
import MainScene from "../scenes/mainScene";

export default class Player extends Entity {

    cursors: Phaser.Input.Keyboard.CursorKeys;
    jumpSoundDelay = 100;
    lastPlayedJumpTime = 0;

    constructor(scene: MainScene, x, y, key) {
        super(scene, x, y, key, "Player");

        this.setSize(12, 16).setOffset(2, 0);
        this.setData("speed", 140);
        this.setData('isDead', false);
        this.setData('score', 0);

        // this.setBounce(0.2);

        // TODO understand why the following cannot be in the create function
        this.cursors = this.scene.input.keyboard.createCursorKeys();

        // Animations management
        this.createAnimations();
        this.on('animationcomplete-dye', (animation, frame) => {
            if (frame.isLast) this.setData('isDead', true);
        });
        this.on('animationupdate-attack', (animation, frame) => {
            if (frame.textureFrame === 26) this.scene.sound.play("playerAttack", { volume: 0.2, detune: Math.random() * 50 - 25 });;
        });
    }

    update(time: number) {
        this.setVelocityX(0);
        // Controlls
        // TODO implement state machine for player controls and animations
        if (this.getData('isDead') === false) {
            if (this.cursors.left.isDown) {
                this.setVelocityX(-this.getData('speed'));
                this.setFlipX(true);
                this.anims.play("walk", true);
            } else if (this.cursors.right.isDown) {
                this.setVelocityX(this.getData('speed'));
                this.setFlipX(false);
                this.anims.play("walk", true);
            } else if (this.cursors.down.isDown) {
                this.anims.play('dye', true);
            } else if (this.cursors.space.isDown) {
                this.anims.play('attack', true);
            } else {
                this.anims.play("idle", true);
            }
            if (this.cursors.up.isDown && this.body.blocked.down) {
                this.setVelocityY(-200);
                this.anims.play("jump");
                // TODO play only if not already playing
                if (time - this.lastPlayedJumpTime > this.jumpSoundDelay) {
                    this.scene.sound.play("playerJump", { volume: 0.2, detune: Math.random() * 50 - 25 });
                    this.lastPlayedJumpTime = time;
                }
            }

            // Fly
            if (!this.body.blocked.down) {
                if (this.body.velocity.y <= 0) {
                    this.anims.play('jump', true);
                } else {
                    this.anims.play('land', true)
                }
            }
        }

        // DEAD Logic (every out of map excepted the top)
        if (this.x > (<MainScene>this.scene).map.width * (<MainScene>this.scene).map.tileWidth ||
            this.x < 0 ||
            this.y > (<MainScene>this.scene).map.height * (<MainScene>this.scene).map.tileHeight) {
            this.setData('isDead', true);
        }
    }

    private createAnimations() {
        // Animations
        this.scene.anims.create({
            key: "walk",
            frames: this.scene.anims.generateFrameNumbers("spriteSheet", { start: 0, end: 11 }),
            frameRate: 20,
            repeat: -1
        });
        this.scene.anims.create({
            key: "idle",
            frames: this.scene.anims.generateFrameNumbers("spriteSheet", { start: 47, end: 48 }),
            frameRate: 2
        });
        this.scene.anims.create({
            key: "jump",
            frames: [{ key: "spriteSheet", frame: 32 }],
            frameRate: 20
        });
        this.scene.anims.create({
            key: "land",
            frames: [{ key: "spriteSheet", frame: 34 }],
            frameRate: 20
        });
        this.scene.anims.create({
            key: "attack",
            frames: this.scene.anims.generateFrameNumbers("spriteSheet", { start: 14, end: 30 }),
            frameRate: 24,
            repeat: 0
        });
        this.scene.anims.create({
            key: "dye",
            frames: this.scene.anims.generateFrameNumbers("spriteSheet", { start: 35, end: 45 }),
            frameRate: 24,
            repeat: 0
        });
    }
}