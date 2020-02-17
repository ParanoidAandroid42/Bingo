module Core.Loaders {
    export interface ISoundObject {
        sound: Howl;
        channel: string;
        isSoundMuted: boolean;
        isChannelMuted: boolean;
    }

    export class SoundLoader extends PIXI.utils.EventEmitter {
        private _resources: { [key: string]: ISoundObject } = {};

        private _loadingCount: number = 0;
        private _loadingProgress: number = 0;
        private _isLoading: boolean = false;

        public add(key: string, channel: string, src: Array<string>): void {
            if ((key in this._resources) == false) {
                this._resources[key] = {
                    sound: new Howl({ src: src, loop: false, volume: 1, preload: false, autoplay: false }),
                    channel: channel,
                    isSoundMuted: false,
                    isChannelMuted: false
                };
                this._resources[key].sound.once("load", this.onSoundLoadProgress.bind(this, this._resources[key].sound, key));
                this._resources[key].sound.once("loaderror", this.onSoundLoadError.bind(this, this._resources[key].sound, key));
                this.emit("soundcreate", this._resources[key].sound, key);
            } else throw "Error: The key already exists in cache.";
        }

        public remove(key: string): void {
            if ((key in this._resources) == true) {
                this._resources[key].sound.unload();
                delete this._resources[key];
            }
        }

        public reset(): void {
            for (let sound in this._resources)
                this._resources[sound].sound.unload();

            this._resources = {};
            this._loadingCount = 0;
            this._loadingProgress = 0;
            this._isLoading = false;
        }

        public load(): void {
            if (Object.keys(this._resources).length > 0) {
                this._loadingCount = 0;
                this._loadingProgress = 0;
                this._isLoading = true;
                this.emit("start", this);
                for (let sound in this._resources)
                    this._resources[sound].sound.load();
            }
        }

        // EVENT CALLBACKS
        private onSoundLoadProgress(sound: Howl, key: string): void {
            this._loadingCount += 1;
            this._loadingProgress = Math.floor((100 / Object.keys(this._resources).length) * this._loadingCount);
            this.emit("progress", this, sound, key);
            if (this._loadingCount == Object.keys(this._resources).length) {
                this._isLoading = false;
                this.emit("complete", this, sound, key);
            }
        }

        private onSoundLoadError(sound: Howl, key: string): void {
            this.emit("error", this, sound, key);
        }

        // GETTERS AND SETTERS
        public get isLoading(): boolean {
            return this._isLoading;
        }

        public get loadingProgress(): number {
            return this._loadingProgress;
        }

        public get loadingCount(): number {
            return this._loadingCount;
        }

        public get resources(): { [key: string]: ISoundObject } {
            return this._resources;
        }
    }
}