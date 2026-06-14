import { _decorator, Component, sys } from 'cc';

const { ccclass, property } = _decorator;

type MraidApi = {
    open?: (url: string) => void;
};

type BrowserWindow = {
    open?: (url: string, target?: string) => unknown;
    location?: {
        href: string;
    };
};

@ccclass('RedirectService')
export class RedirectService extends Component
{
    @property private appStoreUrl = 'https://www.apple.com/app-store/';
    @property private googlePlayUrl = 'https://play.google.com/store/games';
    @property private defaultUrl = 'https://play.google.com/store/games';

    private isRedirecting = false;

    public redirect(): void
    {
        if (this.isRedirecting)
            return;

        this.isRedirecting = true;
        this.openUrl(this.getTargetUrl());
    }

    private getTargetUrl(): string
    {
        if (sys.os === sys.OS.IOS)
            return this.appStoreUrl;

        if (sys.os === sys.OS.ANDROID)
            return this.googlePlayUrl;

        return this.defaultUrl;
    }

    private openUrl(url: string): void
    {
        if (this.tryOpenWithMraid(url))
            return;

        if (this.tryOpenWithBrowser(url))
            return;

        sys.openURL(url);
    }

    private tryOpenWithMraid(url: string): boolean
    {
        const runtime = globalThis as unknown as { mraid?: MraidApi };
        const mraid = runtime.mraid;

        if (!mraid?.open)
            return false;

        mraid.open(url);
        
        return true;
    }

    private tryOpenWithBrowser(url: string): boolean
    {
        const runtime = globalThis as unknown as { window?: BrowserWindow };
        const browserWindow = runtime.window;

        if (!browserWindow)
            return false;

        if (browserWindow.open)
        {
            browserWindow.open(url, '_blank');
            
            return true;
        }

        if (browserWindow.location)
        {
            browserWindow.location.href = url;
            
            return true;
        }

        return false;
    }
}