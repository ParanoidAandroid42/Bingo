module Core.Managers {
    export enum RendererType {
        Canvas,
        WebGL,
        Auto
    }

    export enum PositionType {
        PositionXForLandscape,
        PositionXForPortrait,
        PositionYForLandscape,
        PositionYForPortrait
    }

    export class DisplayManager extends PIXI.utils.EventEmitter {
        private _renderer: PIXI.CanvasRenderer | PIXI.WebGLRenderer;
        private _renderTargets: Array<Interfaces.IRenderTarget> = [];
        private _rendererContainer: HTMLElement = null;
        private _fullscreenTarget: HTMLElement = null;
        protected game: Game;

        private to: any = 0;
        private _orientation = "potrait";

        constructor(game:Game,width: number, height: number, options: PIXI.RendererOptions = {}, container?: string, target?: string) {
            super();
            this.game = game;   
            this._renderer = new PIXI.WebGLRenderer(width, height, options);
            this.initProperties(container, target);
        }

        public render(stageContainer: PIXI.DisplayObject): void {
            for (let rIndex = 0; rIndex < this._renderTargets.length; rIndex++)
                this._renderer.render(this._renderTargets[rIndex].rDisplay, this._renderTargets[rIndex].rTexture);

            if (typeof stageContainer !== "undefined" && stageContainer != null) {
                let x, y, safeX, safeY;
                if (window.innerWidth >= window.innerHeight) {
                    x = 1280;
                    y = 720;
                    safeX = 960;
                    safeY = 720;
                } else {
                    x = 720;
                    y = 1280;
                    safeX = 720;
                    safeY = 1215;
                }
                let sx = window.innerWidth / x;
                let sy = window.innerHeight / y;
                let scale = Math.max(sx, sy);
                let anchorX = .5;
                let anchorY = .5;

                if ((window.innerWidth < (safeX * scale)) || (window.innerHeight < (safeY * scale))) {
                    sx = window.innerWidth / safeX;
                    sy = window.innerHeight / safeY;
                    scale = Math.min(sx, sy);
                }

                stageContainer.scale.set(scale);
                stageContainer.pivot.set(x * anchorX, y * anchorY);
                stageContainer.position.set(window.innerWidth * anchorX, window.innerHeight * anchorY);
                this._renderer.render(stageContainer);
            }
        }

        public offsetPosition(type: PositionType):number {
            let point: number;
            switch (type) {
                case PositionType.PositionXForLandscape:
                    point = (this.game.stage.container.position.x / this.game.stage.container.scale.x) - 480;
                    break;
                case PositionType.PositionYForPortrait:
                    point = ((this.game.display.height - this.game.stage.container.position.y ) / (this.game.stage.container.scale.y));
                    break;
            }
            
            return point;
        }

        public get width(): number {
            return this._renderer.width;
        }

        public get height(): number {
            return this._renderer.height;
        }

        public addRenderTarget(rDisplay: PIXI.DisplayObject, rTexture: PIXI.RenderTexture): void {
            this._renderTargets.push({ rDisplay: rDisplay, rTexture: rTexture });
        }

        public removeRenderTarget(rDisplay: PIXI.DisplayObject, rTexture: PIXI.RenderTexture): void {
            for (let rIndex = 0; rIndex < this._renderTargets.length; rIndex++) {
                if (rDisplay == this._renderTargets[rIndex].rDisplay &&
                    rTexture == this._renderTargets[rIndex].rTexture) {
                    this._renderTargets[rIndex].rDisplay.destroy();
                    this._renderTargets[rIndex].rTexture.destroy();
                    this._renderTargets[rIndex].rDisplay = null;
                    this._renderTargets[rIndex].rTexture = null;
                    this._renderTargets.splice(rIndex, 1);
                }
            }
        }

        public removeAllRenderTargets(): void {
            for (let rIndex = 0; rIndex < this._renderTargets.length; rIndex++) {
                this._renderTargets[rIndex].rDisplay.destroy();
                this._renderTargets[rIndex].rTexture.destroy();
                this._renderTargets[rIndex].rDisplay = null;
                this._renderTargets[rIndex].rTexture = null;
            }
            this._renderTargets = [];
        }

        public toggleFullscreen(): void {
            switch (this.isFullscreen) {
                case true:
                    if (document["exitFullscreen"]) document["exitFullscreen"]();
                    else if (document["msExitFullscreen"]) document["msExitFullscreen"]();
                    else if (document["mozCancelFullScreen"]) document["mozCancelFullScreen"]();
                    else if (document["webkitExitFullscreen"]) document["webkitExitFullscreen"]();
                    break;
                case false:
                    if (this._fullscreenTarget["requestFullscreen"]) this._fullscreenTarget["requestFullscreen"]();
                    else if (this._fullscreenTarget["msRequestFullscreen"]) this._fullscreenTarget["msRequestFullscreen"]();
                    else if (this._fullscreenTarget["mozRequestFullScreen"]) this._fullscreenTarget["mozRequestFullScreen"]();
                    else if (this._fullscreenTarget["webkitRequestFullScreen"]) this._fullscreenTarget["webkitRequestFullScreen"]();
                    break;
            }
        }

        // UTILS
        private initProperties(container?: string, target?: string): void {
            //@FULLCANVAS
            window.addEventListener("resize", this.onWindowResize.bind(this), false);
            window.addEventListener("orientationchange", this.onOrientationChange.bind(this), false);
            document.addEventListener("fullscreenchange", this.onFullscreenChange.bind(this), false);
            document.addEventListener("msfullscreenchange", this.onFullscreenChange.bind(this), false);
            document.addEventListener("mozfullscreenchange", this.onFullscreenChange.bind(this), false);
            document.addEventListener("webkitfullscreenchange", this.onFullscreenChange.bind(this), false);
            document.addEventListener("keydown", this.onFullscreenKeyDown.bind(this), false);

            switch (typeof container) {
                case "string":
                    switch (container) {
                        case "body":
                            this._rendererContainer = document.body;
                            break;
                        default:
                            this._rendererContainer = (document.getElementById(container)) ?
                                document.getElementById(container) : document.body;
                            break;
                    }
                    break;
                default:
                    this._rendererContainer = document.body;
                    break;
            }
            switch (typeof target) {
                case "string":
                    switch (target) {
                        case "body":
                            this._fullscreenTarget = document.body;
                            break;
                        default:
                            this._fullscreenTarget = (document.getElementById(target)) ?
                                document.getElementById(target) : this._rendererContainer;
                            break;
                    }
                    break;
                default:
                    this._fullscreenTarget = this._rendererContainer;
                    break;
            }
            this._renderer.view.id = "videoslot-canvas";
            this._renderer.view.style.width = "100%";
            this._renderer.view.style.height = "100%";
            this._rendererContainer.appendChild(this._renderer.view);

            this.onWindowResize();
        }

        private onWindowResize() {
            this._renderer.resize(window.innerWidth, window.innerHeight);
            this._renderer.view.style.width = "100%";
            this._renderer.view.style.height = "100%";
            this.checkOrientation();
            clearTimeout(this.to);
            this.to = setTimeout(() => {
                this.checkOrientation();
                this.emit("resize", this.orientation);
            }, 50);
        }

        private checkOrientation() {
            window.innerWidth > window.innerHeight ? this.orientation = "landscape" : this.orientation = "portrait";   
        }

        private get orientation() {
            return this._orientation;
        }

        private set orientation(v) {
            if (v != this._orientation) {
                this._orientation = v;
                this.emit("orientationchange", this._orientation);
            }
        }

        private onOrientationChange(event): void {
            this.checkOrientation();
        }

        // EVENT CALLBACKS
        private onFullscreenChange(event): void {
            this.emit("fullscreenchange", this.isFullscreen);
        }

        private onFullscreenKeyDown(event): void {
            switch (event.keyCode) {
                case 122:
                    this.toggleFullscreen();
                    event.preventDefault();
                    break;
                default:
                    break;
            }
        }

        // GETTERS AND SETTERS
        public get isFullscreen(): boolean {
            return ((document["mozFullScreenElement"] && document["mozFullScreenElement"] === this._fullscreenTarget) ||
                (document["webkitFullscreenElement"] && document["webkitFullscreenElement"] === this._fullscreenTarget) ||
                (document["msFullscreenElement"] && document["msFullscreenElement"] === this._fullscreenTarget) ||
                (document["fullscreenElement"] && document["fullscreenElement"] === this._fullscreenTarget)) ? true : false;
        }

        public get renderer(): PIXI.CanvasRenderer | PIXI.WebGLRenderer {
            return this._renderer;
        }

        public get rendererContainer(): HTMLElement {
            return this._rendererContainer;
        }

        public get rendererStyle(): CSSStyleDeclaration {
            return this._renderer.view.style;
        }
        
    }
}