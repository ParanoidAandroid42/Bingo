module Core.Controller {
      /** Importing  classes */
    import PlayView = View.PlayView;

    export class PlayController {

        private _playView: PlayView;
        private _stage: Stages.MainStage;

         /** Running when loading class
         * @param playView - PlayView class
         * @param stage - MainStage class
         */
        public constructor(playView: PlayView, stage: Stages.MainStage) {
            this._stage = stage;
            this._playView = playView;         
        }

        /**running when play button up*/
        public playButtonUp(): void {
            if (AnimationsController.Instance.animationState != AnimationStateType.AnimationPlaying) {
                if (!this.checkBalance) {
                    this._stage.buttonState = ButtonStateType.sendAction;
                    this._stage.visualType = VisualType.instant;
                    this._stage.cardView.controller.setNewData();
                    SoundController.instance.playButtonSound();
                    Game.instance.service.send(SendAction.globeSelect, { betlevel: this._stage.betView.controller.betValue });
                }        
            } else {
                this._stage.bingoType = BingoType.instant;
                this._stage.visualType = VisualType.instant;
                this._stage.buttonState = ButtonStateType.instant;
            }
        }

         /**check balance*/
        public get checkBalance(): boolean {
            //credit < 0 show InsufficientBalanceNotenoughBalance popup
            if (DataController.Instance.credit < 0) {
                this._stage.errorPopupMV.popupController.setPopupType(PopupType.InsufficientBalanceNotenoughBalance);
                return true;
            //credit < 0 minimum bet level show InsufficientBalanceMinimumBetLevel popup
            } else if ((DataController.Instance.credit - DataController.Instance.betValues[0]) < 0) {
                this._stage.errorPopupMV.popupController.setPopupType(PopupType.InsufficientBalanceMinimumBetLevel);
                return true;
            //credit < 0 current bet level show InsufficientBalanceMinimumBetLevel popup
            } else if ((DataController.Instance.credit - this._stage.betView.controller.betValue) < 0) {
                this._stage.errorPopupMV.popupController.setPopupType(PopupType.InsufficientBalanceCurrentBetLevel);
                return true;
            }
            else {
                return false;
            }
        }
    }
}
