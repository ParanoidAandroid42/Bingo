module Core.Controller {

    export class DataController {

        public static Instance: DataController;
        private _cardMatrix: Array<number>;
        private _cardColumnCount: number;
        private _cardLineCount: number;
        private _betValues: Array<number>;
        private _betIndex: number;
        private _selectedGlobes: Array<number>;
        private _clientAction: string;
        private _credit: number;
        private _finishResultPosition: number;
        private _nextAction: string;
        private _winType: string;
        private _payoutData: any;
        private _earnCoins: number;
        private _earnCents: number;
        private _currencyDSeparator: string;
        private _currencyTSeparator: string;
        private _currency: any;
        private _currencyCode: any;
        private _currencyPosition: string;
        private _gameHistory: string;

         /** DataController class's init function. DataController is a singleton class */
        public constructor() {
            DataController.Instance = this;
        }

           /** init data function. getting data from service response
            * @param data - getting data from service response
            */
        public initData(data): void {
            this._betValues = data.betLevel.values;
            this._betIndex = Math.max(0,data.betLevel.values.indexOf(data.betLevel.default));            
            this._cardColumnCount = data.cardColumnCount;
            this._cardLineCount = data.cardLineCount;
            this._cardMatrix = data.cardMatrix;
            this._clientAction = data.clientAction;
            this._credit = data.credit;
            this._finishResultPosition = data.finishResultPosition;
            this._nextAction = data.nextAction;
            this._selectedGlobes = data.selectedGlobes;
            this._winType = data.winType;
            this._payoutData = data.payoutData;
            this._earnCoins = data.earn.coins;
            this._earnCents = data.earn.cents;
            this._currencyDSeparator = data.currency.decimalSeparator;
            this._currencyTSeparator = data.currency.thousandSeparator;
            this._currencyPosition = data.currency.position;
            this._currencyCode = data.currency.code;
            this._currency = data.currency.symbol;
            this._finishResultPosition = data.finishResultPosition;
            this._gameHistory = data.gameHistoryUrl;
        }

          /** update data.getting from service response
           * @param data - getting data from service response
           */
        public updateData(data): void {
            this._cardMatrix = data.cardMatrix;
            this._clientAction = data.clientAction;
            this._credit = data.credit;
            this._nextAction = data.nextAction;
            this._selectedGlobes = data.selectedGlobes;
            this._winType = data.winType;
            this._payoutData = data.payoutData;
            this._earnCoins = data.earn.coins;
            this._earnCents = data.earn.cents;
            this._currencyDSeparator = data.currency.decimalSeparator;
            this._currencyTSeparator = data.currency.thousandSeparator;
            this._currencyPosition = data.currency.position
            this._currency = data.currency.symbol;
            this._finishResultPosition = data.finishResultPosition;
        }     

        /** resolveFormat amount*/
        public resolveFormat(amount: number): string {
            let dec = 2;
            let int = 3;
            let d: string = this._currencyDSeparator;
            let t: string = this._currencyTSeparator;

            let r: string = ("\\d(?=(\\d{" + (int || 3) + "})+" + (dec > 0 ? "\\D" : "$") + ")");
            let n: string = amount.toFixed(Math.max(0, ~~dec));
            let b: string = (d ? n.replace(".", d) : n).replace(new RegExp(r, "g"), "$&" + (t || ","));

            let p: string = this._currencyPosition;
            let s: number = this._currency;

            let sc: number = s ? String.fromCharCode(s) : this._currencyCode;

            switch (p) {
                case "suffix":
                    b = (b + " " + sc);
                    break;
                case "prefix":
                    b = (sc + " " + b);
                    break;
            }
            return b;
        }

        public get earnCoins() {
            return this._earnCoins;
        }

        public get earnCents() {
            return this._earnCents;
        }

        public get currencyCode() {
            return this._currencyCode;
        }

        public get payoutData() {
            return this._payoutData;
        }

        public get winType() {
            return this._winType;
        }

        public get lineCounter() {
            return this._cardLineCount;
        }

        public get columnCounter() {
            return this._cardColumnCount;
        }

        public get cardMatrix() {
            return this._cardMatrix;
        }

        public get betValues() {
            return this._betValues;
        }

        public get resultValues() {
            return this._selectedGlobes;
        }

        public get betIndex() {
            return this._betIndex;
        }

        public get finishResultPosition() {
            return this._finishResultPosition;
        }

        public get gameHistory() {
            return this._gameHistory;
        }

        public get credit() {
            return this._credit;
        }
    }
}