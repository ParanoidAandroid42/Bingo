module Core.Controller {
    /** Importing  classes */
    import MatrixView = View.MatrixView;
    import MatrixBoxView = View.MatrixBoxView;

      /**Matrix Number State Type enum
     * @param Match - Match state
     * @param Pass - Pass state
     * @param OnScreen -  OnScreen state
     * @param Empty -  Empty state
     */
    export enum MatrixBoxStateType {
        Match        = "Match",
        Pass         = "Pass",
        OnScreen     = "OnScreen",
        Empty        = "Empty"
    }

    export class MatrixBoxController {

        private _matrixBoxMode: MatrixBoxStateType;
        private _matrixView: MatrixView;
        private _matrixBoxView: MatrixBoxView;

        private _numberValue: number;

          /** Running when loading MatrixView class
          * @param matrixView - MatrixView class
          * @param matrixBoxView - MatrixBoxView class
          */
        public constructor(matrixView: MatrixView, matrixBoxView: MatrixBoxView) {
            this._matrixBoxView = matrixBoxView;
            this._matrixView = matrixView;
        }

          /** Update number position*/
        public setNumberPosition(x: number, y: number): void {
            this._matrixBoxView.setValuesPosition(x, y);
        }

          /** Update number's MatrixBoxStateType*/
        public set numberStateType(type: MatrixBoxStateType) {
            this._matrixBoxMode = type;
            this._matrixBoxView.playBoxAnim(type);
        }

        public set numberValue(value: number) {
            this._matrixBoxView.numberValueText = value;
            this._numberValue = value;
        }

        public get numberStateType() {
            return this._matrixBoxMode;
        }

        public get numberValue() {
            return this._numberValue;
        }
    }
}