module Core.Parts {
    export class ToggleButton extends PIXI.Sprite {
        private _zIndex: number = 0;
        private _callback: Function;
        private _context: any;

        private _unselectedFrame: PIXI.Texture;
        private _selectedFrame: PIXI.Texture;

        private _isPressed: boolean = false;
        private _isEnabled: boolean = true;
        private _isUnselectable: boolean;
        private _isSelected: boolean;

        constructor(x: number, y: number, callback: Function, context: any, unselectedFrame: string, selectedFrame: string,
            isSelected: boolean = false, isUnselectable: boolean = true, parent?: PIXI.Container,name ?:string) {
            super((isSelected == true) ? PIXI.Texture.fromFrame(selectedFrame) : PIXI.Texture.fromFrame(unselectedFrame));
            this.anchor.set(0.5, 0.5);
            this.position.set(x, y);
            this.name = name;
            this.buttonMode = true;
            this.interactive = true;
            this._callback = callback;
            this._context = context;
            this._isUnselectable = isUnselectable;
            this._isSelected = isSelected;
            this.setFrames(unselectedFrame, selectedFrame);
            this.on("pointerout", this.onButtonOut, this);
            this.on("pointerdown", this.onButtonDown, this);
            this.on("pointerup", this.onButtonUp, this);
            if (parent) parent.addChild(this);
        }

        public setFrames(unselectedFrame: string, selectedFrame: string): void {
            this._unselectedFrame = PIXI.Texture.fromFrame(unselectedFrame);
            this._selectedFrame = PIXI.Texture.fromFrame(selectedFrame);
            this.texture = (this._isSelected == true) ?
                this._selectedFrame : this._unselectedFrame;
        }

        // EVENT CALLBACKS
        private onButtonOut(): void {
            this._isPressed = false;
        }

        private onButtonUp(): void {
            if (this._isEnabled == true && this._isPressed == true) {
                if (this._isUnselectable == false) {
                    if (this.isSelected == false) {
                        this.isSelected = true;
                        if (this._callback) this._callback.call(this._context, this);
                    }
                } else {
                    this.isSelected = !this.isSelected;
                    if (this._callback) this._callback.call(this._context, this);
                }
                this._isPressed = false;
            }
        }

        private onButtonDown(): void {
            if (this._isEnabled == true) this._isPressed = true;
        }

        // GETTERS AND SETTERS
        public set isSelected(value: boolean) {
            if (this._isSelected != value) {
                this._isSelected = value;
                this.texture = (this._isSelected == true) ?
                    this._selectedFrame : this._unselectedFrame;
            }
        }

        public get isSelected(): boolean {
            return this._isSelected;
        }

        public set isEnabled(value: boolean) {
            if (value != this._isEnabled) {
                this._isEnabled = value;
                this.buttonMode = value;
                this.interactive = value;
                this.tint = (this._isEnabled == true) ?
                    0xFFFFFF : 0x696969;
            }
        }

        public set angle(value: number) {
            this.rotation = ((Math.PI / 180) * value);
        }

        public get angle(): number {
            return Math.round(1 / ((Math.PI / 180) / this.rotation));
        }

        public get zIndex(): number {
            return this._zIndex;
        }

        public set zIndex(value: number) {
            this._zIndex = value;
        }
    }
}