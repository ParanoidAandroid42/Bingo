module Core.View {
     /**importing classes*/
    import PayoutController = Controller.PayoutController;

    export class PayoutView implements Interfaces.IDisplayVisual{

        private _stage:  Stages.MainStage;
        private _payoutController: PayoutController;

        private _container: Parts.Container;
        private _payoutSelectorContainer: Parts.Container;

        private _background: Parts.Sprite;
        private _frame: Parts.Sprite;
        private _ballsLine: Parts.Sprite;

         /** Running when loading class
         * @param stage - MainStage class
         */
        public constructor(stage:  Stages.MainStage) {
            this._stage = stage;
            this._payoutController = new PayoutController(this, stage);
            this.initProperties();
        }

         /** PayoutView class's init function */
        public initProperties() {
            /** Create Containers */
            this._container = new Parts.Container(this._stage.backgroundView.baseContainer, "PayoutContainer");

             /** Create Sprites */
            this._background = new Parts.Sprite(959, 191, StyleInformation.PayoutFrames.Background, this._container, "PayoutBackground");
            this._frame = new Parts.Sprite(975, 191, StyleInformation.PayoutFrames.FrameNormal, this._container, "PayoutFrame");
            this._ballsLine = new Parts.Sprite(958, 194, StyleInformation.PayoutFrames.BallsLine, this._container, "PayoutBallsLine");
            this._ballsLine.scale.set(.7, 1);

              /** Create Containers */
            this._payoutSelectorContainer = new Parts.Container(this._container, "PayoutSelectorContainer");
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
                    this._container.scale.set(1, 1);
                    this._container.position.set(0, 0);
                    break;
                case DisplayOrientation.portrait:
                    this._container.scale.set(1.2, 1.2);
                    this._container.position.set(-577, 100)
                    break;
            }
        }

        public get controller() {
            return this._payoutController;
        }

        public get container() {
            return this._container;
        }

        public get payoutSelectorContainer() {
            return this._payoutSelectorContainer;
        }

        public get mainStage() {
            return this._stage;
        }
    }
}