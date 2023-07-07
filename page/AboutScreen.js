import { AppGesture } from "../lib/mmk/AppGesture";
import { BaseAboutScreen } from "../lib/mmk/BaseAboutScreen";
import {VERSION} from "../version";

const { config, t } = getApp()._options.globalData;

class AboutScreen extends BaseAboutScreen {
  constructor() {
    super();
    this.fontSize = config.get("fontSize", this.fontSize);

    this.appId = 33904;
    this.iconSize = 100;
    this.appName = "Toolbox";
    this.version = VERSION;

    this.infoRows = [
      ["melianmiko", "Developer"],
      ["mmk.pw", "Website"],
      ["Vanek905/zhenyok905", "BandBBS publisher"],
      ["天劍血狐", "zh-TW translation"],
      ["harrybin", "de-DE translation"],
      ["arenasjuanf", "es-ES translation"],
      ['NiziulLuizin', "pt-BR translation"],
    ];

    this.uninstallText = t("Uninstall");
    this.uninstallConfirm = t("Tap again to confirm");
    this.uninstallResult = t("Uninstalled") + ".\n" + t("Please reboot device to finish");
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
