import { AppGesture } from "../../lib/AppGesture";
import { BaseAboutScreen } from "../../lib/BaseAboutScreen";
import {t, extendLocale} from "../../lib/i18n";

import {APP_EDIT_TRANSLATIONS} from "../utils/translations";

extendLocale(APP_EDIT_TRANSLATIONS);

class AboutScreen extends BaseAboutScreen {
  appId = 33904;
  appName = "toolbox";
  version = "v2023-04-13";

  infoRows = [
    ["melianmiko", "Developer"],
    ["Vanek905/zhenyok905", "BandBBS publisher"],
    ["天劍血狐", "zh-TW translation"],
    ["harrybin", "de-DE translation"],
    ["arenasjuanf", "es-ES translation"],
  ];

  uninstallText = t("action_uninstall");
  uninstallConfirm = t("tap_to_confirm");
  uninstallResult = t("uninstall_complete") + ".\n" + t("apps_notice_uninstall");

  onUninstall() {
    // Remove config files
    hmFS.remove("/storage/mmk_tb_layout.json");
  }
}

let __$$app$$__ = __$$hmAppManager$$__.currentApp;
let __$$module$$__ = __$$app$$__.current;
__$$module$$__.module = DeviceRuntimeCore.Page({
  onInit(p) {
    AppGesture.withYellowWorkaround("left", {
      appid: 33904,
      url: "page/AboutScreen",
    });
    AppGesture.init();

    new AboutScreen().start();
  }
});
