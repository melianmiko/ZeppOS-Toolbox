import {t, extendLocale} from "../../lib/i18n";
import { SettingsListScreen } from "../../lib/SettingsListScreen";
import { AppGesture } from "../../lib/AppGesture";

import {TOGGLE_DANGER_TRANSLATIONS} from "../utils/translations";

extendLocale(TOGGLE_DANGER_TRANSLATIONS);

class DnagerToggle extends SettingsListScreen {
	build() {
    const allowDanger = hmFS.SysProGetBool("mmk_tb_danger_mode");
    if(allowDanger) {
    	hmFS.SysProSetBool("mmk_tb_danger_mode", false);
    	hmApp.goBack();
    	return;
    }

    this.text(t("danger_warn"));
    this.clickableItem(t("danger_agree"), "menu/cb_true.png", () => {
    	hmFS.SysProSetBool("mmk_tb_danger_mode", true);
    	hmApp.goBack();
    });
	}
}

Page({
  onInit(p) {
    AppGesture.withYellowWorkaround("left", {
      appid: 33904,
      url: "page/ToggleDanger",
    });
    AppGesture.init();

  	(new DnagerToggle).start();
  }
});
