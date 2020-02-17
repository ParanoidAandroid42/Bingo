/// <reference path="../modules/stage.ts" />
module Core.Stages {
    export class MainStage extends Modules.Stage {

        private _soundController: Controller.SoundController;
        private _animationController: Controller.AnimationsController;

        private _backgroundView: View.BackgroundView;
        private _bingoMatrixView: View.MatrixView;
        private _cardView: View.CardView;
        private _machineView: View.MachineView;
        private _payoutView: View.PayoutView;
        private _playView: View.PlayView;
        private _turboView: View.TurboView;
        private _betView: View.BetView;
        private _bigWinPopupView: View.BigWinPopupView;
        private _uiView: View.UIView;
        private _popupMV: View.PopupMV;

        private _visualType: VisualType;
        private _bingoType: BingoType;
        private _buttonState: ButtonStateType;
        private _orientation: DisplayOrientation;

         /** Running when loading stage */
        public init(): void {
             /** Creating sound manager (sound manager is singleton class) */
            this._soundController = new Controller.SoundController();
            /** Creating animation manager (animation manager is singleton class) */
            this._animationController = new Controller.AnimationsController();
            this._animationController.stage = this;
            this.initProperties();
        }
        
        /** Main stage's init function */
        private initProperties(): void {
            this.updateData();
            this.createVisuals();
            this.setDisplayOrientation();
            this.initEvents();

            this._soundController.playAmbianceNormalSound();
            this._cardView.controller.setNewData();
            this._visualType = VisualType.normal;
            this._bingoType = BingoType.normal;
        }

         /**Create events*/
        private initEvents() {
            /** callback function when orientation change */
            Game.instance.display.on(ListenerType.orientationchange, (change) => {
                this.orientation = change;
            }, this);

            /** callback function when display resize */
            Game.instance.display.on(ListenerType.resize, (change) => {
                this.orientation = change;
            }, this);
        }

        /** Update display orientation when stage load */
        private setDisplayOrientation() {
            window.innerWidth > window.innerHeight ? this.orientation = DisplayOrientation.landscape : this.orientation = DisplayOrientation.portrait;
        }

        /** Update service data */
        public updateData(): void {
            Game.instance.service.on(ListenerType[ListenerType.response], (data) => {
                Controller.DataController.Instance.updateData(data);
                switch (data.clientAction) {
                    case SendAction.globeSelect:
                        this.visualType = VisualType.forward;
                        this.buttonState = ButtonStateType.forward;
                        Controller.AnimationsController.Instance.sortScenarioAnimation();
                        break;
                    case SendAction.newCard:
                        this.visualType = VisualType.normal;
                        this.buttonState = ButtonStateType.response;
                        this._cardView.controller.setNewData();
                        break;
                }
            }, this);
        }

          /** Set orientation visuals according to DisplayOrientation (landscape/portrait) */
        public set orientation(orientation: DisplayOrientation) {
            this._betView.changeOrientation(orientation);
            this._backgroundView.changeOrientation(orientation);
            this._bingoMatrixView.changeOrientation(orientation);
            this._payoutView.changeOrientation(orientation);
            this._playView.changeOrientation(orientation);
            this._turboView.changeOrientation(orientation);
            this._machineView.changeOrientation(orientation);
            this._cardView.changeOrientation(orientation);
            this._bigWinPopupView.changeOrientation(orientation);
            this._uiView.changeOrientation(orientation);
            this._popupMV.changeOrientation(orientation);
            this._orientation = orientation;
        }

        /** *create game's view classes*/
        public createVisuals() {
            this._backgroundView = new View.BackgroundView(this);
            this._bingoMatrixView = new View.MatrixView(this);
            this._betView = new View.BetView(this);
            this._uiView = new View.UIView(this);
            this._payoutView = new View.PayoutView(this);
            this._playView = new View.PlayView(this);
            this._turboView = new View.TurboView(this);
            this._machineView = new View.MachineView(this);
            this._cardView = new View.CardView(this);
            this._bigWinPopupView = new View.BigWinPopupView(this);
            this._popupMV = new View.PopupMV(this);
        }

         /** change visuals according to visual type 
         * @param type - visual type
         */
        public set visualType(type: VisualType) {
            if (this._visualType != type) {
                this._playView.changeVisual(type);
                this._machineView.changeVisual(type);
                this._backgroundView.changeVisual(type);
                this._bingoMatrixView.changeVisual(type);
                this._playView.changeVisual(type);
                this._turboView.changeVisual(type);
                this._visualType = type;
            }
        }

        /**Set current animation state
         * @param buttonState - button state type
         */
        public set buttonState(buttonState: ButtonStateType) {
            this._turboView.setButtonState(buttonState);
            this._cardView.setButtonState(buttonState);
            this._betView.setButtonState(buttonState);
            this._playView.setButtonState(buttonState);
            this._uiView.setButtonState(buttonState);
        }

        public get buttonState() {
            return this._buttonState;
        }

        /** set bingo type and change visuals according to BingoType.
         * @param type - Bingo Type
         * */
        public set bingoType(type: BingoType) {
            this._bingoType = type;
        }

        public get bingoType() {
            return this._bingoType;
        }

        /** Running when destroying stage*/
        public dispose() {
        }

        public get cardView() {
            return this._cardView;
        }

        public get turboView() {
            return this._turboView;
        }

        public get playView() {
            return this._playView;
        }

        public get machineView() {
            return this._machineView;
        }

        public get bingoMatrixView() {
            return this._bingoMatrixView;
        }

        public get payoutView() {
            return this._payoutView;
        }
        
        public get betView() {
            return this._betView;
        }

        public get backgroundView() {
            return this._backgroundView;
        }

        public get bigwinPopupView() {
            return this._bigWinPopupView;
        }

        public get uiView() {
            return this._uiView;
        }

        public get errorPopupMV() {
            return this._popupMV;
        }
    }
}