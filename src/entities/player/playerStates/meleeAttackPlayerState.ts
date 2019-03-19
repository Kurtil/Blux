import PlayerState from "./playerState";
import Player from "../player";
import AirPlayerState from "./airPlayerState";
import Sword from "../../sword";

export default class MeleeAttackPlayerState implements PlayerState {

    player: Player = null;
    weaponY: number = null;

    constructor(player: Player) {
        this.player = player;

        this.player.anims.play("meleeAttack");
        this.player.meleeAttack();

        this.weaponY = this.player.y;

        this.player.on("animationupdate-meleeAttack", (animation, frame) => {
            debugger;
            switch (frame.index) {
                case 2: this.weaponY = this.player.y;
                    break;
                case 3: this.weaponY = this.player.y + 2;
                    break;
                default: this.weaponY = this.player.y + 4;
            }
        });
        this.player.once("animationcomplete-meleeAttack", () => {
            this.nextState(new AirPlayerState(this.player));
        });

        this.player.updadeWeapon(this.player.x, this.weaponY);
        this.player.weapon.setVisible(true);
        this.player.weapon.play("sword");
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

        this.player.updadeWeapon(this.player.x, this.weaponY);
    }

    nextState(nextState) {
        this.player.weapon.setVisible(false);
        this.player.setCurrentState(nextState);
    }
}
