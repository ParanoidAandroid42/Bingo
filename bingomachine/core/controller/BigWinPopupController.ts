module Core.Controller {
     /** Importing  classes */
    import BigWinPopupMV = View.BigWinPopupView;

    export class BigWinPopupController {

        private _bigWinPopupMV: BigWinPopupMV;
        private _stage: Stages.MainStage;

           /** Running when loading bigwinController class */
        public constructor(bigWinPopupMV: BigWinPopupMV, stage: Stages.MainStage) {
            this._stage = stage;
            this._bigWinPopupMV = bigWinPopupMV;
        }
    }
}