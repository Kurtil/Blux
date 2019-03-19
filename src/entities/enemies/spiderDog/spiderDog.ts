import Entity from "../../entity";
import MainScene from "../../../scenes/mainScene";
import spriteSheetConfig from "../../../../assets/spriteSheets/spriteSheet.json";
import WalkSpiderDogState from "./spiderDogStates/walkSpiderDogState";
import Player from "../../player/player";
import HealthBar from "../../../utils/healthBar";
import Heart from "../../heart";
import ExtraLife from "../../extraLife";

export default class SpiderDog extends Entity {

    currentState = null;
    currentSpeed: number = null;
    regularSpeed = 30;
    chaseSpeed = 75;
    frontSight = 100;
    backSight = 30;
    chaseTint = 0xFFCCCC;
    distanceToAttack = 10;
    attackHitBox: Phaser.GameObjects.Rectangle = null;
    attackSpeed = 500;
    target: Player;
    attackAvailable = true;
    attackHitBoxGroup: Phaser.GameObjects.Group;
    healthBar: HealthBar;
    health = 3;
    maxHealth = 3;
    isDead = false;

    constructor(scene: MainScene, x, y, key, rightDirection = true, target = scene.player) {
        super(scene, x, y, key, "SpiderDog", Phaser.Physics.Arcade.DYNAMIC_BODY,
            spriteSheetConfig.content.spiderDog.walk.from);

        // TODO try to set friction (and make it work) to allow the player to ride
        this.setSize(14, 12).setOffset(1, 4); //.setImmovable().setFriction(1, 0);
        this.currentSpeed = this.regularSpeed;
        this.target = target;

        // Initial state
        this.setVelocityX(this.currentSpeed);
        if (!rightDirection) {
            this.flipX = true;
            this.setVelocityX(- this.currentSpeed);
        }

        this.currentState = new WalkSpiderDogState(this);

        // Attack hitbox management
        this.attackHitBoxGroup = this.scene.add.group();

        this.scene.physics.add.overlap(this.target, this.attackHitBoxGroup,
            (player: Player) => {
                player.onHit();
                (this.scene as MainScene).updateHUD();
            });

        // life management
        this.healthBar = new HealthBar(this.scene, this.x, this.y - 10, this.width, 2, this.health, this.maxHealth);
    }

    update(time) {
        if (!this.isDead) {
            this.healthBar.setVisible(this.health < this.maxHealth);

            if (this.canSee()) {
                this.currentSpeed = this.chaseSpeed;
                this.setTint(this.chaseTint);
            } else if (this.canSee(- this.backSight)) {
                this.currentSpeed = this.chaseSpeed;
                this.setTint(this.chaseTint);
                this.flipX = !this.flipX;
                this.setVelocityX(this.flipX ? - this.currentSpeed : this.currentSpeed);
            } else {
                this.currentSpeed = this.regularSpeed;
                this.clearTint();
            }

            this.currentState.update(time);

            this.updateAttackHitBox();
            this.healthBar.updateHealthBarPosition(this.x, this.y - 10);
        }
    }

    addHitBox() {
        const hitBox = this.scene.add.rectangle(
            this.flipX ? this.x - 8 : this.x + 8,
            this.y - 3,
            5,
            5
        );
        this.scene.physics.world.enableBody(hitBox);
        (hitBox.body as Phaser.Physics.Arcade.Body).setAllowGravity(false);
        return hitBox;
    }

    setCurrentState(state): void {
        this.currentState = state;
    }

    canAttack(target = this.target): boolean {
        return this.canSee(this.distanceToAttack, target);
    }

    hit() {
        this.onHit();
    }

    disableAttackHitBox() {
        (this.attackHitBox.body as Phaser.Physics.Arcade.Body).checkCollision.none = true;
    }

    isAttackHitBoxEnabled() {
        return this.attackHitBox ?
            !(this.attackHitBox.body as Phaser.Physics.Arcade.Body).checkCollision.none : false;
    }

    enableAttackHitBox() {
        (this.attackHitBox.body as Phaser.Physics.Arcade.Body).checkCollision.none = false;
    }

    updateAttackHitBox() {
        if (this.attackHitBox) {
            this.attackHitBox.x = this.flipX ? this.x - 8 : this.x + 8;
            this.attackHitBox.y = this.y - 3;
        }
    }

    canSee(distance = this.frontSight, target = this.target): boolean {
        return Phaser.Geom.Intersects.LineToRectangle(
            new Phaser.Geom.Line(
                this.x,
                this.y,
                this.flipX ? this.x - distance : this.x + distance,
                this.y
            ),
            target.body
        );
    }

    private onHit() {
        this.health--;
        this.healthBar.updateHealthBar(this.health);
        if (this.health === 0) {
            this.onDead();
        }
    }

    private onDead() {
        if (this.attackHitBox) {
            this.attackHitBox.destroy();
        }
        this.healthBar.destroy();
        this.disableBody();
        this.isDead = true;
        this.play("enemyDestroy");
        this.scene.sound.play("enemyDestroy", { volume: 0.5 });
        this.once("animationcomplete-enemyDestroy", () => {
            const randomNumber = Phaser.Math.Between(1, 12);
            if (randomNumber <= 3) {
                (this.scene as MainScene).pickupGroup.add(
                    new Heart(this.scene, this.x, this.y, spriteSheetConfig.name));
            }
            else if (randomNumber === 12) {
                (this.scene as MainScene).pickupGroup.add(
                    new ExtraLife(this.scene, this.x, this.y, spriteSheetConfig.name));
            }
            this.destroy();
        });
    }
}
