
module Core.Singleton {
    export class ResourceController {

        public static Instance: ResourceController;

        /** ResourceController class's init function. ResourceController is a singleton class */
        public constructor() {
            ResourceController.Instance = this;
        }

         /** add resources to loading asset*/
        public addResources() {
            Game.instance.resource.reset(true, true);
            this.addVisuals();
            this.addSounds();
        }

        /** add visuals asset to loading asset*/
        public addVisuals() {
            Game.instance.resource.addTexture("assets/sprites/background-0.json");  
            Game.instance.resource.addTexture("assets/sprites/background-1.json");  
            Game.instance.resource.addTexture("assets/sprites/background-2.json");  
            Game.instance.resource.addTexture("assets/sprites/ui.json");     
            Game.instance.resource.addTexture("assets/sprites/playButtonEffect.json");     
            Game.instance.resource.addTexture("assets/sprites/turboButtonEffect.json");   
            Game.instance.resource.addTexture("assets/sprites/headEffect.json");   
            Game.instance.resource.addTexture("assets/sprites/noseSmokeEffect.json");   
            Game.instance.resource.addTexture("assets/sprites/headElectric.json");    
            Game.instance.resource.addTexture("assets/sprites/turboSmoke-0.json");    
            Game.instance.resource.addTexture("assets/sprites/turboSmoke-1.json");   
            Game.instance.resource.addTexture("assets/sprites/monitorAnim-0.json");   
            Game.instance.resource.addTexture("assets/sprites/monitorAnim-1.json");   
            Game.instance.resource.addTexture("assets/sprites/SmokeAnim1.json");   
            Game.instance.resource.addTexture("assets/sprites/SmokeAnim2.json");   
            Game.instance.resource.addTexture("assets/sprites/SmokeAnim3.json");   
        }

          /** add sounds asset to loading asset*/
        public addSounds() {
            Game.instance.resource.addSound("Bigwin", "SpecialsSound", ["assets/sounds/ogg/bigwin.ogg", "assets/sounds/mp3/bigwin.mp3", "assets/sounds/mp3/bigwin.wav"]);   
            Game.instance.resource.addSound("AmbianceNormal", "BackgroundSound", ["assets/sounds/ogg/ambiance_normal.ogg", "assets/sounds/mp3/ambiance_normal.mp3", "assets/sounds/mp3/ambiance_normal.wav"]);   
            Game.instance.resource.addSound("AmbianceTurbo", "BackgroundSound", ["assets/sounds/ogg/ambiance_turbo.ogg", "assets/sounds/mp3/ambiance_turbo.mp3", "assets/sounds/mp3/ambiance_turbo.wav"]);   
            Game.instance.resource.addSound("NewCard", "SpecialsSound", ["assets/sounds/ogg/new_card.ogg", "assets/sounds/mp3/new_card.mp3", "assets/sounds/mp3/new_card.wav"]);
            Game.instance.resource.addSound("NormalMachineCounter", "SpecialsSound", ["assets/sounds/ogg/normalmachinecounter.ogg", "assets/sounds/mp3/normalmachinecounter.mp3", "assets/sounds/mp3/new_card.wav"]);
            Game.instance.resource.addSound("PayoutChanged", "SpecialsSound", ["assets/sounds/ogg/paytable_changed.ogg", "assets/sounds/mp3/paytable_changed.mp3", "assets/sounds/mp3/paytable_changed.wav"]);
            Game.instance.resource.addSound("PlayButton", "SpecialsSound", ["assets/sounds/ogg/play_button.ogg", "assets/sounds/mp3/play_button.mp3", "assets/sounds/mp3/play_button.wav"]);
            Game.instance.resource.addSound("TurboMachineCounter", "SpecialsSound", ["assets/sounds/ogg/turbomachinecounter.ogg", "assets/sounds/mp3/turbomachinecounter.mp3", "assets/sounds/mp3/turbomachinecounter.wav"]);
            Game.instance.resource.addSound("TurboButton", "SpecialsSound", ["assets/sounds/ogg/turbo_button.ogg", "assets/sounds/mp3/turbo_button.mp3", "assets/sounds/mp3/turbo_button.wav"]);
            Game.instance.resource.addSound("NumberElectric", "SpecialsSound", ["assets/sounds/ogg/numberelectric.ogg", "assets/sounds/mp3/numberelectric.mp3", "assets/sounds/mp3/numberelectric.wav"]);
            Game.instance.resource.addSound("Click", "SpecialsSound", ["assets/sounds/ogg/click.ogg", "assets/sounds/mp3/click.mp3", "assets/sounds/mp3/click.wav"]);
            Game.instance.resource.addSound("BetChanged", "SpecialsSound", ["assets/sounds/ogg/betchanged.ogg", "assets/sounds/mp3/betchanged.mp3", "assets/sounds/mp3/betchanged.wav"]);
            Game.instance.resource.addSound("CardVibration", "SpecialsSound", ["assets/sounds/ogg/cardvibration.ogg", "assets/sounds/mp3/cardvibration.mp3", "assets/sounds/mp3/cardvibration.wav"]);
            Game.instance.resource.addSound("ShortSmoke01", "SpecialsSound", ["assets/sounds/ogg/shortsmoke01.ogg", "assets/sounds/mp3/shortsmoke01.mp3", "assets/sounds/mp3/shortsmoke01.wav"]);
            Game.instance.resource.addSound("ShortSmoke02", "SpecialsSound", ["assets/sounds/ogg/shortsmoke02.ogg", "assets/sounds/mp3/shortsmoke02.mp3", "assets/sounds/mp3/shortsmoke02.wav"]);
            Game.instance.resource.addSound("ElectricNormal", "SpecialsSound", ["assets/sounds/ogg/electricnormal.ogg", "assets/sounds/mp3/electricnormal.mp3", "assets/sounds/mp3/electricnormal.wav"]);
            Game.instance.resource.addSound("ElectricTurbo", "SpecialsSound", ["assets/sounds/ogg/electricturbo.ogg", "assets/sounds/mp3/electricturbo.mp3", "assets/sounds/mp3/electricturbo.wav"]);
            Game.instance.resource.addSound("NumberCounter", "SpecialsSound", ["assets/sounds/ogg/numbercounter.ogg", "assets/sounds/mp3/numbercounter.mp3", "assets/sounds/mp3/numbercounter.wav"]);
            Game.instance.resource.addSound("Cong", "SpecialsSound", ["assets/sounds/ogg/congpanel.ogg", "assets/sounds/mp3/congpanel.mp3", "assets/sounds/mp3/congpanel.wav"]);
            Game.instance.resource.addSound("OverButton", "SpecialsSound", ["assets/sounds/ogg/overbutton.ogg", "assets/sounds/mp3/overbutton.mp3", "assets/sounds/mp3/overbutton.wav"]);
            Game.instance.resource.addSound("HeadSmoke", "SpecialsSound", ["assets/sounds/ogg/headsmoke.ogg", "assets/sounds/mp3/headsmoke.mp3", "assets/sounds/mp3/headsmoke.wav"]);
            Game.instance.resource.addSound("MouthSmoke", "SpecialsSound", ["assets/sounds/ogg/mouthsmoke.ogg", "assets/sounds/mp3/mouthsmoke.mp3", "assets/sounds/mp3/mouthsmoke.wav"]);
            Game.instance.resource.addSound("BigwinCount", "SpecialsSound", ["assets/sounds/ogg/bigwincounting.ogg", "assets/sounds/mp3/bigwincounting.mp3", "assets/sounds/mp3/bigwincounting.wav"]);
        }
    }
}