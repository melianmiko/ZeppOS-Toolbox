import { AppGesture } from "../../lib/AppGesture";
import {SettingsListScreen} from "../../lib/SettingsListScreen";

const LOCALE_OPTIONS = [
  // [display name, string, code]
  ["Chinese",               "zh-CN", 0],
  ["Chinese (traditional)", "zh-TW", 1],
  ["English",               "en",    2],
  ["Russian",               "ru",    4],
  ["Ukrainian",             "uk",    18],
]

function setSystemLocale(str_val, code_val) {
  hmFS.SysProSetInt("settings_language_follow_phone", 0)
  hmFS.SysProSetChars("locale.name", str_val);
  hmFS.SysProSetInt("settings_data_language", code_val);

  hmApp.startApp({url: "Settings_systemScreen", native: true});
}

class MoreLocaleScreen extends SettingsListScreen {
  build() {
    for(const i in LOCALE_OPTIONS) {
      this.addLocaleRow(LOCALE_OPTIONS[i]);
    }
  }

  addLocaleRow(line) {
    const [title, str_val, code_val] = line;
    this.clickableItem(title, "menu/lang.png", () => {
      setSystemLocale(str_val, code_val);
    });
  }
}


let __$$app$$__ = __$$hmAppManager$$__.currentApp;
let __$$module$$__ = __$$app$$__.current;
__$$module$$__.module = DeviceRuntimeCore.Page({
  onInit() {
    AppGesture.withYellowWorkaround("left", {
      appid: 531545236,
      url: "page/ChangeLocale",
    });
    AppGesture.init();

    (new MoreLocaleScreen()).start();
  }
});
