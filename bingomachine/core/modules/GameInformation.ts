module Core {

    /**ListenerType enum */
    export enum ListenerType {
        /**listener for brand logo animation*/
        animationcomplete = "animationcomplete", 
        /** listener for game load*/
        init              = "init",
        /**listener for when service error*/
        error             = "error",
        /**listener for when service response*/
        response          = "response",
        /**listener for when websocket close*/
        close             = "close",
        /**listener for when display's orientation change*/
        orientationchange = "orientationchange",
        /** listener for when display's resize*/
        resize            = "resize",
        /**listener for when display's fullscreen change*/
        fullscreenchange  = "fullscreenchange"
    }

    /** This game engine's DisplayResolution = 1280x720*/
    export enum DisplayResolution {
        width = 1280,  /**DisplayResolution widht*/
        height = 720   /**DisplayResolution height*/
    }

    /**ListenerType enum*/
    export enum SendAction {
         /**sending action to service when play button up (when starting game)*/
        globeSelect         = "globeSelect",
         /**sending action to service when newcard button up (getting new data)*/
        newCard             = "newCard"
    }

    /** Button State Type*/
    export enum ButtonStateType {
        sendAction,
        response,
        forward,
        instant,
        updateData,
        turboDisabled
    }

    /** Visual Type*/
    export enum VisualType {
        turbo,
        normal,
        forward,
        instant,
        connectionLost
    }

    /** Bingo type*/
    export enum BingoType {
        turbo = "turbo",
        normal = "normal",
        instant = "instant",
        connectionLost = "connectionLost",
        stoppedAnimation = "stoppedAnimation"
    }

     /**Display Orientation enum*/
    export enum DisplayOrientation{
         /**called when window.innerWidth > window.innerHeight */
        landscape = "landscape",
        /**called when window.innerHeight > window.innerWidth */
        portrait    = "portrait"
    }

    /**WinType enum*/
    export enum WinType {
        /** bigwin wintype*/
        bigwin = "bigWin",
        /**normal wintype*/
        normal = "normal"
    }

     /**Anchor*/
    export enum Anchor {
        /** left anchor. setting anchor to (1, .5)*/
        left        = "left",
        /** center anchor. setting anchor to (.5, .5)*/
        center      = "center",
        /** right anchor. setting anchor to (0, .5)*/
        right       = "right"
    }

     /**Language Names from language.json (getting from service)*/
    export enum LanguageNames {
        /**Matrix's header*/
        MatrixHeader = "BingoMatrixHeader",       
        /**Ball Value*/
        BallValue = "BallValue",              
        /**Matrix's header value*/
        MatrixHeaderValue = "BingoMatrixHeaderValue",      
        /**Matrix's number value (ball)*/
        MatrixNumberValue = "BingoMatrixNumberValue",       
        /**New Card Button's Text*/
        NewCard = "NewCardText",         
        /**New Card Button's Text*/
        CardNumberValue = "CardNumberViewValueEmpty", 
        /**View Balls Counter text for payout selector */
        PayoutSelectorBallsCounterValue = "PayoutSelectorViewBallsCounterValue",   
        /**Payout Selector Value*/
        PayoutSelectorValue = "PayoutSelectorViewValue", 
        /**Turbo Button's Text*/
        TurboButton = "TurboButtonText",  
        /**Ball text*/
        BetValue = "BetValueText",           
        /**Machine Head's Value Text*/
        MachineHeadValue = "MachineHeadValue",          
        /**Bigwin header Text*/
        BigWinHeader = "BigWinHeaderText",    
        /**Bigwin's value Text*/
        BigWinValue = "BigWinValue",      
        /**Win's Text*/
        Win = "WinText",             
        /**Win's Value Text*/
        WinValue = "WinValue",         
        /**Mode Text*/
        ModeText = "ModeText",    
        /**Credit Text*/
        Balance = "CreditText",                
        /**Credit's value Text*/
        BalanceValue = "CreditValue",         
        /**Instant button's Text*/
        InstantButton = "InstantButtonText",   
        /**Context for parse error*/
        ErrorParse = "Error_Parse",             
        /**General Header for error*/
        ErrorGeneralHeader = "Error_General_Header",         
        /**Header for session timeout error*/
        ErrorSessionTimeoutHeader = "Error_Session_Time_Out_Header",             
        /**Context for session timeout error*/
        ErrorSessionTimeOut = "Error_Session_Time_Out",             
        /**Header for websocket connection error*/
        ErrorConnectionHeader = "Error_WebSocketConnection_Header",               
        /**Context websocket connection for error*/
        ErrorConnection = "Error_WebSocketConnection",                     
        /**Header for insufficientfunds error*/
        ErrorInsufficientfundsHeader = "Error_Insufficient_funds_header",                
        /**Context for insufficientfunds balance error*/
        ErrorInsufficientfundsBalance = "Error_Insufficient_funds_notenoughBalanceText",   
        /**Context for insufficientfunds current bet level error*/
        ErrorInsufficientfundsCurrentBet = "Error_Insufficient_funds_currentBetLevel",  
        /**Context for insufficientfunds minimum bet level error*/
        ErrorInsufficientfundsMinBet = "Error_Insufficient_funds_minimumBetLevel",        
        /**Header for max bet error*/
        ErrorMaxBetHeader = "Error_MaxBet_Header",                          
        /**Context for maxbet not enough Balance error*/
        ErrorMaxBetnotenoughBalance = "Error_MaxBet_notenoughBalance",        
        /**Context for maxbet enough balance*/
        ErrorMaxBetBalance = "Error_MaxBet_enoughBalanceText",
        /**Header for reconnect restore session error*/
        ErrorReconnectRestoreSessionHeader = "Error_Reconnect_Restore_Session_Header",
        /**Context for reconnect restore session error*/
        ErrorReconnectRestoreSession = "Error_Reconnect_Restore_Session",
        /**Header for message error*/
        ErrorMessageHeader = "ErrorMessageHeaderText",
        /**Context for message error*/
        ErrorMessage = "ErrorMessageText",
        /**General button's text*/
        GeneralButton = "GeneralButtonText",
        /**Reload button's text*/
        ReloadButton = "ReloadButton",
        /**Continue button's text*/
        ContinueButton = "ContinueButton",
        /**Ok button's text*/
        OkButton = "OkButton",          
        /*Header for win popup*/
        WinPopupHeader = "WinPopupHeaderText",
        /*Wontext for win popup*/
        WinPopupWon = "WinPopup_WonText"                                                                     
    }
    export class StyleInformation { 
        /*UI element's style information*/
        static UI = {
            Home: { out: "UI/home_normal", over: "UI/home_over", down: "UI/home_down", disabled: "UI/home_down" },
            History: { out: "UI/history_normal", over: "UI/history_over", down: "UI/history_down", disabled: "UI/history_disabled" },
            Help: { out: "UI/help_normal", over: "UI/help_over", down: "UI/help_down", disabled: "UI/help_disabled" },
            Menu: { out: "UI/menu_normal", over: "UI/menu_over", down: "UI/menu_down", disabled: "UI/menu_disabled" },
            SoundOff: { out: "UI/soundoff_normal", over: "UI/soundoff_over", down: "UI/soundoff_down", disabled: "UI/soundoff_disabled" },
            SoundOn: { out: "UI/soundon_normal", over: "UI/soundon_over", down: "UI/soundon_down", disabled: "UI/soundon_disabled" },
            Minimize: { out: "UI/minimize_normal", over: "UI/minimize_over", down: "UI/minimize_down", disabled: "UI/minimize_disabled" },
            FullScreen: { out: "UI/fullscreen_normal", over: "UI/fullscreen_over", down: "UI/fullscreen_down", disabled: "UI/fullscreen_disabled" },
            ForwardButton: { out: "Forward/forward_out", over: "Forward/forward_over", down: "Forward/forward_down", disabled: "Forward/forward_disabled" },
            GeneralButton: { out: "UI/button_out", over: "UI/button_over", down: "UI/button_down", disabled: "UI/button_disabled" },
            NewCardButton: { out: "Card/new_card_out", over: "Card/new_card_over", down: "Card/new_card_down", disabled: "Card/new_card_disable" },
            TurboButtonOn: { out: "Turbo/turbo_landscape_on", over: "Turbo/turbo_landscape_on", down: "Turbo/turbo_landscape_on", disabled: "Turbo/turbo_landscape_on" },
            TurboButtonOut: { out: "Turbo/turbo_landscape_out", over: "Turbo/turbo_landscape_over", down: "Turbo/turbo_landscape_down", disabled: "Turbo/turbo_landscape_disabled" },
            BetDownButton: { out: "Bet/betdownbutton_out", over: "Bet/betdownbutton_over", down: "Bet/betdownbutton_down", disabled: "Bet/betdownbutton_disabled" },
            BetPlusButton: { out: "Bet/betplusbutton_out", over: "Bet/betplusbutton_over", down: "Bet/betplusbutton_down", disabled: "Bet/betplusbutton_disabled" },
            PlayButton: { out: "Play/play_landscape_button_out", over: "Play/play_landscape_button_over", down: "Play/play_landscape_button_down", disabled: "Play/play_landscape_button_disabled" },
        }

        /*General Button's text style information*/
        static GeneralButton = {
            fontFamily: "Montserrat, sans-serif",
            fontSize: "22px",
            fontWeight: "bold",
            fill: "#d08f38",
            stroke: 0x000000,
            strokeThickness: 3
        }

         /*Error Mesage Header's text style information*/
        static ErrorMessageHeader = {
            align: "center",
            fontFamily: "agencyfb",
            strokeThickness: 3,
            fill: "#d08f38",
            stroke: 0x000000,
            fontSize: "40px",
            fontWeight:"bold"
        }

         /*Error Mesage Context's text style information*/
        static ErrorMessageText = {
            fontFamily: "Montserrat, sans-serif",
            fill: "#8bf2ae",
            stroke: 0x000000,
            strokeThickness: 3,
            fontSize: "24px",
            fontWeight: "600",
            wordWrap: true,
            wordWrapWidth: 400,
            align: "center"
        }

        /*win's text style information*/
        static Win = {
            align: "center",
            fill: "0x32c684",
            fontFamily: "agencyfb",
            fontSize: "30px",
            fontWeight: "bold",
            stroke: "0x32c684",
            strokeThickness: 1
        }

        /*baalnce value's text style information*/
        static BalanceValue = {
            align: "center",
            fill: "0xffffff",
            fontFamily: "agencyfb",
            fontSize: "24px",
            fontWeight: "bold",
            stroke: "0x000000",
            strokeThickness: 1
        }

        /*balance's text style information*/
        static Balance = {
            align: "center",
            fill: "0x32c684",
            fontFamily: "agencyfb",
            fontSize: "30px",
            fontWeight: "bold",
            stroke: "0x32c684",
            strokeThickness: 1
        }

         /*mode's text style information(mode = fun/real)*/ 
        static Mode = {
            align: "center",
            fill: "0x32c684",
            fontFamily: "agencyfb",
            fontSize: "30px",
            fontWeight: "bold",
            stroke: "0x32c684",
            strokeThickness: 1
        }

         /*win's text style information*/
        static WinValue = {
            align: "center",
            fill: "0xffffff",
            fontFamily: "agencyfb",
            fontSize: "24px",
            fontWeight: "bold",
            stroke: "0x000000",
            strokeThickness: 1
        }

        /*matrix header's style information*/
        static MatrixHeaderValue = {
            align: "center",
            fill: "0x32c684",
            fontFamily: "agencyfb",
            fontSize: "20px",
            fontWeight: "bold",
            stroke: "0x32c684",
            strokeThickness: 1
        }

        /*bigwin header's text style information*/
        static BigWinHeader = {
            align: "center",
            fontFamily: "agencyfb",
            fill: [
                "0xff9f1f",
                "0xffff24"
            ],
            fontSize: "100px",
            fontWeight: "bold",
            stroke: "0x472312",
            strokeThickness: 7
        };

        /*bigwin value's text style information*/
        static BigWinValue = {
            align: "center",
            fontFamily: "agencyfb",
            fill: [
                "0xff9f1f",
                "0xffff24"
            ],
            fontSize: "70px",
            fontWeight: "bold",
            stroke: "0x472312",
            strokeThickness: 7
        }

        /*machine header's text style information*/
        static MachineHeadValue = {
            align: "center",
            fill: "0xfac858",
            fontFamily: "agencyfb",
            fontSize: "30px",
            fontWeight: "bold",
            stroke: "0xbb440c",
            strokeThickness: 3,
            dropShadow: true,
            dropShadowAlpha: 1,
            dropShadowAngle: 1,
            dropShadowBlur: 1,
            dropShadowColor:1,
            dropShadowDistance:1
        }

         /*ball's text style information*/
        static BallValue = {
            align: "center",
            fill: "0x000000",
            fontFamily: "agencyfb",
            fontSize: "50px",
            fontWeight: "bold",
            stroke: "0x000000",
            strokeThickness: 1
        }

          /*turbo button out's text style information*/
        static TurboButtonOut = {
            align: "center",
            fill: "0x32c684",
            fontFamily: "agencyfb",
            fontSize: "25px",
            fontWeight: "bold",
            stroke: "0x000000",
            strokeThickness: 2
        }

        /*turbo button on's text style information*/
        static TurboButtonOn = {
            align: "center",
            fill: "0xb71e01",
            fontFamily: "agencyfb",
            fontSize: "25px",
            fontWeight: "bold",
            stroke: "0x000000",
            strokeThickness: 2
        }

        /*turbo button disabled's text style information*/
        static TurboButtonDisabled = {
            align: "center",
            fill: "#999999",
            fontFamily: "agencyfb",
            fontSize: "25px",
            fontWeight: "bold",
            stroke: "0x000000",
            strokeThickness: 2
        }

        /*bet value's text style information*/
        static BetValue = {
            align: "center",
            fill: "0x32c684",
            fontFamily: "agencyfb",
            fontSize: "30px",
            fontWeight: "bold",
            stroke: "0x32c684",
            strokeThickness: 1
        }

        /*new card button's text style information*/
        static NewCard = {
            align: "center",
            fill: "0xb71e01",
            fontFamily: "agencyfb",
            fontSize: "20px",
            fontWeight: "bold",
            stroke: "0xb71e01",
            strokeThickness: 1
        }

        /*payout selector's ball counter value empty state's text style information*/
        static PayoutSelectorBallsEmptyState = {
            align: "center",
            fill: "0x89efac",
            fontFamily: "agencyfb",
            fontWeight: "bold",
            fontSize: "17px"
        }

        /*payout selector's ball counter value match state's text style information*/
        static PayoutSelectorBallsMatchState = {
            align: "center",
            fill: "0xb71e01",
            fontFamily: "agencyfb",
            fontWeight: "bold",
            fontSize: "17px"
        }

        /*payout selector's value empty state's text style information*/
        static PayoutSelectorEmptyState = {
            align: "center",
            fill: "0x89efac",
            fontFamily: "agencyfb",
            fontWeight: "bold",
            fontSize: "17px"
        }

        /*payout selector's value match state's text style information*/
        static PayoutSelectorMatchState = {
            align: "center",
            fill: "0xb71e01",
            fontFamily: "agencyfb",
            fontWeight: "bold",
            fontSize: "17px"
        }

        /*card number's value empty state's text style information*/
        static CardNumberEmptyState = {
            align: "center",
            fill: "0x89efac",
            fontFamily: "agencyfb",
            fontWeight: "bold",
            fontSize: "20px",
            stroke: "0x89efac",
            strokeThickness: 1
        }

        /*card number's value match state's text style information*/
        static CardNumberMatchState = {
            align: "center",
            fill: "0xb71e01",
            fontFamily: "agencyfb",
            fontWeight: "bold",
            fontSize: "20px",
            stroke: "0xb71e01",
            strokeThickness: 1
        }

          /*matrix number's value empty state's text style information*/
        static MatrixEmptyState = {
            align: "center",
            fill: "0x89efac",
            fontFamily: "agencyfb",
            fontWeight: "bold",
            fontSize: "17px"
        }

         /*matrix number's value match state's text style information*/
        static MatrixMatchState = {
            align: "center",
            fill: "0xb71e01",
            fontFamily: "agencyfb",
            fontWeight: "bold",
            fontSize: "17px"
        }

         /*matrix number's value pass state's text style information*/
        static MatrixNumberPassState = {
            align: "center",
            fill: "0x89efac",
            fontFamily: "agencyfb",
            fontWeight: "bold",
            fontSize: "17px"
        }

         /*matrix number's value onscreen state's text style information*/
        static MatrixNumberOnSceenState = {
            align: "center",
            fill: "0x89efac",
            fontFamily: "agencyfb",
            fontWeight: "bold",
            fontSize: "17px"
        }

         /*matrix header's text style information*/
        static MatrixHeader = {
            align: "center",
            fill: "0xb71e01",
            fontFamily: "agencyfb",
            fontSize: "17px",
            fontWeight: "bold",
            stroke: "0xb71e01",
            strokeThickness: 0.3
        }

        /*Background's Sprites's Frame name*/
        static BackgroundFrames = {
            Black:"Background/backgroundblack",
            PortraitNormalBackground: "Background/bg_normal",
            PortraitTurboBackground: "Background/bg_turbo",
            LandscapeNormalBackground: "Background/bg_landscape_normal",
            LandscapeTurboBackground: "Background/bg_landscape_turbo",
            CoverTop: "Background/cover_top",
            CoverBottom: "Background/cover_bottom",
            CoverLeft: "Background/cover_left",
            CoverRight: "Background/cover_right",
            Logo: "Background/logo"
        }

         /*Card's Sprites's Frame name*/
        static CardFrames = {
            CardFrame: "Card/card_landscape_frame",
            CardBackground: "Card/card_landscape_background",
            CardLines: "Card/card_landscape_lines",
            CardMatchBox: "Card/card_landscape_matchbox"
        }

         /*Machine's Sprites's Frame name*/
        static MachineFrames = {
            Machine:"Machines/machine",
            NormalBall: "Machines/normal_ball",
            TurboBall: "Machines/turbo_ball",
            NormalLeftArm: "Machines/normal_arm_left",
            NormalRightArm: "Machines/normal_arm_right",
            NormalLeftEyes: "Machines/normal_eyes_left",
            NormalRightEyes: "Machines/normal_eyes_right",
            NormalHead: "Machines/normal_head",
            NormalMouth: "Machines/normal_mouth",
            NormalTeeth: "Machines/normal_teeth",
            NormalWheel: "Machines/normal_wheel",
            TurboLeftArm: "Machines/turbo_arm_left",
            TurboRightArm: "Machines/turbo_arm_right",
            TurboLeftEyes: "Machines/turbo_eyes_left",
            TurboRightEyes: "Machines/turbo_eyes_right",
            TurboHead: "Machines/turbo_head",
            TurboMouth: "Machines/turbo_mouth",
            TurboTeeth: "Machines/turbo_teeth",
            TurboWheel: "Machines/turbo_wheel",
            Light:"Machines/light"
        }

        /** Background Smoke Animation's Name*/
        static BackgroundSmokes = {
            SmokeAnim1: "smokeAnim1/",
            SmokeAnim2: "SmokeAnim2/",
            SmokeAnim3: "SmokeAnim3/"
        }

         /** Bet Screen frame's Name*/
        static BetScreen = "Bet/betscreen";       

         /**matrix frame's Name*/
        static MatrixFrames = {
            Background: "BingoMatrix/bm_landscape_background",
            FrameNormal: "BingoMatrix/bm_landscape_frame_normal",
            FrameTurbo: "BingoMatrix/bm_landscape_frame_turbo",
            BoxPass: "BingoMatrix/bingoMatrixBoxPass",
            BoxOnScreen: "BingoMatrix/bingoMatrixBoxOnScreen",
            BoxMatch: "BingoMatrix/bingoMatrixBoxMatch"
        }
         /** payout frame's Name*/
        static PayoutFrames = {
            Background: "Payout/payout_landscape_background",
            BallsLine: "Payout/payout_landscape_ballsline",
            FrameNormal: "Payout/payout_landscape_frame_normal",
            Indicator: "Payout/payout_landscape_indicator",
            LineMatch: "Payout/payout_line_match"
        }

        /** popup frame's Name*/
        static Popup = "UI/win_Popup";
        /** bigwin's ball frame's Name*/
        static DolarBall = "Machines/dolarball";
        /** play button effect animation's Name*/
        static PlayButtonEffect = "playButtonEffect/";
        /** turbo button effect animation's Name*/
        static TurboButtonEffect = "TurboButtonEffect/";
        /** head smoke effect animation's Name*/
        static HeadSmokeEffect = "headEffect/";
        /** nose smoke effect animation's Name*/
        static NoseSmokeEffect = "noseEffect/";
        /** head electic effect animation's Name*/
        static HeadElectricEffect = "headElectric/";
        /** turbo smoke effect animation's Name*/
        static TurboSmokeEffect = "TurboSmoke/";
        /** monitor effect animation's Name*/
        static MonitorAnim = "monitor/";
        /** bigwin coin's frame name */
        static BigWinCoins = "BigWin/bigwin_coins";
    }
}