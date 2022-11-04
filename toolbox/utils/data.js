import { extendLocale } from "../lib/i18n";

extendLocale({
  qs_apps: {
    "en-US": "Apps manager",
    "zh-CN": "应用管理器",
    "zh-TW": "應用管理器",
    "ru-RU": "Упр. приложениями",
    "de-DE": "Apps Manager"
  },
  qs_files: {
    "en-US": "File manager",
    "zh-CN": "文件管理器",
    "zh-TW": "檔案管理器",
    "ru-RU": "Файловый менеджер",
    "de-DE": "Dateimanager"
  },
  qs_storage: {
    "en-US": "Disk usage",
    "zh-CN": "磁盘使用情况",
    "zh-TW": "儲存空間",
    "ru-RU": "Память",
    "de-DE": "Speichernutzung"
  },
  qs_dnd: {
    "en-US": "DND settings",
    "zh-CN": "请勿打扰",
    "zh-TW": "勿擾",
    "ru-RU": "Не беспокоить",
    "de-DE": "BNS Einstellungen"
  },
  qs_flashlight: {
    "en-US": "Flashlight app",
    "zh-CN": "手电筒",
    "zh-TW": "手電筒",
    "ru-RU": "Фонарик",
    "de-DE": "Blitzlicht App"
  },
  qs_camera: {
    "en-US": "Camera app",
    "zh-CN": "相机",
    "zh-TW": "遙控拍照",
    "ru-RU": "Камера",
    "de-DE": "Kamera App"
  },
  qs_settings: {
    "en-US": "Settings app",
    "zh-CN": "设置应用",
    "zh-TW": "手環設定",
    "ru-RU": "Настройки",
    "de-DE": "Einstellungen App"
  },
  qs_brightness_btn: {
    "en-US": "Brightness",
    "zh-CN": "亮度",
    "zh-TW": "亮度",
    "ru-RU": "Яркость",
    "de-DE": "Helligkeit"
  },
  qs_aod: {
    "en-US": "AOD",
    "zh-CN": "AOD",
    "zh-TW": "AOD",
    "ru-RU": "AOD",
    "de-DE": "AOD"
  },
  qs_powersave: {
    "en-US": "Powersave",
    "zh-CN": "节能",
    "zh-TW": "省電模式",
    "ru-RU": "Энергосбережение",
    "de-DE": "Energiesparen"
  },
  qs_system: {
    "en-US": "System settings",
    "zh-CN": "系统设置",
    "zh-TW": "系統設定",
    "ru-RU": "Настройки системы",
    "de-DE": "Systemeinstellungen"
  },
  qs_applistsort: {
    "en-US": "App list sort",
    "zh-CN": "应用列表设置",
    "zh-TW": "應用列表設定",
    "ru-RU": "Настр. меню приложений",
    "de-DE": "Apps sortieren"
  },
  qs_poweroff: {
    "en-US": "Power off",
    "zh-CN": "关机",
    "zh-TW": "關機",
    "ru-RU": "Выключить",
    "de-DE": "Ausschalten"
  },
  qs_reboot: {
    "en-US": "Reboot",
    "zh-CN": "重启",
    "zh-TW": "重啟",
    "ru-RU": "Перезагрузить",
    "de-DE": "Neustart"
  },
  qs_timer: {
    "en-US": "Background timer",
    "zh-CN": "后台定时器",
    "zh-TW": "後台計時器",
    "ru-RU": "Фоновый таймер",
    "de-DE": "Hintergrund Timer"
  },
  qs_wake_on_wrist: {
    "en-US": "Wake on Wrist",
    "zh-CN": "唤醒手腕",
    "zh-TW": "喚醒手腕",
    "ru-RU": "Пробуждение при повороте",
    "de-DE": "Aufwachen am Handgelenk"
  }
});

export const DEFAULT_SETTINGS = {
  tiles: [
    "apps",
    "files",
    "storage",
    "timer",
    "dnd",
    "camera"
  ],
  withBrightness: true,
  withBattery: false
};


export const QS_BUTTONS = {
  apps: {
    url: "page/AppListScreen",
    type: "internal",
  },

  files: {
    url: "page/FileManagerScreen",
    type: "internal",
  },

  storage: {
    url: "page/StorageInfoScreen",
    type: "internal",
  },

  timer: {
    url: "page/TimerSetScreen",
    type: "internal",
  },

  dnd: {
    url: "Settings_dndModelScreen",
    type: "native",
  },

  flashlight: {
    url: "FlashLightScreen",
    type: "native",
  },

  camera: {
    url: "HidcameraScreen",
    type: "native",
  },

  settings: {
    url: "Settings_homeScreen",
    type: "native",
  },

  brightness_btn: {
    url: "Settings_lightAdjustScreen",
    type: "native",
  },

  aod: {
    url: "Settings_standbyModelScreen",
    type: "native",
  },

  powersave: {
    url: "LowBatteryScreen",
    type: "native",
  },

  system: {
    url: "Settings_systemScreen",
    type: "native",
  },

  applistsort: {
    url: "Settings_applistSortScreen",
    type: "native",
  },

  poweroff: {
    url: "HmReStartScreen",
    type: "native",
  },

  reboot: {
    url: "page/RebootConfirmScreen",
    type: "internal",
  },

  wake_on_wrist: {
    url: "Settings_wristHomeScreen",
    type: "native",
  },
};
