const QS_BUTTONS = {
  apps: {
    description: "Apps manager",
    click: () => gotoSubpage("apps")
  },

  files: {
    description: "File manager",
    click: () =>gotoSubpage("files")
  },

  storage: {
    description: "Disk usage",
    click: () => gotoSubpage("storage")
  },

  dnd: {
    description: "DND settings",
    click: () => hmApp.startApp({ 
      url: "Settings_dndModelScreen", native: true 
    })
  },

  flashlight: {
    description: "Flashlight app",
    click: () => hmApp.startApp({ 
      url: "FlashLightScreen", native: true 
    })
  },

  camera: {
    description: "Camera app",
    click: () => hmApp.startApp({ 
      url: "HidcameraScreen", native: true 
    })
  },

  settings: {
    description: "Settings app",
    click: () => hmApp.startApp({ 
      url: "Settings_homeScreen", native: true 
    })
  },

  brightness_btn: {
    description: "Brightness",
    click: () => hmApp.startApp({ 
      url: "Settings_lightAdjustScreen", native: true 
    })
  },

  aod: {
    description: "AOD",
    click: () => hmApp.startApp({ 
      url: "Settings_standbyModelScreen", native: true 
    })
  },

  powersave: {
    description: "Powersave",
    click: () => hmApp.startApp({ 
      url: "LowBatteryScreen", native: true, param: 1
    })
  },

  system: {
    description: "System settings",
    click: () => hmApp.startApp({ 
      url: "Settings_systemScreen", native: true 
    })
  },

  applistsort: {
    description: "App list edit",
    click: () => hmApp.startApp({ 
      url: "Settings_applistSortScreen", native: true 
    })
  },

  poweroff: {
    description: "Power off",
    click: () => hmApp.startApp({ 
      url: "HmReStartScreen", native: true 
    })
  },
};
