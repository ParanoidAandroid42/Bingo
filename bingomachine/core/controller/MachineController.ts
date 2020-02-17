module Core.Controller {
     /** Importing  classes */
    import MachineView = View.MachineView;

    export class MachineController {

        private _machineView: MachineView;
        private _stage: Stages.MainStage;
        private _matchCount: number = 0;

          /** Running when loading MachineView class
        * @param machineView - MachineView class
        *  @param machineView - stage MainStage class
        */
        public constructor(machineView: MachineView, stage: Stages.MainStage) {
            this._stage = stage;
            this._machineView = machineView;
        }

        /**
         * check match value
         * @param counter - ball's counter
         */
        public checkMatchValues(counter: number) {
            let bingoMatch = false;
            this._stage.machineView.playHeadElectricEffect();
            let resultValues = Controller.DataController.Instance.resultValues;
            let cardValues = this._stage.cardView.controller.cardNumberView;
            let cardValue;

            for (let i = 0; i < cardValues.length; i++) {
                if (cardValues[i].idNumber == resultValues[counter]) {
                    bingoMatch = true;
                    this._matchCount++;
                    cardValue = i;
                }
            }

            if (bingoMatch) {
                this._stage.bingoMatrixView.matrixBoxView[resultValues[counter] - 1].controller.numberStateType = Controller.MatrixBoxStateType.Match;
                this._stage.cardView.controller.cardNumberView[cardValue].controller.numberStateType = Controller.CardNumberState.Match;
            } else {
                this._stage.bingoMatrixView.matrixBoxView[resultValues[counter] - 1].controller.numberStateType = Controller.MatrixBoxStateType.Pass;
            }

            if ((counter) == this._stage.payoutView.controller.payoutSelectorView[this._stage.payoutView.controller.counter].ballsCounter) {
                if (this._stage.payoutView.controller.counter < this._stage.payoutView.controller.payoutSelectorView.length) {
                    this._stage.payoutView.controller.payoutSelectorView[this._stage.payoutView.controller.counter + 1].controller.indicatorStateType = Core.Controller.IndicatorState.Match;
                    Controller.SoundController.instance.playPayoutChangedSound();
                }
                this._stage.payoutView.controller.payoutSelectorView[this._stage.payoutView.controller.counter].controller.indicatorStateType = Core.Controller.IndicatorState.Empty;
                this._stage.payoutView.controller.counter++;
            }
            this._stage.bingoMatrixView.changeHeaderText(counter + 1);
        }

        /**
         * show result for instant
         */
        public showResult() {
            let ball;

            for (let i = 0; i < this._stage.bingoMatrixView.matrixBoxView.length; i++) {
                if (this._stage.bingoMatrixView.matrixBoxView[i].controller.numberStateType == Controller.MatrixBoxStateType.OnScreen) {
                    this._stage.bingoMatrixView.matrixBoxView[i].controller.numberStateType = Controller.MatrixBoxStateType.Match;
                }
            }

            for (let i = 0; i < DataController.Instance.resultValues.length; i++) {
                if (i == Controller.DataController.Instance.finishResultPosition) {
                    break;
                }

                if (this._stage.bingoMatrixView.matrixBoxView[DataController.Instance.resultValues[i] - 1].controller.numberStateType == Controller.MatrixBoxStateType.Empty)
                    this._stage.bingoMatrixView.matrixBoxView[DataController.Instance.resultValues[i] - 1].controller.numberStateType = Controller.MatrixBoxStateType.Pass;
            }

            for (let i = 0; i < this._stage.cardView.controller.cardNumberView.length; i++)
                this._stage.cardView.controller.cardNumberView[i].playBoxAnim(Core.Controller.CardNumberState.Match);

            for (let i = 0; i < this._stage.payoutView.controller.payoutSelectorView.length; i++) {
                this._stage.payoutView.controller.payoutSelectorView[i].controller.indicatorStateType = Controller.IndicatorState.Empty;
                if (this._stage.payoutView.controller.payoutSelectorView[i].ballsCounter >= Controller.DataController.Instance.finishResultPosition) {
                    this._stage.payoutView.controller.payoutSelectorView[i].controller.indicatorStateType = Controller.IndicatorState.Match;
                    ball = i;
                    break;
                }
            }
            this._stage.bingoMatrixView.changeHeaderText(Controller.DataController.Instance.finishResultPosition);
            Game.instance.timer.addTimeout(.5, Controller.AnimationsController.Instance.playNextAnimations.bind(Controller.AnimationsController.Instance), null);
        }

        public set matchCount(val: number) {
            this._matchCount = val;
        }

        public get matchCount() {
            return this._matchCount;
        }
    }
}