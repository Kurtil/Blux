import PlayerState from "./playerState";
import Player from "../player";
import PlayerCommands from "../playerCommands";

export default class RunPlayerState implements PlayerState {
    player: Player = null;

    constructor(player: Player) {
        this.player = player;
    }

    init() {
        this.player.anims.play("walk");
    }

    update(time) {
        if (!this.player.body.blocked.down && !this.player.body.touching.down) {
            return this.nextState(this.player.states.air);
        }
    }

    handleUserInputs(commandes: PlayerCommands, time) {
        if (commandes.up) {
            if (this.player.jump(time)) return this.nextState(this.player.states.air);
        }
        if (commandes.left) {
            this.player.setVelocityX(-this.player.speed);
            this.player.setFlipX(true);
        } else if (commandes.right) {
            this.player.setVelocityX(this.player.speed);
            this.player.setFlipX(false);
        }
        if (!commandes.left && !commandes.right) {
            this.player.setVelocityX(0);
            return this.nextState(this.player.states.idle);
        }

        if (commandes.meleeAttack && this.player.meleeAttackAvailable) {
            return this.nextState(this.player.states.meleeAttack);
        }
    }

    nextState(nextState) {
        this.player.setAndInitCurrentState(nextState);
    }
}