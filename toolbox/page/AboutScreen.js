import { AppGesture } from "../../lib/mmk/AppGesture";
import { BaseAboutScreen } from "../../lib/mmk/BaseAboutScreen";
import {t, extendLocale} from "../../lib/mmk/i18n";

import {APP_EDIT_TRANSLATIONS} from "../utils/translations";

extendLocale(APP_EDIT_TRANSLATIONS);

class AboutScreen extends BaseAboutScreen {
  constructor() {
    super();
    this.appId = 33904;
    this.appName = "toolbox";
    this.version = "v2023-05-26";

    this.infoRows = [
      ["melianmiko", "Developer"],
      ["mmk.pw", "Website"],
      ["Vanek905/zhenyok905", "BandBBS publisher"],
      ["天劍血狐", "zh-TW translation"],
      ["harrybin", "de-DE translation"],
      ["arenasjuanf", "es-ES translation"],
      ['NiziulLuizin', "pt-BR translation"],
    ];

    this.uninstallText = t("action_uninstall");
    this.uninstallConfirm = t("tap_to_confirm");
    this.uninstallResult = t("uninstall_complete") + ".\n" + t("apps_notice_uninstall");
  }
}

Page({
  onInit(p) {
    AppGesture.withYellowWorkaround("left", {
      appid: 33904,
      url: "page/AboutScreen",
    });
    AppGesture.init();

    new AboutScreen().start();
  }
});
