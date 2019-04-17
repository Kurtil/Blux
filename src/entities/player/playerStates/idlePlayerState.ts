import PlayerState from "./playerState";
import Player from "../player";
import PlayerCommands from "../playerCommands";

export default class IdlePlayerState implements PlayerState {
    player: Player = null;

    constructor(player: Player) {
        this.player = player;
    }

    init() {
        this.player.anims.play("idle");
    }

    update(time) {
        if (!this.player.body.blocked.down && !this.player.body.touching.down) {
            this.nextState(this.player.states.air);
        }
    }

    handleUserInputs(commandes: PlayerCommands, time) {
        if (commandes.up) {
            if (this.player.jump(time)) return this.nextState(this.player.states.air);
        }
        if (commandes.left && !this.player.body.blocked.left) {
            this.player.setVelocityX(-this.player.speed);
            this.player.setFlipX(true);
            return this.nextState(this.player.states.run);
        } else if (commandes.right && !this.player.body.blocked.right) {
            this.player.setVelocityX(this.player.speed);
            this.player.setFlipX(false);
            return this.nextState(this.player.states.run);
        }
        if (commandes.rangedAttack) {
            return this.nextState(this.player.states.rangedAttack);
        }

        if (commandes.meleeAttack && this.player.meleeAttackAvailable) {
            return this.nextState(this.player.states.meleeAttack);
        }
    }

    nextState(nextState) {
        this.player.setAndInitCurrentState(nextState);
    }
}