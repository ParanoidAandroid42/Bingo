module Core.Controller {
    /** Importing  classes */
    import BackgroundView = View.BackgroundView;

    export class BackgroundController {

        private _backgroundView: BackgroundView;
        private _stage: Stages.MainStage;

         /** Running when loading class
         * @param backgroundview - BackgroundView class
         * @param stage - stage class
         */
        public constructor(backgroundview: BackgroundView, stage: Stages.MainStage) {
            this._stage = stage;
            this._backgroundView = backgroundview;
        }
    }
}