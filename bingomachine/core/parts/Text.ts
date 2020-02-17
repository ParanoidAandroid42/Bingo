module Core.Parts {
    export class Text extends PIXI.Text {
        private _zIndex: number = 0;
        private _prefWidth: number = 0;
        private _sizeRange: number[] = null;

        constructor(x: number, y: number, text: string = "", style: PIXI.TextStyleOptions = { fontFamily: "Arial", fill: "#FFFFFF" }, parent?: PIXI.Container, anchor?: Anchor, name?: string) {
            super(text, style);
            this.position.set(x, y);
            this._anchor.set(.5, .5);
            if (this.name) this.name = name;

            switch (anchor) {
                case Anchor.center:
                    this._anchor.set(.5, .5);
                    break;
                case Anchor.left:
                    this._anchor.set(1, .5);
                    break;
                case Anchor.right:
                    this._anchor.set(0, .5);
                    break;
            }
            parent && parent.addChild(this);
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

        public get prefWidth(): number {
            return this._prefWidth;
        }

        public set prefWidth(value: number) {
            this._prefWidth = value;
        }

        public get sizeRange(): number[] {
            return this._sizeRange;
        }

        public set sizeRange(value: number[]) {
            this._sizeRange = value;
        }
    }
}