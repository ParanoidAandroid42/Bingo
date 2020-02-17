module Core.View {
      /**importing classes*/
    import CardView = Core.View.CardView;
    import CardNumberController = Controller.CardNumberController;

    type DynamicText = Parts.Text | Parts.BitmapText;

    export class CardNumberView implements Interfaces.IDisplayVisual{

        private _cardView: CardView;
        private _cardNumberController: CardNumberController;
        private _numberText: DynamicText;
        private _boxTexture: Parts.Sprite;
        private _numberId: number;

         /** Running when loading class
         * @param cardView - CardView class
         */
        public constructor(cardView: CardView) {
            this._cardView = cardView;
            this._cardNumberController = new CardNumberController(cardView, this);
            this.initProperties();
        }

        /** CardNumberView class's init function */
        public initProperties(): void {
            this._boxTexture = new Parts.Sprite(453, 572, StyleInformation.CardFrames.CardMatchBox, this._cardView.cardBoxContainer, "BoxTexture");
            this._numberText = Game.instance.language.createText(LanguageNames.CardNumberValue, 460, 572, null, StyleInformation.CardNumberEmptyState, this._cardView.cardBoxContainer);
        }


         /**play box's animation according to numberState
          * @param numberState - CardNumberState
          * */
        public playBoxAnim(numberState: Controller.CardNumberState): void {
            this._boxTexture.alpha = 0;
            switch (numberState) {
                case Controller.CardNumberState.Match:
                    TweenLite.to(this._boxTexture, .5, { alpha: 1, ease: Sine.easeIn });
                    this._boxTexture.texture = PIXI.Texture.fromFrame(StyleInformation.CardFrames.CardMatchBox);
                    this._numberText.style = new PIXI.TextStyle(StyleInformation.CardNumberMatchState);
                    break;
                case Controller.CardNumberState.Empty:
                    this._numberText.style = new PIXI.TextStyle(StyleInformation.CardNumberEmptyState);
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

        /** play number text's animation */
        public playCardNumberTextAnimation() {
            TweenLite.fromTo(this._numberText, .25, { alpha: 0 }, { alpha: 1, ease: Sine.easeIn });
        }

        /** Set values's position
         * @param x - position x
         * @param y - position y
         */
        public setValuesPosition(x: number, y: number): void {
            this._numberText.position.set(x + 1, y);
            this._boxTexture.position.set(x, y - 2);
        }

        public set numberText(number: number) {
            this._numberText.text = number.toString();
        }

        public get controller() {
            return this._cardNumberController;
        }

        public destroy() {
            this._boxTexture.destroy();
            this._numberText.destroy();
        }

        public set idNumber(val: number) {
            this._numberId = val;
        }

        public get idNumber() {
            return this._numberId;
        }
    }
}