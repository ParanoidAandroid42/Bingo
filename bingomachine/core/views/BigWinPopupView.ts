
module Core.View {
      /** Importing  classes */
    import BigWinPopupController = Controller.BigWinPopupController;
    type DynamicText = Parts.Text | Parts.BitmapText;

    class CoinsAnimation {

        public randomSpeed: number;
        public randomDirection: number; //-1 , +1
        public increase: number;
        public counter: number;
        public sprite: Parts.Sprite;
        public i: number;
        public coinTimer: Essentials.TimerEvent;
        public stopBigWin: boolean = false;

        /** Running when loading bigwinpopupview class 
        * @param parent - parent container
        */
        public constructor(parent: Parts.Container) {
            this.sprite = new Parts.Sprite(640, 250, StyleInformation.DolarBall, parent, "Coins");
            this.setCoinStartPosition(parent);
            this.stopBigWin = false;
        }

         /** Set random position for start
        * @param parent - parent container
        */
        public setCoinStartPosition(parent: Parts.Container) {
            var direction = 0 + Math.random() * 2;
            direction < 1 ? this.randomDirection = -1 : this.randomDirection = 1;
            this.randomSpeed = Math.random() * 3 + 1;
            var randomPositionX = Math.random() * (100) + 640;
            var randomPositionY = 180;
            this.sprite.position.set(randomPositionX, randomPositionY);
            this.sprite.scale.set(.3, .3);
            this.increase = (-Math.PI / 120) * 2;
            this.counter = 0;
            this.i = 0;
        }

        /** Update coins position. (sin)
        * @param parent - parent container
        */
        public updateWayCoin(parent: Parts.Container) {
            if (this.i > 3) 
                parent.visible = true;            

            if (this.i <= 9) {
                this.sprite.position.x += this.i * this.randomDirection * 2;
                this.sprite.position.y += (Math.sin(this.counter) * this.i * 2 + 2) * 2;
                this.sprite.scale.set(this.sprite.scale.x + 0.0032, this.sprite.scale.x + 0.0032);
                this.i += (0.03 * this.randomSpeed);
                this.counter += this.increase;
            } else {
                if (!this.stopBigWin)
                this.setCoinStartPosition(parent);
            }
        }
    }

    export class BigWinPopupView implements Interfaces.IDisplayVisual{

        private _stage: Stages.MainStage;
        private _bigWinPopupController: BigWinPopupController;

        private _bigWinContainer: Parts.Container;
        private _coinsParticleContainer: Parts.Container;

        private _bigWinText: DynamicText;
        private _winValueText: DynamicText;
        private _mouth: Parts.Sprite;

        private _isBigWinState: boolean = false;
        private _animationTimeline: TimelineMax = new TimelineMax;
        private _coinsAnimations: CoinsAnimation[] = [];

        private _winCoinsValue: number;

         /** Running when loading BigWinPopupView class
          * @param mainStage - MainStage class
          */
        public constructor(stage: Stages.MainStage) {
            this._stage = stage;
            this._bigWinPopupController = new BigWinPopupController(this, stage);
            this.initProperties();
        }

         /** BigwinView class's init function */
        public initProperties(): void {

             /** Create Containers */
            this._bigWinContainer = new Parts.Container(this._stage.backgroundView.baseContainer, "BigWinContainer");
            this._coinsParticleContainer = new Parts.Container(this._bigWinContainer, "CoinsParticleContainer");

             /** Create Texts */
            this._bigWinText = Game.instance.language.createText(LanguageNames.BigWinHeader, 704, 250, null, StyleInformation.BigWinHeader, this._bigWinContainer);
            this._winValueText = Game.instance.language.createText(LanguageNames.BigWinValue, 704, 300, null, StyleInformation.BigWinValue, this._bigWinContainer);

              /** Create Sprites */
            this._mouth = new Parts.Sprite(705, 432, StyleInformation.MachineFrames.NormalMouth, this._bigWinContainer, "Mouth");
            this._mouth.visible = false;

              /** Create Coins (this game's coin counter = 100)*/ 
            for (let i = 0; i < 100; i++) 
                this._coinsAnimations.push(new CoinsAnimation(this._coinsParticleContainer));
            
            this._coinsParticleContainer.visible = false;          
            this._bigWinContainer.visible = false;
            this.createAnimationTimeline();
        }

         /** Create Bigwin Animation timeline. just once */
        public createAnimationTimeline() {
            let tweenTime = 0.75;
            this._animationTimeline.to(this._stage.machineView.leftArm, tweenTime, {
                y: 327, ease: Bounce.easeOut,
                onStart: () => {
                    this._stage.machineView.playNoseSmokeEffect();
                },
                onComplete: () => {
                    TweenMax.fromTo(this._bigWinText.scale, .35, { x: 0, y: 0 }, { x: 1, y: 1, ease: Expo.easeInOut, autoKill: true });
                    TweenMax.fromTo(this._winValueText.scale, .35, { x: 0, y: 0 }, { x: 1, y: 1, ease: Expo.easeInOut, autoKill: true });
                }
            });
            this._animationTimeline.to(this._stage.machineView.rightArm, tweenTime, { y: 327, ease: Bounce.easeOut }, "=-" + tweenTime);
            this._animationTimeline.to(this._stage.machineView.mouth, tweenTime, { y: 370, ease: Sine.easeIn }, "=-" + tweenTime);
            this._animationTimeline.to(this._stage.machineView.mouth, tweenTime, {y: 406, ease: Bounce.easeOut,
                onComplete: () => {
                    this._mouth.visible = true;
                }
            }, "=-" + tweenTime);
            this._animationTimeline.to(this._stage.machineView.teeth, tweenTime, { y: 213, ease: Sine.easeIn }, "=-" + tweenTime);      
            this._animationTimeline.pause();
        }

         /** Play Bigwin Animation*/
        public playAnimation() {
            Controller.SoundController.instance.stopBackgroundSound();
            Controller.SoundController.instance.playBigWinSound();
            Controller.SoundController.instance.playBigWinCounterSound();
            this._bigWinText.scale.set(0, 0);
            this._winValueText.scale.set(0, 0);
            this._winCoinsValue = Controller.DataController.Instance.earnCoins
            this.startBigWinCountAnimation(this._winCoinsValue);
            this._animationTimeline.restart();
            this._animationTimeline.play();
            this.startCountCoinAnimation();
            this._bigWinContainer.visible = true;
            this._coinsParticleContainer.visible = false;
        }

          /** Start Coin Animation(sin)*/
        public startCountCoinAnimation() {
            this._coinsParticleContainer.visible = false;
            for (let i = 0; i < this._coinsParticleContainer.children.length; i++) {
                Game.instance.timer.addTimeout(Math.random(), () => {
                    this._coinsAnimations[i].coinTimer = Game.instance.timer.addInterval(0, this._coinsAnimations[i].updateWayCoin.bind(this._coinsAnimations[i], this._coinsParticleContainer), this, true);
                }, this, true);
                this._coinsAnimations[i].setCoinStartPosition(this._coinsParticleContainer);
            }
        }

           /**Start BigWin Count Animation*/
        public startBigWinCountAnimation(coinsCount: number) {
            this._winValueText.text = "0";
            let listener = { value: 0 };
            TweenLite.to(listener, 5.5 - 0.1, {
                value: coinsCount,
                delay: 0.1,
                ease: Sine.easeOut, onUpdate: () => {
                    this._winValueText.text = listener.value.toFixed(0).toString();
                }, onComplete: () => {
                    for (let i = 0; i < this._coinsAnimations.length; i++) {
                        this._coinsAnimations[i].stopBigWin = true;
                    }
                    TweenLite.fromTo(this._winValueText.scale, .35, { x: 1, y: 1 }, { x: 1.2, y: 1.2, yoyo: true, repeat: -1, repeatDelay: .2, ease: Bounce.easeIn });
                    Game.instance.timer.addTimeout(2, () => {                      
                        this.stopBigWinAnimation();
                    }, null);
                }
            });
        }

        /** Stop Bigwin Animation*/
        public stopBigWinAnimation() {
            this._coinsParticleContainer.visible = false;
            let bigwinText = TweenMax.fromTo(this._bigWinText.scale, .2, { x: 1, y: 1 }, { x: 0, y: 0, autoKill: true, ease: Expo.easeOut });
            let winValueText = TweenMax.fromTo(this._winValueText.scale, .2, { x: 1, y: 1 }, { x: 0, y: 0, autoKill: true, ease: Expo.easeOut });
            this._mouth.visible = false;
            TweenLite.to(this._stage.machineView.leftArm, .35, { y: 271, ease: Sine.easeIn });
            TweenLite.to(this._stage.machineView.rightArm, .35, { y: 271, ease: Sine.easeIn });
            TweenLite.to(this._stage.machineView.mouth, .35, { y: 298, ease: Sine.easeIn, onComplete: () => { Controller.AnimationsController.Instance.playNextAnimations(); } });
            for (let i = 0; i < this._coinsParticleContainer.children.length; i++) {
                Game.instance.timer.remove(this._coinsAnimations[i].coinTimer);
                this._coinsAnimations[i].stopBigWin = false;
            }
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
                    this._coinsParticleContainer.position.set(26, 93);
                    this._mouth.position.set(705, 432);
                    this._bigWinText.position.set(704, 250);
                    this._winValueText.position.set(704, 335);
                    break;
                case DisplayOrientation.portrait:
                    this._coinsParticleContainer.position.set(-316, 558);
                    this._mouth.position.set(368, 897);
                    this._bigWinText.position.set(369, 724);
                    this._winValueText.position.set(369, 807);
                    break;
            }
        }

        public get bigWinContainer() {
            return this._bigWinContainer;
        }

        public get winCoinsValue() {
            return this._winCoinsValue;
        }
    }
}