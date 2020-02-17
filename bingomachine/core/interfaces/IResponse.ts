module Core.Interfaces {
    export interface IWSData {
        count: number;
        line: number;
        matrix: Array<number>;
        multiplier: string;
        symbol: number;
        way: string;
        wildFound: boolean;
        win: number;
    }

    export interface IESData {
        starts: Array<number>;
        ends: Array<Array<number>>;
    }

    export interface IActionData {
        reelSet: { [key: string]: Array<Array<number>> };
        history: { lastFive: Array<{ bet: string, created_at: string, win: string }>, topFive: Array<{ bet: string, created_at: string, win: string }> };
        reelSetType: string;
        pos: Array<number>;
        gameHistoryUrl: string;
        symbols: Array<Array<number>>;
        ws: Array<IWSData>;
        earn: { cents: number, coins: number };
        totalEarn: { cents: number, coins: number };
        denomination: { default: number, values: Array<number> };
        betLevel: { default: number, values: Array<number> };
        betWay: { default: number, values: Array<number> },
        betWaysCost: { 3: number, 9: number, 27: number, 81: number, 243: number };
        betAmount: number;
        credit: number;
        currency: { title, code, symbol, position, decimalSeparator, thousandSeparator };
        currencySymbol: string;
        clientAction: string;
        nextAction: string;
        freeSpinCount: number;
        gambleSelection: number;
        freeSpinExtendSymbol: number;
        freeSpinExtendSymbolWin: Array<{ line: number, count: number, win: number, matrix: Array<number> }>;
        freeSpinExtendTotalEarn: { cents: number, coins: number };
        gambleBetAmount: { cents: number, coins: number };
        gambleChoices: Array<string>;
        gambleCount: number;
        gambleEnabled: boolean;
        gambleHistory: Array<number>; //todo string ?
        gambleLastWinCard: number | string;
        gambleTotalEarn: { cents: number, coins: number };
        prizePos: Array<number>;
        prizeWon: Array<number>;
        I: string;
        T: number;
        winType: string;
    }

    export interface IInitData extends IActionData {
        version: string;
    }

    export interface IBaseAction {
        status: string;
        data: IActionData | IInitData
    }

    export interface IInitAction extends IBaseAction {
        data: IInitData
    }

    export interface ISpinAction extends IBaseAction {
        data: IActionData
    }
}