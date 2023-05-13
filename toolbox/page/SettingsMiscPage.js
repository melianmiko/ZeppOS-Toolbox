import { t, extendLocale } from "../../lib/i18n";
import { SettingsListScreen } from "../../lib/SettingsListScreen";
import { AppGesture } from "../../lib/AppGesture";

import { SETTINGS_MISC_TRANSLATIONS } from "../utils/translations";
import { openPage } from "../utils/misc";

extendLocale(SETTINGS_MISC_TRANSLATIONS);

class SettingsMiscPage extends SettingsListScreen {
  build() {
    this.propCheckbox(t("cfg_skip_main_page"), "mmk_tb_skip_home", false);
    this.propCheckbox(t("cfg_show_size_in_list"), "mmk_tb_filesize", false);
    this.propCheckbox(t("cfg_timer_keep"), "mmk_tb_cfg_timer_keep", true);
    this.propCheckbox(t("cfg_fs_unit"), "mmk_tb_fs_unit", false);
    this.propInteger(t("prop_font_size"), "mmk_tb_fontsize", 16);

    const allowDanger = !!hmFS.SysProGetBool("mmk_tb_danger_mode");
    this.clickableItem(t("cfg_danger_mode"), `menu/cb_${allowDanger}.png`, () => {
      openPage("ToggleDanger");
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
