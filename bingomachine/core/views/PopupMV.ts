module Core.View {
     /**importing classes*/
    import PopupController = Controller.PopupController;
    import PopupButtonType = Controller.PopupButtonType;

    type DynamicText = Parts.Text | Parts.BitmapText;

    export class PopupMV implements Interfaces.IDisplayVisual{

        private _stage: Stages.MainStage;
        private _popupController: PopupController;
        private _popupContainer: Parts.Container;
        private _messageText: DynamicText;
        private _buttonText: DynamicText;
        private _headerText: DynamicText;
        private _errorPopuptable: Parts.Sprite;
        private _background: Parts.Sprite;
        private _button: Parts.BasicButton;

         /** Running when loading class
         * @param stage - MainStage class
         */
        public constructor(stage: Stages.MainStage) {
            this._stage = stage;
            this._popupController = new PopupController(this, stage);
            this.initProperties();
        }

        /** PopupMV class's init function */
        public initProperties(): void {

            /** Create Containers */
            this._popupContainer = new Parts.Container(this._stage, "ErrorPopupContainer");
            this._popupContainer.alpha = 0;
            this._popupContainer.visible = false;

            /** Create Sprites */
            this._background = new Parts.Sprite(640, 360, StyleInformation.BackgroundFrames.Black, this._popupContainer, "Background");
            this._background.scale.set(10, 10);
            this._background.alpha = .35;
            this._background.interactive = true;
            this._errorPopuptable = new Parts.Sprite(640, 344, StyleInformation.Popup, this._popupContainer, "ErrorPopuptable");

              /** Create Texts & Buttons*/
            this._headerText = Game.instance.language.createText(LanguageNames.ErrorMessageHeader, 640, 283, null, StyleInformation.ErrorMessageHeader, this._popupContainer);
            this._messageText = Game.instance.language.createText(LanguageNames.ErrorMessage, 640, 366, null, StyleInformation.ErrorMessageText, this._popupContainer);
            this._button = new Parts.BasicButton(640, 455, null, "", StyleInformation.UI.GeneralButton, this._popupContainer, "GENERALBUTTON");
            this._buttonText = Game.instance.language.createText(LanguageNames.GeneralButton, 640, 455, null, StyleInformation.GeneralButton, this._popupContainer);
        }

        /** Set button type according to PopupButtonType 
         * @param type - PopupButtonType
         */
        public setPopupButtonType(type: PopupButtonType) {
            switch (type) {
                case PopupButtonType.Reload:
                    this._buttonText.text = Game.instance.language.parse(LanguageNames.ReloadButton);
                    this._button.Callback = this._popupController.reloadGame.bind(this._popupController);
                    break;
                case PopupButtonType.ContinueGame:
                    this._buttonText.text = Game.instance.language.parse(LanguageNames.ContinueButton);
                    this._button.Callback = this._popupController.continueGame.bind(this._popupController);
                    break;
                case PopupButtonType.Okay:
                    this._buttonText.text = Game.instance.language.parse(LanguageNames.OkButton);
                    this._button.Callback = this._popupController.closePopup.bind(this._popupController);
                    break;
            }
        }

          /** set popup type
            * @param header - Header of popup
            * @param context - Context of popup
            * @param type - PopupButtonType
           * */
        public popupType(header: string, context: string, type: PopupButtonType) {
            this.tweenVisiblePopupContainer(true);
            this._headerText.text = header.toString();
            this._messageText.text = context;
            this.setPopupButtonType(type);
        }

         /** tween animation for popup visible
            * @param visible - Enable-Disable boolean
           * */
        public tweenVisiblePopupContainer(visible: boolean): void {
            this._popupContainer.visible = true;
            if (visible) {
                TweenLite.to(this._popupContainer, 0.5, { alpha: 1, ease: Sine.easeIn });
            } else {
                TweenLite.to(this._popupContainer, 0.5, { alpha: 0, ease: Sine.easeIn, onComplete: () => { this._popupContainer.visible = false; } });
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
                    this._popupContainer.position.set(0, 0);
                    break;
                case DisplayOrientation.portrait:
                    this._popupContainer.position.set(-270, 289);
                    break;
            }
        }

        public get popupContainer() {
            return this._popupContainer;
        }

        public get mainStage() {
            return this._stage;
        }

        public get popupController() {
            return this._popupController;
        }
    }
}