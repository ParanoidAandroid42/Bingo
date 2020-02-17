/// <reference path="../modules/stage.ts" />

module Core.Stages {
    export class AssetLoader extends Modules.Stage {
        private _loadingBar: Parts.Sprite;
        private _loadingBarTween: TweenLite;
        private _logoAnimation: Components.BrandLogo;
        
        public init(): void {
            this._logoAnimation = new Components.BrandLogo(this.game, 360, 345, true, this);
            this._logoAnimation.once(ListenerType.animationcomplete, this.onLogoAnimationComplete, this);

            let barGraphics = new PIXI.Graphics();
            barGraphics.lineStyle(3, 0xFFFF00, 1);
            barGraphics.moveTo(0, 0);
            barGraphics.lineTo(0, 10);

            this._loadingBar = new Parts.Sprite(490, 420, barGraphics.generateCanvasTexture(), this);
            this._loadingBar.anchor.set(0, 0.5);
            this._loadingBar.scale.set(0, 1);
            if (window.innerWidth > window.innerHeight) {
                this._loadingBar.position.set(490, 420);
            }
            else {
                this._loadingBar.position.set(220, 670);
            }
        }

        public dispose(): void {
            TweenLite.killTweensOf(this._loadingBar);
            this._loadingBarTween.kill();
            this._loadingBarTween = null;
        }

        // EVENT CALLBACKS
        private onLogoAnimationComplete(): void {
            let u = this.game.config.service.languageUrl;
            let i = this.game.config.service.gameId;
            let l = this.game.config.service.language;
            let v = this.game.config.service.languageVer;

            this.game.language.once("loadcomplete", this.onLanguageLoadComplete, this);
            this.game.language.once("loaderror", this.onLanguageLoadError, this);
            this.game.language.load(["assets/languages/"+l+".json", "assets/languages/en.json"]);
        }

        private onLanguageLoadComplete(): void {
            Game.instance.ResourceController.addResources();
            this.game.resource.on("loadprogress", this.onResLoadProgress, this);
            this.game.resource.once("loadcomplete", this.onResLoadComplete, this);
            this.game.resource.once("loaderror", this.onResLoadError, this);
            Game.instance.resource.load();
        }

        private onLanguageLoadError(): void {
            throw "Error: Language Load Failed.";
        }

        //// RESOURCE LOAD CALLBACKS
        private onResLoadProgress(progress: number): void {
            this._loadingBar.scale.x = progress["default"];
        }

        private onResLoadComplete(): void {            
            this._loadingBarTween = TweenLite.to(this._loadingBar, 0.85, {
                alpha: 0.25, ease: Linear.easeNone, onComplete: () => {
                    TweenLite.to(this._loadingBar, 0.85, {
                        alpha: 1, ease: Linear.easeNone, onComplete: () => {
                            this._loadingBarTween.restart(false);
                        }
                    });
                }
            });

            Game.instance.service.once(ListenerType.init, (data: Interfaces.IInitData) => {
                Controller.DataController.Instance.initData(data);
                Controller.DataController.Instance.updateData(data);

                Essentials.GameUI.initUI(Game.instance.service.config.gameUI, {
                    lang: Game.instance.language.manifest.mobileUI,
                    paytable: Game.instance.language.manifest.paytable,
                    currency: data.currency,
                    historyURL: data.gameHistoryUrl
                });

                Game.instance.stage.start("MainStage", Stages.MainStage, true, false, null, "Default");
            }, this);
            Game.instance.service.connect();

            Game.instance.service.once(ListenerType.error, (type: string, action: string, message: string) => {
                switch (type) {
                    case "Status":
                    case "Parse":
                        Game.instance.stage.start("ErrorPopup", Stages.Common.ErrorPopup, true, false, null, "Error_Parse","Error_Parse");
                        break;
                    case "Websocket":
                        Game.instance.stage.start("ErrorPopup", Stages.Common.ErrorPopup, true, false, null, "Error_WebSocketConnection", "Error_WebSocketConnection");
                        break;
                }
            }, this);

            Game.instance.service.once(ListenerType.close, (event) => {
                Game.instance.stage.start("ErrorPopup", Stages.Common.ErrorPopup, true, false, null, "Error_WebSocketConnection", "Error_WebSocketConnection");
            }, this);
        }

        private onResLoadError(type: string): void {
            throw "Error: Resource Load Failed (" + type + ").";
        }
    }
}