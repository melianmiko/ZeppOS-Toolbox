import { t, extendLocale } from "../../lib/i18n";
import { SettingsListScreen } from "../../lib/SettingsListScreen";

import { SETTINGS_HOME_TRANSLATIONS } from "../utils/translations";

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
    this.propCheckbox(t("cfg_timer_keep"), "mmk_tb_cfg_timer_keep", true);
    this.propCheckbox(t("cfg_fs_unit"), "mmk_tb_fs_unit", false);
    this.propInteger(t("prop_font_size"), "mmk_tb_fontsize", 16);

    const allowDanger = !!hmFS.SysProGetBool("mmk_tb_danger_mode");
    this.clickableItem(t("cfg_danger_mode"), `menu/cb_${allowDanger}.png`, () => {
      hmApp.gotoPage({url: "page/ToggleDanger"});
    })
  }

  openPage(id) {
    hmApp.gotoPage({ url: "page/" + id });
  }
}

let __$$app$$__ = __$$hmAppManager$$__.currentApp;
let __$$module$$__ = __$$app$$__.current;
__$$module$$__.module = DeviceRuntimeCore.Page({
  onInit(p) {
    this.screen = new SettingsHomePage();
    this.screen.start();
  },
});
