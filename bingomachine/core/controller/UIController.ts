module Core.Controller {

    /**importing classes*/
    import UIView = View.UIView;

    export class UIController {

        private _UIView: UIView;
        private _stage: Stages.MainStage;
        private _isSoundOn: boolean = true;
        private _isFullScreen: boolean = false;
        private _isOpenContainer: boolean = false;

         /** Running when UIView class
         * @param uIView - UIView class
         * @param stage - stage class
         */
        public constructor(uIView: UIView, stage: Stages.MainStage) {
            this._stage = stage;
            this._UIView = uIView;
            this.initEvents();
        }

        /**Create events*/
        private initEvents() {
            this.checkFullScreen();
        }

        /**check fullscreen event*/
        public checkFullScreen() {
            Game.instance.display.on(ListenerType.fullscreenchange, (fullscreen) => {
                let asset;
                fullscreen ? asset = StyleInformation.UI.Minimize : asset = StyleInformation.UI.FullScreen;
                this._UIView.fullScreenButton.setFrames(asset);
            })
        }

          /** Running when history button up*/
        public historyButtonUp() {
            window.open(DataController.Instance.gameHistory, "_blank");
        }

          /** Running when home button up*/
        public homeButtonUp() {
            Essentials.GameUI.backToHome();
        }

          /** Running when help button up*/
        public helpButtonUp(): void {
            SoundController.instance.playBetChangedSound();
            window.open(<string>Game.instance.config.menubar.help);
        }

         /** Running when fullscreen button up*/
        public fullScreenButtonUp(): void {
            SoundController.instance.playBetChangedSound();
            Game.instance.display.toggleFullscreen();
        }

        /** Running when menu button up*/
        public menuButtonUp(button: Parts.BasicButton): void {
            this._isOpenContainer = !this._isOpenContainer;
            SoundController.instance.playBetChangedSound();
            this._UIView.playMenuBarAnimation(this._isOpenContainer);
        }

          /** Running when sound button up*/
        public soundButtonUp(): void {
            SoundController.instance.playBetChangedSound();
            SoundController.instance.muteSound(this._isSoundOn);
            this._isSoundOn = !this._isSoundOn;
            this._UIView.changeSoundFrame(this._isSoundOn);
        }
    }
}