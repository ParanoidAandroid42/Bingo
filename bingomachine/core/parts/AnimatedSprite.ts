module Core.Parts {
    export class AnimatedSprite extends PIXI.extras.AnimatedSprite {
        private _zIndex: number = 0;

        constructor(x: number, y: number, textures: PIXI.Texture[] | { texture: PIXI.Texture; time?: number; }[], loop: boolean = false, speed: number = 1, parent?: PIXI.Container,name?:string) {
            super(textures);
            this.anchor.set(0.5, 0.5);
            this.loop = loop;
            this.position.set(x, y);
            this.animationSpeed = speed;
            this.name = name;
            if (parent) parent.addChild(this);
        }

        public setAnimation(textures: Array<PIXI.Texture>, currentFrame: number = 0): void {
            this.textures = textures;
            if (currentFrame != null) this.texture = textures[currentFrame];
            if (currentFrame != null) this.currentFrame = currentFrame;
        }

        public resetAnimation(currentFrame: number = 0): void {
            if (currentFrame != null) this.gotoAndStop(currentFrame);
            if (currentFrame != null) this.texture = <PIXI.Texture>this.textures[currentFrame];
        }

        // GETTERS AND SETTERS
        public get angle(): number {
            return Math.round(1 / ((Math.PI / 180) / this.rotation));
        }

        public set angle(value: number) {
            this.rotation = ((Math.PI / 180) * value);
        }

        public get zIndex(): number {
            return this._zIndex;
        }

        public set zIndex(value: number) {
            this._zIndex = value;
        }

        // STATIC HELPERS
        public static generateTextures(prefix: string, start: number, stop: number, suffix: string = "", padding: number = 0): Array<PIXI.Texture> {
            try {
                let frameTextures: Array<PIXI.Texture> = [];
                if (start <= stop) {
                    for (let frameNo = start; frameNo <= stop; frameNo++) {
                        let frameName = prefix;
                        let padDiff = padding - frameNo.toString().length;
                        if (padDiff > 0) for (let index = 0; index < padDiff; index++) frameName += "0";
                        frameName += frameNo.toString();
                        frameName += suffix;
                        frameTextures.push(PIXI.Texture.fromFrame(frameName));
                    }
                } else {
                    for (let frameNo = start; frameNo >= stop; frameNo--) {
                        let frameName = prefix;
                        let padDiff = padding - frameNo.toString().length;
                        if (padDiff > 0) for (let index = 0; index < padDiff; index++) frameName += "0";
                        frameName += frameNo.toString();
                        frameName += suffix;
                        frameTextures.push(PIXI.Texture.fromFrame(frameName));
                    }
                }
                return frameTextures;
            } catch (e) {
                throw "Error: " + e.message;
            }
        }
    }
}