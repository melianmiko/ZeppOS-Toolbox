import { SettingsListScreen } from "../../lib/SettingsListScreen";
import { AppGesture } from "../../lib/AppGesture";

import { openPage } from "../utils/misc";

const { config, t } = getApp()._options.globalData;

class SettingsMiscPage extends SettingsListScreen {
  build() {
    this.configCheckbox(t("Hide main screen (open toolbox to settings list directly)"), "skipMainPage", false);
    this.configCheckbox(t("Open *.txt files with one click"), "autoOpenFiles", false);
    this.configCheckbox(t("Show file size in explorer"), "fmShowSizes", false);
    this.configCheckbox(t("Keep last timer value"), "timerKeepLast", true);

    // Kept in SysPro... for compat with FsUtils
    this.propCheckbox(t("Use Base-2 filesize\n1KB = 1024 B"), "mmk_tb_fs_unit", false);

    this.configInteger(t("Reader font size"), "readerFontSize", 16);

    const allowDanger = config.get("allowDanger", false);
    this.clickableItem(t("Unlock danger features"), `menu/cb_${allowDanger}.png`, () => {
      openPage("ToggleDanger");
    })
  }

  configInteger(name, key, fallback) {
    this.controlledInteger(name, config.get(key, fallback), (val) => {
      config.set(key, val);
    });
  }

  configCheckbox(name, key, fallback) {
    this.controlledCheckbox(name, config.get(key, fallback), (val) => {
      config.set(key, val);
    });
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
