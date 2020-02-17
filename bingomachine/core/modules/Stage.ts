/// <reference path="../parts/container.ts" />

module Core.Modules {
    export abstract class Stage extends Parts.Container {
        protected game: Core.Game;

        constructor(game: Game, name: string = "Stage") {
            super(null, name);
            this.game = game;
        }

        public abstract init(...args: any[]): void;
        public abstract dispose(): void;
    }
}