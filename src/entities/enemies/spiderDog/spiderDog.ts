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
    attackSpeed = 800;
    attackAvailable = true;
    target: Player;

    constructor(scene: MainScene, x, y, key, rightDirection = true, target = scene.player) {
        super(scene, x, y, key, "SpiderDog", Phaser.Physics.Arcade.DYNAMIC_BODY,
            spriteSheetConfig.content.spiderDog.walk.from);

        this.setSize(14, 12).setOffset(1, 4);
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
        this.attackHitBox = this.scene.add.rectangle(
            this.flipX ? this.x - 8 : this.x + 8,
            this.y - 3,
            5,
            5
        );
        this.scene.physics.world.enableBody(this.attackHitBox);
        (this.attackHitBox.body as Phaser.Physics.Arcade.Body).setAllowGravity(false);
        this.disableAttackHitBox();

        this.scene.physics.add.overlap(this.target, this.attackHitBox,
            (player: Player) => {
                if (this.attackAvailable) {
                    player.onHit();
                    (this.scene as MainScene).updateHUD();
                }
            });
    }

    update() {
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

        this.currentState.update();

        this.updateAttackHitBox();
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
        // TODO understand why onOverlap = false do not work to prevent overlap callback
        this.attackAvailable = false;
    }

    enableAttackHitBox() {
        this.attackAvailable = true;
    }

    updateAttackHitBox() {
        this.attackHitBox.x = this.flipX ? this.x - 8 : this.x + 8;
        this.attackHitBox.y = this.y - 3;
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
