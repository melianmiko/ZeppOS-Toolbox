import {t, extendLocale} from "../../lib/i18n";
import { SettingsListScreen } from "../../lib/SettingsListScreen";

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

let __$$app$$__ = __$$hmAppManager$$__.currentApp;
let __$$module$$__ = __$$app$$__.current;
__$$module$$__.module = DeviceRuntimeCore.Page({
  onInit(p) {
  	(new DnagerToggle).start();
  }
});
