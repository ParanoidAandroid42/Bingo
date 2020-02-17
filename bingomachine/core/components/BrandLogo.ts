/// <reference path="../parts/container.ts" />

module Core.Components {
    export class BrandLogo extends Parts.Container {
        protected game: Game;

        private _spinLabel: Parts.Sprite;
        private _maticLabel: Parts.AnimatedSprite;
        private _entertainmentLabel: Parts.Sprite;
        private _animationTween: TweenLite;

        private _isStarted: boolean = false;
        private _isLoaded: boolean = false;

        constructor(game: Game, x: number, y: number, autoStart: boolean = true, parent?: PIXI.Container) {
            super((parent) ? parent : null, "BrandLogo");
            this.position.set(x, y);
            this.game = game;
            this._isStarted = autoStart;
            this.loadAnimationAssets();
            this.once("removed", () => {
                this._animationTween.kill();
                this._animationTween = null;

                this._spinLabel.destroy(true);
                this._maticLabel.destroy();
                this._entertainmentLabel.destroy(true);
            }, this);
        }

        public play(): void {
            if (this._isLoaded == false) this._isStarted = true;
            else if (this._animationTween.isActive() == false && this._isLoaded == true)
                this._animationTween.play();
        }

        // UTILS
        private loadAnimationAssets(): void {
            this.game.resource.reset(true, true);
            this.game.resource.addTexture("assets/sprites/brand_logo.json");
            this.game.resource.once("loadcomplete", this.onTextureLoadComplete, this);
            this.game.resource.load();
        }

        // EVENT CALLBACKS
        private onTextureLoadComplete(asset: Managers.ResourceManager, resource): void {
            this._isLoaded = true;
            this.emit("loadcomplete");

            this._spinLabel = new Parts.Sprite(150, 0, "brandlogo/spin", this);
            this._spinLabel.anchor.set(0.5, 0.5);

            this._maticLabel = new Parts.AnimatedSprite(370, -23, Parts.AnimatedSprite.generateTextures("brandlogo/matic/", 0, 53, "", 5), false, 0.5, this);
            this._maticLabel.anchor.set(0.5, 0.5);

            this._entertainmentLabel = new Parts.Sprite(305, 35, "brandlogo/entertainment", this);
            this._entertainmentLabel.anchor.set(0.5, 0.5);
            this._entertainmentLabel.alpha = 0;

            if (window.innerWidth > window.innerHeight) {
                this._maticLabel.position.set(370, -23);
                this._spinLabel.position.set(150, 0);
                this._entertainmentLabel.position.set(305, 35);
            } else {
                this._maticLabel.position.set(100, 228);
                this._spinLabel.position.set(-120, 250);
                this._entertainmentLabel.position.set(35, 285);
            }

            this._animationTween = TweenLite.to(this._spinLabel.scale, 0.15, {
                x: 0.85, y: 0.85, ease: Linear.easeNone, paused: !this._isStarted,
                onStart: () => {
                    this.emit("animationstart");
                    this._spinLabel.tint = 0x696969;
                },
                onComplete: () => {
                    TweenLite.to(this._spinLabel.scale, 0.20, {
                        x: 1, y: 1, ease: Back.easeOut.config(7, 1), delay: 0.25,
                        onStart: () => {
                            this._spinLabel.tint = 0xFFFFFF;
                        },
                        onComplete: () => {
                            this._maticLabel.play();
                        }
                    });
                }
            });

            this._maticLabel.onComplete = () => {
                TweenLite.to(this._entertainmentLabel, 1, {
                    alpha: 1, ease: Linear.easeNone, delay: 0.1,
                    onComplete: () => {
                        this.emit("animationcomplete");
                    }
                });
            };
        }
    }
}