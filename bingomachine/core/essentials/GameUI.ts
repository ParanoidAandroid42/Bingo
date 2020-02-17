module Core.Essentials {

    export type UIEvents =
        "spinclick" |
        "gambleclick" |
        "quickspin" |
        "lefthandmode" |
        "mutesound" |
        "mutemusic" |
        "mutesoundfx" |
        "spacebartospin" |
        "coinvalueindex" |
        "betlevelindex" |
        "betwayindex" |
        "autoplayindex" |
        "betindex" |
        "autoplaystart" |
        "autoplaycondition"

    // loop and idle's behaviours are identical.
    export type SpinButtonStates = "loop" | "idle" | "spin" | "match" | "play";

    export enum IMessageTypes {
        PRIMARY = "A",
        SECONDARY = "B"
    }

    export enum UILayouts {
        LEGACY = 0,
        ALTERNATIVE = 1
    }
    export enum IInfoBarStates {
        DEFAULT = "default",
        GAMBLE = "gamble",
        FREESPIN = "freespin"
    }

    export enum SpinButtonIcons {
        SPIN = "spin",
        SKIP = "skip",
        STOP = "stop",
        PLAY = "play"
    }

    export interface IModalStyle {
        title?: { color?: string },
        content?: { color?: string },
        buttons?: {
            color?: string,
            background?: {
                up?: string,
                down?: string,
                over?: string,
                disable?: string
            },
            dropShadow?: {
                angle?: number,
                distance?: number,
                blur?: number,
                color?: string,
                alpha?: number
            }
        },
        background?: {
            border?: string,
            body?: string,
        }
    }

    export interface ICurrency {
        title: string,
        code: string,
        symbol: string,
        position: string,
        decimalSeparator: string,
        thousandSeparator: string
    }

    export class GameUI {

        public static target: any;

        //future implementation 
        //not supported yet
        public static setText(name: string, text: string) {
            switch (name) {
                case "BetAmountText":
                    break;
                case "WinAmountText":
                    break;
                case "CreditAmountText":
                    break;
                case "BalanceCreditText":
                    break;
                case "BalanceCoinsText":
                    break;
                case "CoinAmountText":
                    break;
                case "CoinValueText":
                    break;
                case "BetLevelText":
                    break;
                case "TotalWinAmountText":
                    break;

            }
        }

        /**
         * 
         * @param value
         */
        public static setUIVisibility(value: boolean) {
            try {
                GameUI.target.setUIVisibility(value);
            } catch (e) {
                console.warn(e);
            }
        }

        public static initUI(target: any, options: any) {
            try {
                GameUI.target = target;
                GameUI.target.initUI(options)
            } catch (e) {

            }
        }

        /**
         * 
         * @param values
         */
        public static setMobileMenuItems(values: any[]) {
            try {
                GameUI.target.setMobileMenuItems(values.slice(0));
            } catch (e) {
                console.warn(e);
            }
        }

        /**
         * 
         * @param value
         */
        public static setGambleButtonVisibility(value: boolean) {
            try {
                GameUI.target.setGambleButtonVisibility(value);
            } catch (e) {
                console.warn(e);
            }
        }

        /**
         * 
         * @param value
         */
        public static setPaytableVisibility(value: boolean) {
            try {
                GameUI.target.setPaytableVisibility(value);
            } catch (e) {
                console.warn(e);
            }
        }

        /**
         * 
         * @param value
         */
        public static setLayout(value: UILayouts) {
            try {
                GameUI.target.setLayout(value);
            } catch (e) {
                console.warn(e);
            }
        }

        /**
         * 
         * @param value
         */
        public static setWifiStrength(value: (0 | 1 | 2)) {
            try {
                GameUI.target.setWifiStrength(value);
            } catch (e) {
                console.warn(e);
            }
        }

        /**
         * 
         * @param value
         */
        public static setInfoBarState(value: IInfoBarStates) {
            try {
                GameUI.target.setInfoBarState(value);
            } catch (e) {
                console.warn(e);
            }
        }

        /**
         * 
         * @param value
         */
        public static setSpinButtonIcon(value: SpinButtonIcons) {
            try {
                GameUI.target.setSpinButtonIcon(value);
            } catch (e) {
                console.warn(e);
            }
        }

        /**
        * 
        * @param value
        */
        public static setMessageBarVisibility(value: boolean) {
            try {
                GameUI.target.setMessageBarVisibility(value);
            } catch (e) {
                console.warn(e);
            }
        }

        /**
         * 
         * @param value
         */
        public static setControlBarVisibility(value: boolean) {
            try {
                GameUI.target.setControlBarVisibility(value);
            } catch (e) {
                console.warn(e);
            }
        }

        /**
         * 
         * @param values
         */
        public static setCoinValues(values: any[]) {
            try {
                GameUI.target.setCoinValues(values.slice(0));
            } catch (e) {
                console.warn(e);
            }
        }

        /**
         * 
         * @param values
         */
        public static setBetLevels(values: any[]) {
            try {
                GameUI.target.setBetLevels(values.slice(0));
            } catch (e) {
                console.warn(e);
            }
        }

        /**
         * 
         * @param values
         */
        public static setBetWays(values: any[]) {
            try {
                GameUI.target.setBetWays(values.slice(0));
            } catch (e) {
                console.warn(e);
            }
        }

        /**
         * 
         * @param values
         */
        public static setAutoPlayValues(values: any[]) {
            try {
                GameUI.target.setAutoPlayValues(values.slice(0));
            } catch (e) {
                console.warn(e);
            }
        }

        /**
         * 
         * @param values
         */
        public static setBetValues(values: any[]) {
            try {
                GameUI.target.setBetValues(values.slice(0));
            } catch (e) {
                console.warn(e);
            }
        }


        /**
         * 
         * @param value
         */
        public static setAutoPlayIndex(value: number) {
            try {
                GameUI.target.setAutoPlayIndex(value);
            } catch (e) {
                console.warn(e);
            }
        }

        /**
         * 
         * @param value
         */
        public static setAutoPlayValue(value: number) {
            try {
                GameUI.target.setAutoPlayValue(value);
            } catch (e) {
                console.warn(e);
            }
        }

        /**
         * 
         * @param values
         */
        public static setAutoPlayConditions(value: any[]) {
            try {
                GameUI.target.setAutoPlayConditions(value.slice(0));
            } catch (e) {
                console.warn(e);
            }
        }

        /**
         * 
         * @param spinsPlayed
         * @param sessionTime
         * @param spinsPerHour
         */
        public static setSpinResults(spinsPlayed: string, sessionTime: string, spinsPerHour: string) {
            try {
                GameUI.target.setSpinResults(spinsPlayed, sessionTime, spinsPerHour);
            } catch (e) {
                console.warn(e);
            }
        }

        /**
         * 
         * @param first 
         * @param second
         * @param third
         */
        public static setHighestWins(first: string, second: string, third: string) {
            try {
                GameUI.target.setHighestWins(first, second, third);
            } catch (e) {
                console.warn(e);
            }
        }

        /**
         * 
         * @param win
         * @param x2
         * @param x4
         */
        public static setGambleValues(win: number, x2: number, x4?: number) {
            try {
                GameUI.target.setGambleValues(win, x2, x4);
            } catch (e) {
                console.warn(e);
            }
        }

        /**
         * 
         * @param credit
         * @param coins
         */
        public static setBalance(credit: number, coins: number) {
            try {
                GameUI.target.setBalance(credit, coins);
            } catch (e) {
                console.warn(e);
            }
        }

        /**
         * 
         * @param credit
         * @param coin
         */
        public static setWin(credit: any, coin: any) {
            try {
                GameUI.target.setWin(credit, coin);
            } catch (e) {
                console.warn(e);
            }
        }

        /**
         * 
         * @param credit
         * @param coin
         */
        public static setTotalWin(credit: number, coin: number) {
            try {
                GameUI.target.setTotalWin(credit, coin);
            } catch (e) {
                console.warn(e);
            }
        }

        /**
         * 
         * @param msgType 
         * @param message
         */
        public static setMessageText(msgType: IMessageTypes, message: string) {
            try {
                GameUI.target.setMessageText(msgType, message);
            } catch (e) {
                console.warn(e);
            }
        }

        /**
         * 
         * @param message
         * @param buttonLabel1
         * @param callback1
         * @param buttonLabel2
         * @param callback2
         */
        public static showFlatModal(message: string, buttonLabel1: string, callback1: Function, buttonLabel2?: string, callback2?: Function) {
            try {
                GameUI.target.showFlatModal(message, buttonLabel1, callback1, buttonLabel2, callback2);
            } catch (e) {
                console.warn(e);
            }
        }

        /**
         * 
         * @param styles
         */
        public static setModalStyles(styles: IModalStyle) {
            try {
                GameUI.target.setModalStyle(styles);
            } catch (e) {
                console.warn(e);
            }
        }

        /**
         * 
         * @param value
         */
        public static setSettingsVisibility(value: boolean) {
            try {
                GameUI.target.setSettingsVisibility(value);
            } catch (e) {
                console.warn(e);
            }
        }

        public static setFooterVisibility(value: boolean) {
            try {
                GameUI.target.setFooterVisibility(value);
            } catch (e) {
                console.warn(e);
            }
        }

        /**
         * 
         * @param value
         */
        public static setAutoPlayVisibility(value: boolean) {
            try {
                GameUI.target.setAutoPlayVisibility(value);
            } catch (e) {
                console.warn(e);
            }
        }

        /**
         * 
         * @param value
         */
        public static setRulesVisibility(value: boolean) {
            try {
                GameUI.target.setRulesVisibility(value);
            } catch (e) {
                console.warn(e);
            }
        }

        public static on(event: UIEvents, listener: Function, scope: any) {
            try {
                (<Function>GameUI.target.on).call(GameUI.target, event, listener.bind(scope));
            } catch (e) {
                console.warn(e);
            }
        }

        //UPDATE FUNCTİON !!! 
        /**
         * 
         * @param styles
         */
        public static showCustomModal(styles: IModalStyle) {
            try {
                GameUI.target.setModalStyle(styles);
            } catch (e) {
                console.warn(e);
            }
        }

        /**
         * 
         * @param value
         */
        public static setCurrency(value: ICurrency) {
            try {
                GameUI.target.setCurrency(value);
            } catch (e) {
                console.warn(e);
            }
        }

        public static disableUI() {
            try {
                GameUI.target.disableUI(true);
            } catch (e) {
                console.warn(e);
            }
        }

        public static enableUI() {
            try {
                GameUI.target.disableUI(false);
            } catch (e) {
                console.warn(e);
            }
        }

        public static disableControlBar() {
            try {
                GameUI.target.disableControlBar(true);
            } catch (e) {
                console.warn(e);
            }
        }

        public static enableControlBar() {
            try {
                GameUI.target.disableControlBar(false);
            } catch (e) {
                console.warn(e);
            }
        }

        public static disableMenu() {
            try {
                GameUI.target.disableMenu(true);
            } catch (e) {
                console.warn(e);
            }
        }

        public static enableMenu() {
            try {
                GameUI.target.disableMenu(false);
            } catch (e) {
                console.warn(e);
            }
        }

        public static disableSpinButton() {
            try {
                GameUI.target.disableSpinButton(true);
            } catch (e) {
                console.warn(e);
            }
        }

        public static enableSpinButton() {
            try {
                GameUI.target.disableSpinButton(false);
            } catch (e) {
                console.warn(e);
            }
        }

        /**
         * 
         * @param value
        */
        public static setAutoPlayCount(value: any) {
            try {
                GameUI.target.setAutoPlayCount(value);
            } catch (e) {
                console.warn(e);
            }
        }

        /**
        * 
        * @param value
        */
        public static setHistoryVisibility(value: boolean) {
            try {
                GameUI.target.setHistoryVisibility(value);
            } catch (e) {
                console.warn(e);
            }
        }

        /**
         * 
         * @param value
         */
        public static setStatisticsVisibility(value: boolean) {
            try {
                GameUI.target.setStatisticsVisibility(value);
            } catch (e) {
                console.warn(e);
            }
        }

        /**
         * 
         * @param value
         */
        public static backToHome() {
            try {
                GameUI.target.backToHome();
            } catch (e) {
                console.warn(e);
            }
        }

        /**
         * 
         * @param value
         */
        public static setFreeSpinMode(value: boolean) {
            try {
                GameUI.target.setFreeSpinMode(value);
            } catch (e) {
                console.log(e);
            }
        }

        /**
         * 
         * @param value
         */
        public static setFreeSpinCount(value: number) {
            try {
                GameUI.target.freeSpinCount(value);
            } catch (e) {
                console.log(e);
            }
        }

        /**
         * 
         * @param value
         */
        public static setColors(primaryColor: string, secondaryColor?: string, tertiary?: string) {
            try {
                GameUI.target.setColors(primaryColor, secondaryColor, tertiary);
            } catch (e) {
                console.warn(e);
            }
        }

        public static setGameValues(data: { bet: { betInCredits: number, betInCoins: number }, betIndex: number, coinValueIndex: number, betLevelIndex: number, betWayIndex?: number }) {
            try {
                GameUI.target.setGameValues(data);
            } catch (e) {
                console.warn(e);
            }
        }

        public static setQuickSpin(value: boolean) {
            try {
                GameUI.target.setQuickSpin(value);
            } catch (e) {
                console.warn(e);
            }
        }

    }

    export type AutoPlayCondition = {
        id: string,
        type: 0 | 1,
        enable: boolean,
        label: string,
        value?: number
    } & { [key: string]: any }


    export class AutoPlayConditionList {

        private _data: AutoPlayCondition[] = [];

        constructor() {
            GameUI.on("autoplaycondition", (condition: AutoPlayCondition) => {
                this.update(condition.id, condition.enable, condition.value);
            }, this)
        }

        public add(id: string, label: string, type: (0 | 1) = 0, enable?: boolean, value?: number) {
            if (this.fetch(id)) throw new Error(id + " is already exist.");
            let condition: AutoPlayCondition = { id, label, enable, type, value };
            this._data.push(condition);
            return this;
        }

        public remove(id: string) {
            let condition = this.fetch(id);
            if (!condition) throw new Error(id + " is not exist.");
            let index = this._data.indexOf(condition);
            this._data.splice(index, 1); //remove 1 item from index
            return this
        }

        public update(id: string, enable?: boolean, value?: number) {
            let condition = this.fetch(id);
            if (!condition) throw new Error(id + " is not exist.");

            let changed = false;
            if (condition.enable != enable) {
                condition.enable = enable;
                changed = true;
            }
            if (condition.enable != enable) {
                condition.value = value;
                changed = true;
            }

            //not supported yet
            //if (changed) GameUI.target.updateAutoPlay(id,enable,value);

            return this
        }

        public fetch(id: string): AutoPlayCondition {
            let len = this._data.length;
            for (let i = 0; i < len; i++) {
                if (this._data[i].id === id)
                    return this._data[i];
            }
            return null;
        }

        public get data(): AutoPlayCondition[] {
            return this._data;
        }

        public static fromArray(values: any[]): AutoPlayConditionList {
            let instance = new AutoPlayConditionList;
            instance._data = values;

            return instance;
        }

    }
}