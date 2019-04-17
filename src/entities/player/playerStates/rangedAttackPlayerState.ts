import PlayerState from "./playerState";
import Player from "../player";
import PlayerCommands from "../playerCommands";
import MainScene from "../../../scenes/mainScene";
import spriteSheetConfig from "../../../../assets/spriteSheets/spriteSheet.json";

export default class RangedAttackPLayerState implements PlayerState {
    player: Player = null;

    constructor(player: Player) {
        this.player = player;
    }

    init() {
        this.player.anims.play("attack");
        this.player.on("animationupdate-attack", (animation, frame) => {
            if (frame.textureFrame === 32) {
                this.player.shotGroup.add(new this.player.rangedWeapon(
                    this.player.scene as MainScene,
                    this.player.x,
                    this.player.y,
                    spriteSheetConfig.name,
                    this.player,
                    this.player.shotPower,
                    this.player.shotSpeed));
                this.player.scene.sound.play("playerAttack", { detune: Math.random() * 50 - 25 });
            }
        });
    }

    update(time): void { }

    handleUserInputs(commandes: PlayerCommands) {
        if (!commandes.rangedAttack) {
            return this.nextState(this.player.states.idle);
        }

        if (this.player.meleeWeapon && commandes.meleeAttack && this.player.meleeAttackAvailable) {
            return this.nextState(this.player.states.meleeAttack);
        }
    }

    nextState(nextState) {
        this.player.removeListener("animationupdate-attack");
        this.player.setAndInitCurrentState(nextState);
    }
}