import PlayerState from "./playerState";
import Player from "../player";
import AirPlayerState from "./airPlayerState";

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
        this.hitPower = this.player.weapon.hitPower;

        this.player.meleeAttack();

        this.weaponDeltaX = 5;
        this.weaponDeltaY = - 2;
        this.weaponAngle = 0;

        this.player.on("animationupdate-meleeAttack", (animation, frame) => {
            switch (frame.index) {
                // case 1 never happens in update if not looping animation
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
                default:
                    this.weaponDeltaX = 5;
                    this.weaponDeltaY = 1;
                    this.weaponAngle = 65;
            }
        });

        this.player.once("animationcomplete-meleeAttack", () => {
            this.nextState(new AirPlayerState(this.player));
        });

        this.hitbox = this.addMeleeHitBox();

        this.updateWeaponDisplay();
    }

    update(time) {
        this.player.lastMeleeAttack = time;
        this.player.meleeAttackAvailable = false;

        this.updateWeapon();
    }

    handleUserInputs(commandes, time) {
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
        this.player.meleeAttacking = false;
        this.player.removeListener("animationupdate-meleeAttack");
        this.player.setCurrentState(nextState);
    }

    private updateHitBox() {
        this.hitbox.x = this.player.flipX ?
            this.player.x + this.weaponDeltaX - 10 :
            this.player.x + this.weaponDeltaX + 10;
        this.hitbox.y = this.player.y + this.weaponDeltaY;
    }

    private updateWeaponDisplay() {
        this.player.updadeWeapon(
            this.player.x + this.weaponDeltaX,
            this.player.y + this.weaponDeltaY,
            this.weaponAngle);
    }

    private updateWeapon(): void {
        this.updateWeaponDisplay();
        this.updateHitBox();
    }

    private addMeleeHitBox(): Phaser.GameObjects.Rectangle {
        return this.player.addMeleeHitBox(
            this.player.flipX ?
                this.player.x + this.weaponDeltaX - 10 :
                this.player.x + this.weaponDeltaX + 10,
            this.player.y + this.weaponDeltaY - 10,
            16,
            5,
            this.hitPower);
    }
}
