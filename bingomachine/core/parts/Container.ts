module Core.Parts {
    // INTERFACE
    export interface IContainerBounds {
        mostTop: number;
        mostRight: number;
        mostBottom: number;
        mostLeft: number
    }

    export class Container extends PIXI.Container {
        private _zIndex: number = 0;

        constructor(parent?: PIXI.Container, name?: string) {
            super();
            this.name = name ? name : null;
            parent && parent.addChild(this);
        }

        public sortProperties(): void {
            this.children.sort((a: any, b: any) => {
                a.zIndex = a.zIndex || 0;
                b.zIndex = b.zIndex || 0;
                return a.zIndex - b.zIndex;
            });
        }

        // UTILS
        public getContainerBounds(): IContainerBounds {
            let bounds: IContainerBounds = { mostTop: null, mostRight: null, mostBottom: null, mostLeft: null };
            bounds.mostTop = -(this.position.y / this.scale.y);
            bounds.mostRight = ((this.width - this.position.x) / this.scale.x);
            bounds.mostBottom = ((this.height - this.position.y) / this.scale.y);
            bounds.mostLeft = -(this.position.x / this.scale.x);
            return bounds;
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