import { extendLocale } from "../../lib/i18n";
import { QS_TILE_NAMES } from "./translations";

extendLocale(QS_TILE_NAMES);

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
    url: "AppListScreen",
    type: "internal",
  },

  files: {
    url: "FileManagerScreen",
    type: "internal",
  },

  storage: {
    url: "StorageInfoScreen",
    type: "internal",
  },

  timer: {
    url: "TimerSetScreen",
    type: "internal",
  },

  dnd: {
    url: "Settings_dndModelScreen",
    type: "native",
    isEnabled: () => {
      const response = hmFS.SysProGetChars("settings_data_dnd");
      return response && response.length > 0;
    }
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
    isEnabled: () => {
      // Yes, `sytem`, thats typo in Mi Band firmware
      const response = hmFS.SysProGetBool("sytem.screen_aod_mode")
      return response;
    }
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
    url: "RebootConfirmScreen",
    type: "internal",
    danger: true,
  },

  wake_on_wrist: {
    url: "Settings_wristHomeScreen",
    type: "native",
  },
};
