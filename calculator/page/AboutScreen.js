import { AppGesture } from "../../lib/AppGesture";
import { BaseAboutScreen } from "../../lib/BaseAboutScreen";
import {t, extendLocale} from "../../lib/i18n";

extendLocale({
  app_name: {
    "en-US": "Calculator",
    "ru-RU": "Калькулятор",
    "zh-CN": "计算器",
  },
  action_uninstall: {
    "en-US": "Uninstall",
    "ru-RU": "Удалить",
    "zh-CN": "卸载",
  },
  tap_to_confirm: {
    "en-US": "Tap again to confirm",
    "ru-RU": "Нажмите ещё раз для подтверждения",
    "zh-CN": "再次点击以确认",
  },
  uninstall_complete: {
    "en-US": "Uninstalled.\nPlease reboot device to finish",
    "ru-RU": "Удалено.\nПерезагрузите устройство для завершения",
    "zh-CN": "已卸载,请重启设备以应用",
  },
});

class AboutScreen extends BaseAboutScreen {
  appId = 33904;
  appName = t("app_name");
  version = "v2023-04-14";

  infoRows = [
    ["MelianMiko", "Developer"],
    ["melianmiko.ru", "Download from"]
  ];

  uninstallText = t("action_uninstall");
  uninstallConfirm = t("tap_to_confirm");
  uninstallResult = t("uninstall_complete");

  onUninstall() {
    hmFS.SysProSetChars("calc_display", "");
  }
}

let __$$app$$__ = __$$hmAppManager$$__.currentApp;
let __$$module$$__ = __$$app$$__.current;
__$$module$$__.module = DeviceRuntimeCore.Page({
  onInit(p) {
    AppGesture.withYellowWorkaround("left", {
      appid: 337482,
      url: "page/AboutScreen",
    });
    AppGesture.init();

    new AboutScreen().start();
  }
});
