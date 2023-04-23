import { AppGesture } from "../../lib/AppGesture";
import {SettingsListScreen} from "../../lib/SettingsListScreen";

class IndexScreen extends SettingsListScreen {
  build() {
    this.clickableItem("Select locale...", "menu/lang.png", () => {
      hmApp.gotoPage({url: "page/ChangeLocale"});
    });
    this.clickableItem("About...", "menu/info.png", () => {
      hmApp.gotoPage({url: "page/AboutScreen"});
    });

    const savedCode = hmFS.SysProGetInt("settings_data_language"),
          savedLocale = hmFS.SysProGetChars("locale.name"),
          currentLocale = DeviceRuntimeCore.HmUtils.getLanguage(),
          currentCode = hmSetting.getLanguage();

    this.headline("Status:");
    this.field("Current config", `${currentLocale} (${currentCode})`);
    this.field("Saved data", `${savedLocale} (${savedCode})`);
  }

  addLocaleRow(code, title) {
    this.clickableItem(title, "menu/lang.png", () => setSystemLocale(code));
  }
}


let __$$app$$__ = __$$hmAppManager$$__.currentApp;
let __$$module$$__ = __$$app$$__.current;
__$$module$$__.module = DeviceRuntimeCore.Page({
  onInit() {
    AppGesture.withYellowWorkaround("left", {
      appid: 531545236,
      url: "page/index",
    });
    AppGesture.init();

    (new IndexScreen()).start();
  }
});
