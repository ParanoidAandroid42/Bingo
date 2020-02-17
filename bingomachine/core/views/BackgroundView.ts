module Core.View {

     /** Importing classses */
    import BackgroundController = Controller.BackgroundController;

    export class BackgroundView implements Interfaces.IDisplayVisual{

        private _stage: Stages.MainStage;
        private _backgroundController: BackgroundController;
        private _backgroundContainer: Parts.Container;
        private _baseContainer: Parts.Container;
        private _coverContainer: Parts.Container;

        private _coverTop: Parts.Sprite;
        private _coverBottom: Parts.Sprite;
        private _coverLeft: Parts.Sprite;
        private _coverRight: Parts.Sprite;
        private _portraitLogo: Parts.Sprite;
        private _lanscapeLogo: Parts.Sprite;

        private _portraitBackground: Parts.Sprite;
        private _landscapeBackground: Parts.Sprite;
        private _backgroundBlack: Parts.Sprite;

        private _smokeAnim: Parts.AnimatedSprite[] = [];

         /** Running when loading stage 
          * @param stage - stage class
          */
        public constructor(stage: Stages.MainStage) {
            this._stage = stage;
            this._backgroundController = new BackgroundController(this, stage);
            this.initProperties();
        }

         /** Background View class's init function */
        public initProperties() {

            /** Create Containers */
            this._backgroundContainer = new Parts.Container(this._stage, "BackgroundContainer");
            this._baseContainer = new Parts.Container(this._stage, "BaseContainer"); 
            this._coverContainer = new Parts.Container(this._stage, "CoverContainer");

             /** Create Sprites */
            this._portraitBackground = new Parts.Sprite(360, 640, StyleInformation.BackgroundFrames.PortraitNormalBackground, this._backgroundContainer, "PortaitBackground");
            this._landscapeBackground = new Parts.Sprite(640, 360, StyleInformation.BackgroundFrames.LandscapeNormalBackground, this._backgroundContainer, "LandscapeBackground");

            let dimGraphics = new PIXI.Graphics();
            dimGraphics.beginFill(0x000000, 1);
            dimGraphics.drawRect(0, 0, DisplayResolution.width, DisplayResolution.width);
            dimGraphics.endFill();

            this._backgroundBlack = new Parts.Sprite(DisplayResolution.width / 2, DisplayResolution.width/2, dimGraphics.generateCanvasTexture(), this._backgroundContainer, "BackgroundBlack");
            this._coverBottom = new Parts.Sprite(360, 960, StyleInformation.BackgroundFrames.CoverBottom, this._coverContainer, "CoverBottom");
            this._coverTop = new Parts.Sprite(360, 322, StyleInformation.BackgroundFrames.CoverTop, this._coverContainer, "CoverTop");
            this._coverRight = new Parts.Sprite(960, 360, StyleInformation.BackgroundFrames.CoverRight, this._coverContainer, "CoverRight");
            this._coverLeft = new Parts.Sprite(322, 360, StyleInformation.BackgroundFrames.CoverLeft, this._coverContainer, "CoverLeft");
            this._portraitLogo = new Parts.Sprite(0, 283, StyleInformation.BackgroundFrames.Logo, this._coverTop, "Logo");
            this._lanscapeLogo = new Parts.Sprite(360, 238, StyleInformation.BackgroundFrames.Logo, this._coverLeft, "Logo");

            /** Create Animations */
            let frame = Parts.AnimatedSprite.generateTextures(StyleInformation.BackgroundSmokes.SmokeAnim1, 6, 19, "", 5);
            this._smokeAnim.push(new Parts.AnimatedSprite(349, 452, frame, false, 0.35, this._backgroundContainer));
            frame = Parts.AnimatedSprite.generateTextures(StyleInformation.BackgroundSmokes.SmokeAnim2, 20, 34, "", 5);
            this._smokeAnim.push(new Parts.AnimatedSprite(1106, 308, frame , false, 0.35, this._backgroundContainer));
            frame = Parts.AnimatedSprite.generateTextures(StyleInformation.BackgroundSmokes.SmokeAnim3, 19, 33, "", 5);
            this._smokeAnim.push(new Parts.AnimatedSprite(257, 470, frame, false, 0.35, this._backgroundContainer));
            frame = Parts.AnimatedSprite.generateTextures(StyleInformation.BackgroundSmokes.SmokeAnim3, 19, 33, "", 5),
            this._smokeAnim.push(new Parts.AnimatedSprite(193, 385,frame, false, 0.35, this._backgroundContainer));            

            for (let i = 0; i < 4; i++) 
                this._smokeAnim[i].scale.set(.8, .8);            

            this.playCoverOpenAnimation(DisplayOrientation.landscape);
            this.playCoverOpenAnimation(DisplayOrientation.portrait);
            this.playRandomSmokeAnimation();
        }

         /** Play Cover Animations (landscape or portrait) 
          * @param orientation - display orientation (landscape or portrait)
          */
        private playCoverOpenAnimation(orientation: DisplayOrientation) {           
            if (orientation == DisplayOrientation.portrait) {
                TweenLite.to(this._coverTop, .8, { delay: .5, y: -240, ease: Sine.easeOut });
                TweenLite.to(this._coverBottom, .8, { delay: .5, y: 1522, ease: Sine.easeOut });
                TweenLite.to(this._portraitLogo.scale, .8, { delay: .5, y: 1, x: 1, ease: Sine.easeOut });
            } else {
                TweenLite.to(this._coverLeft, .8, { delay: .5, x: -240, ease: Sine.easeOut });
                TweenLite.to(this._coverRight, .8, { delay: .5, x: 1522, ease: Sine.easeOut });
                TweenLite.to(this._lanscapeLogo.scale, .8, { delay: .5, y: .8, x: .8, ease: Sine.easeOut });
            }
            TweenLite.to(this._backgroundBlack, 1, { delay: .5, alpha: 0, ease: Sine.easeOut });
        }

        /** Random play smoke animations*/
        public playRandomSmokeAnimation() {
            let randomTime = (5 + Math.random()) * 10;  //changing scala = 5-10 sn
            let tweentime: TimelineMax = new TimelineMax();
            tweentime.call(() => {
                let randomSmoke = Math.floor((0 + Math.random()) * 4);  //smoke scala = 0-4
                Controller.SoundController.instance.playShortSmokeSound(randomSmoke % 2);
                this._smokeAnim[randomSmoke].resetAnimation();
                this._smokeAnim[randomSmoke].play();
                this.playRandomSmokeAnimation();
            }, null, null, "+=" + randomTime);
        }

       /** change visual according to visual type 
         * @param type - visual type
         */
        public changeVisual(type: VisualType): void {
            switch (type) {
                case VisualType.normal:
                    this._landscapeBackground.texture = PIXI.Texture.fromFrame(StyleInformation.BackgroundFrames.LandscapeNormalBackground);
                    this._portraitBackground.texture = PIXI.Texture.fromFrame(StyleInformation.BackgroundFrames.PortraitNormalBackground);
                    break;
                case VisualType.turbo:
                    this._landscapeBackground.texture = PIXI.Texture.fromFrame(StyleInformation.BackgroundFrames.LandscapeTurboBackground);
                    this._portraitBackground.texture = PIXI.Texture.fromFrame(StyleInformation.BackgroundFrames.PortraitTurboBackground);
                    break;
                case VisualType.forward:
                    break;
            }
        }

        /** Set orientation visuals according to DisplayOrientation (landscape/portrait) */
        public changeOrientation(orientation: DisplayOrientation) {
            switch (orientation) {
                case DisplayOrientation.landscape:
                    this._smokeAnim[0].position.set(349, 452);
                    this._smokeAnim[1].position.set(1106, 308);
                    this._smokeAnim[2].position.set(257, 470);
                    this._smokeAnim[3].position.set(193, 385);
                    this._portraitBackground.visible = false;
                    this._landscapeBackground.visible = true;
                    this._coverBottom.visible = false;
                    this._coverTop.visible = false;
                    this._coverLeft.visible = true;
                    this._coverRight.visible = true;
                    this._portraitLogo.visible = false;
                    this._lanscapeLogo.visible = true;
                    break;
                case DisplayOrientation.portrait:
                    this._smokeAnim[0].position.set(405, 913);
                    this._smokeAnim[1].position.set(505, 752);
                    this._smokeAnim[2].position.set(185, 574);
                    this._smokeAnim[3].position.set(96, 831);
                    this._portraitBackground.visible = true;
                    this._landscapeBackground.visible = false;
                    this._coverBottom.visible = true;
                    this._coverTop.visible = true;
                    this._coverLeft.visible = false;
                    this._coverRight.visible = false;
                    this._portraitLogo.visible = true;
                    this._lanscapeLogo.visible = false;
                    break;
            }
        }

        public get baseContainer() {
            return this._baseContainer;
        }

        public get backgroundContainer() {
            return this._backgroundContainer;
        }
    }
}