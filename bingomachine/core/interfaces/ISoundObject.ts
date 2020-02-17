module Core.Interfaces {
    export interface ISoundObject {
        sound: Howl;
        channelName: string;
        isSoundMuted: boolean;
        isChannelMuted: boolean;
    }
}