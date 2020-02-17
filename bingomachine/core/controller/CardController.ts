module Core.Controller {
     /** Importing  classes */
    import CardView = View.CardView;

    export class CardController {

        private _cardView: CardView;
        private _stage: Stages.MainStage;
        private _cardNumberView: View.CardNumberView[] = [];

          /** Running when loading class
         * @param cardView - CardView class
         * @param stage - stage class
         */
        public constructor(cardView: CardView, stage: Stages.MainStage) {
            this._stage = stage;
            this._cardView = cardView;
        }

          /** running when new card button up */
        public newCardButtonUp(): void {
            SoundController.instance.playNewCardSound();
            this._stage.bingoType = BingoType.normal;
            this._stage.visualType = VisualType.instant; 
            Game.instance.service.send(SendAction.newCard);
            this._stage.buttonState = ButtonStateType.sendAction;
        }

           /** set new data from get response when new card button up */
        public setNewData(): void {
            this.destroyCardNumberView();
            this._stage.bingoMatrixView.controller.removeMatrixData();
            this._stage.payoutView.controller.updatePayoutData();
            this._cardView.playCardAnimation();
        }

         /** Destroy card number view's*/
        private destroyCardNumberView() {
       //     if (!this._cardNumberView) return;
            for(let i = 0; i <this._cardNumberView.length; i++)
                this._cardNumberView[i].destroy();
        }

          /** update card data*/
        public updateCardData() {
            this._cardNumberView = [];
            let counter = 0;
            let xOffset = 36.3;
            let yOffset = 33;
            for (let i = 0; i < DataController.Instance.columnCounter; i++) {
                for (let j = 0; j < DataController.Instance.lineCounter; j++) {
                    if (DataController.Instance.cardMatrix[counter] != null) {
                        let number = new View.CardNumberView(this._cardView);
                        number.numberText = DataController.Instance.cardMatrix[counter];
                        number.setValuesPosition(305 + i * xOffset, 541 + j * yOffset);
                        number.controller.numberStateType = Controller.CardNumberState.Empty;
                        number.playCardNumberTextAnimation();
                        number.idNumber = DataController.Instance.cardMatrix[counter];
                        this._cardNumberView.push(number);
                    }
                    counter++;
                }
            }
            this._stage.bingoMatrixView.controller.removeMatrixData();
        }

        public get cardNumberView() {
            return this._cardNumberView;
        }
    }
}