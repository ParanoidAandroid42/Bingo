module Core.View {

      /** Importing  classes */

    type DynamicText = Parts.Text | Parts.BitmapText;

    export class MatrixView implements Interfaces.IDisplayVisual{

        private _stage:  Stages.MainStage;
        private _matrixController: Controller.MatrixController;

        private _container: Parts.Container;
        private _matrixBoxContainer: Parts.Container;

        private _background: Parts.Sprite;
        private _frame: Parts.Sprite;

        private _matrixBoxView: MatrixBoxView[] = [];

        private _headerText: DynamicText;
        private _headerValueText: DynamicText;


        /** Running when loading MatrixView class
        * @param stage - MainStage class
        */
        public constructor(stage:  Stages.MainStage) {
            this._stage = stage;
            this._matrixController = new Controller.MatrixController(this, stage);
            this.initProperties();
        }

         /** MatrixView class's init function */
        public initProperties() {

            /** Create Containers */
            this._container = new Parts.Container(this._stage.backgroundView.baseContainer, "MatrixContainer");
            /** Create Sprites */
            this._background = new Parts.Sprite(396, 205, StyleInformation.MatrixFrames.Background, this._container, "MatrixBackground");
            /** Create Containers */
            this._matrixBoxContainer = new Parts.Container(this._container, "MatrixBoxContainer");
             /** Create Matrix's boxes */
            this.createMatrixBoxes(0, 0, 1); 
             /** Create Sprites */
            this._frame = new Parts.Sprite(399, 216, StyleInformation.MatrixFrames.FrameNormal, this._container, "BingoMatrixFrame");     
             /** Create Texts */
            this._headerText = Game.instance.language.createText(LanguageNames.MatrixHeader, 395, 5, null, StyleInformation.MatrixHeader, this._container);                 
            this._headerValueText = Game.instance.language.createText(LanguageNames.MatrixHeaderValue, 395, 34, null, StyleInformation.MatrixHeaderValue, this._container);
        }

          /** Create Matrix's Boxes. This function is recursive
          * @param rIndex - raw index - this game's row = 9
          * @param cIndex - coloumn index  - this game's coloumn = 10
          * @param count - Matrix's box count
          */
        private createMatrixBoxes(rIndex: number, cIndex: number, count:number) {
            if (rIndex >= 9) return;
            let xOffSet = 26;
            let yOffSet = 26;
            let number = new MatrixBoxView(this);
            number.controller.numberValue = count;
            number.controller.setNumberPosition(278 + cIndex % 10 * xOffSet, 98 + rIndex * yOffSet);
            number.controller.numberStateType = Controller.MatrixBoxStateType.Empty;
            this._matrixBoxView.push(number);
            count++;
            cIndex++;

            if (cIndex % 10 == 0) 
                rIndex++;
            this.createMatrixBoxes(rIndex, cIndex % 10, count);
        }

         /** change visuals according to visual type 
         * @param type - visual type
         */
        public changeVisual(type: VisualType): void {
            switch (type) {
                case VisualType.normal:
                    this._frame.texture = PIXI.Texture.fromFrame(StyleInformation.MatrixFrames.FrameNormal);
                    break;
                case VisualType.turbo:
                    this._frame.texture = PIXI.Texture.fromFrame(StyleInformation.MatrixFrames.FrameTurbo);
                    break;
                case VisualType.forward:
                    break;
            }
        }

          /** change matrix's header text*/
        public changeHeaderText(val: number) {
            val == 0 ? this._headerValueText.text = "" : this._headerValueText.text = val.toString();
        }

        /** Set orientation visuals according to DisplayOrientation (landscape/portrait) */
        public changeOrientation(orientation: DisplayOrientation) {
            switch (orientation) {
                case DisplayOrientation.landscape:
                    this._container.position.set(0, 13);
                    this._container.scale.set(1, 1);
                    break;
                case DisplayOrientation.portrait:
                    this._container.position.set(-237, 122);
                    this._container.scale.set(1.1, 1.1);
                    break;
            }
        }

        public get matrixBoxView() {
            return this._matrixBoxView;
        }

        public get controller() {
            return this._matrixController;
        }

        public get container() {
            return this._container;
        }

        public get matrixBoxContainer() {
            return this._matrixBoxContainer;
        }

        public get mainStage() {
            return this._stage;
        }
    }
}