import Entity from "../entity";
import MainScene from "../../scenes/mainScene";
import State from "./playerStates/playerState";
import IdlePlayerState from "./playerStates/idlePlayerState";
import { RIGHT } from "phaser";
import PlayerCommands from "./playerCommands";
import DiePLayerState from "./playerStates/diePlayerState";

export default class Player extends Entity {

    cursors: Phaser.Input.Keyboard.CursorKeys;
    jumpDelay = 200;
    lastJumpTime = 0;
    currentState: State;
    killed = false;
    hitSoundAvailable = true;
    canJump = true;

    constructor(scene: MainScene, x, y, key) {
        super(scene, x, y, key, "Player");

        this.setSize(12, 15).setOffset(2, 1);
        this.setData("speed", 140);
        this.setData('isDead', false);
        this.setData('score', 0);

        this.cursors = this.scene.input.keyboard.createCursorKeys();

        // Animations management
        this.createAnimations();

        this.currentState = new IdlePlayerState(this);
    }

    update(time: number) {
        this.currentState.update(this.handleUserInput(this.cursors), time);

        if (this.isOutOfBounds()) this.onDead();
    }

    jump(time) {
        if (time - this.lastJumpTime > this.jumpDelay) {
            this.setVelocityY(-200);
            this.scene.sound.play("playerJump", { volume: 0.2, detune: Math.random() * 50 - 25 });
            this.lastJumpTime = time;
            return true;
        } else {
            return false;
        }
    }

    setCurrentState(state: State): any {
        this.currentState = state;
    }

    onHit() {
        this.scene.cameras.main.shake(100, 0.001);
        if (this.hitSoundAvailable) {
            this.scene.sound.play('playerHit', { volume: 0.15 });
            this.hitSoundAvailable = false;
        }
        this.scene.time.addEvent({
            callback: () => this.hitSoundAvailable = true,
            delay: 1000
        });
        this.onKilled();
    }

    attack(): any {
        this.scene.sound.play("playerAttack", { volume: 0.2, detune: Math.random() * 50 - 25 });
    }

    onDead(): any {
        this.scene.cameras.main.shake(250, 0.005);
        this.setData('isDead', true);
    }

    private isOutOfBounds(): any {
        return this.x > (<MainScene>this.scene).map.width * (<MainScene>this.scene).map.tileWidth ||
            this.x < 0 ||
            this.y > (<MainScene>this.scene).map.height * (<MainScene>this.scene).map.tileHeight;
    }

    private onKilled() {
        // can be killed only one time :) TODO : do better
        if (!this.killed) this.setCurrentState(new DiePLayerState(this));
        this.killed = true;
    }

    private handleUserInput(cursors): PlayerCommands {
        return {
            up: cursors.up.isDown,
            right: cursors.right.isDown,
            left: cursors.left.isDown,
            attack: cursors.space.isDown
        };
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
            frames: this.scene.anims.generateFrameNumbers("spriteSheet", { start: 12, end: 13 }),
            frameRate: 2,
            repeat: -1
        });
        this.scene.anims.create({
            key: "jump",
            frames: [{ key: "spriteSheet", frame: 15 }],
            frameRate: 20
        });
        this.scene.anims.create({
            key: "land",
            frames: [{ key: "spriteSheet", frame: 14 }],
            frameRate: 20
        });
        this.scene.anims.create({
            key: "attack",
            frames: this.scene.anims.generateFrameNumbers("spriteSheet", { start: 20, end: 36 }),
            frameRate: 24,
            repeat: 0
        });
        this.scene.anims.create({
            key: "die",
            frames: this.scene.anims.generateFrameNumbers("spriteSheet", { start: 40, end: 50 }),
            frameRate: 24,
            repeat: 0
        });
    }
}
