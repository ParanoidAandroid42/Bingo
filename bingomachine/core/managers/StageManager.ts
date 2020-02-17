module Core.Managers {
    export class StageManager {
        protected game: Game;
        private _container: Parts.Container = new Parts.Container(null, "StageContainer");
        private _instances: { [key: string]: any } = {};

        constructor(game: Game) {
            this.game = game;
        }

        public start(name: string, stageBase: any, resetStages: boolean = true, resetLoader: boolean = false,properties: Object = {}, ...args: any[]): any {
            if (resetLoader == true) this.game.resource.reset(true, true);
            if (resetStages == true) this.removeAll();
            this.game.display.removeAllRenderTargets();
            return this.createStage(name, stageBase, properties, ...args);
        }

        public remove(name: string): void {
            if (typeof this._instances[name].dispose === "function")
                this._instances[name].dispose.call(this._instances[name]);
            this._instances[name].destroy({ children: true, baseTexture: true });
            delete this._instances[name];
        }

        public removeAll(): void {
            for (let key in this._instances) {
                if (typeof this._instances[key].dispose === "function")
                    this._instances[key].dispose.call(this._instances[key]);
                this._instances[key].destroy({ children: true, baseTexture: true });
            }
            delete this._instances;
            this._instances = {};
        }

        public update(elapsedMS: number, deltaTime: number): void {
            for (let key in this._instances) {
                if (typeof this._instances[key].update === "function")
                    this._instances[key].update.call(this._instances[key], elapsedMS, deltaTime);
            }
        }

        // UTILS
        private createStage(name: string, stageBase: any, properties: Object = {}, ...args: any[]): any {
            this._instances[name] = new stageBase(this.game, name);
            for (let property in properties) if (property in this._instances[name])
                this._instances[name][property] = properties[property];
            if (typeof this._instances[name].init === "function")
                this._instances[name].init.call(this._instances[name], ...args);
            return this._container.addChild(this._instances[name]);
        }

        // GETTERS AND SETTERS
        public get container(): Parts.Container {
            return this._container;
        }
    }
}