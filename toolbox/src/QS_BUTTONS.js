const QS_BUTTONS = {
  apps: {
    click: () => gotoSubpage("apps")
  },

  files: {
    click: () =>gotoSubpage("files")
  },

  storage: {
    click: () => gotoSubpage("storage")
  },

  timer: {
    click: () => gotoSubpage("timer")
  },

  dnd: {
    click: () => hmApp.startApp({ 
      url: "Settings_dndModelScreen", native: true 
    })
  },

  flashlight: {
    click: () => hmApp.startApp({ 
      url: "FlashLightScreen", native: true 
    })
  },

  camera: {
    click: () => hmApp.startApp({ 
      url: "HidcameraScreen", native: true 
    })
  },

  settings: {
    click: () => hmApp.startApp({ 
      url: "Settings_homeScreen", native: true 
    })
  },

  brightness_btn: {
    click: () => hmApp.startApp({ 
      url: "Settings_lightAdjustScreen", native: true 
    })
  },

  aod: {
    click: () => hmApp.startApp({ 
      url: "Settings_standbyModelScreen", native: true 
    })
  },

  powersave: {
    click: () => hmApp.startApp({ 
      url: "LowBatteryScreen", native: true, param: 1
    })
  },

  system: {
    click: () => hmApp.startApp({ 
      url: "Settings_systemScreen", native: true 
    })
  },

  applistsort: {
    click: () => hmApp.startApp({ 
      url: "Settings_applistSortScreen", native: true 
    })
  },

  poweroff: {
    click: () => hmApp.startApp({ 
      url: "HmReStartScreen", native: true 
    })
  },

  reboot: {
    click: () => {
      const a = hmUI.createWidget(hmUI.widget.GROUP, {
        x: 0, y: 0, w: 192, h: 490
      });

      a.createWidget(hmUI.widget.IMG, {x: 0, y: 0, src: ""});
      hmUI.deleteWidget(a);
    }
  }
};
