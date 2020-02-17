module Core.Parts {
    export class ParticleContainer extends PIXI.particles.ParticleContainer {
        private _zIndex: number = 0;

        constructor(parent?: PIXI.Container, name?: string, size?: number, properties?: PIXI.particles.ParticleContainerProperties, batchSize?: number) {
            super(size, properties, batchSize);
            if (name) this.name = name;
            if (parent) parent.addChild(this);
        }

        public sortChildren(): void {
            this.children.sort(function (a: any, b: any) {
                a.zIndex = a.zIndex || 0;
                b.zIndex = b.zIndex || 0;
                return a.zIndex - b.zIndex;
            });
        }

        // GETTERS AND SETTERS
        public set angle(value: number) {
            this.rotation = ((Math.PI / 180) * value);
        }

        public get angle(): number {
            return Math.round(1 / ((Math.PI / 180) / this.rotation));
        }

        public get zIndex(): number {
            return this._zIndex;
        }

        public set zIndex(value: number) {
            this._zIndex = value;
        }
    }
}