import PlayerState from "./playerState";
import Player from "../player";
import PlayerCommands from "../playerCommands";

export default class MeleeAttackPlayerState implements PlayerState {

    player: Player = null;
    weaponDeltaY: number = null;
    weaponAngle: number = null;
    _weaponDeltaX: number = null;
    hitbox: Phaser.GameObjects.Rectangle = null;
    hitPower: number = null;

    get weaponDeltaX() {
        // 10 is the distance between hands when player is turned to the left and turned to the right
        return this.player.flipX ? this._weaponDeltaX - 10 : this._weaponDeltaX;
    }

    set weaponDeltaX(value) {
        this._weaponDeltaX = value;
    }

    constructor(player: Player) {
        this.player = player;
    }

    init() {
        this.hitPower = this.player.meleeWeapon.hitPower;

        this.player.anims.play("meleeAttack");
        this.player.scene.sound.play("meleeAttack", { volume: 0.3, detune: Math.random() * 200 - 100 });
        // TODO implement a better dash (ex : in the air, no FLYING)
        // this.scene.physics.moveTo(this, this.flipX ? this.x - this.width * 2 : this.x + this.width * 2,
        //     this.y, 200, 100);

        this.weaponDeltaX = 5;
        this.weaponDeltaY = - 2;
        this.weaponAngle = 0;

        this.player.on("animationupdate-meleeAttack", (animation, frame) => {
            switch (frame.index) {
                case 1:
                    this.weaponDeltaX = 5;
                    this.weaponDeltaY = 1;
                    this.weaponAngle = 65;
                    break;
                case 2:
                    this.weaponDeltaX = 5;
                    this.weaponDeltaY = 1;
                    this.weaponAngle = 30;
                    break;
                case 3:
                    this.weaponDeltaX = 5;
                    this.weaponDeltaY = 0;
                    this.weaponAngle = 60;
                    break;
            }
        });

        this.player.once("animationcomplete-meleeAttack", () => {
            this.nextState(this.player.states.air);
        });

        this.hitbox = this.addMeleeHitBox(
            this.player.flipX ?
                this.player.x + this.weaponDeltaX - 10 :
                this.player.x + this.weaponDeltaX + 10,
            this.player.y + this.weaponDeltaY - 10,
            16,
            5,
            this.hitPower);

        this.updateWeaponDisplay();
    }

    update(time) {
        this.player.lastMeleeAttack = time;
        this.player.meleeAttackAvailable = false;

        this.updateWeapon();
    }

    handleUserInputs(commandes: PlayerCommands, time) {
        const onSomething = this.player.body.touching.down || this.player.body.blocked.down;

        if (commandes.left) {
            this.player.setVelocityX(- (onSomething ? this.player.speed : this.player.airSpeed));
            this.player.setFlipX(true);
        } else if (commandes.right) {
            this.player.setVelocityX((onSomething ? this.player.speed : this.player.airSpeed));
            this.player.setFlipX(false);
        }
        if (!commandes.left && !commandes.right) {
            this.player.setVelocityX(0);
        }

        if ((onSomething) && commandes.up) {
            this.player.jump(time);
        }
    }

    nextState(nextState) {
        this.hitbox.destroy();
        this.player.removeListener("animationupdate-meleeAttack");
        this.player.setAndInitCurrentState(nextState);
    }

    private updateHitBox() {
        this.hitbox.x = this.player.flipX ?
            this.player.x + this.weaponDeltaX - 10 :
            this.player.x + this.weaponDeltaX + 10;
        this.hitbox.y = this.player.y + this.weaponDeltaY;
    }

    private updateWeaponDisplay() {
        this.player.updadeMeleeWeapon(
            this.player.x + this.weaponDeltaX,
            this.player.y + this.weaponDeltaY,
            this.player.flipX,
            this.weaponAngle);
    }

    private updateWeapon(): void {
        this.updateWeaponDisplay();
        this.updateHitBox();
    }

    private addMeleeHitBox(x, y, width, height, hitPower = 1) {
        const hitbox = this.player.scene.add.rectangle(x, y, width, height);
        this.player.scene.physics.world.enableBody(hitbox);
        (hitbox.body as Phaser.Physics.Arcade.Body).setAllowGravity(false);

        this.player.shotGroup.add(hitbox);
        (hitbox as any).hit = () => {
            if (hitPower > 0) {
                // a hit can hit only once will all its power
                this.player.scene.sound.play("meleeHit", { volume: 0.2, detune: Phaser.Math.Between(-500, 500) });
                const power = hitPower;
                hitPower = 0;
                return power;
            } else {
                return 0;
            }
        };
        return hitbox;
    }
}
