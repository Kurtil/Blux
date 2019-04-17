import PlayerState from "./playerState";
import PlayerCommands from "../playerCommands";
import Player from "../player";
import AirPlayerState from "./airPlayerState";
import IdlePlayerState from "./idlePlayerState";
import MeleeAttackPlayerState from "./meleeAttackPlayerState";

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
            return this.nextState(new AirPlayerState(this.player));
        }
    }

    handleUserInputs(commandes: PlayerCommands, time) {
        if (commandes.up) {
            if (this.player.jump(time)) return this.nextState(new AirPlayerState(this.player));
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
            return this.nextState(new IdlePlayerState(this.player));
        }

        if (this.player.weapon && commandes.meleeAttack && this.player.meleeAttackAvailable) {
            return this.nextState(new MeleeAttackPlayerState(this.player));
        }
    }

    nextState(nextState) {
        this.player.setAndInitCurrentState(nextState);
    }
}