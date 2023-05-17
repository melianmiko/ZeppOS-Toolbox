import {t, extendLocale} from "../../lib/i18n";
import { SettingsListScreen } from "../../lib/SettingsListScreen";
import { AppGesture } from "../../lib/AppGesture";

import {TOGGLE_DANGER_TRANSLATIONS} from "../utils/translations";

const { config } = getApp()._options.globalData;

extendLocale(TOGGLE_DANGER_TRANSLATIONS);

class DnagerToggle extends SettingsListScreen {
	build() {
    const allowDanger = config.get("allowDanger", false);
    if(allowDanger) {
    	config.set("allowDanger", false);
    	hmApp.goBack();
    	return;
    }

    this.text(t("danger_warn"));
    this.clickableItem(t("danger_agree"), "menu/cb_true.png", () => {
      config.set("allowDanger", true);
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
