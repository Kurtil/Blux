import SpiderDog from "../spiderDog";

export default class WalkSpiderDogState {

    spiderDog: SpiderDog;

    speed = 30;

    constructor(spiderDog: SpiderDog) {
        this.spiderDog = spiderDog;
        this.spiderDog.anims.play("spiderDogWalk");
    }

    update() {
        // TODO understand the differences between touching/blocked and collider/overlap !!!
        if (this.spiderDog.body.blocked.left || this.spiderDog.body.touching.left) {
            this.spiderDog.flipX = false;
            this.spiderDog.setVelocityX(this.speed);
        }
        if (this.spiderDog.body.blocked.right || this.spiderDog.body.touching.right) {
            this.spiderDog.flipX = true;
            this.spiderDog.setVelocityX(- this.speed);
        }
    }

}