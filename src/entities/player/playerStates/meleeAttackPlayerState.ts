import PlayerState from "./playerState";
import Player from "../player";
import AirPlayerState from "./airPlayerState";

export default class MeleeAttackPlayerState implements PlayerState {

    player: Player = null;
    weaponY: number = null;
    weaponAngle: number = null;
    _weaponX: number = null;
    hitbox: Phaser.GameObjects.Rectangle = null;
    hitPower: number = null;

    get weaponX() {
        // 10 is the distance between hands when player is turned to the left and turned to the right
        return this.player.flipX ? this._weaponX - 10 : this._weaponX;
    }

    set weaponX(value) {
        this._weaponX = value;
    }

    constructor(player: Player) {
        this.player = player;
        this.hitPower = this.player.weapon.hitPower;

        this.player.anims.play("meleeAttack");
        this.player.meleeAttack();

        this.weaponX = this.player.x + 5;
        this.weaponY = this.player.y - 2;
        this.weaponAngle = 0;

        this.player.on("animationupdate-meleeAttack", (animation, frame) => {
            switch (frame.index) {
                // case 1 never happens in update if not looping animation
                case 2:
                    this.weaponX = this.player.x + 5;
                    this.weaponY = this.player.y - 1;
                    this.weaponAngle = 30;
                    break;
                case 3:
                    this.weaponX = this.player.x + 5;
                    this.weaponY = this.player.y;
                    this.weaponAngle = 60;
                    break;
                default:
                    this.weaponX = this.player.x + 5;
                    this.weaponY = this.player.y + 1;
                    this.weaponAngle = 65;
            }
        });

        this.player.once("animationcomplete-meleeAttack", () => {
            this.nextState(new AirPlayerState(this.player));
        });

        this.player.meleeAttacking = true;

        this.hitbox = this.player.addMeleeHitBox(this.player.flipX ? this.weaponX - 10 : this.weaponX + 10,
            this.weaponY - 10, 16, 5);
        this.player.shotGroup.add(this.hitbox);
        (this.hitbox as any).hit = () => {
            if (this.hitPower > 0) {
                this.player.meleeAttackSound();
                return this.hitPower--;
            } else {
                return 0;
            }
        };

        // this.player.weapon.play("sword");
        this.player.updadeWeapon(this.weaponX, this.weaponY, this.weaponAngle);

    }

    update(commandes, time) {
        // player commands may change the state
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

        this.player.updadeWeapon(this.weaponX, this.weaponY, this.weaponAngle);
        this.player.lastMeleeAttack = time;
        this.player.meleeAttackAvailable = false;

        this.updateHitBox(this.player.flipX ? this.weaponX - 10 : this.weaponX + 10, this.weaponY);
    }

    nextState(nextState) {
        this.hitbox.destroy();
        this.player.meleeAttacking = false;
        this.player.removeListener("animationupdate-meleeAttack");
        this.player.setCurrentState(nextState);
    }

    updateHitBox(x, y) {
        this.hitbox.x = x;
        this.hitbox.y = y;
    }
}
