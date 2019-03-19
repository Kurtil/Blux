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
        this.player.anims.play("walk");
    }

    update(commandes: PlayerCommands, time) {
        // is player in good state
        if (!this.player.body.blocked.down && !this.player.body.touching.down) {
            return this.nextState(new AirPlayerState(this.player));
        }
        // player commands may change the state
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

        if (commandes.meleeAttack) {
            return this.nextState(new MeleeAttackPlayerState(this.player));
        }
    }

    nextState(nextState) {
        this.player.setCurrentState(nextState);
    }
}