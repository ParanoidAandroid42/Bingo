/// <reference path="../parts/text.ts" />
/// <reference path="../parts/bitmaptext.ts" />
/// <reference path="../parts/textbutton.ts" />
/// <reference path="../parts/bitmaptextbutton.ts" />

module Core.Essentials {
    // TYPES
    type LanguageFontStyle = PIXI.TextStyleOptions & PIXI.extras.BitmapTextStyle & { size?: number; };
    type LanguageType = "webfont" | "bitmapfont";

    type DynamicText = Parts.Text | Parts.BitmapText;
    type DynamicButton = Parts.TextButton | Parts.BitmapTextButton;

    // INTERFACES
    interface ButtonTints {
        out: number;
        over: number;
        down: number;
        disabled: number;
    }

    interface ButtonStyles {
        out: PIXI.TextStyleOptions;
        over: PIXI.TextStyleOptions;
        down: PIXI.TextStyleOptions;
        disabled: PIXI.TextStyleOptions;
    }

    interface ILanguageFontStyle {
        font?: string;
        size?: number;
        fill?: string;
        align?: string;
    };

    interface ILanguageData {
        text: string;
        properties?: ILanguageFontStyle;
    };

    interface ILanguageManifest {
        code: string | number;
        data: { [key: string]: ILanguageData };
        font: { [key: string]: { type: LanguageType; format?: string; url: string; } };
        mobileUI: any;
        paytable: any;
        message?: string;
    };

    export class Language extends PIXI.utils.EventEmitter {
        protected game: Core.Game;

        private _loader: XMLHttpRequest = new XMLHttpRequest();
        private _manifest: ILanguageManifest;

        private _langNumber: number = 0;
        private _langUrls: Array<string> = [];

        private _bmpFontLoaded: boolean = false;
        private _webFontLoaded: boolean = false;

        constructor(game: Core.Game) {
            super();
            this.game = game;
            this._loader.addEventListener("error", this.onJsonLoadError.bind(this), false);
            this._loader.addEventListener("abort", this.onJsonLoadError.bind(this), false);
            this._loader.addEventListener("timeout", this.onJsonLoadError.bind(this), false);
            this._loader.addEventListener("load", this.onJsonLoadComplete.bind(this), false);
        }

        public load(langUrls: Array<string>): void {
            if (typeof langUrls === "undefined" || langUrls == null || langUrls.length == 0)
                return;

            this._langNumber = 0;
            this._langUrls = langUrls;
            this._loader.open("GET", this._langUrls[this._langNumber++], true);
            this._loader.send(null);
        }

        public createText(key: string, x: number, y: number, text: string = null, style?: LanguageFontStyle, parent?: PIXI.Container, anchor?: Anchor): DynamicText {
            let data: ILanguageData = this._manifest.data[key];
            if (typeof data === "undefined" || typeof data.properties === "undefined")
                return new Parts.Text(x, y, key, style, parent);

            text = (typeof text === "string") ? text : this.parse(key);
            style = (typeof style === "object" && style != null) ? this.style(key, style) : this.style(key);

            let type: string = (data.properties.font in this.font) ? this.font[data.properties.font].type.toLowerCase() : "webfont";

            switch (type) {
                case "bitmapfont":
                    return new Parts.BitmapText(x, y, text, style, parent, anchor);
                case "webfont": default:
                    return new Parts.Text(x, y, text, style, parent, anchor);
            }
        }

        public createButton(key: string, x: number, y: number, callback: Function, context: any, text: string = null, style?: LanguageFontStyle, states?: ButtonTints | ButtonStyles, parent?: PIXI.Container): DynamicButton {
            let data: ILanguageData = this._manifest.data[key];
            if (typeof data === "undefined" || typeof data.properties === "undefined")
                return new Parts.TextButton(x, y, callback, context, key, style, states, parent);

            text = (typeof text === "string") ? text : this.parse(key);
            style = (typeof style === "object" && style != null) ? this.style(key, style) : this.style(key);

            let type: string = (data.properties.font in this.font) ? this.font[data.properties.font].type.toLowerCase() : "webfont";

            switch (type) {
                case "bitmapfont":
                    return new Parts.BitmapTextButton(x, y, callback, context, text, style, <ButtonTints>states, parent);
                case "webfont": default:
                    return new Parts.TextButton(x, y, callback, context, text, style, states, parent);
            }
        }

        public parse(key: string, ...args: Array<any>): string {
            let text: string = "";
            let data: ILanguageData = this._manifest.data[key];
            if (typeof data === "undefined" || typeof data.text === "undefined")
                return key;

            text = data.text.replace(new RegExp('\\|\\{\\d+\\}|\\{(\\d+)\\}', 'gm'), (substr: string, i: string) => {
                switch (substr[0]) {
                    case "|":
                        return substr.slice(1, substr.length);
                    default:
                        return (typeof args[i] !== "undefined" && args[i] != null) ? args[i] : substr;
                }
            });

            return text;
        }

        public style(key: string, style: LanguageFontStyle = {}): LanguageFontStyle {
            let data: ILanguageData = this._manifest.data[key];
            if (typeof data === "undefined" || typeof data.properties === "undefined")
                return style;

            style.font = { name: data.properties.font, size: (typeof style.size !== "undefined") ? style.size : 15 };
            style.tint = (typeof style.tint !== "undefined") ? style.tint : 0xFFFFFF;
            style.fontFamily = (typeof style.fontFamily !== "undefined") ? style.fontFamily : "Arial";
            style.fontSize = (typeof style.fontSize !== "undefined") ? style.fontSize : 15;
            style.fill = (typeof style.fill !== "undefined") ? style.fill : "#FFFFFF";
            style.align = (typeof style.align !== "undefined") ? style.align : "left";

            let font: string = data.properties.font;
            let type: string = (font in this.font) ? this.font[font].type.toLowerCase() : "webfont";

            switch (type) {
                case "webfont":
                    delete style.font;
                    delete style.tint;
                    style.fontFamily = (typeof data.properties.font !== "undefined") ? data.properties.font : style.fontFamily;
                    style.fontSize = (typeof data.properties.size !== "undefined") ? data.properties.size : style.fontSize;
                    style.fill = (typeof data.properties.fill !== "undefined") ? data.properties.fill : style.fill;
                    style.align = (typeof data.properties.align !== "undefined") ? data.properties.align : style.align;
                    break;
                case "bitmapfont":
                    delete style.fontFamily;
                    delete style.fontSize;
                    delete style.fill;
                    style.font.name = (typeof data.properties.font !== "undefined") ? data.properties.font : style.font.name;
                    style.font.size = (typeof data.properties.size !== "undefined") ? data.properties.size : style.font.size;
                    style.tint = (typeof data.properties.fill !== "undefined") ? parseInt(data.properties.fill) : style.tint;
                    style.align = (typeof data.properties.align !== "undefined") ? data.properties.align : style.align;
                    break;
            }

            return style;
        }

        // EVENT CALLBACKS
        private onJsonLoadComplete(): void {
            switch (this._loader.status) {
                case 200:
                    try {
                        this._manifest = JSON.parse(this._loader.responseText);

                        if (this._manifest.code == 404) {
                            if (this._langUrls.length == this._langNumber) {
                                this.emit("loaderror", this, this._loader);
                                return;
                            }

                            this._loader.open("GET", this._langUrls[this._langNumber++], true);
                            this._loader.send(null);
                            return;
                        }

                        this._bmpFontLoaded = false;
                        this._webFontLoaded = false;

                        //// LOAD BITMAPFONT
                        switch (Object.keys(this.bitmapfont).length) {
                            case 0:
                                this._bmpFontLoaded = true;
                                break;
                            default:
                                this.game.resource.reset(false, true);

                                for (let font in this.bitmapfont) {
                                    if (typeof this.bitmapfont[font].url === "string")
                                        this.game.resource.addTexture(font, this.bitmapfont[font].url);
                                }

                                this.game.resource.once("loadcomplete", this.onBitmapFontLoadComplete, this);
                                this.game.resource.once("loaderror", this.onBitmapFontLoadError, this);
                                this.game.resource.load();
                                break;
                        }

                        //// LOAD WEBFONT
                        switch (Object.keys(this.webfont).length) {
                            case 0:
                                this._webFontLoaded = true;
                                break;
                            default:
                                let fams: Array<string> = [];
                                let urls: Array<string> = [];

                                for (let font in this.webfont) {
                                    let format: string = "";
                                    if (typeof this.webfont[font].format !== "undefined")
                                        format = this.webfont[font].format;

                                    fams.push((font + ":" + format));
                                    if (urls.indexOf(this.webfont[font].url) == -1)
                                        urls.push(this.webfont[font].url);
                                }

                                WebFont.load({
                                    custom: { families: fams, urls: urls },
                                    active: this.onWebFontLoadComplete.bind(this),
                                    inactive: this.onWebFontLoadError.bind(this)
                                });
                                break;
                        }
                    } catch (e) {
                        this.emit("loaderror", this, this._loader.responseText);
                    }
                    break;
                case 404:
                case 500:
                    if (this._langUrls.length == this._langNumber) {
                        this.emit("loaderror", this, this._loader);
                        return;
                    }

                    this._loader.open("GET", this._langUrls[this._langNumber++], true);
                    this._loader.send(null);
                    break;
                default:
                    this.emit("loaderror", this, this._loader);
                    break;
            }
        }

        private onJsonLoadError(): void {
            this.emit("loaderror", this, this._loader);
        }

        private onBitmapFontLoadComplete(): void {
            this._bmpFontLoaded = true;

            if (this._webFontLoaded == true)
                this.emit("loadcomplete", this, this._manifest);
        }

        private onBitmapFontLoadError(): void {
            this.emit("loaderror", this, this._manifest);
        }

        private onWebFontLoadComplete(): void {
            this._webFontLoaded = true;

            if (this._bmpFontLoaded == true)
                this.emit("loadcomplete", this, this._manifest);
        }

        private onWebFontLoadError(): void {
            this.emit("loaderror", this, this._manifest);
        }

        // GETTERS AND SETTERS
        public get manifest(): ILanguageManifest {
            return this._manifest;
        }

        public get code(): string | number {
            return this._manifest.code;
        }

        private get font() {
            return this._manifest.font;
        }

        private get webfont() {
            let font = {};
            if (typeof this.font === "undefined" || this.font == null)
                return font;

            for (let key in this.font) {
                if (this.font[key].type.toLowerCase() == "webfont")
                    font[key] = this.font[key];
            }

            return font;
        }

        private get bitmapfont() {
            let font = {};
            if (typeof this.font === "undefined" || this.font == null)
                return font;

            for (let key in this.font) {
                if (this.font[key].type.toLowerCase() == "bitmapfont")
                    font[key] = this.font[key];
            }

            return font;
        }
    }
}