
module Core.Controller {
    /**importing classes*/
    import PopupMV = View.PopupMV;

    /**Popup Button Type
     *@param Reload - Reload button
     *@param ContinueGame - ContinueGame button
     *@param Okay - Okay button
     */
    export enum PopupButtonType {
        Reload,
        ContinueGame,
        Okay
    }

     /**Popup Type for showing popup*/
    export enum PopupType {
        /**Status Errror*/
        Status = "Status", 
        /**Parse Errror*/
        Parse = "Parse",
        /**Connection Errror*/
        Websocket = "Websocket",
        /**MessageId Errror*/
        MessageId = "MessageId",
        /**Insufficient funds for the current bet level.*/
        InsufficientBalanceCurrentBetLevel = "InsufficientBalanceCurrentBetLevel",
        /*Insufficient funds for the minimum bet level*/
        InsufficientBalanceMinimumBetLevel = "InsufficientBalanceMinimumBetLevel",
         /*Insufficient funds for the all bet level*/
        InsufficientBalanceNotenoughBalance = "InsufficientBalanceNotenoughBalance",
         /*Reconnect Restore Session error*/
        ReconnectRestoreSession = "ReconnectRestoreSession",
        /*for the win popup*/
        Win = "Win"
    }

    export class PopupController {

        private _stage: Stages.MainStage;
        private _popupMV: PopupMV;

        /** Running when loading PopupMV class
          * @param stage - MainStage class
          */
        public constructor(popupMV: PopupMV, stage: Stages.MainStage) {
            this._popupMV = popupMV;
            this._stage = stage;
            this.initEvent();
        }

         /** PopupMV class's init event */
        public initEvent() {
            this.initServiceError();
        }

          /** events of service error */
        public initServiceError() {
            this._popupMV.mainStage.uiView.winValueText = "";
            let header, context;
            header = Game.instance.language.parse(LanguageNames.ErrorGeneralHeader);
            Game.instance.service.once(ListenerType.error, (type: string, action: string, message: string) => {
                switch (type) {
                    case PopupType[PopupType.Status]:
                        context = Game.instance.language.parse(LanguageNames.ErrorParse);
                        this._popupMV.popupType(header, context,PopupButtonType.Reload);
                        break;
                    case PopupType[PopupType.Parse]:
                        context = Game.instance.language.parse(LanguageNames.ErrorParse);
                        this._popupMV.popupType(header, context, PopupButtonType.Reload);
                        break;
                    default:
                        this._popupMV.popupType(header, message,PopupButtonType.Reload);
                        break;
                }
            }, this);

            Game.instance.service.once(ListenerType.close, (event) => {
                header = Game.instance.language.parse(LanguageNames.ErrorConnectionHeader);
                context = LanguageNames.ErrorConnection;
                this._popupMV.popupType(header, context, PopupButtonType.Reload);
            }, this);
        }


          /** set popup type according to popup type
           * @param popupType - popup type
           * */
        public setPopupType(popupType: PopupType) {
            SoundController.instance.stopBackgroundSound();
            this._popupMV.mainStage.uiView.winValueText = "";
            SoundController.instance.playCongPanelSound();
            let header, context;
            header = Game.instance.language.parse(LanguageNames.ErrorInsufficientfundsHeader);
            switch (popupType) {
                case PopupType.InsufficientBalanceNotenoughBalance:
                    context = Game.instance.language.parse(LanguageNames.ErrorInsufficientfundsBalance);
                    this._stage.errorPopupMV.popupType(header, context, PopupButtonType.Okay);
                    break;
                case PopupType.InsufficientBalanceCurrentBetLevel:
                    context = Game.instance.language.parse(LanguageNames.ErrorInsufficientfundsCurrentBet);
                    this._stage.errorPopupMV.popupType(header, context, PopupButtonType.Okay);
                    break;
                case PopupType.InsufficientBalanceMinimumBetLevel:
                    context = Game.instance.language.parse(LanguageNames.ErrorInsufficientfundsMinBet);
                    this._stage.errorPopupMV.popupType(header, context, PopupButtonType.Okay);
                    break;
                case PopupType.ReconnectRestoreSession:
                    header = Game.instance.language.parse(LanguageNames.ErrorReconnectRestoreSessionHeader);
                    context = Game.instance.language.parse(LanguageNames.ErrorReconnectRestoreSession);
                    this._stage.errorPopupMV.popupType(header, context, PopupButtonType.ContinueGame);
                    break;
                case PopupType.Win:
                    header = Game.instance.language.parse(LanguageNames.WinPopupHeader);
                    context = Game.instance.language.parse(LanguageNames.WinPopupWon);
                    context += "\n" + DataController.Instance.resolveFormat(DataController.Instance.earnCents / 100) + "\n";
                    this._popupMV.mainStage.uiView.winValueText = DataController.Instance.resolveFormat(DataController.Instance.earnCents / 100);
                    this._popupMV.popupType(header, context, PopupButtonType.Okay);
                    break;
            }
        }

         /** reload game */
        public reloadGame() {
            location.reload();
        }

         /** continue game */
        public continueGame() {
            this._popupMV.tweenVisiblePopupContainer(false);
            Game.instance.timer.addTimeout(1.5, AnimationsController.Instance.playNextAnimations.bind(AnimationsController.Instance), null);
        }

         /** close game */
        public closePopup() {
            this._stage.bingoType = BingoType.normal;
            this._stage.buttonState = ButtonStateType.response;
            this._stage.uiView.updateWinValue();
            this._stage.uiView.updateCreditValueText(DataController.Instance.credit);
            SoundController.instance.playAmbianceNormalSound();
            this._popupMV.tweenVisiblePopupContainer(false);
            let payaoutIndex = this._stage.payoutView.controller.resultPayoutIndex();
            this._stage.payoutView.controller.payoutSelectorView[payaoutIndex].playSelectorAnim(IndicatorState.Loop);
        }

        public get mainStage() {
            return this._stage;
        }
    }
}