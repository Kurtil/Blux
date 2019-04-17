import PlayerState from "./playerState";
import Player from "../player";
import PlayerCommands from "../playerCommands";

export default class AirPlayerState implements PlayerState {
    player: Player = null;

    constructor(player: Player) {
        this.player = player;
    }

    init() { }

    update(time): void {
        if (this.player.body.velocity.y > 0) {
            this.player.anims.play("land");
        } else {
            this.player.anims.play("jump");
        }
        if (this.player.body.blocked.down || this.player.body.touching.down) {
            if (this.player.body.velocity.x === 0) {
                return this.nextState(this.player.states.idle);
            } else {
                return this.nextState(this.player.states.run);
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

        if (commandes.meleeAttack && this.player.meleeAttackAvailable) {
            return this.nextState(this.player.states.meleeAttack);
        }
    }

    nextState(nextState) {
        this.player.setAndInitCurrentState(nextState);
    }
}