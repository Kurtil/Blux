import Entity from "../../entity";
import MainScene from "../../../scenes/mainScene";
import spriteSheetConfig from "../../../../assets/spriteSheets/spriteSheet.json";
import WalkSpiderDogState from "./spiderDogStates/walkSpiderDogState";

export default class SpiderDog extends Entity {

    currentState = null;
    speed = 30;

    constructor(scene: MainScene, x, y, key, rightDirection = true) {
        super(scene, x, y, key, "SpiderDog", Phaser.Physics.Arcade.DYNAMIC_BODY,
            spriteSheetConfig.content.spiderDog.walk.from);

        this.setSize(14, 12).setOffset(1, 4);

        // Initial state
        this.setVelocityX(this.speed);
        if (!rightDirection) {
            this.flipX = true;
            this.setVelocityX(- this.speed);
        }

        this.currentState = new WalkSpiderDogState(this);
    }

    update(time) {
        this.currentState.update();

        if (this.body.blocked.left) {
            console.log("blocked LEFT");
        }
        if (this.body.blocked.right) {
            console.log("blocked RIGHT");
        }
        if (this.body.touching.left) {
            console.log("touching LEFT");
        }
        if (this.body.touching.right) {
            console.log("touching RIGHT");
        }
    }

    hit() {
    }

}