import Entity from "./entity";

export default class Gem extends Entity {

    big: boolean = null;

    constructor(scene, x, y, key, big: boolean) {
        super(scene, x, y, key, "Gem");
        this.big = big;
        if (big) {
            this.setScale(2);
            // TODO Why next line do not work ?
            // this.refreshBody();
            this.body.reset(this.x, this.y);
        }
        this.anims.play("gem");

        (this.body as Phaser.Physics.Arcade.Body).setAllowGravity(false);
    }

    onPickedUp(): any {
        this.scene.sound.play('gemPickedUp', { detune: this.big ? -1000 : 0 });
        this.destroy();
    }
}
