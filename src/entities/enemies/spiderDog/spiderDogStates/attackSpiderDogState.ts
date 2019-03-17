import SpiderDog from "../spiderDog";
import WalkSpiderDogState from "./walkSpiderDogState";

export default class AttackSpiderDogState {

    spiderDog: SpiderDog;

    constructor(spiderDog: SpiderDog) {
        this.spiderDog = spiderDog;

        this.spiderDog.play("spiderDogAttack");
        this.spiderDog.setVelocityX(0);

        this.spiderDog.enableAttackHitBox();
    }

    update() {
        if (!this.spiderDog.canAttack()) {
            this.spiderDog.disableAttackHitBox();
            this.spiderDog.setCurrentState(new WalkSpiderDogState(this.spiderDog));
        }
    }
}