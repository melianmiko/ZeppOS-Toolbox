import { t, extendLocale } from "../../lib/i18n";
import { SettingsListScreen } from "../../lib/SettingsListScreen";
import { AppGesture } from "../../lib/AppGesture";

import { SETTINGS_HOME_TRANSLATIONS } from "../utils/translations";
import {openPage} from "../utils/misc";

extendLocale(SETTINGS_HOME_TRANSLATIONS);

class SettingsHomePage extends SettingsListScreen {
  build() {
    this.clickableItem(t("action_info"), "menu/info.png", () =>
      this.openPage("AboutScreen")
    );
    this.clickableItem(t("settings_ui"), "menu/ui.png", () =>
      this.openPage("SettingsUiScreen")
    );
    this.clickableItem(t("settings_lang"), "menu/lang.png", () =>
      this.openPage("SettingsLangScreen")
    );

    this.headline(t("headline_tools"))
    this.propCheckbox(t("cfg_show_size_in_list"), "mmk_tb_filesize", false);
    this.propCheckbox(t("cfg_timer_keep"), "mmk_tb_cfg_timer_keep", true);
    this.propCheckbox(t("cfg_fs_unit"), "mmk_tb_fs_unit", false);
    this.propInteger(t("prop_font_size"), "mmk_tb_fontsize", 16);

    const allowDanger = !!hmFS.SysProGetBool("mmk_tb_danger_mode");
    this.clickableItem(t("cfg_danger_mode"), `menu/cb_${allowDanger}.png`, () => {
      openPage("ToggleDanger");
    })
  }

  openPage(id) {
    openPage(id);
  }
}

Page({
  onInit(p) {
    AppGesture.withYellowWorkaround("left", {
      appid: 33904,
      url: "page/SettingsHomePage",
    });
    AppGesture.init();

    this.screen = new SettingsHomePage();
    this.screen.start();
  },
});
