module Core.Essentials {

    export type DUIEvents =
        "autoPlayAccepted" |
        "autoPlayCanceled" |
        "autoPlayCountChanged" |
        "lossLimitChanged" |
        "winLimitChanged"

    export interface IOptions {
        currency?: any
    }

    export class DesktopUI {

        public static target: any;

        /**
         * 
         * @param target referance for DesktopUI object if you are not sure use <b>window["DesktopUI"]</b>;
         * @param options 
         */
        public static initUI(target: any, options: any) {
            try {
                DesktopUI.target = target;
                DesktopUI.target && (<Function>DesktopUI.target.initUI).call(DesktopUI.target, options);
            } catch (e) {
                console.warn("Error on DesktopUI");
                console.warn(e);
            }

        }

        /**
         * 
         * @param array
         */
        public static showPaytable() {
            try {
                DesktopUI.target && (<Function>DesktopUI.target.showPaytable).call(DesktopUI.target);
            } catch (e) {
                //blame
                console.warn("Error on DesktopUI");
                console.warn(e);
            }
        }

        /**
         * 
         */
        public static showAutoPlay(spinCount: number, currentBet: Number, credit: number) {
            try {
                DesktopUI.target && (<Function>DesktopUI.target.showAutoPlay).call(DesktopUI.target, spinCount, currentBet, credit);
            } catch (e) {
                //blame
                console.warn("Error on DesktopUI");
                console.warn(e);
            }
        }

        /**
         * 
         */
        public static hideAutoPlay() {
            try {
                DesktopUI.target && (<Function>DesktopUI.target.hideAutoPlay).call(DesktopUI.target);
            } catch (e) {
                //blame
                console.warn("Error on DesktopUI");
                console.warn(e);
            }
        }

        /**
         * 
         * @param array
         */
        public static showSettings() {
            try {
                DesktopUI.target && (<Function>DesktopUI.target.showSettings).call(DesktopUI.target);
            } catch (e) {
                //blame
                console.warn("Error on DesktopUI");
                console.warn(e);
            }
        }

        /**
         * 
         * @param array
         */
        public static showStatistics() {
            try {
                DesktopUI.target && (<Function>DesktopUI.target.showStatistics).call(DesktopUI.target);
            } catch (e) {
                //blame
                console.warn("Error on DesktopUI");
                console.warn(e);
            }
        }

        /**
         *
         */
        public static backToHome() {
            try {
                DesktopUI.target && (<Function>DesktopUI.target.backToHome).call(DesktopUI.target);
            } catch (e) {
                console.warn("Error on DesktopUI");
                console.warn(e);
            }
        }

        /**
         * 
         */
        public static currency(amount: number, symbol: string, tsep: any, dsep: any, suffix: boolean, fractionLimit: number) {
            try {
                GameUI.target && (<Function>GameUI.target.currency).call(GameUI.target, amount, symbol, tsep, dsep, suffix, fractionLimit);
            } catch (e) {
                console.warn("Error on MobileUI");
                console.warn(e);
            }
        }

        /**
         * 
         */
        public static clearCurrency(str: string, symbol: string, tsep: any) {
            try {
                GameUI.target && (<Function>GameUI.target.currency).call(GameUI.target, str, symbol, tsep);
            } catch (e) {
                console.warn("Error on MobileUI");
                console.warn(e);
            }
        }

        /**
        * 
        * @param event
        * @param listener
        * @param scope
        */
        public static on(event: DUIEvents, listener: Function, scope?: any) {
            try {
                DesktopUI.target && (<Function>DesktopUI.target.on).call(DesktopUI.target, event, listener.bind(scope));
            } catch (e) {
                console.warn("Error on DesktopUI");
                console.warn(e);
            }
        }

        /**
         * 
         * @param event
         * @param listener
         * @param scope
         */
        public static off(event: DUIEvents, listener: Function, scope?: any) {
            try {
                DesktopUI.target && (<Function>DesktopUI.target.off).call(DesktopUI.target, event, listener.bind(scope));
            } catch (e) {
                console.warn("Error on DesktopUI");
                console.warn(e);
            }
        }

        /**
         * 
         * @param event
         * @param scope
         */
        public static emit(event: DUIEvents, scope?: any) {
            try {
                DesktopUI.target && (<Function>DesktopUI.target.emit).apply(scope || DesktopUI.target, arguments);
            } catch (e) {
                console.warn("Error on DesktopUI");
                console.warn(e);
            }
        }

        /**
         * 
         */
        public static openWindow(url: string, _self: boolean) {
            try {
                DesktopUI.target && (<Function>DesktopUI.target.openWindow).call(DesktopUI.target, url, _self);
            } catch (e) {
                console.warn("Error on DesktopUI");
                console.warn(e);
            }
        }

    }
}