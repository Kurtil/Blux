import SpiderDog from "../spiderDog";
import spriteSheetConfig from "../../../../../assets/spriteSheets/spriteSheet.json";
import AttackSpiderDogState from "./attackSpiderDogState";

export default class WalkSpiderDogState {

    spiderDog: SpiderDog;

    constructor(spiderDog: SpiderDog) {
        this.spiderDog = spiderDog;
    }

    update() {
        if (this.spiderDog.body.blocked.left) {
            this.spiderDog.flipX = false;
            this.spiderDog.setFrame(spriteSheetConfig.content.spiderDog.face.frame);
        } else if (this.spiderDog.body.blocked.right) {
            this.spiderDog.flipX = true;
            this.spiderDog.setFrame(spriteSheetConfig.content.spiderDog.face.frame);
        } else {
            this.spiderDog.setVelocityX(this.spiderDog.flipX ?
                - this.spiderDog.currentSpeed :
                this.spiderDog.currentSpeed);
            this.spiderDog.anims.play("spiderDogWalk", true);
        }

        if (this.spiderDog.canAttack()) {
            return this.spiderDog.setCurrentState(new AttackSpiderDogState(this.spiderDog));
        }
    }

}