/// <reference path="node_modules/zeppos-device-types-v1/types/index.d.ts" />

declare function getApp(): any;

type SettingsChangeEvent = {
    key: string,
    oldValue: any,
    newValue: any,
}

declare const settings: {
    settingsStorage: {
        getItem: (key: string) => any,
        setItem: (key: string, value: any) => void,
        addListener: (eventType: string, handler: (e: SettingsChangeEvent) => void) => void,
    }
}
