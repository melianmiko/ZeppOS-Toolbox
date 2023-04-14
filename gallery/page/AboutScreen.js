import { AppGesture } from "../../lib/AppGesture";
import { BaseAboutScreen } from "../../lib/BaseAboutScreen";
import {t, extendLocale} from "../../lib/i18n";

extendLocale({
  app_name: {
    "en-US": "Gallery",
    "ru-RU": "Галерея",
  },
  action_uninstall: {
    "en-US": "Uninstall",
    "ru-RU": "Удалить",
  },
  tap_to_confirm: {
    "en-US": "Tap again to confirm",
    "ru-RU": "Нажмите ещё раз для подтверждения",
  },
  uninstall_complete: {
    "en-US": "Uninstalled.\nPlease reboot device to finish",
    "ru-RU": "Удалено.\nПерезагрузите устройство для завершения",
  },
});

class AboutScreen extends BaseAboutScreen {
  appId = 20042;
  appName = t("app_name");
  version = "v2023-04-14";

  infoRows = [
    ["MelianMiko", "Developer"],
    ["melianmiko.ru", "Download from"]
  ];

  uninstallText = t("action_uninstall");
  uninstallConfirm = t("tap_to_confirm");
  uninstallResult = t("uninstall_complete");
}

let __$$app$$__ = __$$hmAppManager$$__.currentApp;
let __$$module$$__ = __$$app$$__.current;
__$$module$$__.module = DeviceRuntimeCore.Page({
  onInit(p) {
    AppGesture.withYellowWorkaround("left", {
      appid: 20042,
      url: "page/AboutScreen",
    });
    AppGesture.init();

    new AboutScreen().start();
  }
});
