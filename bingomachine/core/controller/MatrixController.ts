module Core.Controller {
      /** Importing  classes */
    import MatrixView = View.MatrixView;

    export class MatrixController {

        private _matrixView: MatrixView;
        private _stage: Stages.MainStage;

         /** Running when loading MatrixController class
          * @param matrixView - MatrixView class
          *  @param stage - Stage class
          */
        public constructor(matrixView: MatrixView, stage: Stages.MainStage) {
            this._stage = stage;
            this._matrixView = matrixView;
        }

          /** Update Matrix Data*/
        public updateMatrixData() {
            this.removeMatrixData();
            Game.instance.timer.addTimeout(.5, AnimationsController.Instance.playNextAnimations.bind(AnimationsController.Instance), null);
        }

          /** remove Matrix Data.(to default settings)*/
        public removeMatrixData() {
            for (let t = 0; t < this._matrixView.matrixBoxView.length; t++) 
                this._matrixView.matrixBoxView[t].controller.numberStateType = Controller.MatrixBoxStateType.Empty;
            
            for (let i = 0; i < this._stage.cardView.controller.cardNumberView.length; i++) {
                let number = this._stage.cardView.controller.cardNumberView[i].idNumber - 1;
                this._matrixView.matrixBoxView[number].controller.numberStateType = Controller.MatrixBoxStateType.OnScreen;
            }    

            this._matrixView.changeHeaderText(0);
        }
    }
}