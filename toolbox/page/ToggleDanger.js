import { ListScreen } from "../../lib/mmk/ListScreen";
import { AppGesture } from "../../lib/mmk/AppGesture";

const { config, t } = getApp()._options.globalData;

class DnagerToggle extends ListScreen {
  constructor() {
    super();
    this.fontSize = config.get("fontSize", this.fontSize);
  }

	start() {
    const allowDanger = config.get("allowDanger", false);
    if(allowDanger) {
    	config.set("allowDanger", false);
    	hmApp.goBack();
    	return;
    }

    this.text({
      text: t("This option will show some features, that may cause your device to fail to boot. Continuing, you agree that in some moment all settings of that device may become lost." )
    });
    this.offset(8)
    this.row({
      text: t("Agree, enable"),
      icon: "menu/cb_true.png",
      callback: () => {
        config.set("allowDanger", true);
      	hmApp.goBack();
      }
    });
    this.offset();
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
