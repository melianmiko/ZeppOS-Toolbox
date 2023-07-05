const { config, t } = getApp()._options.globalData;

export const QS_BUTTONS = {
  apps: {
    title: t("Apps manager"),
    url: "AppListScreen",
    type: "internal",
  },

  files: {
    title: t("File manager"),
    url: "FileManagerScreen",
    type: "internal",
  },

  remman: {
    title: t("Remote manager"),
    url: "RemoteManScreen",
    type: "internal",
  },

  storage: {
    title: t("Disk usage"),
    url: "StorageInfoScreen",
    type: "internal",
  },

  timer: {
    title: t("Background timer"),
    url: "TimerSetScreen",
    type: "internal",
    lowRamOnly: true,
  },

  dnd: {
    title: t("DND settings"),
    url: "Settings_dndModelScreen",
    type: "native",
    isEnabled: () => {
      const response = hmFS.SysProGetChars("settings_data_dnd");
      return response && response.length > 0;
    }
  },

  flashlight: {
    title: t("Flashlight app"),
    url: "FlashLightScreen",
    type: "native",
  },

  camera: {
    title: t("Camera app"),
    url: "HidcameraScreen",
    type: "native",
  },

  settings: {
    title: t("Settings app"),
    url: "Settings_homeScreen",
    type: "native",
  },

  brightness_btn: {
    title: t("Brightness"),
    url: "Settings_lightAdjustScreen",
    type: "native",
  },

  aod: {
    title: t("AOD"),
    url: "Settings_standbyModelScreen",
    type: "native",
    isEnabled: () => {
      // Yes, `sytem`, thats typo in Mi Band firmware
      const response = hmFS.SysProGetBool("sytem.screen_aod_mode")
      return response;
    }
  },

  powersave: {
    title: t("Powersave"),
    url: "LowBatteryScreen",
    type: "native",
  },

  system: {
    title: t("System settings"),
    url: "Settings_systemScreen",
    type: "native",
  },

  applistsort: {
    title: t("App list sort"),
    url: "Settings_applistSortScreen",
    type: "native",
  },

  poweroff: {
    title: t("Power off"),
    url: "HmReStartScreen",
    type: "native",
  },

  reboot: {
    title: t("Reboot"),
    url: "RebootConfirmScreen",
    type: "internal",
    danger: true,
  },

  wake_on_wrist: {
    title: t("Wake on Wrist"),
    url: "Settings_wristHomeScreen",
    type: "native",
  },
};
