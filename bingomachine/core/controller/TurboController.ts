
module Core.Controller {
      /** Importing  classes */
    import TurboView = View.TurboView;

    export class TurboController {

        private _turboView: TurboView;
        private _stage: Stages.MainStage;

          /** Running when loading class
         * @param turboView - TurboView class
         * @param stage - Stage class
         */
        public constructor(turboView: TurboView, stage: Stages.MainStage) {
            this._stage = stage;
            this._turboView = turboView;
        }

        /** running when turbo button up */
        public turboButtonUp() {
            switch (this._stage.bingoType) {
                case BingoType.turbo:
                    if (AnimationsController.Instance.animationState != Controller.AnimationStateType.AnimationPlaying) {
                        this._stage.bingoType = BingoType.normal;
                        this._stage.visualType = VisualType.normal;
                        SoundController.instance.stopTurboButtonSound();
                    } else {
                        this._stage.buttonState = ButtonStateType.turboDisabled;
                    }
                    break;
                case BingoType.normal:
                    this._stage.bingoType = BingoType.turbo;
                    this._stage.visualType = VisualType.turbo;
                    SoundController.instance.playTurboButtonSound();
                    break;
            }
        }
    }
}