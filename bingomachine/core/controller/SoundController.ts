module Core.Controller {

    export class SoundController {
        private _soundFXVolume: number;
        private _backgroundSoundVolume: number;

        private _isMuteSound: boolean = true;
        private _isMuteMusic: boolean = false;
        private _isMuteSoundFx: boolean = false;

        public static instance: SoundController;

         /** SoundController class's init function. SoundController is a singleton class */
        public constructor() {
            SoundController.instance = this;
            this._soundFXVolume = .5;
            this._backgroundSoundVolume = 1;
        }

         /** Play background sound for the normal type  */
        public playAmbianceNormalSound() {
            Game.instance.sound.play("AmbianceNormal", this._backgroundSoundVolume, true);
        }

           /** Play background sound for the turbo type  */
        public playAmbianceTurboSound() {
            Game.instance.sound.play("AmbianceTurbo", this._backgroundSoundVolume, true);
        }

        /** Play bigwin sound */
        public playBigWinSound() {
            Game.instance.sound.play("Bigwin", this._soundFXVolume, false);
        }

          /** Play bigwin counter sound */
        public playBigWinCounterSound() {
            Game.instance.sound.play("BigwinCount", this._soundFXVolume, false);
        }  

          /** Play newcard sound */
        public playNewCardSound() {
            Game.instance.sound.play("NewCard", this._soundFXVolume, false);
        }

          /** Play machine counter sound for the normal type  */
        public playNormalMachineCounterSound() {
            Game.instance.sound.play("NormalMachineCounter", this._soundFXVolume, false);
        }

          /** Play counter sound for the normal type  */
        public playCounterSound() {
            Game.instance.sound.play("NumberCounter", this._soundFXVolume, false);            
        }

         /** Play congrulation panel sound  */
        public playCongPanelSound() {
            Game.instance.sound.play("Cong", this._soundFXVolume, false);
        }

        /** Play over button sound */
        public playOverButtonSound() {
            Game.instance.sound.play("OverButton", this._soundFXVolume, false);
        }

         /** Play number elecktric sound */
        public playNumberElectricSound() {
            Game.instance.sound.play("NumberElectric", this._soundFXVolume, false);            
        }

         /** Play short smoke sound */
        public playShortSmokeSound(version: number) {
            switch (version) {
                case 0:
                    Game.instance.sound.play("ShortSmoke01", this._soundFXVolume, false);
                    break;
                case 1:
                    Game.instance.sound.play("ShortSmoke02", this._soundFXVolume, false);
                    break;
            }
        }

         /** Play electric sound for the normal type */
        public playElectricNormalSound() {
            Game.instance.sound.play("ElectricNormal", this._soundFXVolume, false);
        }

          /** Play electric sound for the turbo type */
        public playElectricTurboSound() {
            Game.instance.sound.play("ElectricTurbo", this._soundFXVolume, false);
        }

         /** Play card vicration sound */
        public playCardVibrationSound() {
            Game.instance.sound.play("CardVibration", this._soundFXVolume, false);
        }

          /** Play button click sound */
        public playClickSound() {
            Game.instance.sound.play("Click", this._soundFXVolume, false);
        }

          /** Play bet changed sound */
        public playBetChangedSound() {
            Game.instance.sound.play("BetChanged", this._soundFXVolume, false);
        }

          /** Play machine counter sound for the turbo type  */
        public playTurboMachineCounterSound() {
            Game.instance.sound.play("TurboMachineCounter", this._soundFXVolume, false);
        }

            /** Play payout changed sound  */
        public playPayoutChangedSound(){
            Game.instance.sound.play("PayoutChanged", this._soundFXVolume, false);
        }

         /** Play button up sound  */
        public playButtonSound() {
            Game.instance.sound.play("PlayButton", this._soundFXVolume, false);
        }

          /** turbo button up sound  */
        public playTurboButtonSound() {
            Game.instance.sound.play("TurboButton", this._soundFXVolume, false);
        }

           /** Play head smoke sound  */
        public playHeadSmokeSound() {
            Game.instance.sound.play("HeadSmoke", this._soundFXVolume, false);
        }

          /** Play nose smoke sound  */
        public playNoseSmokeSound() {
            Game.instance.sound.play("MouthSoun", this._soundFXVolume, false);
        }

          /** stop turbo button sound  */
        public stopTurboButtonSound() {
            Game.instance.sound.stop("TurboButton");
        }

         /** stop bigwin counter sound  */
        public stopBigWinCounterSound() {
            Game.instance.sound.stop("BigwinCount");
        }   

          /** stop normal ambiance sound  */
        public stopAmbianceNormalSound() {
            Game.instance.sound.stop("AmbianceNormal");
        }

          /** stop turbo ambiance sound  */
        public stopAmbianceTurboSound() {
            Game.instance.sound.stop("AmbianceTurbo");
        }

           /** stop background sound (turbo+normal, all of them)  */
        public stopBackgroundSound() {
            this.stopAmbianceNormalSound();
            this.stopAmbianceTurboSound();
        }

        /** mute background sound  */
        public muteBackgroundSound(): void {
            Game.instance.sound.muteChannel("BackgroundSound");
        }

            /** mute specials sound */
        public muteSpecialsSound() {
            Game.instance.sound.muteChannel("SpecialsSound");
        }

        /** mute sound(specials + background)*/
        public muteSound(mute: boolean) {
            if (mute) {
                this.muteSpecialsSound();
                this.muteBackgroundSound();
            } else {
                this.unMuteSpecialsSound();
                this.unMuteBackgroundSound();
            }
        }

          /** unmute specials sound */
        public unMuteSpecialsSound(): void {
            Game.instance.sound.unmuteChannel("SpecialsSound");
        }

         /** unmute background sound  */
        public unMuteBackgroundSound(): void {
            Game.instance.sound.unmuteChannel("BackgroundSound");
        }

         /** is mute music(background sounds)? */
        public isMuteMusic(index: boolean) {
            this._isMuteMusic = index;
            if (!this._isMuteMusic && this._isMuteSound) {
                this.unMuteBackgroundSound();
            } else {
                this.muteBackgroundSound();
            }
        }

         /** is mute soundfx(special sounds)? */
        public isMuteSoundFx(index: boolean) {
            this._isMuteSoundFx = index;
            if (!this._isMuteSoundFx && this._isMuteSound) {
                this.unMuteSpecialsSound();
            } else {
                this.muteSpecialsSound();
            }
        }

          /** is mute sounds(specials + background)*/
        public isMuteSound(index: boolean) {
            this._isMuteSound = index;
            if (this._isMuteSound) {
                this.isMuteSoundFx(this._isMuteSoundFx);
                this.isMuteMusic(this._isMuteMusic);
            } else {
                this.muteSound(false);
            }
        }
    }
}