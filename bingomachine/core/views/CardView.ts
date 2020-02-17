module Core.View {
      /** Importing  classes */
    import MainStage = Stages.MainStage;
    import CardController = Controller.CardController;

    type DynamicText = Parts.Text | Parts.BitmapText;

    export class CardView implements Interfaces.IDisplayVisual {

        private _mainStage: MainStage;
        private _cardController: CardController;

        private _container: Parts.Container;
        private _cardTableContainer: Parts.Container;
        private _cardButtonContainer: Parts.Container;
        private _cardBoxContainer: Parts.Container;

        private _cardTableBackround: Parts.Sprite;
        private _cardTableFrame: Parts.Sprite;
        private _cardTableLines: Parts.Sprite;
        private _monitorAnim: Parts.AnimatedSprite;

        private _newCardButton: Parts.BasicButton;
        private _newCardText: DynamicText;
        private _cardType: BingoType;

         /** Running when loading CardView class
          * @param mainStage - MainStage class
          */
        public constructor(mainStage: Stages.MainStage) {
            this._mainStage = mainStage;
            this._cardController = new CardController(this, mainStage);
            this.initProperties();
        }
          /** CardView class's init function */
        public initProperties() {
              /** Create Containers */
            this._container = new Parts.Container(this._mainStage.backgroundView.baseContainer, "CardContainer");
            this._cardTableContainer = new Parts.Container(this._container, "CardTableContainer");
            this._cardButtonContainer = new Parts.Container(this._container, "CardButtonContainer");

              /** Create Sprites */
            this._cardTableBackround = new Parts.Sprite(453, 572, StyleInformation.CardFrames.CardBackground, this._cardTableContainer, "CardBackground");
            this._monitorAnim = new Parts.AnimatedSprite(450, 572, Parts.AnimatedSprite.generateTextures(StyleInformation.MonitorAnim, 0, 59, "", 5), false, 0.35, this._cardTableContainer);
            this._monitorAnim.scale.set(.6, .6);
            this._monitorAnim.play();
            this._cardTableFrame = new Parts.Sprite(467, 577, StyleInformation.CardFrames.CardFrame, this._container, "CardFrame");
            this._cardTableLines = new Parts.Sprite(457, 572, StyleInformation.CardFrames.CardLines, this._cardTableContainer, "CardLines");

              /** Create Buttons */
            this._newCardButton = new Parts.BasicButton(139, 632, this._cardController.newCardButtonUp.bind(this._cardController), "", StyleInformation.UI.NewCardButton, this._cardButtonContainer, "NewCardButton");

             /** Create Texts */
            this._newCardText = Game.instance.language.createText(LanguageNames.NewCard, 450, 393, null, StyleInformation.NewCard, this._cardButtonContainer);

             /** Create Containers */
            this._cardBoxContainer = new Parts.Container(this._cardTableContainer, "CardButtonNumberContainer");   
        }

        /** set button state according to ButtonStateType
       *  @param state - Button state type
       */
        public setButtonState(state: ButtonStateType) {
            switch (state) {
                case ButtonStateType.response:
                    this._newCardButton.isEnabled = true;
                    break;
                case ButtonStateType.sendAction:
                    this._newCardButton.isEnabled = false;
                    break;
                case ButtonStateType.forward:
                    this._newCardButton.isEnabled = false;
                    break;
                case ButtonStateType.instant:
                    this._newCardButton.isEnabled = false;
                    break;
                case ButtonStateType.updateData:
                    this._newCardButton.isEnabled = true;
                    break;
            }
        }

        /** Play monitor animation*/
        public playMonitorAnim() {
            this._monitorAnim.resetAnimation();
            this._monitorAnim.play();
        }

        /** Play Card animation*/
        public playCardAnimation() {
            Controller.SoundController.instance.playCardVibrationSound();
            TweenLite.fromTo(this._cardTableBackround, .35, { angle: -1 }, { angle: 1, yoyo: true, repeat: 2, repeatDelay: .2, ease: Bounce.easeIn });
            TweenLite.fromTo(this._cardTableLines, .35, { angle: -1 }, {
                angle: 1, yoyo: true, repeat: 2, repeatDelay: .2, ease: Bounce.easeIn, onComplete: () => {
                    this._cardTableBackround.angle = 0;
                    this._cardTableLines.angle = 0;
                }
            });
            this._cardController.updateCardData(); 
            this.playMonitorAnim();
        }

        /** Set orientation visuals according to DisplayOrientation (landscape/portrait) */
        public changeOrientation(orientation: DisplayOrientation) {
            switch (orientation) {
                case DisplayOrientation.landscape:
                    this._cardTableBackround.position.set(453, 572);
                    this._cardTableFrame.position.set(467, 577);
                    this._cardTableLines.position.set(450, 572);
                    this._newCardButton.position.set(451, 424);
                    this._cardTableBackround.scale.set(1, 1);
                    this._cardTableFrame.scale.set(1, 1);
                    this._cardTableLines.scale.set(1, 1);
                    this._newCardButton.scale.set(1, 1);
                    this._newCardText.position.set(450, 393);
                    this._cardBoxContainer.scale.set(1, 1);
                    this._cardBoxContainer.position.set(0, 0);
                    break;
                case DisplayOrientation.portrait:
                    this._cardTableBackround.position.set(363, 1073);
                    this._cardTableFrame.position.set(379, 1078);
                    this._cardTableLines.position.set(360, 1073);
                    this._newCardButton.position.set(178, 917);
                    this._cardTableBackround.scale.set(1.3, 1.3);
                    this._cardTableFrame.scale.set(1.2, 1.2);
                    this._cardTableLines.scale.set(1.2, 1.2);
                    this._newCardButton.scale.set(1, 1);
                    this._newCardText.position.set(176, 885);
                    this._cardBoxContainer.scale.set(1.2, 1.2);
                    this._cardBoxContainer.position.set(-180, 388);
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

        public get container() {
            return this._cardTableContainer;
        }

        public get cardBoxContainer() {
            return this._cardBoxContainer;
        }

        public get mainStage() {
            return this._mainStage
        }

        public get controller() {
            return this._cardController;
        }
    }
}