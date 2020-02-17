module Core.Controller {
      /** Importing  classes */
    import BetView = View.BetView;

     /**Bet Button Type*/
    export enum BetButtonType {
        Min,
        Plus
    }

    export class BetController {

        private _betView: BetView;
        private _stage: Stages.MainStage;
        private _betButtonTimeline: TimelineMax;
        private _betIndex: number = 0;
        private _betButtonDown: boolean = false;
        private _betValues: Array<number>;

         /** Running when loading class
         * @param betView - BetView class
         * @param stage - stage class
         */
        public constructor(betView: BetView, stage: Stages.MainStage) {
            this._stage = stage;
            this._betView = betView;

            this._betValues = DataController.Instance.betValues;
            this._betIndex = DataController.Instance.betIndex;
        } 

        /** Running when betbutton up
         *  @param buttonType - Bet Button Type (min or plus)
         */
        public betButtonUp(buttonType: BetButtonType): void {
            this.stopButtonTimeline();
            this._betButtonDown = false;
        }

        /** Running when betbutton down
        * @param buttonType - Bet Button Type (min or plus)
        */
        public betButtonDown(buttonType: BetButtonType) {   
            if (this._betButtonDown == false) {
                this._betButtonDown = true;
                this.stopButtonTimeline();
                this._betButtonTimeline = new TimelineMax({
                    repeat: -1, repeatDelay: .2,
                    onStart: () => {
                        SoundController.instance.playBetChangedSound();
                        this.calculeteBetValue(buttonType);
                    },
                    onRepeat: () => {

                        let onRepeat;
                        switch (buttonType) {
                            case BetButtonType.Min:
                                onRepeat = (this._betIndex != 0);
                                break;
                            case BetButtonType.Plus:
                                onRepeat = (this._betIndex != this._betValues.length - 1);
                                break;
                        }
                        onRepeat = onRepeat && AnimationsController.Instance.animationState != AnimationStateType.AnimationPlaying;

                        if (onRepeat) {
                            SoundController.instance.playBetChangedSound();
                            this.calculeteBetValue(buttonType);
                        }
                    }
                });
            } 
        }

        /** Calculete new bet value
        * @param buttonType - Bet Button Type (min or plus)
        */
        private calculeteBetValue(buttonType: BetButtonType) {
            switch (buttonType) {
                case BetButtonType.Min:
                    if (this._betIndex > 0)
                        this._betIndex--;
                    break;
                case BetButtonType.Plus:
                    if (this._betIndex < this._betValues.length - 1)
                        this._betIndex++;
                    break;
            }
            this.betStatus(BetButtonType.Min);
            this.betStatus(BetButtonType.Plus);
            this._betView.betValueText = this._betValues[this._betIndex];
            this._stage.payoutView.controller.updatePayoutData();
        }

         /** Bet Current Status (isenable = true/false)
        * @param buttonType - Bet Button Type (min or plus)
        */
        public betStatus(buttonType: BetButtonType) {
            switch (buttonType) {
                case BetButtonType.Min:
                    this._betView.betMinButton.isEnabled = (this._betIndex != 0);                
                    break;
                case BetButtonType.Plus:
                    this._betView.betPlusButton.isEnabled = (this._betIndex != this._betValues.length - 1);
                    break;
            }
            this._betButtonDown = false;
        }

        /** Kill button's timeline animation*/
        public stopButtonTimeline() {
            if (this._betButtonTimeline) {
                this._betButtonTimeline.progress(0, true);
                this._betButtonTimeline.kill();
                this._betButtonTimeline = null;
            }
        }

        public get betValue() {
            return this._betValues[this._betIndex];
        }
    }
}