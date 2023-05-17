import { t, extendLocale } from "../../lib/i18n";
import { SettingsListScreen } from "../../lib/SettingsListScreen";
import { AppGesture } from "../../lib/AppGesture";

import { SETTINGS_MISC_TRANSLATIONS } from "../utils/translations";
import { openPage } from "../utils/misc";

const { config } = getApp()._options.globalData;

extendLocale(SETTINGS_MISC_TRANSLATIONS);

class SettingsMiscPage extends SettingsListScreen {
  build() {
    this.configCheckbox(t("cfg_skip_main_page"), "skipMainPage", false);
    this.configCheckbox(t("cfg_auto_open_files"), "autoOpenFiles", false);
    this.configCheckbox(t("cfg_show_size_in_list"), "fmShowSizes", false);
    this.configCheckbox(t("cfg_timer_keep"), "timerKeepLast", true);

    // Kept in SysPro... for compat with FsUtils
    this.propCheckbox(t("cfg_fs_unit"), "mmk_tb_fs_unit", false);

    this.configInteger(t("prop_font_size"), "readerFontSize", 16);

    const allowDanger = config.get("allowDanger", false);
    this.clickableItem(t("cfg_danger_mode"), `menu/cb_${allowDanger}.png`, () => {
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
