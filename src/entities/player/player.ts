import spriteSheetConfig from "../../../assets/spriteSheets/spriteSheet.json";
import Entity from "../entity";
import MainScene from "../../scenes/mainScene";
import State from "./playerStates/playerState";
import IdlePlayerState from "./playerStates/idlePlayerState";
import PlayerCommands from "./playerCommands";
import DiePLayerState from "./playerStates/diePlayerState";
import Sword from "../swords/sword";
import AirPlayerState from "./playerStates/airPlayerState";
import RunPlayerState from "./playerStates/runPlayerState";
import MeleeAttackPlayerState from "./playerStates/meleeAttackPlayerState";
import RangedAttackPLayerState from "./playerStates/rangedAttackPlayerState";
import PlayerShot from "./playerShot";

export default class Player extends Entity {

    scene: Phaser.Scene = null;

    states = {
        idle: new IdlePlayerState(this),
        run: new RunPlayerState(this),
        air: new AirPlayerState(this),
        meleeAttack: new MeleeAttackPlayerState(this),
        rangedAttack: new RangedAttackPLayerState(this),
        die: new DiePLayerState(this),
    };

    currentState: State = null;

    speed = 140;
    airSpeed = 120;

    jumpPower = 200;
    jumpDelay = 200;
    lastJumpTime = 0;

    _isDead = false;
    get isDead() {
        return this._isDead;
    }
    set isDead(value) {
        if (value) this.scene.cameras.main.shake(250, 0.005);
        this._isDead = value;
    }

    get dying() { return this.currentState === this.states.die; }

    health = 3;
    maxHealth = 3;

    invincible = false;
    hitLimitTime = 400;

    score = 0; // TODO score may be externalized

    rangedWeapon = PlayerShot;
    shotGroup: Phaser.GameObjects.Group = null;
    shotPower = 1;
    shotSpeed = 200;

    meleeWeapon: Sword = null;
    get meleeAttacking() { return this.currentState === this.states.meleeAttack; }
    meleeAttackAvailable = true;
    meleeAttackSpeed = 300;
    lastMeleeAttack: number = null;

    constructor(scene: MainScene, x, y, key) {
        super(scene, x, y, key, "Player");
        this.scene = scene;
        this.shotGroup = this.scene.add.group();

        this.createAnimations();

        this.setSize(10, 15).setOffset(3, 1).setDragX(100).setDepth(1);

        this.currentState = this.states.idle;
    }

    update(time: number, commandes: PlayerCommands) {
        this.isDead = this.isOutOfBounds();
        if (this.isDead) return;

        this.meleeAttackAvailable = time - this.lastMeleeAttack > this.meleeAttackSpeed;
        if (!this.meleeAttacking && this.meleeWeapon) {
            this.updadeMeleeWeapon(this.x - (this.flipX ? -2 : 2), this.y - 16, this.flipX, 135);
        }

        if (this.dying) return;

        if (this.health <= 0) {
            this.currentState.nextState(this.states.die);
        } else {
            this.currentState.update(time);
            this.currentState.handleUserInputs(this.parseUserInput(commandes), time);
        }
    }

    setAndInitCurrentState(state: State): void {
        this.currentState = state;
        this.currentState.init();
    }

    onHit(power = 1) {
        if (!this.dying && this.affect({ health: -power })) {
            this.scene.cameras.main.shake(100, 0.001);
            this.scene.sound.play("playerHit", { volume: 0.5 });
            if (this.health > 0) {
                this.setTemporaryInvincibility(this.hitLimitTime);
            }
        }
    }

    /**
     * The facade used to affect the player with effects
    * @param effect the effect that will (probably) affect the player
    * @returns true if the effect affected the player, false if no effect
    */
    affect(effect): boolean {
        const { health, maxHealth, score, weapon } = effect;
        let affected = false;
        if (health) {
            affected = this.updateHealth(health);
        }
        if (score) {
            this.score += score;
            affected = true;
        }
        if (maxHealth) {
            this.updateMaxHealth(maxHealth);
            affected = true;
        }
        if (weapon) {
            affected = this.equip(new weapon(this.scene, this.x, this.y, spriteSheetConfig.name));
        }
        return affected;
    }

    updadeMeleeWeapon(x, y, flipX, angle) {
        this.meleeWeapon.setX(x);
        this.meleeWeapon.setY(y);
        this.meleeWeapon.setFlipX(flipX);
        this.meleeWeapon.setAngle(angle);
    }

    /**
     * Jump if the previous jump was not to close in time
     * @param time the current time
     * @return true if the jump was performed
     */
    jump(time): boolean {
        let jumped = false;
        if (this.jumpAvailable(time)) {
            this.setVelocityY(-this.jumpPower);
            this.scene.sound.play("playerJump", { detune: Math.random() * 50 - 25 });
            this.lastJumpTime = time;
            jumped = true;
        }
        return jumped;
    }

    private jumpAvailable(time: number): boolean {
        return time - this.lastJumpTime > this.jumpDelay;
    }

    private setTemporaryInvincibility(duration: number) {
        this.invincible = true;
        const repeatTime = 3;
        this.scene.tweens.add({
            targets: this,
            duration: duration / repeatTime,
            alpha: 0,
            onComplete() {
                this.invincible = false;
                this.alpha = 1;
            },
            onCompleteScope: this,
            repeat: repeatTime
        });
    }

    /**
     * Update health of the player if possible
     * @param amount the amount to change
     * @return true if health changed
     */
    private updateHealth(amount): boolean {
        let healthUpdated = false;
        if (amount > 0 && this.health < this.maxHealth) {
            this.health = Math.min(this.health + amount, this.maxHealth);
            healthUpdated = true;
        } else if (amount < 0 && !this.invincible) {
            this.health += amount;
            healthUpdated = true;
        }
        return healthUpdated;
    }

    private updateMaxHealth(maxHealthChange) {
        if (maxHealthChange > 0) {
            this.maxHealth += maxHealthChange;
        } else if (maxHealthChange < 0) {
            this.maxHealth += maxHealthChange;
            if (this.health > this.maxHealth) {
                this.health = this.maxHealth;
            }
        }
    }

    private equip(weapon): boolean {
        let equiped = false;
        if (true) { // TODO if player want to equipe. ex : lower power sword... ?
            if (this.meleeWeapon) {
                this.meleeWeapon.destroy();
            }
            this.meleeWeapon = weapon;
            equiped = true;
        }
        return equiped;
    }

    private isOutOfBounds(): boolean {
        return this.x > (<MainScene>this.scene).map.width * (<MainScene>this.scene).map.tileWidth ||
            this.x < 0 ||
            this.y > (<MainScene>this.scene).map.height * (<MainScene>this.scene).map.tileHeight;
    }

    private parseUserInput(commandes: PlayerCommands): PlayerCommands {
        return {
            ...commandes,
            meleeAttack: commandes.meleeAttack && !!this.meleeWeapon,
            rangedAttack: commandes.rangedAttack && !!this.rangedWeapon,
        };
    }

    private createAnimations() {
        // Animations
        this.scene.anims.create({
            key: "walk",
            frames: this.scene.anims.generateFrameNumbers(spriteSheetConfig.name, { start: 0, end: 11 }),
            frameRate: 20,
            repeat: -1
        });
        this.scene.anims.create({
            key: "idle",
            frames: this.scene.anims.generateFrameNumbers(spriteSheetConfig.name, { start: 12, end: 13 }),
            frameRate: 2,
            repeat: -1
        });
        this.scene.anims.create({
            key: "jump",
            frames: [{ key: spriteSheetConfig.name, frame: 15 }],
            frameRate: 20
        });
        this.scene.anims.create({
            key: "land",
            frames: [{ key: spriteSheetConfig.name, frame: 14 }],
            frameRate: 20
        });
        this.scene.anims.create({
            key: "attack",
            frames: this.scene.anims.generateFrameNumbers(spriteSheetConfig.name, { start: 20, end: 36 }),
            frameRate: 36,
            repeat: -1
        });
        this.scene.anims.create({
            key: "die",
            frames: this.scene.anims.generateFrameNumbers(spriteSheetConfig.name, { start: 40, end: 50 }),
            frameRate: 24,
            repeat: 0
        });
        this.scene.anims.create({
            key: "playerShot",
            frames: this.scene.anims.generateFrameNumbers(spriteSheetConfig.name, { start: 140, end: 147 }),
            frameRate: 24,
            repeat: -1
        });
        this.scene.anims.create({
            key: "playerShotExplodes",
            frames: this.scene.anims.generateFrameNumbers(spriteSheetConfig.name, { start: 150, end: 163 }),
            frameRate: 50,
        });
        this.scene.anims.create({
            key: "meleeAttack",
            frames: this.scene.anims.generateFrameNumbers(spriteSheetConfig.name,
                {
                    start: spriteSheetConfig.content.player.meleeAttack.from,
                    end: spriteSheetConfig.content.player.meleeAttack.to
                }),
            frameRate: 24,
        });
    }
}
