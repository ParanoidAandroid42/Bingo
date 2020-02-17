module Core.Controller {

    /** CardNumberState enum */
    export enum CardNumberState {
        Match = "Match",
        Empty = "Empty"
    }

    /** CardNumberController class's init function */
    import CardView = View.CardView;
    import CardNumberView = View.CardNumberView;

    export class CardNumberController {

        private _numberMode: CardNumberState;
        private _number: number;
        private _cardView: CardView;
        private _cardNumberView: CardNumberView;

          /** Running when loading class
         * @param cardView - CardView class
         * @param cardNumberView - CardNumberView class
         */
        public constructor(cardView: CardView, cardNumberView: CardNumberView) {
            this._cardNumberView = cardNumberView;
            this._cardView = cardView;
        }

        /**
         * Set cardnumberview's value's position
         * @param x -position x
         * @param y - position y
         */
        public setNumberPosition(x: number, y: number): void {
            this._cardNumberView.setValuesPosition(x, y);
        }

        public get number() {
            return this._number;
        }

        public set number(value: number) {
            this._cardNumberView.numberText = value;
            this._number = value;
        }

        public get numberStateType() {
            return this._numberMode;
        }

        public set numberStateType(type: CardNumberState) {
            this._numberMode = type;
            this._cardNumberView.playBoxAnim(type);
        }
    }
}