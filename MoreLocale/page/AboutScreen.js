import { AppGesture } from "../../lib/AppGesture";
import { BaseAboutScreen } from "../../lib/BaseAboutScreen";

class AboutScreen extends BaseAboutScreen {
  appId = 531545236;
  appName = "MoreLocale";
  version = "v2023-04-21";

  infoRows = [
    ["MelianMiko", "Developer"],
    ["melianmiko.ru", "Download from"]
  ];

  uninstallText = "Uninstall";
  uninstallConfirm = "Tap again to confirm";
  uninstallResult = "Complete, reboot device now";
}

let __$$app$$__ = __$$hmAppManager$$__.currentApp;
let __$$module$$__ = __$$app$$__.current;
__$$module$$__.module = DeviceRuntimeCore.Page({
  onInit(p) {
    AppGesture.withYellowWorkaround("left", {
      appid: 531545236,
      url: "page/AboutScreen",
    });
    AppGesture.init();

    new AboutScreen().start();
  }
});
