import { SettingsListScreen } from "../../lib/SettingsListScreen";
import { AppGesture } from "../../lib/AppGesture";

const { config, t } = getApp()._options.globalData;

class DnagerToggle extends SettingsListScreen {
	build() {
    const allowDanger = config.get("allowDanger", false);
    if(allowDanger) {
    	config.set("allowDanger", false);
    	hmApp.goBack();
    	return;
    }

    this.text(t("This option will show some features, that may cause your device to fail to boot. Continuing, you agree that in some moment all settings of that device may become lost." ));
    this.clickableItem(t("Agree, enable"), "menu/cb_true.png", () => {
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
