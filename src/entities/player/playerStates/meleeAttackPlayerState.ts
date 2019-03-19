import PlayerState from "./playerState";
import Player from "../player";
import AirPlayerState from "./airPlayerState";

export default class MeleeAttackPlayerState implements PlayerState {
    player: Player = null;

    constructor(player: Player) {
        this.player = player;
        this.player.anims.play("meleeAttack");
        this.player.once("animationcomplete-meleeAttack", () => {
            this.nextState(new AirPlayerState(this.player));
        });

        this.player.meleeAttack();
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
    }

    nextState(nextState) {
        this.player.setCurrentState(nextState);
    }
}
