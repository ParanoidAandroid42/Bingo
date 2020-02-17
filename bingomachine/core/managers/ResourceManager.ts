module Core.Managers {
    export class ResourceManager extends PIXI.utils.EventEmitter {

        public static readonly DEFAULT: string = "default";

        private _textures: { [key: string]: PIXI.loaders.Loader } = { default: new PIXI.loaders.Loader() };
        private _sounds: { [key: string]: Loaders.SoundLoader } = { default: new Loaders.SoundLoader() };


        private _loadingQueue: { [key: string]: Array<string> } = { default: [] };
        private _loadingCount: { [key: string]: number } = { default: 0 };
        private _loadingProgress: { [key: string]: number } = { default: 0 };
        private _isLoading: { [key: string]: boolean } = { default: false };

        protected baseUrl = "";

        constructor(baseUrl: string = "") {
            super();
            this.baseUrl = baseUrl;
            this._textures[ResourceManager.DEFAULT].baseUrl = baseUrl;
            this._textures[ResourceManager.DEFAULT].on("progress", this.onTextureLoadProgress.bind(this, ResourceManager.DEFAULT), this);
            this._textures[ResourceManager.DEFAULT].on("error", this.onTextureLoadError.bind(this, ResourceManager.DEFAULT), this);
            this._sounds[ResourceManager.DEFAULT].on("progress", this.onSoundLoadProgress.bind(this, ResourceManager.DEFAULT), this);
            this._sounds[ResourceManager.DEFAULT].on("error", this.onSoundLoadError.bind(this, ResourceManager.DEFAULT), this);
        }

        public fromResource(key: string, pack: string = ResourceManager.DEFAULT): any {
            return this._textures[pack].resources[key];
        }

        public fromFrame(key: string): PIXI.Texture {
            return PIXI.Texture.fromFrame(key);
        }

        public addTexture(key: string, url?: string, ...args: any[]): void {
            this.addTextureAt(ResourceManager.DEFAULT, key, url, ...args);
        }

        private addTextureAt(pack: string, key: string, url?: string, ...args: any[]): void {
            if (!this._loadingQueue.hasOwnProperty(pack)) {
                //package dictionary
                this._loadingQueue[pack] = [];
            }

            if (!this._textures.hasOwnProperty(pack)) {
                //creating texture loader 
                console.log("creating texture loader", pack);
                this._textures[pack] = new PIXI.loaders.Loader();
                this._textures[pack].baseUrl = this.baseUrl;
                this._textures[pack].on("progress", this.onTextureLoadProgress.bind(this, pack), this);
                this._textures[pack].on("error", this.onTextureLoadError.bind(this, pack), this);
            }

            if (!this._loadingCount.hasOwnProperty(pack)) this._loadingCount[pack] = 0;
            if (!this._loadingProgress.hasOwnProperty(pack)) this._loadingProgress[pack] = 0;
            if (!this._isLoading.hasOwnProperty(pack)) this._isLoading[pack] = false;

            this._loadingQueue[pack].push(key);
            this._textures[pack].add(key, url, ...args);
        }

        public addTexturePack(name: string): Function {
            return this.addTextureAt.bind(this, name);
        }

        public addSound(key: string, channel: string, src: Array<string>): void {
            this.addSoundAt(ResourceManager.DEFAULT, key, channel, src);
        }

        private addSoundAt(pack: string, key: string, channel: string, src: Array<string>): void {
            if (!this._loadingQueue.hasOwnProperty(pack)) {
                //package dictionary
                this._loadingQueue[pack] = [];
            }

            if (!this._sounds.hasOwnProperty(pack)) {
                //creating sound loader
                console.log("creating sound loader", pack);
                this._sounds[pack] = new Loaders.SoundLoader();
                this._sounds[pack].on("progress", this.onSoundLoadProgress.bind(this, pack), this);
                this._sounds[pack].on("error", this.onSoundLoadError.bind(this, pack), this);
            }

            if (!this._loadingCount.hasOwnProperty(pack)) this._loadingCount[pack] = 0;
            if (!this._loadingProgress.hasOwnProperty(pack)) this._loadingProgress[pack] = 0;
            if (!this._isLoading.hasOwnProperty(pack)) this._isLoading[pack] = false;

            this._loadingQueue[pack].push(key);
            this._sounds[pack].add(key, channel, src);
        }

        public addSoundPack(name: string): Function {
            return this.addSoundAt.bind(this, name);
        }

        public load(pack: string = ResourceManager.DEFAULT): void {
            this._isLoading[pack] = true;
            this.emit("loadstart", this, pack);
            this._textures.hasOwnProperty(pack) && this._textures[pack].load();
            this._sounds.hasOwnProperty(pack) && this._sounds[pack].load();
        }

        public reset(hardReset: boolean = false, clearEvents: boolean = false, pack?: string): void {
            if (clearEvents == true) this.clearEvents();
            if (hardReset == true) {
                if (pack === undefined || pack == null) {
                    this._textures[ResourceManager.DEFAULT].reset();
                    this._sounds[ResourceManager.DEFAULT].reset();
                } else {
                    this._textures.hasOwnProperty(pack) && this._textures[pack].reset();
                    this._sounds.hasOwnProperty(pack) && this._sounds[pack].reset();
                }
            }
            this.clearProgress();
        }

        public clearEvents(): void {
            this.off("loadstart");
            this.off("loadprogress");
            this.off("loadcomplete");
            this.off("loaderror");
        }

        public clearProgress(pack: string = ResourceManager.DEFAULT): void {
            this._loadingCount[pack] = 0;
            this._loadingProgress[pack] = 0;
            this._isLoading[pack] = false;
            this._loadingQueue[pack] = [];
        }

        // UTILS
        private validateLoadQueue(key: string, pack): void {
            if (this._loadingQueue[pack].indexOf(key) != -1) {
                this._loadingCount[pack] += 1;
                this._loadingProgress[pack] = Math.floor((100 / Object.keys(this._loadingQueue[pack]).length) * this._loadingCount[pack]);
                this.emit("loadprogress", this._loadingProgress, key, pack);
                if (this._loadingCount[pack] == Object.keys(this._loadingQueue[pack]).length) {
                    this._isLoading[pack] = false;
                    this._loadingQueue[pack] = [];
                    this.emit("loadcomplete", this, pack);
                }
            }
        }

        // EVENT CALLBACKS
        private onTextureLoadProgress(pack: string, loader: PIXI.loaders.Loader, resource: PIXI.loaders.Resource): void {
            this.validateLoadQueue(resource.name, pack);
        }

        private onTextureLoadError(pack): void {
            this.emit("loaderror", "Texture", pack);
        }

        private onSoundLoadProgress(pack: string, loader: Loaders.SoundLoader, sound: Howl, name: string): void {
            this.validateLoadQueue(name, pack);
        }

        private onSoundLoadError(pack): void {
            this.emit("loaderror", "Sound", pack);
        }

        // GETTERS AND SETTERS
        public get loadingCount(): { [key: string]: number } {
            return this._loadingCount;
        }

        public get loadingProgress(): { [key: string]: number } {
            return this._loadingProgress;
        }

        public get isLoading(): { [key: string]: boolean } {
            return this._isLoading;
        }
    }
}