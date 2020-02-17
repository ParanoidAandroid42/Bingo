// Type definitions for howler.js v1.1.25
// Project: https://github.com/goldfire/howler.js
// Definitions by: Pedro Casaubon <https://github.com/xperiments/>
// Definitions: https://github.com/borisyankov/DefinitelyTyped


declare class HowlerGlobal {
    mute(value: boolean): HowlerGlobal;
    unmute(): HowlerGlobal;
    volume(): number;
    volume(volume: number): HowlerGlobal;
    codecs(extension: string): boolean;
    iOSAutoEnable: boolean;
}

declare var Howler: HowlerGlobal;

interface IHowlCallback {
    (): void;
}
interface IHowlSoundSpriteDefinition {
    [name: string]: number[]
}
interface IHowlProperties {
    autoplay?: boolean;
    buffer?: boolean;
    format?: string;
    loop?: boolean;
    sprite?: IHowlSoundSpriteDefinition;
    volume?: number;
    src?: string[];
    preload?: boolean;
    onend?: IHowlCallback;
    onload?: IHowlCallback;
    onloaderror?: IHowlCallback;
    onpause?: IHowlCallback;
    onplay?: IHowlCallback;
    html5?: boolean;
}

declare class Howl {
    autoplay: Boolean;
    buffer: Boolean;
    format: string;
    rate: number;
    model: string;
    onend: IHowlCallback;
    onload: IHowlCallback;
    onloaderror: IHowlCallback;
    onpause: IHowlCallback;
    onplay: IHowlCallback;
    constructor(properties: IHowlProperties);
    playing(id?): boolean;
    play(sprite?: string, callback?: (soundId: number) => void): Howl;
    seek(seek?: number, id?): number;
    pause(soundId?: number): Howl;
    stop(soundId?: number): Howl;
    mute(muted?: boolean, soundId?: number): Howl;
    unmute(soundId?: number): Howl;
    state(): string;
    fade(from: number, to: number, duration: number, callback?: IHowlCallback, soundId?: number): Howl;
    loop(): boolean;
    loop(loop: boolean): Howl;
    pos(position?: number, soundId?: number): number;
    pos3d(x: number, y: number, z: number, soundId?: number): any;
    sprite(definition?: IHowlSoundSpriteDefinition): IHowlSoundSpriteDefinition;
    volume(): number;
    volume(volume?: number, soundId?: number): Howl;
    src(): string[];
    src(src: string[]): Howl;
    on(event: string, listener?: () => void): Howl;
    once(event: string, listener?: () => void): Howl;
    off(event: string, listener?: () => void): Howl;
    load(): void;
    unload(): void;
}