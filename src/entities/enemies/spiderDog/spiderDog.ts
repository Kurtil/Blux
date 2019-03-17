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
    graphics: Phaser.GameObjects.Graphics;
    frontSight = 100;
    backSight = 30;
    debug = false;
    chaseColor = 0xFFCCCC;
    distanceToAttack = 10;
    attackHitBox: Phaser.GameObjects.Rectangle = null;
    attackSpeed = 800;
    attackAvailable = true;

    constructor(scene: MainScene, x, y, key, rightDirection = true) {
        super(scene, x, y, key, "SpiderDog", Phaser.Physics.Arcade.DYNAMIC_BODY,
            spriteSheetConfig.content.spiderDog.walk.from);

        this.setSize(14, 12).setOffset(1, 4);
        this.currentSpeed = this.regularSpeed;

        // Initial state
        this.setVelocityX(this.currentSpeed);
        if (!rightDirection) {
            this.flipX = true;
            this.setVelocityX(- this.currentSpeed);
        }

        this.currentState = new WalkSpiderDogState(this);

        if (this.debug) this.graphics = this.scene.add.graphics();

        this.attackHitBox = this.scene.add.rectangle(
            this.flipX ? this.x - 8 : this.x + 8,
            this.y - 3,
            5,
            5
        );

        this.scene.physics.world.enableBody(this.attackHitBox);
        (this.attackHitBox.body as Phaser.Physics.Arcade.Body).setAllowGravity(false);
        this.disableAttackHitBox();

        this.scene.physics.add.overlap(this.attackHitBox, (this.scene as MainScene).player,
            (hitbox, player: Player) => {
                if (this.attackAvailable) {
                    player.onHit();
                    (this.scene as MainScene).updateHUD();
                    this.attackAvailable = false;
                    this.scene.time.addEvent({
                        callbackScope: this,
                        delay: this.attackSpeed,
                        callback() {
                            this.attackAvailable = true;
                        }
                    });
                }
            });
    }

    update() {
        if (this.seeTarget((this.scene as MainScene).player.body)) {
            this.currentSpeed = this.chaseSpeed;
            this.setTint(this.chaseColor);
        } else {
            this.currentSpeed = this.regularSpeed;
            this.clearTint();
        }

        this.currentState.update();

        if (this.debug) {
            this.graphics.clear();
            this.graphics.lineStyle(1, 0xffffff, 1);
            const drawLine = new Phaser.Curves.Line(
                new Phaser.Math.Vector2(this.flipX ? this.x + this.backSight : this.x - this.backSight, this.y),
                new Phaser.Math.Vector2(this.flipX ? this.x - this.frontSight : this.x + this.frontSight, this.y)
            );
            drawLine.draw(this.graphics);
        }
        this.updateAttackHitBox();
    }

    setCurrentState(state): void {
        this.currentState = state;
    }

    canAttack(target = (this.scene as MainScene).player): boolean {
        return this.seeTarget(target.body, this.distanceToAttack);
    }

    hit() {
    }

    disableAttackHitBox() {
        this.attackAvailable = false;
    }

    enableAttackHitBox(): any {
        this.attackAvailable = true;
    }

    updateAttackHitBox() {
        this.attackHitBox.x = this.flipX ? this.x - 8 : this.x + 8;
        this.attackHitBox.y = this.y - 3;
    }

    private seeTarget(target, distance = this.frontSight): boolean {
        return Phaser.Geom.Intersects.LineToRectangle(
            new Phaser.Geom.Line(
                this.x,
                this.y,
                this.flipX ? this.x - distance : this.x + distance,
                this.y
            ),
            target
        );
    }
}
