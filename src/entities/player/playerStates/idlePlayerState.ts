import PlayerState from "./playerState";
import PlayerCommands from "../playerCommands";
import Player from "../player";
import AirPlayerState from "./airPlayerState";
import RunPlayerState from "./runPlayerState";
import AttackPLayerState from "./attackPlayerState";
import MeleeAttackPlayerState from "./meleeAttackPlayerState";

export default class IdlePlayerState implements PlayerState {
    player: Player = null;

    constructor(player: Player) {
        this.player = player;
        this.player.anims.play("idle");
    }

    update(commandes: PlayerCommands, time) {
        // is player in good state
        if (!this.player.body.blocked.down && !this.player.body.touching.down) {
            this.nextState(new AirPlayerState(this.player));
        }
        // player commands may change the state
        if (commandes.up) {
            if (this.player.jump(time)) return this.nextState(new AirPlayerState(this.player));
        }
        if (commandes.left && !this.player.body.blocked.left) {
            this.player.setVelocityX(-this.player.speed);
            this.player.setFlipX(true);
            return this.nextState(new RunPlayerState(this.player));
        } else if (commandes.right && !this.player.body.blocked.right) {
            this.player.setVelocityX(this.player.speed);
            this.player.setFlipX(false);
            return this.nextState(new RunPlayerState(this.player));
        }
        if (commandes.attack) {
            return this.nextState(new AttackPLayerState(this.player));
        }

        if (commandes.meleeAttack && this.player.meleeAttackAvailable) {
            return this.nextState(new MeleeAttackPlayerState(this.player));
        }
    }

    nextState(nextState) {
        this.player.setCurrentState(nextState);
    }
}