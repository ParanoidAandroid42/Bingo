module Core.Controller {
     /**importing classes*/
    import PayoutView = View.PayoutView;
    import PayoutSelectorView = View.PayoutSelectorView;

     /**Indicator Stae*/
    export enum IndicatorState {
        Match = "Match",  
        Empty = "Empty",
        Loop  = "Loop"
    }

    export class PayoutSelectorController {

        private _payoutView: PayoutView;
        private _payoutSelectorView: PayoutSelectorView;
        private _indicatorStateType: Controller.IndicatorState;

         /** Running when loading class
         * @param payoutView - PayoutView class
         * @param payoutSelectorView - PayoutSelectorView class
         */
        public constructor(payoutView: PayoutView, payoutSelectorView: PayoutSelectorView) {
            this._payoutSelectorView = payoutSelectorView;
            this._payoutView = payoutView;
        }

        public get indicatorStateType() {
            return this._indicatorStateType;
        }

        public set indicatorStateType(type: Controller.IndicatorState) {
            this._indicatorStateType = type;
            this._payoutSelectorView.playSelectorAnim(type);
        }
    }
}