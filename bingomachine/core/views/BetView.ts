module Core.View {
    import BetController = Controller.BetController;
    type DynamicText = Parts.Text | Parts.BitmapText;

    export class BetView implements Interfaces.IDisplayVisual{

        private _stage: Stages.MainStage;
        private _betController: BetController;
        private _container: Parts.Container;
        private _screenBetValue: Parts.Sprite;
        private _betMinButton: Parts.BasicButton;
        private _betPlusButton: Parts.BasicButton;
        private _betValueText: DynamicText;

        public constructor(stage: Stages.MainStage) {
            this._stage = stage;
            this._betController = new BetController(this, stage);
            this.initProperties();
        }

         /** BetView class's init function */
        public initProperties(): void {

             /** Create Containers */
            this._container = new Parts.Container(this._stage.backgroundView.baseContainer, "BetViewContainer");

            /** Create Sprites */
            this._screenBetValue = new Parts.Sprite(961, 430, StyleInformation.BetScreen, this._container, "Screen");

            /** Create Texts */
            this._betValueText = Game.instance.language.createText(LanguageNames.BetValue, 0, 3, null, StyleInformation.BetValue, this._screenBetValue);

            /** Create Buttons */
            this._betMinButton = new Parts.BasicButton(871, 430, this._betController.betButtonUp.bind(this._betController, Controller.BetButtonType.Min), "", StyleInformation.UI.BetDownButton, this._container, "BetDownButton");
            this._betPlusButton = new Parts.BasicButton(1051, 430, this._betController.betButtonUp.bind(this._betController, Controller.BetButtonType.Plus), "", StyleInformation.UI.BetPlusButton, this._container, "BetPlusButton");
           
            this.betValueText = Controller.DataController.Instance.betValues[Controller.DataController.Instance.betIndex];
            this._betController.betStatus(Controller.BetButtonType.Min);
            this._betController.betStatus(Controller.BetButtonType.Plus);
            this.initEvents();
        }

         /**Create events*/
        private initEvents() {
            this._betMinButton.on('pointerdown', this._betController.betButtonDown.bind(this._betController, Controller.BetButtonType.Min), this);
            this._betMinButton.on('pointerupoutside', this._betController.betButtonUp.bind(this._betController, Controller.BetButtonType.Min), this);
            this._betPlusButton.on('pointerdown', this._betController.betButtonDown.bind(this._betController,  Controller.BetButtonType.Plus), this);
            this._betPlusButton.on('pointerupoutside', this._betController.betButtonUp.bind(this._betController, Controller.BetButtonType.Plus), this);
        }

        /** set button state according to ButtonStateType
        *  @param state - Button state type
        */
        public setButtonState(state: ButtonStateType) {
            switch (state) {
                case ButtonStateType.response:
                    this._betController.betStatus(Controller.BetButtonType.Min);
                    this._betController.betStatus(Controller.BetButtonType.Plus);
                    break;
                case ButtonStateType.sendAction:
                    this._betMinButton.isEnabled = false;
                    this._betPlusButton.isEnabled = false;
                    break;
                case ButtonStateType.forward:
                    this._betMinButton.isEnabled = false;
                    this._betPlusButton.isEnabled = false;
                    break;
                case ButtonStateType.instant:
                    this._betMinButton.isEnabled = false;
                    this._betPlusButton.isEnabled = false;
                    break;
                case ButtonStateType.updateData:
                    this._betController.betStatus(Controller.BetButtonType.Min);
                    this._betController.betStatus(Controller.BetButtonType.Plus);
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
                    this._container.position.set(0, 0);
                    break;
                case DisplayOrientation.portrait:
                    this._container.position.set(-378, 486);
                    break;
            }
        }

        public set betValueText(val: number) {
            this._betValueText.text = (val / 100).toFixed(2);
        }

        public get controller() {
            return this._betController;
        }

        public get mainStage() {
            return this._stage;
        }

        public get betMinButton() {
            return this._betMinButton;
        }

        public get betPlusButton() {
            return this._betPlusButton;
        }
    }
}