module Core.Essentials {
    export class Database extends PIXI.utils.EventEmitter {
        private _data: { [key: string]: any } = {};

        public insert(key: string, value: any): void {
            if (this.exists(key) == true && this.fetch(key) == value) {
                this._data[key] = value;
                this.emit("insert", key, value, false);
            } else {
                this._data[key] = value;
                this.emit("insert", key, value, true);
            }
        }

        public fetch(key: string): any {
            return this._data[key];
        }

        public exists(key: string): boolean {
            return (key in this._data) ? true : false;
        }

        public reset(key: string): any {
            if (this._data.exists(key) == true) {
                this._data.insert(key, null);
                this.emit("reset", key, true);
            } else {
                this.emit("reset", key, false);
            }
        }

        public remove(key: string): any {
            delete this._data[key];
            this.emit("remove", key);
        }

        public removeAll(): any {
            delete this._data;
            this._data = {};
            this.emit("wipe");
        }

        public forEach(callback: (value?: any, key?: string, map?: { [key: string]: any }) => void, callbackContext: any): void {
            for (let key in this._data) callback.call(callbackContext, this._data[key], key, this);
        }

        // GETTERS AND SETTERS
        public get length(): number {
            return Object.keys(this._data).length;
        }

        public get keys(): Array<string> {
            return Object.keys(this._data);
        }
    }
}