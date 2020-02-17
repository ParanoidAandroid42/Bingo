module Core.View {
     /** Importing  classes */
    import MachineController = Controller.MachineController;

    type DynamicText = Parts.Text | Parts.BitmapText;

    export class MachineView implements Interfaces.IDisplayVisual {

        private _stage: Stages.MainStage;
        private _machineController: MachineController;

        private _container: Parts.Container;
        private _tempContainer: Parts.Container;

        private _ball: Parts.Sprite;
        private _head: Parts.Sprite;
        private _mouth: Parts.Sprite;
        private _teeth: Parts.Sprite;
        private _wheel: Parts.Sprite;
        private _leftEyes: Parts.Sprite;
        private _rightEyes: Parts.Sprite;
        private _leftArm: Parts.Sprite;
        private _rightArm: Parts.Sprite;
        private _headLight: Parts.Sprite;  
        
        private _headElectic: Parts.AnimatedSprite;
        private _headLeftSmokeEffect: Parts.AnimatedSprite;
        private _headRightSmokeEffect: Parts.AnimatedSprite;
        private _turboSmokeEffect: Parts.AnimatedSprite;
        private _noseRightEffect: Parts.AnimatedSprite;
        private _noseLeftEffect: Parts.AnimatedSprite;

        private _resultLeftNumber: DynamicText;
        private _resultRightNumber: DynamicText;
        private _ballText: DynamicText;   

        private _animationTimeline: TimelineMax;
        private _firsTimeTurbo: boolean = false;

          /** Running when loading MachineView class
        * @param stage - MainStage class
        */
        public constructor(stage: Stages.MainStage) {
            this._stage = stage;        
            this._machineController = new MachineController(this, stage);
            this.initProperties();
        }

         /** MachineView class's init function */
        public initProperties() {
             /** Create Containers */
            this._container = new Parts.Container(this._stage.backgroundView.baseContainer, "MachineContainer");

              /** Create Sprites */
            this._leftArm = new Parts.Sprite(622, 271, StyleInformation.MachineFrames.NormalLeftArm, this._container, "LeftArm");
            this._rightArm = new Parts.Sprite(788, 271, StyleInformation.MachineFrames.NormalRightArm, this._container, "RightArm");
            this._mouth = new Parts.Sprite(705, 298, StyleInformation.MachineFrames.NormalMouth, this._container, "Mouth");
            this._tempContainer = new Parts.Container(this._container, "TempContainer");
            this._ball = new Parts.Sprite(705, 202, StyleInformation.MachineFrames.NormalBall, this._container, "Ball");
            this._ballText = Game.instance.language.createText(LanguageNames.BallValue, 0, 1, null, StyleInformation.BallValue, this._ball);
            this._teeth = new Parts.Sprite(705, 213, StyleInformation.MachineFrames.NormalTeeth, this._container, "Teeth");
            this._wheel = new Parts.Sprite(705, 172, StyleInformation.MachineFrames.NormalWheel, this._container, "Wheel");
            this._head = new Parts.Sprite(705, 137, StyleInformation.MachineFrames.NormalHead, this._container, "Head");
            this._headLight = new Parts.Sprite(705, 74, StyleInformation.MachineFrames.Light, this._container, "HeadLight");
            this._headLight.alpha = 0;
            this._leftEyes = new Parts.Sprite(655, 161, StyleInformation.MachineFrames.NormalLeftEyes, this._container, "LeftEyes");
            this._rightEyes = new Parts.Sprite(755, 161, StyleInformation.MachineFrames.NormalRightEyes, this._container, "RightEyes");
            this._ball.scale.set(0.8, 0.8);  

            /** Create AnimatedSprites */
            let animation = Parts.AnimatedSprite.generateTextures(StyleInformation.HeadSmokeEffect, 0, 21, "", 5);
            this._headLeftSmokeEffect = new Parts.AnimatedSprite(570, 52, animation, false, 0.45, this._container);
            this._headLeftSmokeEffect.scale.set(.8, .8);
            this._headRightSmokeEffect = new Parts.AnimatedSprite(840, 52, animation, false, 0.45, this._container);
            this._headRightSmokeEffect.scale.set(-0.8, 0.8);
            animation = Parts.AnimatedSprite.generateTextures(StyleInformation.NoseSmokeEffect, 7, 30, "", 5);
            this._noseRightEffect = new Parts.AnimatedSprite(761, 270, animation , false, 0.45, this._container);
            this._noseRightEffect.scale.set(-0.8, 0.8);
            this._noseLeftEffect = new Parts.AnimatedSprite(652, 270, Parts.AnimatedSprite.generateTextures(StyleInformation.NoseSmokeEffect, 7, 30, "", 5), false, 0.45, this._container);
            this._noseLeftEffect.scale.set(0.8, 0.8);
            animation = Parts.AnimatedSprite.generateTextures(StyleInformation.HeadElectricEffect, 23, 41, "", 5);
            this._headElectic = new Parts.AnimatedSprite(702, 0, animation, false, 0.45, this._container);
            this._headElectic.scale.set(0.6, 0.6);
            animation = Parts.AnimatedSprite.generateTextures(StyleInformation.TurboSmokeEffect, 1, 21, "", 5);
            this._turboSmokeEffect = new Parts.AnimatedSprite(714, 213, animation, false, 0.35, this._container);
            this._turboSmokeEffect.scale.set(.8, .8);

             /** Create texts */
            this._resultLeftNumber = Game.instance.language.createText(LanguageNames.MachineHeadValue, 668, 47, null, StyleInformation.MachineHeadValue, this._container);
            this._resultRightNumber = Game.instance.language.createText(LanguageNames.MachineHeadValue, 743, 47, null, StyleInformation.MachineHeadValue, this._container);           
            this._resultLeftNumber.rotation = -0.05;
            this._resultRightNumber.rotation = 0.05;

            this.playNoseSmokeEffect();
            this._firsTimeTurbo = true;
        }

        /** Set orientation visuals according to DisplayOrientation (landscape/portrait) */
        public changeOrientation(orientation: DisplayOrientation) {
            switch (orientation) {
                case DisplayOrientation.landscape:
                    this._container.position.set(0, 26);
                    break;
                case DisplayOrientation.portrait:
                    this._container.position.set(-337, 491);
                    break;
            }
        }

        /** change visual according to bingotype ( turbo /normal) */
        public changeVisual(type: VisualType): void {
            switch (type) {
                case VisualType.normal:
                    this._leftArm.texture = PIXI.Texture.fromFrame(StyleInformation.MachineFrames.NormalLeftArm);
                    this._rightArm.texture = PIXI.Texture.fromFrame(StyleInformation.MachineFrames.NormalRightArm);
                    this._mouth.texture = PIXI.Texture.fromFrame(StyleInformation.MachineFrames.NormalMouth);
                    this._ball.texture = PIXI.Texture.fromFrame(StyleInformation.MachineFrames.NormalBall);
                    this._teeth.texture = PIXI.Texture.fromFrame(StyleInformation.MachineFrames.NormalTeeth);
                    this._wheel.texture = PIXI.Texture.fromFrame(StyleInformation.MachineFrames.NormalWheel);
                    this._head.texture = PIXI.Texture.fromFrame(StyleInformation.MachineFrames.NormalHead);
                    this._leftEyes.texture = PIXI.Texture.fromFrame(StyleInformation.MachineFrames.NormalLeftEyes);
                    this._rightEyes.texture = PIXI.Texture.fromFrame(StyleInformation.MachineFrames.NormalRightEyes);
                    this._headElectic.animationSpeed = 0.45;
                    Controller.SoundController.instance.stopBackgroundSound();
                    Controller.SoundController.instance.playAmbianceNormalSound();
                    this._firsTimeTurbo = true;
                    break;
                case VisualType.turbo:
                    this._leftArm.texture = PIXI.Texture.fromFrame(StyleInformation.MachineFrames.TurboLeftArm);
                    this._rightArm.texture = PIXI.Texture.fromFrame(StyleInformation.MachineFrames.TurboRightArm);
                    this._mouth.texture = PIXI.Texture.fromFrame(StyleInformation.MachineFrames.TurboMouth);
                    this._ball.texture = PIXI.Texture.fromFrame(StyleInformation.MachineFrames.TurboBall);
                    this._teeth.texture = PIXI.Texture.fromFrame(StyleInformation.MachineFrames.TurboTeeth);
                    this._wheel.texture = PIXI.Texture.fromFrame(StyleInformation.MachineFrames.TurboWheel);
                    this._head.texture = PIXI.Texture.fromFrame(StyleInformation.MachineFrames.TurboHead);
                    this._leftEyes.texture = PIXI.Texture.fromFrame(StyleInformation.MachineFrames.TurboLeftEyes);
                    this._rightEyes.texture = PIXI.Texture.fromFrame(StyleInformation.MachineFrames.TurboRightEyes);
                    this._headElectic.animationSpeed = 1;
                    Controller.SoundController.instance.stopBackgroundSound();
                    Controller.SoundController.instance.playAmbianceTurboSound();
                    break;
            }
        }

        /**
         * play animation
         * @param tweenTime - tween time
         * @param counter - ball's counter
         */
        public playAnimation(tweenTime: number, counter: number): void {
            switch (this._stage.bingoType) {
                case BingoType.normal:
                    Controller.SoundController.instance.playCounterSound();
                    this.playNormalAnimation(tweenTime, counter);
                    break;
                case BingoType.turbo:
                    if (this._firsTimeTurbo)
                        tweenTime = tweenTime / 2;
                    this.playTurboAnimation(tweenTime, counter); 
                    this._firsTimeTurbo = false;
                    break;
                case BingoType.stoppedAnimation:
                    this._animationTimeline.to(this._ball, tweenTime, { y: 202, ease: Expo.easeInOut });
                    this._animationTimeline.to(this._wheel, tweenTime / 2, { rotation: 0, ease: Sine.easeIn }, "=-" + tweenTime);
                    this._animationTimeline.to(this._mouth, tweenTime, { y: 302, ease: Expo.easeInOut }, "=-" + tweenTime);
                    this._animationTimeline.to(this._rightArm, tweenTime, { y: 271, ease: Expo.easeInOut }, "=-" + tweenTime);
                    this._animationTimeline.to(this._leftArm, tweenTime, { y: 271, ease: Expo.easeInOut }, "=-" + tweenTime);
                    Game.instance.timer.addTimeout(.5, Controller.AnimationsController.Instance.playNextAnimations.bind(Controller.AnimationsController.Instance), null);
                    break;
                case BingoType.instant:
                    this._animationTimeline.to(this._ball, tweenTime, { y: 202, ease: Expo.easeInOut });
                    this._animationTimeline.to(this._wheel, tweenTime / 2, { rotation: 0, ease: Sine.easeIn }, "=-" + tweenTime);
                    this._animationTimeline.to(this._mouth, tweenTime, { y: 298, ease: Expo.easeInOut }, "=-" + tweenTime);
                    this._animationTimeline.to(this._rightArm, tweenTime, { y: 271, ease: Expo.easeInOut }, "=-" + tweenTime);
                    this._animationTimeline.to(this._leftArm, tweenTime, { y: 271, ease: Expo.easeInOut }, "=-" + tweenTime);
                    this._animationTimeline.to(this._teeth, tweenTime, { y: 213, ease: Expo.easeInOut }, "=-" + tweenTime);
                    this._machineController.showResult();
                    break;
                case BingoType.connectionLost:
                    this._animationTimeline.to(this._ball, tweenTime, { y: 202, ease: Expo.easeInOut });
                    this._animationTimeline.to(this._wheel, tweenTime / 2, { rotation: 0, ease: Sine.easeIn }, "=-" + tweenTime);
                    this._animationTimeline.to(this._mouth, tweenTime, { y: 302, ease: Expo.easeInOut }, "=-" + tweenTime);
                    this._animationTimeline.to(this._rightArm, tweenTime, { y: 271, ease: Expo.easeInOut }, "=-" + tweenTime);
                    this._animationTimeline.to(this._leftArm, tweenTime, { y: 271, ease: Expo.easeInOut }, "=-" + tweenTime);
                    break;
            }
        }

        /**
         * play normal animation
         * @param tweenTime - tweentime
         * @param counter - ball's counter
         */
        public playNormalAnimation(tweenTime: number, counter: number): void {
            this.stopAnimation();
            this._animationTimeline = new TimelineMax();
            let resultValues = Controller.DataController.Instance.resultValues;
            this._stage.machineView.playHeadSmokeEffect();
            this._animationTimeline.to(this._leftArm, tweenTime / 2, { y: 300, ease: Sine.easeIn, onStart: () => { this._stage.machineView.playNoseSmokeEffect(); } }, "=-" + tweenTime);
            this._animationTimeline.to(this._rightArm, tweenTime / 2, { y: 300, ease: Sine.easeIn }, "=-" + tweenTime);
            this._animationTimeline.to(this._leftArm, tweenTime / 2, { y: 327, ease: Bounce.easeOut });
            this._animationTimeline.to(this._rightArm, tweenTime / 2, { y: 327, ease: Bounce.easeOut }, "=-" + tweenTime / 2);
            this._animationTimeline.to(this._teeth, tweenTime / 2, { y: 213, ease: Sine.easeIn }, "=-" + tweenTime);
            this._animationTimeline.to(this._leftEyes, tweenTime / 2, { rotation: Math.PI + Math.random() * 2 * Math.PI, ease: Sine.easeIn }, "=-" + tweenTime);
            this._animationTimeline.to(this._rightEyes, tweenTime / 2, { rotation: Math.PI + Math.random() * 2 * Math.PI, ease: Sine.easeIn }, "=-" + tweenTime);
            this._animationTimeline.to(this._mouth, tweenTime / 2, { y: 370, ease: Sine.easeIn }, "=-" + tweenTime);
            this._animationTimeline.to(this._mouth, tweenTime / 2, { y: 406, ease: Bounce.easeOut }, "=-" + tweenTime / 2);
            this._animationTimeline.to(this._wheel, tweenTime / 2, { rotation: 2, ease: Sine.easeIn }, "=-" + tweenTime);
            this._animationTimeline.to(this._ball, tweenTime / 2, {
                y: 303, ease: Sine.easeIn,
                onStart: () => {
                    this._ballText.text = resultValues[counter].toString();
                    this._stage.machineView.playHeadValueAnimation(Math.floor(resultValues[counter] / 10), resultValues[counter] % 10);
                },
                onComplete: () => {
                    this._machineController.checkMatchValues(counter);
                }
            }, "=-" + tweenTime / 2);
            this._animationTimeline.to(this._ball, tweenTime / 2, { y: 308, ease: Bounce.easeOut });
            this._animationTimeline.to(this._ball, tweenTime, { y: 195, ease: Sine.easeOut }, "=+" + tweenTime / 2);
            this._animationTimeline.to(this._wheel, tweenTime / 2, { rotation: 0, ease: Sine.easeOut }, "=-" + tweenTime);
            this._animationTimeline.to(this._mouth, tweenTime, { y: 295, ease: Sine.easeOut }, "=-" + tweenTime);
            this._animationTimeline.to(this._rightArm, tweenTime, { y: 271, ease: Sine.easeOut }, "=-" + tweenTime);
            this._animationTimeline.to(this._leftArm, tweenTime, { y: 271, ease: Sine.easeOut }, "=-" + tweenTime);
            this._animationTimeline.to(this._teeth, tweenTime, { y: 210, ease: Elastic.easeOut }, "=-" + tweenTime / 4);

            this._animationTimeline.call(() => {
                if (this._machineController.matchCount != this._stage.cardView.controller.cardNumberView.length) {
                    counter++;
                    this.playAnimation(tweenTime, counter);
                }
                else {
                    Game.instance.timer.addTimeout(.5, Controller.AnimationsController.Instance.playNextAnimations.bind(Controller.AnimationsController.Instance), null);
                }
            })
        }

        /**
         * play turbo animation
         * @param tweenTime - tween time
         * @param counter - ball's count
         */
        public playTurboAnimation(tweenTime: number, counter: number): void {
            this.stopAnimation();
            this._animationTimeline = new TimelineMax();
            let resultValues = Controller.DataController.Instance.resultValues;
            let ball, ballText;
            this._leftArm.position.set(this._leftArm.position.x, 327);
            this._rightArm.position.set(this._rightArm.position.x, 327);
            this._mouth.position.set(this._mouth.position.x, 406);
            this._animationTimeline.to(this._leftEyes, tweenTime / 2, { rotation: Math.PI * 2 + Math.random() * 10 * Math.PI, ease: Sine.easeIn });
            this._animationTimeline.to(this._rightEyes, tweenTime / 2, { rotation: Math.PI * 2 + Math.random() * 10 * Math.PI, ease: Sine.easeIn }, "=-" + tweenTime / 2);
            this._animationTimeline.to(this._wheel, tweenTime / 2, { rotation: Math.PI * 2, ease: Sine.easeIn }, "=-" + tweenTime / 2);
            this._animationTimeline.to(this._ball, tweenTime / 2, {
                y: 303, ease: Sine.easeIn,
                onStart: () => {
                    ball = new Parts.Sprite(705, 308, StyleInformation.MachineFrames.TurboBall, this._tempContainer, "Ball");
                    ballText = Game.instance.language.createText(LanguageNames.BallValue, 0, 1, null, StyleInformation.BallValue, ball);
                    ball.scale.set(.8, .8);
                    ballText.text = resultValues[counter].toString();
                    this._ballText.text = resultValues[counter].toString();
                    this._stage.machineView.playHeadValueAnimation(Math.floor(resultValues[counter] / 10), resultValues[counter] % 10);
                },
                onComplete: () => {
                    this._machineController.checkMatchValues(counter);
                }
            }, "=-" + tweenTime / 2);
            this._animationTimeline.to(this._ball, tweenTime / 2, { y: 308, ease: Bounce.easeOut });

            this._animationTimeline.call(() => {
                if (this._machineController.matchCount != this._stage.cardView.controller.cardNumberView.length) {
                    counter++;
                    this.playAnimation(tweenTime, counter);
                }
                else {
                    this._stage.bingoType = BingoType.stoppedAnimation;
                    this.playAnimation(.5, counter);
                }
                ball.destroy();
                ballText.destroy();
            })
        }

        /**
         * play head value animation
         * @param valueLeft - left value
         * @param valueRight - right value
         */
        public playHeadValueAnimation(valueLeft: number, valueRight: number) {
            this._resultRightNumber.text = valueRight.toString();
            this._resultLeftNumber.text = valueLeft.toString();
            let leftnumbertween;
            let rightnumbertween;

            switch (this._stage.bingoType) {
                case BingoType.normal:
                    leftnumbertween = .25;
                    rightnumbertween = .45;
                    break;
                case BingoType.turbo:
                    leftnumbertween = .15;
                    rightnumbertween = .25;
                    break;
            }

            TweenLite.killTweensOf(this._resultLeftNumber);
            TweenLite.killTweensOf(this._headLight);
            TweenLite.killTweensOf(this._resultRightNumber);
            TweenLite.fromTo(this._resultLeftNumber, leftnumbertween, { alpha: 0 }, {alpha: 1, ease: Expo.easeIn,
                onComplete: () => {
                    TweenLite.fromTo(this._resultLeftNumber, leftnumbertween, { alpha: 1 }, { alpha: 0, ease: Elastic.easeOut, delay: .5 });
                }
            });
            TweenLite.fromTo(this._resultRightNumber, leftnumbertween, { alpha: 0 }, {alpha: 1, ease: Expo.easeIn,
                onComplete: () => {
                    TweenLite.fromTo(this._resultRightNumber, rightnumbertween, { alpha: 1 }, { alpha: 0, ease: Elastic.easeOut, delay: .5 });
                }
            });
            TweenLite.fromTo(this._headLight, leftnumbertween, { alpha: 0 }, {alpha: 1, ease: Expo.easeIn,
                onComplete: () => {
                    TweenLite.fromTo(this._headLight, rightnumbertween, { alpha: 1 }, { alpha: 0, ease: Elastic.easeOut, delay: .5 });
                }
            });
        }

        /**
         * play head electric efect
         */
        public playHeadElectricEffect() {
            if (this._stage.bingoType == BingoType.normal)
                Controller.SoundController.instance.playElectricNormalSound();
            this._headElectic.resetAnimation();
            this._headElectic.play();
        }

        /**
         * play nose smoke effect
         */
        public playNoseSmokeEffect() {
            this._noseRightEffect.resetAnimation();
            this._noseRightEffect.play();
            this._noseLeftEffect.resetAnimation();
            this._noseLeftEffect.play();
            Controller.SoundController.instance.playNoseSmokeSound();
        }

        /**
         * play head smoke effect
         */
        public playHeadSmokeEffect() {
            this._headLeftSmokeEffect.resetAnimation();
            this._headLeftSmokeEffect.play();
            this._headRightSmokeEffect.resetAnimation();
            this._headRightSmokeEffect.play();
            Controller.SoundController.instance.playHeadSmokeSound();
        }

        /**
         * stop animation
         */
        public stopAnimation() {
            if (this._animationTimeline) {
                this._animationTimeline.progress(0, true);
                this._animationTimeline.kill();
                this._animationTimeline = null;
            }
        } 

        public get turboSmokeEffect() {
            return this._turboSmokeEffect;
        }

        public get controller() {
            return this._machineController;
        }

        public get container() {
            return this._container;
        }

        public get leftArm() {
            return this._leftArm;
        }

        public get rightArm() {
            return this._rightArm;
        }

        public get mouth() {
            return this._mouth;
        }

        public get teeth() {
            return this._teeth;
        }


    }
}