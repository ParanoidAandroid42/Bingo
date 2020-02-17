module Core.Interfaces {
    export interface IServiceConfig {
        conId?: string;
        gameId?: string;
        hostname?: string;
        port?: number;
        protocol?: string;
        mode?: string;
        wallet?: string;
        cdnUrl?: string;
        platform?: string;
        language?: string;
        languageUrl?: string;
        languageVer?: string;
        location?: string;
        debug?: boolean;
        gameUI?: any;
        conUrl?: string;
        conUser?: string;
        gameCode?: number;
    }

    export interface IMenuBarConfig {
        quickspin?: boolean;
        settings?: boolean;
        cashier?: false | string;
        history?: boolean;
        volume?: boolean;
        paytable?: boolean;
        statistics?: boolean;
        home?: false | string;
        help?: false | string;
        fullscreen?: boolean;
    }

    export interface IStartupConfig {
        service: IServiceConfig;
        menubar: IMenuBarConfig;
        options: PIXI.RendererOptions;
    }
}