
module Core.View {
    /**importing classes*/
    import UIController = Controller.UIController;

    interface MenuButtons<T> {
        [K: string]: T;
    }

    type DynamicText = Parts.Text | Parts.BitmapText;

    export class UIView implements Interfaces.IDisplayVisual{

        private _stage: Stages.MainStage;
        private _uiController: UIController;

        private _container: Parts.Container;
        private _sideContainer: Parts.Container;
        private _footerContainer: Parts.Container;

        private _menuButton: Parts.BasicButton;
        private _menuBarButtons: MenuButtons<Parts.BasicButton> = {};

        private _footerBackground: Parts.Sprite;

        private _winText: DynamicText;
        private _winValue: DynamicText;
        private _modeText: DynamicText;
        private _creditText: DynamicText;
        private _creditValue: DynamicText;

        private _dimGraphics: PIXI.Graphics;
        private _dimGraphicss: PIXI.Graphics;

          /** Running when loading UIView class
          * @param stage - MainStage class
          */
        public constructor(stage: Stages.MainStage) {
            this._stage = stage;
            this._uiController = new UIController(this, stage);
            this.initProperties();
        }

        /** UIView class's init function */
        public initProperties() {
             /** Create Containers */
            this._container = new Parts.Container(this._stage, "UIContainer");
            this._sideContainer = new Parts.Container(this._container, "SideContainer");
            this._footerContainer = new Parts.Container(this._container, "FooterContainer");

            this._dimGraphics = new PIXI.Graphics();
            this._dimGraphics.beginFill(0x000000, 1);
            this._dimGraphics.drawRect(0, 0, 1900, 300);
            this._dimGraphics.endFill();

            /** Create Sprites */
            this._footerBackground = new Parts.Sprite(640, 820, this._dimGraphics.generateCanvasTexture(), this._footerContainer, "FooterBackground");

             /** Create Buttons */
            this._menuButton = new Parts.BasicButton(191, 702, this._uiController.menuButtonUp.bind(this._uiController), "", StyleInformation.UI.Menu, this._footerContainer, "MenuButton");
            this._menuButton.scale.set(.6, .6);
            this.createMenuButton();

             /** Create Texts */
            this._winText = Game.instance.language.createText(LanguageNames.Win, 0, 0, null, StyleInformation.Win, this._footerContainer, Anchor.center);
            this._winValue = Game.instance.language.createText(LanguageNames.WinValue, 0, 0, null, StyleInformation.WinValue, this._footerContainer, Anchor.center);
            this._modeText = Game.instance.language.createText(LanguageNames.ModeText, 0, 0, null, StyleInformation.Mode, this._footerContainer);
            this._creditText = Game.instance.language.createText(LanguageNames.Balance, 0, 0, null, StyleInformation.Balance, this._footerContainer, Anchor.center);
            this._creditValue = Game.instance.language.createText(LanguageNames.BalanceValue, 0, 0, null, StyleInformation.BalanceValue, this._footerContainer, Anchor.center);           
            this._creditValue.addChild(this._creditText);

            this.updateCreditValueText(Controller.DataController.Instance.credit);
        }

          /** Create menu buttons according to service menu parameters*/
        private createMenuButton() {
            let iOS = false;
            try { iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) } catch (e) { }  //geçici

            if (Game.instance.config.menubar.history)
                this.addMenuButton("History");

            if (Game.instance.config.menubar.help)
                this.addMenuButton("Help");

            if (Game.instance.config.menubar.home)
                this.addMenuButton("Home");

            if (Game.instance.config.menubar.volume)
                this.addMenuButton("Sound");

            this.addMenuButton("FullScreen");
            this._menuBarButtons["FullScreen"].visible = !iOS;
        }

          /** add menu buttons*/
        private addMenuButton(name: string) {
            let y = this._menuButton.position.y - (55 * (this._sideContainer.children.length + 1));
            let button;
            switch (name) {
                case "History":
                    button = new Parts.BasicButton(0, y, this._uiController.historyButtonUp.bind(this._uiController), "",
                        StyleInformation.UI.History, this._sideContainer, name);
                    break;
                case "Help":
                    button = new Parts.BasicButton(0, y, this._uiController.helpButtonUp.bind(this._uiController), "",
                        StyleInformation.UI.Help, this._sideContainer, name);
                    break;
                case "Home":
                    button = new Parts.BasicButton(0, y, this._uiController.homeButtonUp.bind(this._uiController), "",
                        StyleInformation.UI.Home, this._sideContainer, name);
                    break;
                case "Sound":
                    button = new Parts.BasicButton(0, y, this._uiController.soundButtonUp.bind(this._uiController), "",
                        StyleInformation.UI.SoundOn, this._footerContainer, name);
                    break;
                case "FullScreen":
                    button = new Parts.BasicButton(0, y, this._uiController.fullScreenButtonUp.bind(this._uiController), "",
                        StyleInformation.UI.FullScreen, this._footerContainer, name);
                    break;
            }
            this._menuBarButtons[name] = button;
            this._menuBarButtons[name].scale.set(.6, .6);
        }

        /** Check Mode type (change mode text according service's mode parameter)*/
        private checkModeType() {
            let funText = Game.instance.language.parse("ModeFun");
            let modeText = Game.instance.language.parse("ModeText");
            Game.instance.service.config.mode != "real" ? this._modeText.text = funText : this._modeText.text = modeText;
        }

        /** set button state according to ButtonStateType
         *  @param state - Button state type
         */
        public setButtonState(state: ButtonStateType) {
            switch (state) {
                case ButtonStateType.response:
                    this._menuBarButtons["History"].isEnabled = true;
                    break;
                case ButtonStateType.sendAction:
                    this._menuBarButtons["History"].isEnabled = false;
                    break;
                case ButtonStateType.forward:
                    this._menuBarButtons["History"].isEnabled = false;
                    break;
                case ButtonStateType.instant:
                    this._menuBarButtons["History"].isEnabled = false;
                    break;
                case ButtonStateType.updateData:
                    this._menuBarButtons["History"].isEnabled = true;
                    break;
            }
        }

         /** Play Menubar Amimation
          * @param open - menubar on or off boolean
          */
        public playMenuBarAnimation(open: boolean) {
            let y,tint;
            open ? y = 0 : y = (this._sideContainer.children.length + 1) * 60;
            TweenLite.to(this._sideContainer, 0.25, { y: y, ease: Back.easeOut.config(1, 1)});
        }

          /** Change sound frame
           * @param soundOn - sound on or off boolean
           */
        public changeSoundFrame(sound: boolean) {
            let soundTexture;
            sound ? soundTexture = StyleInformation.UI.SoundOn : soundTexture = StyleInformation.UI.SoundOff;
            this._menuBarButtons["Sound"].setFrames(soundTexture);
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
                    this._menuButton.position.set(185 - Game.instance.display.offsetPosition(Core.Managers.PositionType.PositionXForLandscape), 698);
                    if (this._menuBarButtons["Sound"])
                        this._menuBarButtons["Sound"].position.set(240 - Game.instance.display.offsetPosition(Core.Managers.PositionType.PositionXForLandscape), 698);
                    if (this._menuBarButtons["FullScreen"])
                        this._menuBarButtons["FullScreen"].position.set(1094 + Game.instance.display.offsetPosition(Core.Managers.PositionType.PositionXForLandscape), 698);
                    this._winText.position.set(240 - Game.instance.display.offsetPosition(Core.Managers.PositionType.PositionXForLandscape) + this._winText.width / 2 + 30, 698);
                    this._winValue.position.set(this._winText.position.x + this._winText.width / 2 + 35, 698);
                    this._creditText.position.set(-this._creditText.width / 2 - this._creditValue.width / 2 - 5, 0);
                    this._creditValue.position.set(1094 + Game.instance.display.offsetPosition(Core.Managers.PositionType.PositionXForLandscape) - this._creditValue.width / 2 - 35, 698);
                    this._sideContainer.position.set(185 - Game.instance.display.offsetPosition(Core.Managers.PositionType.PositionXForLandscape), (this._sideContainer.children.length + 1) * 60);
                    this._modeText.visible = true;
                    this._modeText.position.set(640, 698);
                    break;
                case DisplayOrientation.portrait:
                    this._menuButton.position.set(24, 698);
                    if (this._menuBarButtons["FullScreen"]) this._menuBarButtons["FullScreen"].position.set(696, 698);
                    if (this._menuBarButtons["Sound"]) this._menuBarButtons["Sound"].position.set(this._menuButton.x + 55, 698);
                    this._winText.position.set(this._menuButton.x + 55 + this._winText.width / 2 + 30, 700);
                    this._winValue.position.set(this._winText.position.x + this._winText.width / 2 + 35, 698);
                    this._creditValue.position.set(696 - this._creditValue.width / 2 - 35, 698);
                    this._creditText.position.set(-this._creditText.width / 2 - this._creditValue.width / 2 - 5, 0);
                    this._sideContainer.position.set(24, (this._sideContainer.children.length + 1) * 60);
                    this._container.position.set(0, Game.instance.display.offsetPosition(Core.Managers.PositionType.PositionYForPortrait) - 80);
                    if (Game.instance.service.config.mode == "real")
                        this._modeText.visible = false;
                    this._modeText.position.set(346, 698);
                    break;
            }
        }

          /** update credit's value and position */
        public updateCreditValueText(val:number) {
            this._creditValue.text = Controller.DataController.Instance.resolveFormat(val / 100);
            this._creditText.position.set(-this._creditText.width / 2 - this._creditValue.width / 2 - 5, 0);
            this._creditValue.position.set(this._menuBarButtons["FullScreen"].position.x - this._creditValue.width / 2 - 35, 698);
        }

          /** update win's value and position */
        public updateWinValue() {
            TweenLite.fromTo(this._winValue.scale, .35, { x: 1.2, y: 1.2 }, { x: 1, y: 1, yoyo: true, repeat: 3, repeatDelay: .2, ease: Bounce.easeIn });
            this._winValue.text = Controller.DataController.Instance.resolveFormat((Controller.DataController.Instance.earnCents / 100));
        }

        public get fullScreenButton() {
            return this._menuBarButtons["FullScreen"];
        }

        public get winValueText() {
            return this._winValue.text;
        }

        /**set win value */
        public set winValueText(val) {
            this._winValue.text = val;
            this._winValue.position.set(this._winText.position.x + this._winText.width / 2 + 35, 698);
        }

        public get container() {
            return this._container;
        }
    }
}