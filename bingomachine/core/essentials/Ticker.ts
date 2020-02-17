module Core.Essentials {
    export class Ticker {
        private _ticker: PIXI.ticker.Ticker = new PIXI.ticker.Ticker();
        private _tickerEvents: Array<TickerEvent> = [];

        constructor(autoStart: boolean = true) {
            this._ticker.add(this.onTickCallback, this);
            if (autoStart == true) this._ticker.start();
        }

        public start(): void {
            this._ticker.start();
        }

        public stop(): void {
            this._ticker.stop();
        }

        public addLoop(callback: Function, context: any, isEnabled: boolean = true): TickerEvent {
            let tickerEvent = new TickerEvent(callback, context, isEnabled);
            this._tickerEvents.push(tickerEvent);
            return tickerEvent;
        }

        public remove(target: Function | TickerEvent): void {
            if (target && typeof target === "function") {
                for (let tIndex = 0; tIndex < this._tickerEvents.length; tIndex++) {
                    if (this._tickerEvents[tIndex].callback == target)
                        this._tickerEvents.splice(tIndex, 1);
                }
            } else if (target)
                this._tickerEvents.splice(this._tickerEvents.indexOf(<TickerEvent>target), 1);
        }

        public removeAll(): void {
            delete this._tickerEvents;
            this._tickerEvents = [];
        }

        // EVENT CALLBACKS
        private onTickCallback() {
            for (let index = 0; index < this._tickerEvents.length; index++) {
                if (this._tickerEvents[index].isEnabled == true)
                    this._tickerEvents[index].callback.call(this._tickerEvents[index].context,
                        this._ticker.elapsedMS, this._ticker.deltaTime);
            }
        }
    }

    export class TickerEvent {
        private _callback: Function;
        private _context: any;
        private _isEnabled: boolean;

        constructor(callback: Function, context: any, isEnabled: boolean = true) {
            this._callback = callback;
            this._context = context;
            this._isEnabled = isEnabled;
        }

        // GETTERS AND SETTERS
        public get callback(): Function {
            return this._callback;
        }

        public get context(): any {
            return this._context;
        }

        public get isEnabled(): boolean {
            return this._isEnabled;
        }

        public set isEnabled(value: boolean) {
            if (this._isEnabled != value)
                this._isEnabled = value;
        }
    }
}