import {extendLocale, t} from "../../lib/i18n";
import {SettingsListScreen} from "../../lib/SettingsListScreen";

import {BG_OPTIONS, BG_OPTION_KEY, HIGHSCORE_KEY} from "../src/Options.js"
import {OPTION_NAMES} from "../src/Locale";

import { AppGesture } from "../../lib/AppGesture";

extendLocale(OPTION_NAMES);

class Im02Settings extends SettingsListScreen {
	build() {
		this.colorID = hmFS.SysProGetInt(BG_OPTION_KEY);
		if(!this.colorID) this.colorID = 0;

		this.clickableItem(t("About..."), "info.png", () => {
			hmApp.gotoPage({url: "page/AboutScreen"});
		});
		this.clickableItem(t("Wipe record"), "clear.png", () => {
			hmFS.SysProSetInt(HIGHSCORE_KEY, 0);
			hmUI.showToast({text: "OK"});
		});

		this.headline(t("Game options"))
	    this.propCheckbox(t("Disable vibration"), "mmk_game_no_vibro", false);
		this.setCurrentColorName = this.field(t("Background color"),
			BG_OPTIONS[this.colorID][0], 
			() => this.nextColor());
	}

	nextColor() {
		this.colorID = (this.colorID + 1) % BG_OPTIONS.length;
		hmFS.SysProSetInt(BG_OPTION_KEY, this.colorID);
		this.setCurrentColorName(BG_OPTIONS[this.colorID][0]);
	}
}

let __$$app$$__ = __$$hmAppManager$$__.currentApp;
let __$$module$$__ = __$$app$$__.current;
__$$module$$__.module = DeviceRuntimeCore.Page({
	onInit(bg) {
	    AppGesture.withYellowWorkaround("left", {
	      appid: 93464,
	      url: "page/SettingsScreen",
	    });
	    AppGesture.init();

		hmUI.setLayerScrolling(true);
		(new Im02Settings()).start();
	}
});
