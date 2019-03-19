import SpiderDog from "../spiderDog";
import WalkSpiderDogState from "./walkSpiderDogState";

export default class AttackSpiderDogState {

    spiderDog: SpiderDog;
    lastAttackTime = 0;

    constructor(spiderDog: SpiderDog) {
        this.spiderDog = spiderDog;

        this.spiderDog.play("spiderDogAttack");
        this.spiderDog.setVelocityX(0);
        this.spiderDog.attackHitBox = this.spiderDog.addHitBox();
        this.spiderDog.attackHitBoxGroup.add(this.spiderDog.attackHitBox);
        // the attack hit box need to be disable first because lastAttack time = 0
        // so il will be enable at the first update cycle
        this.spiderDog.disableAttackHitBox();
    }

    update(time) {
        if (this.spiderDog.isAttackHitBoxEnabled()) {
            this.spiderDog.disableAttackHitBox();
        } else {
            if (time - this.lastAttackTime > this.spiderDog.attackSpeed) {
                this.spiderDog.enableAttackHitBox();
                this.lastAttackTime = time;
            }
        }

        if (!this.spiderDog.canAttack()) {
            this.spiderDog.attackHitBox.destroy();
            this.spiderDog.setCurrentState(new WalkSpiderDogState(this.spiderDog));
        }
    }
}