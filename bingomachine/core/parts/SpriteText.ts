/// <reference path="sprite.ts" />
/// <reference path="container.ts" />

module Core.Parts {
    type AnchorType = { x: number; y: number; set: (x: number, y?: number) => void };
    type SpriteFontProperties = {
        spacing?: number;
        anchor?: { x: number; y: number; };
        scale?: { x: number; y: number; };
    };

    const ASCII_CHARACTER_CODES = {
        "31": "", "32": " ", "33": "!", "34": "\"", "35": "#",
        "36": "$", "37": "%", "38": "&", "39": "'", "40": "(",
        "41": ")", "42": "*", "43": "+", "44": ",", "45": "-",
        "46": ".", "47": "/", "48": "0", "49": "1", "50": "2",
        "51": "3", "52": "4", "53": "5", "54": "6", "55": "7",
        "56": "8", "57": "9", "58": ":", "59": ";", "60": "<",
        "61": "=", "62": ">", "63": "?", "64": "@", "65": "A",
        "66": "B", "67": "C", "68": "D", "69": "E", "70": "F",
        "71": "G", "72": "H", "73": "I", "74": "J", "75": "K",
        "76": "L", "77": "M", "78": "N", "79": "O", "80": "P",
        "81": "Q", "82": "R", "83": "S", "84": "T", "85": "U",
        "86": "V", "87": "W", "88": "X", "89": "Y", "90": "Z",
        "91": "[", "92": "\\", "93": "]", "94": "^", "95": "_",
        "96": "`", "97": "a", "98": "b", "99": "c", "100": "d",
        "101": "e", "102": "f", "103": "g", "104": "h", "105": "i",
        "106": "j", "107": "k", "108": "l", "109": "m", "110": "n",
        "111": "o", "112": "p", "113": "q", "114": "r", "115": "s",
        "116": "t", "117": "u", "118": "v", "119": "w", "120": "x",
        "121": "y", "122": "z", "123": "{", "124": "|", "125": "}",
        "126": "~", "127": ""
    };

    export class SpriteText extends Parts.Container {
        private _glyphs: Array<Parts.Sprite> = [];

        private _font: string;
        private _text: string;
        private _spacing: number = 5;
        private _anchor: AnchorType = {
            x: 0, y: 0, set: (x: number, y: number = null) => {
                if (typeof x === "number" && y == null) {
                    this._anchor.x = x;
                    this._anchor.y = x;
                } else {
                    this._anchor.x = x;
                    this._anchor.y = y;
                }
                this.calculatePivot(this._anchor.x, this._anchor.y);
            }
        };

        constructor(x: number, y: number, text: string, font: string, properties?: SpriteFontProperties, parent?: PIXI.Container) {
            super(parent, "SpriteText");
            this.anchor.set(0.5, 0.5);
            this.position.set(x, y);
            this._text = text;
            this._font = font;
            this.initProperties(properties);
        }

        private initProperties(properties: SpriteFontProperties): void {
            this.anchor.x = (properties && properties.anchor) ? properties.anchor.x : 0;
            this.anchor.y = (properties && properties.anchor) ? properties.anchor.y : 0;
            this.scale.x = (properties && properties.scale) ? properties.scale.x : 1;
            this.scale.y = (properties && properties.scale) ? properties.scale.y : 1;
            this._spacing = (properties && properties.spacing) ? properties.spacing : 5;
            this.generateText(this.text);
        }

        // UTILS
        private generateText(text: string): void {
            try {
                let w: number = 0;
                let h: number = 0;
                for (let gIndex = 0; gIndex < text.length; gIndex++) {
                    if (this._glyphs[gIndex]) {
                        this._glyphs[gIndex].position.set(w, 0);
                        this._glyphs[gIndex].texture = PIXI.Texture.fromFrame((this.font + "/" + text[gIndex].charCodeAt(0).toString()));
                    } else
                        this._glyphs[gIndex] = new Parts.Sprite(w, 0, (this.font + "/" + text[gIndex].charCodeAt(0).toString()), this);
                    w += this._glyphs[gIndex].width + this.spacing;
                    h = (this._glyphs[gIndex].height > h) ? this._glyphs[gIndex].height : h;
                    if (gIndex == (text.length - 1))
                        this.pivot.set(((w -= this.spacing) * this.anchor.x), (h * this.anchor.y));
                }
                if (this._glyphs.length > text.length) {
                    let oldChars = this._glyphs.splice(text.length, (this._glyphs.length - text.length));
                    for (let oIndex = 0; oIndex < oldChars.length; oIndex++)
                        oldChars[oIndex].destroy({ children: true, baseTexture: true });
                    oldChars = null;
                }
            } catch (e) {

            }
        }

        private calculatePivot(x: number = 0, y: number = 0): void {
            let w: number = 0;
            let h: number = 0;
            for (let gIndex = 0; gIndex < this._glyphs.length; gIndex++) {
                w += this._glyphs[gIndex].width + this.spacing;
                h = (this._glyphs[gIndex].height > h) ? this._glyphs[gIndex].height : h;
            }
            this.pivot.set(((w -= this.spacing) * x), (h * y));
        }
        
        // GETTERS AND SETTERS
        public get font(): string {
            return this._font;
        }

        public set font(value: string) {
            if (this._font != value) {
                this._font = value;
                this.generateText(this.text);
            }
        }

        public get text(): string {
            return this._text;
        }

        public set text(value: string) {
            if (this._text != String(value)) {
                this._text = String(value);
                this.generateText(this.text);
            }
        }

        public get spacing(): number {
            return this._spacing;
        }

        public set spacing(value: number) {
            if (this._spacing != value) {
                this._spacing = value;
                this.generateText(this.text);
            }
        }

        public get anchor(): AnchorType {
            return this._anchor;
        }
    }
}