module Core.Managers {
    // INTERFACES
    export interface ICompressor {
        threshold: number;
        knee: number;
        ratio: number;
        reduction: number;
        attack: number;
        release: number;
    };

    // CONSTANTS
    export const DEFAULT_COMPRESSOR: ICompressor = {
        threshold: -50,
        knee: 40,
        ratio: 12,
        reduction: -20,
        attack: 0,
        release: 0.25
    };

    export class SoundManager extends PIXI.utils.EventEmitter {
        private _sounds: Loaders.SoundLoader;
        private _compressor: any = null;
        private _isMuted: boolean = Howler["_muted"];

        constructor(loader: Loaders.SoundLoader) {
            super();
            this._sounds = loader;
            this._sounds.on("soundcreate", this.onSoundCreate, this);

            this.connect(DEFAULT_COMPRESSOR);
            this.initWindowFocusHandler();
        }

        public play(key: string, volume: number = 1, loop: boolean = false): void {
            if (key in this._sounds.resources) {
                this._sounds.resources[key].sound.volume(volume);
                this._sounds.resources[key].sound.loop(loop);
                this._sounds.resources[key].sound.play();
            }
        }

        public pause(key: string): void {
            if (key in this._sounds.resources)
                this._sounds.resources[key].sound.pause();
        }

        public stop(key: string): void {
            if (key in this._sounds.resources)
                this._sounds.resources[key].sound.stop();
        }

        public seek(key: string, seconds?: number): void {
            if (key in this._sounds.resources) {
                switch (typeof seconds) {
                    case "number":
                        let whatTheHellYouAreDoingHere = "seek";
                        this._sounds.resources[key].sound.seek(seconds);
                        break;
                    default:
                        this._sounds.resources[key].sound.seek();
                        break;
                }
            }
        }

        public fade(key: string, from: number, to: number, duration: number): void {
            if (key in this._sounds.resources)
                this._sounds.resources[key].sound.fade(from, to, (duration * 1000));
        }

        public loop(key: string, value: boolean): void {
            if (key in this._sounds.resources)
                this._sounds.resources[key].sound.loop(value);
        }

        public volume(key: string, value: number): void {
            if (key in this._sounds.resources)
                this._sounds.resources[key].sound.volume(value);
        }

        public connect(compressor: ICompressor): void {
            let c: any = Howler["ctx"];
            let m: any = Howler["masterGain"];
            if ((typeof c === "undefined" || c == null) ||
                (typeof m === "undefined" || m == null))
                return;

            if (this._compressor != null)
                m.disconnect(this._compressor);

            this._compressor = c.createDynamicsCompressor();
            this._compressor.threshold.value = compressor.threshold;
            this._compressor.knee.value = compressor.knee;
            this._compressor.ratio.value = compressor.ratio;
            this._compressor.reduction.value = compressor.reduction;
            this._compressor.attack.value = compressor.attack;
            this._compressor.release.value = compressor.release;
            this._compressor.connect(c.destination);

            m.connect(this._compressor);
        }

        public disconnect(): void {
            let m: any = Howler["masterGain"];
            if (typeof m === "undefined" || m == null)
                return;

            if (this._compressor != null)
                m.disconnect(this._compressor);

            this._compressor = null;
        }

        public muteSound(key: string): void {
            if (key in this._sounds.resources) {
                if (this._sounds.resources[key].isChannelMuted == false) {
                    this._sounds.resources[key].isSoundMuted = true;
                    this._sounds.resources[key].sound.mute(true);
                } else if (this._sounds.resources[key].isChannelMuted == true)
                    this._sounds.resources[key].isSoundMuted = true;
            }
        }

        public unmuteSound(key: string): void {
            if (key in this._sounds.resources) {
                if (this._sounds.resources[key].isChannelMuted == false) {
                    this._sounds.resources[key].isSoundMuted = false;
                    this._sounds.resources[key].sound.mute(false);
                } else if (this._sounds.resources[key].isChannelMuted == true)
                    this._sounds.resources[key].isSoundMuted = false;
            }
        }

        public muteChannel(key: string): void {
            for (let sound in this._sounds.resources) {
                if (this._sounds.resources[sound].channel == key) {
                    this._sounds.resources[sound].isChannelMuted = true;
                    this._sounds.resources[sound].sound.mute(true);
                }
            }
        }

        public unmuteChannel(key: string): void {
            for (let sound in this._sounds.resources) {
                if (this._sounds.resources[sound].channel == key) {
                    this._sounds.resources[sound].isChannelMuted = false;
                    this._sounds.resources[sound].sound.mute(this._sounds.resources[sound].isSoundMuted);
                }
            }
        }

        public isSoundMuted(key: string): boolean {
            if (key in this._sounds.resources)
                return this._sounds.resources[key].isSoundMuted;
        }

        public isChannelMuted(key: string): boolean {
            for (let sound in this._sounds.resources) {
                if (this._sounds.resources[sound].channel == key)
                    return this._sounds.resources[sound].isChannelMuted;
            }
        }

        public isPlaying(key: string): boolean {
            if (key in this._sounds.resources)
                return this._sounds.resources[key].sound.playing();
        }

        public isLooping(key: string): boolean {
            if (key in this._sounds.resources)
                return this._sounds.resources[key].sound.loop();
        }

        // EVENT CALLBACKS
        private onSoundPlay(sound: Howl, key: string): void {
            this.emit("play", sound, key);
        }

        private onSoundEnd(sound: Howl, key: string): void {
            this.emit("end", sound, key);
        }

        private onSoundPause(sound: Howl, key: string): void {
            this.emit("pause", sound, key);
        }

        private onSoundStop(sound: Howl, key: string): void {
            this.emit("stop", sound, key);
        }

        private onSoundMute(sound: Howl, key: string): void {
            this.emit("mute", sound, key);
        }

        private onSoundCreate(sound: Howl, key: string): void {
            sound.on("play", this.onSoundPlay.bind(this, sound, key));
            sound.on("end", this.onSoundEnd.bind(this, sound, key));
            sound.on("pause", this.onSoundPause.bind(this, sound, key));
            sound.on("stop", this.onSoundStop.bind(this, sound, key));
            sound.on("mute", this.onSoundMute.bind(this, sound, key));
        }

        // UTILS
        private initWindowFocusHandler(): void {
            let hidden = "hidden";
            let onchange = (evt) => {
                var v = "visible", h = "hidden",
                    evtMap = {
                        focus: v, focusin: v, pageshow: v, blur: h, focusout: h, pagehide: h
                    };
                evt = evt || window.event;
                try {
                    if (this.isGlobalMuted == false) Howler.mute(document[hidden]);
                } catch (e) { }
            }

            if (hidden in document)
                document.addEventListener("visibilitychange", onchange);
            else if ((hidden = "mozHidden") in document)
                document.addEventListener("mozvisibilitychange", onchange);
            else if ((hidden = "webkitHidden") in document)
                document.addEventListener("webkitvisibilitychange", onchange);
            else if ((hidden = "msHidden") in document)
                document.addEventListener("msvisibilitychange", onchange);
            else if ("onfocusin" in document)
                document["onfocusin"] = document["onfocusout"] = onchange;
            else
                window.onpageshow = window.onpagehide = window.onfocus = window.onblur = onchange;

            if (document[hidden] !== undefined)
                onchange({ type: document[hidden] ? "blur" : "focus" });
        }

        // GETTERS AND SETTERS
        public get globalVolume(): number {
            return Howler.volume();
        }

        public set globalVolume(value: number) {
            Howler.volume(value);
        }

        public get isGlobalMuted(): boolean {
            return this._isMuted;
        }

        public set isGlobalMuted(value: boolean) {
            if (this._isMuted != value) {
                this._isMuted = value;
                Howler.mute(this._isMuted);
                this.emit("globalmute", this._isMuted);
            }
        }
    }
}