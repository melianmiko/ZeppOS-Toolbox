import {SettingsListScreen} from "../../lib/SettingsListScreen";

const PROP_LOCALE = "locale.name";
const PROP_FOLLOW_PHONE = "settings_language_follow_phone";

const LOCALES_LIST = {
  "ru": "Russian",
  "en": "English",
  "zh-CN": "Chineese",
  "zh-TW": "Chineese (traditional)"
}

function setSystemLocale(val) {
  hmFS.SysProSetInt(PROP_FOLLOW_PHONE, 0)
  hmFS.SysProSetChars(PROP_LOCALE, val);
  hmUI.showToast({text: "Ready, please reboot NOW."});
}

class MoreLocaleScreen extends SettingsListScreen {
  build() {
    this.clickableItem("About...", "menu/info.png", () => {
      hmApp.gotoPage({url: "page/AboutScreen"});
    });

    this.headline("Select locale:");

    for(const code in LOCALES_LIST) {
      this.addLocaleRow(code, LOCALES_LIST[code]);
    }
  }

  addLocaleRow(code, title) {
    this.clickableItem(title, "menu/lang.png", () => setSystemLocale(code));
  }
}


let __$$app$$__ = __$$hmAppManager$$__.currentApp;
let __$$module$$__ = __$$app$$__.current;
__$$module$$__.module = DeviceRuntimeCore.Page({
  onInit() {
    (new MoreLocaleScreen()).start();
  }
});
