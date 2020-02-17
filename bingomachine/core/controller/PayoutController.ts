module Core.Controller {
     /**importing classes*/
    import PayoutView = View.PayoutView;

    export class PayoutController {

        private _payout: PayoutView;
        private _stage: Stages.MainStage;
        private _payoutSelectorView: View.PayoutSelectorView[] = [];
        private _counter: number;

        /** Running when loading class
         * @param payoutView - PayoutView class
         * @param stage - MainStage class
         */
        public constructor(payoutView: PayoutView, stage: Stages.MainStage) {
            this._stage = stage;
            this._payout = payoutView;
        }

        /** update payout data*/
        public updatePayoutData() {
            this._counter = 0;
            this.destroyPayoutSelectorView();
            this._payoutSelectorView = [];
            this.createPayoutSelectorView(0);
        }

        /** destroy Payout Selector View*/
        private destroyPayoutSelectorView() {
            for (let i = 0; i < this._payoutSelectorView.length; i++)
                this._payoutSelectorView[i].destroy();  
        }

        /** create payout selector view. this function is recursive*/
        private createPayoutSelectorView(index: number) {
            if (DataController.Instance.payoutData.length == index) {
                this._payoutSelectorView[0].controller.indicatorStateType = Controller.IndicatorState.Match;
                this._stage.uiView.winValueText = "";
                return;
            }
            let payoutSelectorView = new View.PayoutSelectorView(this._payout);
            let value = DataController.Instance.payoutData[index].payout * (this._stage.betView.controller.betValue / 100);
            if (value > DataController.Instance.payoutData[0].payout)
                value = DataController.Instance.payoutData[0].payout;
            payoutSelectorView.setValues(DataController.Instance.payoutData[index].globeNumber, value);
            payoutSelectorView.valuesPosition(959, 45 + index * 23);
            payoutSelectorView.controller.indicatorStateType = Controller.IndicatorState.Empty;
            this._payoutSelectorView.push(payoutSelectorView);            
            index++;
            this.createPayoutSelectorView(index);
        } 

        /** result payout index according to finishResultPosition*/
        public resultPayoutIndex(): number {
            for (let i = 0; i < this._payoutSelectorView.length; i++) {
                if (this._payoutSelectorView[i].ballsCounter >= DataController.Instance.finishResultPosition) 
                    return i;                
            }
        }

        public get payoutSelectorView() {
            return this._payoutSelectorView;
        }

        public set counter(val: number) {
            this._counter = val;
        }

        public get counter() {
            return this._counter;
        }
    }
}