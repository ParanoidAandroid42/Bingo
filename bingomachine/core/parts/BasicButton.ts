module Core.Parts {

    export enum ButtonStates {
        Up = "Up",
        Down = "Down",
        Out = "Out",
        Over = "Over"
    }

    export enum ButtonEvents {
        Click = "onClick",
        Down = "onDown",
        Up = "onUp",
        Over = "onOver",
        Out = "onOut"
    }

    interface IButtonFrames {
        out: string;
        over: string;
        down: string;
        disabled: string;
    }

    interface IButtonTints {
        out: number;
        over: number;
        down: number;
        disabled: number;
    }

    interface IButtonStyles {
        out: PIXI.TextStyleOptions & PIXI.extras.BitmapTextStyle & { size?: number };
        over?: PIXI.TextStyleOptions & PIXI.extras.BitmapTextStyle & { size?: number };
        down?: PIXI.TextStyleOptions & PIXI.extras.BitmapTextStyle & { size?: number };
        disabled?: PIXI.TextStyleOptions & PIXI.extras.BitmapTextStyle & { size?: number };
    }

    export class BasicButton extends PIXI.Sprite {
        private _zIndex: number = 0;
        private _callback: Function = null
        private _context: any = null;
        private _text: Parts.Text | Parts.BitmapText = null;
        private _state: ButtonStates = ButtonStates.Out;
        private _frames: IButtonFrames = null;
        private _states: IButtonTints | IButtonStyles = { out: 0xFFFFFF, over: 0xFFFFFF, down: 0xFFFFFF, disabled: 0xFFFFFF };
        private _sounds: any = { Up: null, Down: null, Over: null, Out: null };
        private _codes: Array<number> = [];

        private _isPressed: boolean = false;
        private _isOver: boolean = false;
        private _isEnabled: boolean = true;
        private _maxPoint: number = 1;


        public static create(x: number, y: number, callback: Function, context: any, texture: string, parent?: PIXI.Container): BasicButton {
            let instance = new BasicButton(x, y, callback, context, { out: texture + "_out", over: texture + "_over", down: texture + "_down", disabled: texture + "_disabled" }, parent);
            return instance;
        }       

        constructor(x: number, y: number, callback: Function, context: any, frames: IButtonFrames, parent ?: PIXI.Container, name ?: string) {
            super(null);
            this.anchor.set(0.5, 0.5);
            this.position.set(x, y);
            this.buttonMode = true;
            this.interactive = true;
            this._callback = callback;
            this.name = name;
            this._context = context;
            this.setFrames(frames);
            this.on("pointerout", this.onButtonOut, this);
            this.on("pointerover", this.onButtonOver, this);
            this.on("pointerdown", this.onButtonDown, this);
            this.on("pointerup", this.onButtonUp, this);
            this.on("pointerupoutside", this.onButtonUpOutside, this);
            parent && parent.addChild(this);
        }

        public set Callback(callback: Function) {
            this._callback = callback;
        }

        public setFrames(frames: IButtonFrames): void {
            this._frames = (typeof frames === "object" && frames != null) ? frames : this._frames;
            this.resolveButtonState(this._state);
        }

        public setStates(states: IButtonTints | IButtonStyles): void {
            this._states = (typeof states === "object" && frames != null) ? states : this._states;
            this.resolveButtonState(this._state);
        }

        public setText(text: Parts.Text | Parts.BitmapText, states: IButtonTints | IButtonStyles): void {
            if (typeof text === "undefined" || text == null)
                return;

            if (typeof this._text === "object" && this._text != null)
                this.removeChild(this._text);
            this.addChild(this._text = text);

            this.setStates(states);
        }

        public setSoundFx(sound: string, state: ButtonStates = ButtonStates.Up, volume: number = 1.0) {
            this._sounds[state] = { sound, volume };
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
                this.onButtonDown(null);
        }

        private onKeyUp(event: KeyboardEvent): void {
            if (this._codes.indexOf(event.keyCode) != -1)
                this.onButtonUp(null);
        }

        // EVENT CALLBACKS
        private onButtonOut(e): void {
            if (e.data != undefined && (<TouchEvent>e.data.originalEvent).touches && (<TouchEvent>e.data.originalEvent).touches.length > 1) return;
            this._state = ButtonStates.Out;
            this.resolveButtonState(this._state);
            if (this._isEnabled == true) {
                if (this._isPressed == true)
                    this.emit("pointerup", true);
                this._isPressed = false;
            }
        }

        private onButtonOver(e): void {
            if (e.data != undefined && (<TouchEvent>e.data.originalEvent).touches && (<TouchEvent>e.data.originalEvent).touches.length > 1) return;
            this._state = ButtonStates.Over;
            if (this._isEnabled == true) {
                this.resolveButtonState(this._state);
                Controller.SoundController.instance.playButtonSound();
            }
        }

        private onButtonDown(e): void {
            if (e.data != undefined && (<TouchEvent>e.data.originalEvent).touches && (<TouchEvent>e.data.originalEvent).touches.length > 1) return;
            if (this._isEnabled == true) {
                this._state = ButtonStates.Down;
                this.resolveButtonState(this._state);
                this._isPressed = true;
            }
        }

        private onButtonUp(skipCallback: boolean): void {
            if (skipCallback != true && this._isEnabled == true && this._isPressed == true) {
                this._state = ButtonStates.Out;
                this.resolveButtonState(this._state);
                if (this._callback) this._callback.call(this._context, this);
                this._isPressed = false;
            }
        }

        private onButtonUpOutside(): void {
            this._state = ButtonStates.Up
            this._isPressed = false;
            this._isOver = false
            this._isEnabled && this.emit(ButtonEvents.Up);
            this.resolveButtonState(this._state);
        }

        private playSound(state: string) {
            if (this._isEnabled && this._sounds[this._state]) {
                Core.Game.instance.sound.play(this._sounds[this._state].sound, this._sounds[this._state].volume);
            }
        }

        // UTILS
        private resolveButtonState(buttonState: ButtonStates): void {
            let currentState: any = null;
            switch (this.isEnabled) {
                case true:
                    switch (buttonState) {
                        case ButtonStates.Up:
                            this.texture = PIXI.Texture.fromFrame(this._isOver ? this._frames.over : this._frames.out);
                            currentState = this._states.out;
                            break;
                        case ButtonStates.Down:
                            this.texture = PIXI.Texture.fromFrame(this._frames.down);
                            currentState = this._states.down;
                            break;
                        case ButtonStates.Out:
                            this.texture = PIXI.Texture.fromFrame(this._frames.out);
                            currentState = this._states.out;
                            break;
                        case ButtonStates.Over:
                            this.texture = PIXI.Texture.fromFrame(this._frames.over);
                            currentState = this._states.over;
                            break;
                    }
                    break;
                case false:
                    this.texture = PIXI.Texture.fromFrame(this._frames.disabled);
                    currentState = this._states.disabled;
                    break;
            }

            if (typeof this._text === "object" && this._text != null && currentState != null) {
                switch (typeof currentState) {
                    case "number":
                        this._text.tint = currentState;
                        break;
                    case "object":
                        if (typeof this._text["style"] === "object" && this._text["style"] != null) {
                            for (let property in currentState)
                                this._text["style"][property] = currentState[property];
                        }
                        break;
                }
            }
        }

        // GETTERS AND SETTERS
        public get isEnabled(): boolean {
            return this._isEnabled;
        }

        public set isEnabled(value: boolean) {
            if (this._isEnabled != value) {
                this._isEnabled = value;
                if (!value) this.onButtonUp(null);
                this.buttonMode = value;
                this.interactive = value;
                this.emit("enabled", this._isEnabled);
                this.resolveButtonState(this._state);
            }
        }

        public get text(): Parts.Text | Parts.BitmapText {
            return this._text;
        }

        public get state(): ButtonStates {
            return this._state;
        }

        public get angle(): number {
            return Math.round(1 / ((Math.PI / 180) / this.rotation));
        }

        public set angle(value: number) {
            this.rotation = ((Math.PI / 180) * value);
        }

        public get zIndex(): number {
            return this._zIndex;
        }

        public get keyCodes(): number[] {
            return this._codes;
        }

        public set zIndex(value: number) {
            this._zIndex = value;
        }
    }
}