/// <reference path="../modules/stage.ts" />
module Core.Stages.Common {
    export class ErrorPopup extends Modules.Stage {
        private popupBackground: Parts.Sprite;
        public init(header: string, context: string, args: any[]): void {

            this.popupBackground = new Parts.Sprite(360, 360, StyleInformation.Popup, this);
            this.popupBackground.anchor.set(0.5, 0.5);

            let popupContext = Game.instance.language.createText(LanguageNames.ErrorMessageHeader, 0, 0, null, StyleInformation.ErrorMessageText, this.popupBackground);
            
            popupContext.name = "ErrorPopupContext";
            popupContext.anchor["set"](0.5, 0.5);
            popupContext.text = Game.instance.language.parse(context);

            let popupButton = new Parts.BasicButton(0, 111, this.onReloadButtonClick, this, StyleInformation.UI.GeneralButton, this.popupBackground);
            popupButton.name = 'PopupButton';
            popupButton.anchor.set(0.5, 0.5);
            this.popupBackground.addChild(popupButton);
            let popupButtonText = Game.instance.language.createText(LanguageNames.GeneralButton, 0, 0, null, StyleInformation.GeneralButton, this.popupBackground);
            popupButtonText.name = 'PopupButtonText';
            popupButtonText.text = Game.instance.language.parse("ReloadButton");
            popupButtonText.anchor['set'](0.5, 0.5);
            popupButton.addChild(popupButtonText);

            if (window.innerWidth > window.innerHeight) {
                this.popupBackground.position.set(640, 360);
            } else {
                this.popupBackground.position.set(360, 640);
            }
        }

        private onReloadButtonClick(): void {
            if (location != null)
                location.reload();
        }

        public dispose(): void { }
    }
}