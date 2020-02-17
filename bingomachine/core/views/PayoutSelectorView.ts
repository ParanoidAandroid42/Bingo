module Core.View {
     /**importing classes*/
    import PayoutView = Core.View.PayoutView;
    import PayoutSelectorController = Controller.PayoutSelectorController;

    type DynamicText = Parts.Text | Parts.BitmapText;

    export class PayoutSelectorView implements Interfaces.IDisplayVisual {

        private _payoutView: PayoutView;
        private _payoutSelectorController: PayoutSelectorController;

        private _ballsCounter: number;

        private _ballsCounterText: DynamicText;
        private _valueText: DynamicText;

        private _indicator: Parts.Sprite;
        private _lineMatch: Parts.Sprite;

           /** Running when loading class
         * @param payoutView - PayoutView class
         */
        public constructor(payoutView: PayoutView) {
            this._payoutView = payoutView;
            this._payoutSelectorController = new PayoutSelectorController(payoutView, this);
            this.initProperties();
        }

           /** PayoutSelectorView class's init function */
        public initProperties(): void {

               /** Create Sprites */
            this._indicator = new Parts.Sprite(959, 88, StyleInformation.PayoutFrames.Indicator, this._payoutView.payoutSelectorContainer, "Indicator");
            this._indicator.scale.set(1.05, 1.05);
            this._lineMatch = new Parts.Sprite(959, 88, StyleInformation.PayoutFrames.LineMatch, this._payoutView.payoutSelectorContainer, "LineMatch");
            this._lineMatch.scale.set(.75, 1);

              /** Create Texts */
            let language = LanguageNames.PayoutSelectorBallsCounterValue;
            let style = StyleInformation.PayoutSelectorBallsEmptyState;
            this._ballsCounterText = Game.instance.language.createText(language, 885, 89, null, style, this._payoutView.payoutSelectorContainer, Anchor.left);

            language = LanguageNames.PayoutSelectorValue;
            style = StyleInformation.PayoutSelectorEmptyState;
            this._valueText = Game.instance.language.createText(language, 1033, 89, null, style, this._payoutView.payoutSelectorContainer, Anchor.right);           
        }

        /**
         * set indicator,ballsCounterText,valueText and lineMatch position according to parameters
         * @param x - position x
         * @param y - position y
         */
        public valuesPosition(x: number, y: number): void {
            this._indicator.position.set(x, y-1);
            this._ballsCounterText.position.set(x-20, y);
            this._valueText.position.set(x + 20, y);
            this._lineMatch.position.set(x - 1, y);
        }

        /**
         * set valueText and ballsCounterText value according to parameters
         * @param ballsCounter - ball's counter
         * @param value - ball's payout value
         */
        public setValues(ballsCounter: number, value: number): void {
            this._ballsCounter = ballsCounter;
            this._ballsCounterText.text = Game.instance.language.parse(LanguageNames.PayoutSelectorBallsCounterValue, this._ballsCounter);
            this._valueText.text = Controller.DataController.Instance.resolveFormat(value / 100);
        }

         /** Play selector anim according to  numberState
          * @param numberState - IndicatorState value
          */
        public playSelectorAnim(numberState: Controller.IndicatorState): void {
            this._indicator.alpha = 0;
            this._lineMatch.alpha = 0;
            switch (numberState) {
                case Controller.IndicatorState.Match:
                    this._indicator.alpha = 1;
                    this._lineMatch.alpha = 1;
                    this._ballsCounterText.style = new PIXI.TextStyle(StyleInformation.PayoutSelectorBallsMatchState);
                    this._valueText.style = new PIXI.TextStyle(StyleInformation.PayoutSelectorMatchState);
                    break;
                case Controller.IndicatorState.Empty:
                    this._ballsCounterText.style = new PIXI.TextStyle(StyleInformation.PayoutSelectorBallsEmptyState);
                    this._valueText.style = new PIXI.TextStyle(StyleInformation.PayoutSelectorEmptyState);
                    break;
                case Controller.IndicatorState.Loop:
                    this._lineMatch.alpha = 1;
                    this._indicator.alpha = 1;
                    TweenMax.to(this._indicator.scale, 1.06, { x: 1.12, y: 1.08, repeat: -1, yoyo: true, ease: Power2.easeInOut });
                    TweenMax.to(this._ballsCounterText.scale, 1.05, { x: 1.08, y: 1.08, repeat: -1, yoyo: true, ease: Power2.easeInOut });
                    TweenMax.to(this._valueText.scale, 1.05, { x: 1.08, y: 1.08, repeat: -1, yoyo: true, ease: Power2.easeInOut });
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

        /** Set orientation visuals according to DisplayOrientation (landscape/portrait) */
        public changeOrientation(orientation: DisplayOrientation) {
            switch (orientation) {
                case DisplayOrientation.landscape:
                    break;
                case DisplayOrientation.portrait:
                    break;
            }
        }

        public get ballsCounter() {
            return this._ballsCounter;
        }

        public destroy() {
            this._indicator.destroy();
            this._lineMatch.destroy();
            this._ballsCounterText.destroy();
            this._valueText.destroy();
        }

        public get controller() {
            return this._payoutSelectorController;
        }
    }
}