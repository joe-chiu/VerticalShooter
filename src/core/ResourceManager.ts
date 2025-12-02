export class ResourceManager {
    private images: Map<string, HTMLImageElement> = new Map();
    private audio: Map<string, HTMLAudioElement> = new Map();

    private static instance: ResourceManager;

    private constructor() { }

    public static getInstance(): ResourceManager {
        if (!ResourceManager.instance) {
            ResourceManager.instance = new ResourceManager();
        }
        return ResourceManager.instance;
    }

    public loadImage(key: string, src: string): Promise<HTMLImageElement> {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                this.images.set(key, img);
                resolve(img);
            };
            img.onerror = (e) => reject(e);
            img.src = src;
        });
    }

    public getImage(key: string): HTMLImageElement | undefined {
        return this.images.get(key);
    }

    // Placeholder for audio
    public loadAudio(key: string, src: string): void {
        const audio = new Audio(src);
        this.audio.set(key, audio);
    }

    public playAudio(key: string): void {
        const audio = this.audio.get(key);
        if (audio) {
            audio.currentTime = 0;
            audio.play().catch(e => console.warn('Audio play failed', e));
        }
    }
}
