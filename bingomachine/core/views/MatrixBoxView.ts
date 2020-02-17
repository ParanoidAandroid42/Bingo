module Core.View {

      /** Importing  classes */
    import MatrixView = Core.View.MatrixView;

    type DynamicText = Parts.Text | Parts.BitmapText;

    export class MatrixBoxView implements Interfaces.IDisplayVisual {
        private _matrixView: MatrixView;
        private _matrixBoxController: Controller.MatrixBoxController;
        private _numberText: DynamicText;
        private _boxTexture: Parts.Sprite;

          /** Running when loading MatrixBoxView class
          * @param matrixView - MatrixView class
          */
        public constructor(matrixView: MatrixView) {
            this._matrixView = matrixView;
            this._matrixBoxController = new Controller.MatrixBoxController(matrixView, this);
            this.initProperties();
        }

          /** MatrixBoxView class's init function */
        public initProperties(): void {
            this._boxTexture = new Parts.Sprite(453, 572, StyleInformation.MatrixFrames.BoxMatch, this._matrixView.matrixBoxContainer, "BoxTexture");
            this._numberText = Game.instance.language.createText(LanguageNames.MatrixNumberValue, 395, 72, null, StyleInformation.MatrixEmptyState, this._matrixView.matrixBoxContainer);
        }

        /** Set number text and box texture's position*/
        public setValuesPosition(x: number, y: number):void {
            this._numberText.position.set(x, y);
            this._boxTexture.position.set(x, y - 2);
        }

         /** Play box animation
          * @param numberState - play box anim according to MatrixNumberStateType
          */
        public playBoxAnim(numberState: Controller.MatrixBoxStateType): void {
            this._boxTexture.alpha = 0;
            TweenLite.killTweensOf(this._boxTexture);
            switch (numberState) {
                case Controller.MatrixBoxStateType.OnScreen:
                    TweenLite.to(this._boxTexture, .25, { alpha: 1, ease: Sine.easeIn });
                    this._boxTexture.texture = PIXI.Texture.fromFrame(StyleInformation.MatrixFrames.BoxOnScreen);
                    this._numberText.style =  new PIXI.TextStyle(StyleInformation.MatrixNumberOnSceenState);
                    break;
                case Controller.MatrixBoxStateType.Match:
                    TweenLite.to(this._boxTexture, .25, { alpha: 1, ease: Sine.easeIn });
                    this._boxTexture.texture = PIXI.Texture.fromFrame(StyleInformation.MatrixFrames.BoxMatch);
                    this._numberText.style = new PIXI.TextStyle(StyleInformation.MatrixMatchState);
                    break;
                case Controller.MatrixBoxStateType.Empty:
                    this._numberText.style = new PIXI.TextStyle(StyleInformation.MatrixEmptyState);
                    break;
                case Controller.MatrixBoxStateType.Pass:
                    TweenLite.to(this._boxTexture, .25, { alpha: 1, ease: Sine.easeIn });
                    this._boxTexture.texture = PIXI.Texture.fromFrame(StyleInformation.MatrixFrames.BoxPass);
                    this._numberText.style = new PIXI.TextStyle(StyleInformation.MatrixNumberPassState);
                    break;
            }
        }

        /** Set orientation visuals according to DisplayOrientation (landscape/portrait) */
        public changeOrientation(orientation: DisplayOrientation) {
            switch (orientation) {
                case DisplayOrientation.landscape:
                    break;
                case DisplayOrientation.portrait:
                    break;
            }
        }

        /** change visual according to visual type 
       * @param type - visual type
       */
        public changeVisual(type: VisualType): void {
            switch (type) {
                case VisualType.normal:
                    break;
                case VisualType.turbo:
                    break;
                case VisualType.forward:
                    break;
            }
        }

        public set numberValueText(number: number) {
            this._numberText.text = number.toString();
        }

        public get controller() {
            return this._matrixBoxController;
        }
    }
}