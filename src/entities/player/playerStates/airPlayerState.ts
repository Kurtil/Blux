import PlayerState from "./playerState";
import PlayerCommands from "../playerCommands";
import Player from "../player";
import RunPlayerState from "./runPlayerState";
import IdlePlayerState from "./idlePlayerState";
import MeleeAttackPlayerState from "./meleeAttackPlayerState";

export default class AirPlayerState implements PlayerState {
    player: Player = null;

    constructor(player: Player) {
        this.player = player;
    }

    update(time): void {
        if (this.player.body.velocity.y > 0) {
            this.player.anims.play("land");
        } else {
            this.player.anims.play("jump");
        }
        if (this.player.body.blocked.down || this.player.body.touching.down) {
            if (this.player.body.velocity.x === 0) {
                return this.nextState(new IdlePlayerState(this.player));
            } else {
                return this.nextState(new RunPlayerState(this.player));
            }
        }
    }

    handleUserInputs(commandes: PlayerCommands) {
        if (commandes.left) {
            this.player.setVelocityX(-this.player.airSpeed);
            this.player.setFlipX(true);
        } else if (commandes.right) {
            this.player.setVelocityX(this.player.airSpeed);
            this.player.setFlipX(false);
        }
        if (!commandes.left && !commandes.right) {
            this.player.setVelocityX(0);
        }

        if (this.player.weapon && commandes.meleeAttack && this.player.meleeAttackAvailable) {
            return this.nextState(new MeleeAttackPlayerState(this.player));
        }
    }

    nextState(nextState) {
        this.player.setCurrentState(nextState);
    }
}