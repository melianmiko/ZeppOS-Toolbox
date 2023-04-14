import { AppGesture } from "../../lib/AppGesture";
import { BaseAboutScreen } from "../../lib/BaseAboutScreen";
import { extendLocale, t } from "../../lib/i18n";

import { ABOUT_SCREEN_LANG } from "../src/Locale";

extendLocale(ABOUT_SCREEN_LANG);

const APP_VERSION = "v2023-01-18";
const ABOUT_INFO = [
  ["melianmiko", t("Main developer")],
  [t("info"), "Legal"]
];

class AboutScreen extends BaseAboutScreen {
  appId = 93464;
  appName = "IM-02";
  version = "v2023-04-14";

  infoRows = [
    ["MelianMiko", "Developer"],
    ["melianmiko.ru", "Download from"],
    [t("info"), "Legal"],
  ];

  donateText = t("Donate");
  donateUrl = "page/DonateCode";

  uninstallText = t("action_uninstall");
  uninstallConfirm = t("tap_to_confirm");
  uninstallResult = t("uninstall_complete");
}


let __$$app$$__ = __$$hmAppManager$$__.currentApp;
let __$$module$$__ = __$$app$$__.current;
__$$module$$__.module = DeviceRuntimeCore.Page({
  onInit(p) {
    AppGesture.withYellowWorkaround("left", {
      appid: 93464,
      url: "page/AboutScreen",
    });
    AppGesture.init();

    new AboutScreen().start();
  }
});