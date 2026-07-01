export class AvatarLoader {
    constructor(containerId: string);
    init(): void;
    onReady(fn: () => void): void;
    loadExternalAnimation(url: string, registerAs: string, onLoaded?: () => void): void;
    _playAnimation(name: string): void;
    startLipSync(audioElement: HTMLAudioElement): void;
    stopLipSync(): void;
    destroy(): void;
}
