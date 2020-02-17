
module Core.Controller {
    /** Importing  classes */

    /** Animation State Type*/
    export enum AnimationStateType {
        /** Playing Animation*/
        AnimationPlaying = "AnimationPlaying",
        /** Stopped Animation */
        AnimationStopped = "AnimationStopped"
    }

    /** Animation Type*/
    export enum AnimationType {
        BigWin = "Bigwin",
        MatchValues = "MatchValues"
    }

    export class AnimationsController {

        public static Instance: AnimationsController;
        private _stage: Stages.MainStage;
        private _animations: Array<AnimationType>;
        private _buttonState: ButtonStateType;
        private _animationState: AnimationStateType;

         /** Sorting animation according to Scenario */
        private _animationSort: Array<AnimationType> = [
            AnimationType.MatchValues,
            AnimationType.BigWin
        ];

        /** AnimationsController class's init function. AnimationsController is a singleton class */
        public constructor() {
            AnimationsController.Instance = this;
        }

         /** Play next animation for scenario*/
        public playNextAnimations(): void {
            this._animationState = AnimationStateType.AnimationPlaying;
            if (this._animations.length == 0) {
                this._animationState = AnimationStateType.AnimationStopped;
                this._stage.buttonState = ButtonStateType.updateData;
                this._stage.visualType = VisualType.normal;
                SoundController.instance.stopBackgroundSound();
                this.checkPopup();
            } else {
                switch (this._animations[0]) {
                    case AnimationType.MatchValues:
                        this._stage.machineView.playAnimation(.5, 0);
                        break;
                    case AnimationType.BigWin:
                        this._stage.bigwinPopupView.playAnimation();
                        break;
                }
                delete this._animations[0];
                this._animations.splice(0, 1);
            }
        }

        /**show if earn>0*/
        public checkPopup() {
            let earn = DataController.Instance.earnCents / 100;
            let popupController = this._stage.errorPopupMV.popupController;
            earn > 0 ? popupController.setPopupType(Core.Controller.PopupType.Win) : popupController.closePopup();
        }

        /**setup animation for scenario's animation sort*/
        public sortScenarioAnimation(): void {
            let value = DataController.Instance.credit - DataController.Instance.earnCents;
            this._stage.uiView.updateCreditValueText(value);
            this._stage.machineView.controller.matchCount = 0;
            let bigwin = (DataController.Instance.winType == WinType.bigwin);

            this._animations = new Array<AnimationType>();
            for (let i = 0; i < this._animationSort.length; i++) {
                switch (this._animationSort[i]) {
                    case AnimationType.MatchValues:
                        this._animations.push(AnimationType.MatchValues);
                        break;
                    case AnimationType.BigWin:
                        if (bigwin)
                        this._animations.push(AnimationType.BigWin);
                        break;
                }
            }      
            this.playNextAnimations();
        }

        public get animationState() {
            return this._animationState;
        }

        public set stage(stage: Stages.MainStage) {
            this._stage = stage;
        }
    }
}