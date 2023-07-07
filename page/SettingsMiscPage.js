import { ListScreen } from "../lib/mmk/ListScreen";
import { AppGesture } from "../lib/mmk/AppGesture";

import { openPage } from "../utils/misc";

const { config, t } = getApp()._options.globalData;

class SettingsMiscPage extends ListScreen {
  constructor() {
    super();
    this.fontSize = config.get("fontSize", this.fontSize);
  }

  start() {
    // this.configCheckbox(t("Hide main screen (open toolbox to settings list directly)"), "skipMainPage", false);
    this.configCheckbox(t("Open *.txt files with one click"), "autoOpenFiles", false);
    this.configCheckbox(t("Show file size in explorer"), "fmShowSizes", false);
    this.configCheckbox(t("Keep last timer value"), "timerKeepLast", true);

    this.configCheckbox(t("Use Base-2 filesize\n1KB = 1024 B"), "FsBase2", false);

    const allowDanger = config.get("allowDanger", false);
    this.row({
      text: t("Unlock danger features"),
      icon: `menu/cb_${allowDanger}.png`,
      callback: () => openPage("ToggleDanger")
    });
    this.offset();
  }

  configInteger(name, key, fallback) {
    this.controlledInteger(name, config.get(key, fallback), (val) => {
      config.set(key, val);
    });
  }

  configCheckbox(name, key, fallback) {
    this.checkboxRow({
      text: name,
      iconFalse: "menu/cb_false.png",
      iconTrue: "menu/cb_true.png",
      value: config.get(key, fallback),
      callback: (v) => config.set(key, v)
    })
  }

  propCheckbox(name, key, fallback) {
    this.checkboxRow({
      text: name,
      iconFalse: "menu/cb_false.png",
      iconTrue: "menu/cb_true.png",
      value: hmFS.SysProGetBool(key),
      callback: (v) => hmFS.SysProGetBool(key, v)
    })
  }
}

Page({
  onInit(p) {
    AppGesture.withYellowWorkaround("left", {
      appid: 33904,
      url: "page/SettingsMiscPage",
    });
    AppGesture.init();

    this.screen = new SettingsMiscPage();
    this.screen.start();
  },
});
