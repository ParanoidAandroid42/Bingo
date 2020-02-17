module Core.View {
    /** Importing  classes */
    import PlayController = Controller.PlayController;

    export class PlayView implements Interfaces.IDisplayVisual{

        private _stage: Stages.MainStage;
        private _playController: PlayController;
        private _container: Parts.Container;
        private _playButton: Parts.BasicButton;
        private _playButtonEffect: Parts.AnimatedSprite;

        /** Running when loading class
         * @param stage - MainStage class
         */
        public constructor(stage: Stages.MainStage) {
            this._stage = stage;
            this._playController = new PlayController(this, stage);
            this.initProperties();
        }

         /** Main stage's init function */
        public initProperties() {

            /** Create Containers */
            this._container = new Parts.Container(this._stage.backgroundView.baseContainer, "PlayContainer");

            /** Create Buttons */
            this._playButton = new Parts.BasicButton(0, 0, this._playController.playButtonUp.bind(this._playController), "", StyleInformation.UI.PlayButton, this._container, "PlayButton");

            /** Create Mask for play button */
            let sideMask = new PIXI.Graphics();
            sideMask.beginFill(0xffffff, 1);
            sideMask.drawCircle(0, -3, 89);
            sideMask.endFill();
            this._container.addChild(sideMask);
            this._playButton.mask = sideMask;
        }

         /** play button effect*/
        public playButtonEffect() {
            this._playButtonEffect.resetAnimation();
            this._playButtonEffect.play();
            this._playButtonEffect.onComplete = () => {
            }
        }

        /** Set orientation visuals according to DisplayOrientation (landscape/portrait) */
        public changeOrientation(orientation: DisplayOrientation) {
            switch (orientation) {
                case DisplayOrientation.landscape:
                    this._container.position.set(997, 572);
                    this._container.scale.set(1, 1);
                    break;
                case DisplayOrientation.portrait:
                    this._container.position.set(584, 670);
                    this._container.scale.set(1.3, 1.3);
                    break;
            }
        }

        /** change visual according to VisualType */
        public changeVisual(type: VisualType): void {
            switch (type) {
                case VisualType.normal:
                    this._playButton.setFrames(StyleInformation.UI.PlayButton);
                    break;
                case VisualType.turbo:
                    break;
                case VisualType.forward:
                    this._playButton.setFrames(StyleInformation.UI.ForwardButton);
                    break;
            }
        }

         /** set button state according to ButtonStateType
          *  @param state - Button state type
          */
        public setButtonState(state: ButtonStateType) {
            switch (state) {
                case ButtonStateType.response:
                    this._playButton.isEnabled = true;
                    break;
                case ButtonStateType.sendAction:
                    this._playButton.isEnabled = false;
                    break;
                case ButtonStateType.forward:
                    this._playButton.isEnabled = true;
                    break;
                case ButtonStateType.instant:
                    this._playButton.isEnabled = false;
                    break;
                case ButtonStateType.updateData:
                    this._playButton.isEnabled = true;
                    break;
            }
        }

        public get controller() {
            return this._playController;
        }

        public get playButton() {
            return this._playButton;
        }

        public get container() {
            return this._container;
        }
    }
}