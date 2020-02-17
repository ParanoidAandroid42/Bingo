module Core.Parts {
    enum ButtonStates {
        Up = "Up",
        Down = "Down",
        Out = "Out",
        Over = "Over"
    }

    interface ButtonTints {
        out: number;
        over: number;
        down: number;
        disabled: number;
    }

    export class BitmapTextButton extends Parts.BitmapText {
        private _callback: Function = null;
        private _context: any = null;
        private _state: ButtonStates = ButtonStates.Out;
        private _states: ButtonTints = { out: 0xFFFFFF, over: 0xFFFFFF, down: 0xFFFFFF, disabled: 0xFFFFFF };
        private _codes: Array<number> = [];

        private _isPressed: boolean = false;
        private _isEnabled: boolean = true;

        constructor(x: number, y: number, callback: Function, context: any, text: string, style: PIXI.extras.BitmapTextStyle, states: ButtonTints, parent?: PIXI.Container) {
            super(x, y, text, style, parent);
            this.buttonMode = true;
            this.interactive = true;
            this._state = ButtonStates.Out;
            this._callback = callback;
            this._context = context;
            this.setStates(states);
            this.on("pointerout", this.onButtonOut, this);
            this.on("pointerover", this.onButtonOver, this);
            this.on("pointerdown", this.onButtonDown, this);
            this.on("pointerup", this.onButtonUp, this);
            this.on("pointerupoutside", this.onButtonUpOutside, this);
        }

        public setStates(states: ButtonTints): void {
            this._states = (typeof states === "object" && states != null) ? states : this._states;
            this.resolveButtonState(this._state);
        }

        public captureKey(code: number): void {
            if (typeof this._codes === "undefined" || this._codes == null)
                this._codes = [];

            if (this._codes.length == 0) {
                document.addEventListener("keydown", this.onKeyDown.bind(this));
                document.addEventListener("keyup", this.onKeyUp.bind(this));
            }

            this._codes[this._codes.length] = code;
        }

        public removeKey(code: number): void {
            if (typeof this._codes === "undefined" || this._codes == null)
                this._codes = [];

            if (this._codes.length != 0) {
                let index: number = this._codes.indexOf(code);
                this._codes.splice(((index == -1) ? this._codes.length : index), 1);
            }
        }

        // EVENT CALLBACKS
        private onKeyDown(event: KeyboardEvent): void {
            if (this._codes.indexOf(event.keyCode) != -1)
                this.onButtonDown();
        }

        private onKeyUp(event: KeyboardEvent): void {
            if (this._codes.indexOf(event.keyCode) != -1)
                this.onButtonUp(false);
        }

        private onButtonOut(): void {
            this._state = ButtonStates.Out;
            if (this._isEnabled == true) {
                this.resolveButtonState(this._state);
                if (this._isPressed == true)
                    this.emit("pointerup", true);
                this._isPressed = false;
            }
        }

        private onButtonOver(): void {
            this._state = ButtonStates.Over;
            if (this._isEnabled == true)
                this.resolveButtonState(this._state);
        }

        private onButtonDown(): void {
            if (this._isEnabled == true) {
                this.resolveButtonState(this._state = ButtonStates.Down);
                this._isPressed = true;
            }
        }

        private onButtonUp(skip?: boolean): void {
            if (typeof skip === "boolean" && skip == true)
                return;

            if (this._isEnabled == true && this._isPressed == true) {
                switch (skip) {
                    case false:
                        this.resolveButtonState(this._state = ButtonStates.Out);
                        break;
                    default:
                        this.resolveButtonState(this._state = ButtonStates.Up);
                }

                this._isPressed = false;
                if (this._callback && this._context)
                    this._callback.call(this._context, this);
            }
        }

        private onButtonUpOutside(): void {
            if (this._isEnabled == true && this._isPressed == true)
                this.resolveButtonState(this._state = ButtonStates.Out);
        }

        // UTILS
        private resolveButtonState(buttonState: ButtonStates): void {
            switch (this.isEnabled) {
                case true:
                    switch (buttonState) {
                        case ButtonStates.Up:
                            this.tint = this._states.over;
                            break;
                        case ButtonStates.Down:
                            this.tint = this._states.down;
                            break;
                        case ButtonStates.Out:
                            this.tint = this._states.out;
                            break;
                        case ButtonStates.Over:
                            this.tint = this._states.over;
                            break;
                    }
                    break;
                case false:
                    this.tint = this._states.disabled;
                    break;
            }
        }

        // GETTERS AND SETTERS
        public get isEnabled(): boolean {
            return this._isEnabled;
        }

        public set isEnabled(value: boolean) {
            if (this._isEnabled != value) {
                this._isEnabled = value;
                this.buttonMode = value;
                this.interactive = value;
                this.resolveButtonState(this._state);
                if (this._isPressed == true) {
                    this._isPressed = false;
                    this.emit("pointerup", true);
                    this._state = ButtonStates.Out;
                }
            }
        }

        public get state(): ButtonStates {
            return this._state;
        }
    }
}