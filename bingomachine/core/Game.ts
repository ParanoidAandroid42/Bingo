/// <reference path="version.ts" />
module Core {
    export class Game extends Version {
        private readonly _config: Interfaces.IStartupConfig;
        private readonly _display: Managers.DisplayManager;
        private readonly _resource: Managers.ResourceManager;
        private readonly _stage: Managers.StageManager;
        private readonly _sound: Managers.SoundManager;

        private readonly _service: Essentials.Service;
        private readonly _data: Essentials.Database;
        private readonly _language: Essentials.Language;
        private readonly _timer: Essentials.Timer;
        private readonly _ticker: Essentials.Ticker;
        private _dataController: Controller.DataController;
        private _resourceController: Singleton.ResourceController;
        private static _instance: Game;

        public static get instance(): Game {
            return Game._instance;
        }

        constructor(config: Interfaces.IStartupConfig, container?: string, fullscreen?: string) {
            super();
            Game._instance = this;
            //view of the game according to resolution 1280x720
            this._display = new Managers.DisplayManager(this, DisplayResolution.width, DisplayResolution.height, config.options, container, fullscreen);        
            this._resource = new Managers.ResourceManager(config.service.cdnUrl);
            this._language = new Essentials.Language(this);
            this._stage = new Managers.StageManager(this);
            this._sound = new Managers.SoundManager(this.resource["_sounds"]["default"]);

            this._service = new Essentials.Service(config.service);
            this._data = new Essentials.Database();
            this._timer = new Essentials.Timer();
            this._ticker = new Essentials.Ticker();

            this._ticker.addLoop((elapsedMS: number, deltaTime: number) => {
                this._timer.update(elapsedMS, deltaTime);
                this._stage.update(elapsedMS, deltaTime);
                this._display.render(this._stage.container);
            }, this, true);

            this._config = config;
            this._dataController = new Controller.DataController();
            this._resourceController = new Singleton.ResourceController();
            this._stage.start("AssetLoader", Stages.AssetLoader, false, false);
        }

        // GETTERS AND SETTERS
        public get display(): Managers.DisplayManager {
            return this._display;
        }

        public get resource(): Managers.ResourceManager {
            return this._resource;
        }

        public get stage(): Managers.StageManager {
            return this._stage;
        }

        public get sound(): Managers.SoundManager {
            return this._sound;
        }

        public get service(): Essentials.Service {
            return this._service;
        }

        public get language(): Essentials.Language {
            return this._language;
        }

        public get data(): Essentials.Database {
            return this._data;
        }

        public get timer(): Essentials.Timer {
            return this._timer;
        }

        public get ticker(): Essentials.Ticker {
            return this._ticker;
        }

        public get config(): Interfaces.IStartupConfig {
            return this._config;
        }

        public get ResourceController() {
            return this._resourceController;
        }
    }
}