module Core.Essentials {
    // CONSTANTS
    const PING_INTERVAL: number = 30000;

    export class Service extends PIXI.utils.EventEmitter {
        private _config: Interfaces.IServiceConfig;
        private _wInstance: WebSocket;
        private _xInstance: XMLHttpRequest;

        private _pingMS: number = 0;
        private _mSendTime: number = 0;
        private _pSendTime: number = 0;

        constructor(config: Interfaces.IServiceConfig) {
            super();
            this._config = config;
        }

        public connect(): void {
            if ((typeof this._config.conId !== "string" || this._config.conId.length != 32) &&
                (typeof this._config.debug === "boolean" && this._config.debug == true)) {
                this._xInstance = new XMLHttpRequest();
                this._xInstance.addEventListener("error", this.onConnectionIdError.bind(this), false);
                this._xInstance.addEventListener("abort", this.onConnectionIdError.bind(this), false);
                this._xInstance.addEventListener("timeout", this.onConnectionIdError.bind(this), false);
                this._xInstance.addEventListener("load", this.onConnectionIdLoad.bind(this), false);

                let url: string = this._config.conUrl;
                let user: string = this._config.conUser;
                let code: number = this._config.gameCode;

                this._xInstance.open("GET", (url + "?username=" + user + "&gameId=" + String(code)), true);
                this._xInstance.send(null);

                return;
            }

            let protocol: string = this._config.protocol;
            let hostname: string = this._config.hostname;
            let port: string = String(this._config.port);

            this.establish((protocol + "://" + hostname + ":" + port));
        }

        public send(action: string, parameters: any = {}): void {
            parameters.action = action;
            parameters.conId = this._config.conId;
            parameters.gameId = this._config.gameId;
            parameters.I = "0000";

            this._wInstance.send(JSON.stringify(parameters));
            this._mSendTime = Date.now();
        }

        // UTILS
        private establish(url: string): void {
            this._wInstance = new WebSocket(url);
            this._wInstance.onopen = this.onWebSocketOpen.bind(this);
            this._wInstance.onclose = this.onWebSocketClose.bind(this);
            this._wInstance.onerror = this.onWebSocketError.bind(this);
            this._wInstance.onmessage = this.onWebSocketMessage.bind(this);
        }

        private calculatePing(value: number): void {
            this.pingMS = (Date.now() - value);
        }

        // EVENT CALLBACKS
        private onConnectionIdError(event): void {
            this.emit("error", "XMLHttpRequest", event);
        }

        private onConnectionIdLoad(): void {
            switch (this._xInstance.status) {
                case 200:
                    this._config.conId = this._xInstance.response;

                    let protocol: string = this._config.protocol;
                    let hostname: string = this._config.hostname;
                    let port: string = String(this._config.port);

                    this.establish((protocol + "://" + hostname + ":" + port));
                    break;
                default:
                    this.emit("error", "XMLHttpRequest", event);
                    break;
            }
        }

        private onWebSocketMessage(message: any): void {
            let response: any = { status: false };
            try {
                response = JSON.parse(message.data);
            } catch (exception) {
                this.emit("error", "Parse", exception.message, exception);
                return;
            }

            switch (response.status) {
                case true:
                    switch (response.data.action) {
                        case "pong":
                            this.calculatePing(this._pSendTime);
                            break;
                        default:
                            this.emit("response", response.data);
                            this.calculatePing(this._mSendTime);
                            break;
                    }
                    break;
                case false:
                    this.emit("error", "Status", response.type, response.message, response.code);
                    break;
            }
        }

        private onWebSocketError(event): void {
            this.emit("error", "WebSocket", event);
        }

        private onWebSocketClose(event): void {
            this.emit("close", event);
        }

        private onWebSocketOpen(event): void {
            this.emit("open", event);
            this.once("response", this.onInitMessageReceived, this);
            this.send("init", { platform: this._config.platform });
        }

        private onInitMessageReceived(data: Interfaces.IActionData): void {
            switch (data.clientAction) {
                case "init":
                    this.emit("init", data);
                    setInterval(this.pingCallback.bind(this), PING_INTERVAL);
                    break;
            }
        }

        private pingCallback(): void {
            this._wInstance.send(JSON.stringify({ action: "ping", conId: this._config.conId }));
            this._pSendTime = Date.now();
        }

        // GETTERS AND SETTERS
        public set pingMS(value: number) {
            if (this._pingMS != value) {
                this._pingMS = value;
                this.emit("ping", value);
            }
        }

        public get pingMS(): number {
            return this._pingMS;
        }

        public get config(): Interfaces.IServiceConfig {
            return this._config;
        }
    }
}