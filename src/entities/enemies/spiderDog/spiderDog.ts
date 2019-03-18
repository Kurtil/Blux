import Entity from "../../entity";
import MainScene from "../../../scenes/mainScene";
import spriteSheetConfig from "../../../../assets/spriteSheets/spriteSheet.json";
import WalkSpiderDogState from "./spiderDogStates/walkSpiderDogState";
import Player from "../../player/player";

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
    }

    update(time) {
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
}
