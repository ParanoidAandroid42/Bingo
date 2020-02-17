module Core.Essentials {
    export class Timer {
        private _timerEvents: Array<TimerEvent> = [];
        private _isEnabled: boolean = true;

        constructor(isEnabled: boolean = true) {
            this._isEnabled = isEnabled;
        }

        public addTimeout(duration: number, callback: Function, context: any, autoStart: boolean = true, ...args: any[]): TimerEvent {
            let timerEvent = new TimerEvent(duration, callback, context, false, autoStart, ...args);
            this._timerEvents.push(timerEvent);
            return timerEvent;
        }

        public addInterval(duration: number, callback: Function, context: any, autoStart: boolean = true, ...args: any[]): TimerEvent {
            let timerEvent = new TimerEvent(duration, callback, context, true, autoStart, ...args);
            this._timerEvents.push(timerEvent);
            return timerEvent;
        }

        public remove(target: Function | TimerEvent): void {
            if (target && typeof target === "function") {
                for (let tIndex = 0; tIndex < this._timerEvents.length; tIndex++) {
                    if (this._timerEvents[tIndex].callback == target)
                        this._timerEvents.splice(tIndex, 1);
                }
            } else if (target)
                this._timerEvents.splice(this._timerEvents.indexOf(<TimerEvent>target), 1);
        }

        public removeAll(): void {
            delete this._timerEvents;
            this._timerEvents = [];
        }

        // EVENT CALLBACKS
        public update(elapsedMS: number, deltaTime: number): void {
            if (this._isEnabled == true) {
                let elapsed: number = (elapsedMS / 1000);
                for (let tIndex = 0; tIndex < this._timerEvents.length; tIndex++) {
                    if (this._timerEvents[tIndex] && this._timerEvents[tIndex].isActive == true) {
                        if (this._timerEvents[tIndex].elapsed >= this._timerEvents[tIndex].duration) {
                            if (this._timerEvents[tIndex].isInterval == true) {
                                this._timerEvents[tIndex].elapsed = elapsed;
                                this._timerEvents[tIndex].callback.call(this._timerEvents[tIndex].context,
                                    ...this._timerEvents[tIndex].arguments, this._timerEvents[tIndex]);
                            } else {
                                let oldTimerEvents = this._timerEvents.splice(tIndex, 1);
                                for (let oIndex = 0; oIndex < oldTimerEvents.length; oIndex++)
                                    oldTimerEvents[oIndex].callback.call(oldTimerEvents[oIndex].context,
                                        ...oldTimerEvents[oIndex].arguments, oldTimerEvents[oIndex]);
                                oldTimerEvents = null;
                            }
                        } else this._timerEvents[tIndex].elapsed += elapsed;
                    }
                }
            }
        }

        // GETTERS AND SETTERS
        public set isEnabled(value: boolean) {
            if (this._isEnabled != value)
                this._isEnabled = value;
        }

        public get isEnabled(): boolean {
            return this._isEnabled;
        }
    }

    export class TimerEvent {
        private _callback: Function;
        private _context: any;
        private _duration: number;
        private _elapsed: number;
        private _isInterval: boolean;
        private _isActive: boolean;
        private _arguments: any[];

        constructor(duration: number, callback: Function, context: any, isInterval: boolean = false, isActive: boolean = false, ...args: any[]) {
            this._duration = duration;
            this._elapsed = 0;
            this._callback = callback;
            this._context = context;
            this._isInterval = isInterval;
            this._isActive = isActive;
            this._arguments = args;
        }

        public start(): void {
            this.elapsed = 0;
            this.isActive = true;
        }

        public stop(): void {
            this.elapsed = 0;
            this.isActive = false;
        }

        public resume(): void {
            this.isActive = true;
        }

        public pause(): void {
            this.isActive = false;
        }

        // GETTERS AND SETTERS
        public get callback(): Function {
            return this._callback;
        }

        public get context(): any {
            return this._context;
        }

        public set duration(value: number) {
            if (this._duration != value)
                this._duration = value;
        }

        public get duration(): number {
            return this._duration;
        }

        public set elapsed(value: number) {
            if (this._elapsed != value)
                this._elapsed = value;
        }

        public get elapsed(): number {
            return this._elapsed;
        }

        public set isInterval(value: boolean) {
            if (this._isInterval != value)
                this._isInterval = value;
        }

        public get isInterval(): boolean {
            return this._isInterval;
        }

        public set isActive(value: boolean) {
            if (this._isActive != value)
                this._isActive = value;
        }

        public get isActive(): boolean {
            return this._isActive;
        }

        public get arguments(): any[] {
            return this._arguments;
        }
    }
}