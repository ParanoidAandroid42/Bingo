module Core.Parts {
    export class Sprite extends PIXI.Sprite {
        private _zIndex: number = 0;
        private _pointerOut

        constructor(x: number, y: number, frame?: string | PIXI.Texture, parent?: PIXI.Container, name?: string) {
            super((typeof frame === "string") ? PIXI.Texture.fromFrame(frame) : <PIXI.Texture>frame);
            this.anchor.set(0.5, 0.5);
            this.position.set(x, y);
            if (parent) parent.addChild(this);
            this.name = name;
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
    }
}