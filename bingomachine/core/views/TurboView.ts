module Core.View {
     /**importing classes*/
    import TurboController = Controller.TurboController;

    type DynamicText = Parts.Text | Parts.BitmapText;

    export class TurboView implements Interfaces.IDisplayVisual{

        private _stage: Stages.MainStage;
        private _turboController: TurboController;
        private _container: Parts.Container;
        private _turboButton: Parts.BasicButton;
        private _buttonEffect: Parts.AnimatedSprite;
        private _turboText: DynamicText;

         /** Running when loading class
         * @param stage - MainStage class
         */
        public constructor(stage: Stages.MainStage) {
            this._stage = stage;
            this._turboController = new TurboController(this, stage);
            this.initProperties();
        }

         /** TurboView class's init function */
        public initProperties() {

            /** Create Containers */
            this._container = new Parts.Container(this._stage.backgroundView.baseContainer, "TurboContainer");

            /** Create Buttons */
            this._turboButton = new Parts.BasicButton(0, 0, this._turboController.turboButtonUp.bind(this._turboController), "", StyleInformation.UI.TurboButtonOut, this._container, "TurboButton");

            /** Create Mask for turbobutton */
            let sideMask = new PIXI.Graphics();
            sideMask.beginFill(0xffffff, 1);
            sideMask.drawCircle(this._turboButton.position.x - 8, this._turboButton.position.y, 97);
            sideMask.endFill();
            this._container.addChild(sideMask);
            this._turboButton.mask = sideMask;

             /** Create Texts */
            this._turboText = Game.instance.language.createText(LanguageNames.TurboButton, 0, 25, null, StyleInformation.TurboButtonOut, this._turboButton);

               /** Create Animation sprite */
            this._buttonEffect = new Parts.AnimatedSprite(0, -75, Parts.AnimatedSprite.generateTextures(StyleInformation.TurboButtonEffect, 19, 43, "", 5), false, 0.35, this._turboButton);
            this._buttonEffect.scale.set(.8, .8);
        }

        /** play turbo effect animation */
        public playTurboButtonEffect() {
            this._buttonEffect.resetAnimation();
            this._buttonEffect.play();
        }


        /** set button state according to ButtonStateType
             *  @param state - Button state type
             */
        public setButtonState(state: ButtonStateType) {
            switch (state) {
                case ButtonStateType.response:
                    this._turboButton.isEnabled = true;
                    break;
                case ButtonStateType.sendAction:
                    this._turboButton.isEnabled = false;
                    break;
                case ButtonStateType.turboDisabled:
                    this._turboButton.isEnabled = false;
                    break;
                case ButtonStateType.forward:
                    if (this._stage.bingoType == BingoType.turbo) 
                        this._turboButton.isEnabled = false;
                    else
                        this._turboButton.isEnabled = true;
                    break;
                case ButtonStateType.instant:
                    this._turboButton.isEnabled = false;
                    break;
                case ButtonStateType.updateData:
                    this._turboButton.isEnabled = true;
                    break;
            }
        }

        /** change visual according to visual type 
      * @param type - visual type
      */
        public changeVisual(type: VisualType): void {
            switch (type) {
                case VisualType.normal:
                    this._turboButton.setFrames(StyleInformation.UI.TurboButtonOut);
                    this._turboText.style = new PIXI.TextStyle(StyleInformation.TurboButtonOut);
                    break;
                case VisualType.turbo:
                    this._turboButton.setFrames(StyleInformation.UI.TurboButtonOn);
                    this._turboText.style = new PIXI.TextStyle(StyleInformation.TurboButtonOut);
                    break;
                case VisualType.forward:
                    if (this._stage.bingoType == BingoType.turbo) {
                        this._turboButton.setFrames(StyleInformation.UI.TurboButtonOn);
                        this._turboText.style = new PIXI.TextStyle(StyleInformation.TurboButtonOut);
                    } else {
                        this._turboButton.setFrames(StyleInformation.UI.TurboButtonOut);
                        this._turboText.style = new PIXI.TextStyle(StyleInformation.TurboButtonOut);
                    }
                    break;
                case VisualType.instant:
                    this._turboButton.setFrames(StyleInformation.UI.TurboButtonOut);
                    this._turboText.style = new PIXI.TextStyle(StyleInformation.TurboButtonDisabled);
                    break;
            }
        }

        /** Set orientation visuals according to DisplayOrientation (landscape/portrait) */
        public changeOrientation(orientation: DisplayOrientation) {
            switch (orientation) {
                case DisplayOrientation.landscape:
                    this._container.position.set(805, 557);
                    this._container.scale.set(1, 1);
                    break;
                case DisplayOrientation.portrait:
                    this._container.position.set(141, 670);
                    this._container.scale.set(1.3, 1.3);
                    break;
            }
        }

        public get container() {
            return this._container;
        }

        public get controller() {
            return this._turboController;
        }
    }
}