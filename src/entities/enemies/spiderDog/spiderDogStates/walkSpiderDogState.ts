import SpiderDog from "../spiderDog";
import spriteSheetConfig from "../../../../../assets/spriteSheets/spriteSheet.json";
import AttackSpiderDogState from "./attackSpiderDogState";

export default class WalkSpiderDogState {

    spiderDog: SpiderDog = null;
    walkSoundLimit = 9 * 16;
    walkSound: Phaser.Sound.BaseSound = null;
    walkSoundDetune = 400;

    constructor(spiderDog: SpiderDog) {
        this.spiderDog = spiderDog;
        this.walkSound = spiderDog.walkSound;
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
            this.walkSound.stop();
            return this.spiderDog.setCurrentState(new AttackSpiderDogState(this.spiderDog));
        }

        // Walk sound management
        const distanceToPlayer = Phaser.Math.Distance.Between(
            this.spiderDog.x,
            this.spiderDog.y,
            this.spiderDog.target.x,
            this.spiderDog.target.y
        );

        if (distanceToPlayer < this.walkSoundLimit) {
            if (!this.walkSound.isPlaying) {
                this.walkSound.play();
            }
        } else {
            this.walkSound.stop();
        }

        // Typescript def are not complete here... TODO contribute ;) !!!
        (this.walkSound as any).volume = 0.6 / ((distanceToPlayer < 1 ? 1 : distanceToPlayer) / 10);
        (this.walkSound as any).rate = this.spiderDog.canSee() ? 1.5 : 1;
        (this.walkSound as any).detune = this.walkSoundDetune * Math.random() - this.walkSoundDetune / 2;
    }

}