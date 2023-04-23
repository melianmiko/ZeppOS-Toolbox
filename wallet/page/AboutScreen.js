import { FsUtils } from "../../lib/FsUtils";
import { AppGesture } from "../../lib/AppGesture";
import { BaseAboutScreen } from "../../lib/BaseAboutScreen";

class AboutScreen extends BaseAboutScreen {
  appId = 18858;
  appName = "Кошелёк";
  version = "v2023-04-13";

  infoRows = [
    ["MelianMiko", "Разработчик"],
    ["melianmiko.ru", "Загружено с"],
    ["JsBarcode\nqrcode-generator\npdf417-js", "Исп. библиотеки"]
  ];

  donateText = "Поддержать";

  uninstallText = "Удалить";
  uninstallConfirm = "Нажмите ещё раз для подтверждения";
  uninstallResult = "Приложение и все его данные удалены. Немедленно перезагрузите устройство.";

  donateUrl = () => {
    const [st, e] = FsUtils.stat(FsUtils.fullPath("donate.png"));

    if(e != 0) {
        hmFS.SysProSetBool("mmk_c_aw", true);
        hmApp.gotoPage({
          url: "page/WriteQR",
          param: JSON.stringify({
            format: "QR",
            content: "https://melianmiko.ru/donate",
            forceFilename: "donate.png",
            noStore: true
          })
        })
    } else {
      hmApp.gotoPage({
        url: "page/CardView",
        param: JSON.stringify({
          filename: 'donate.png', 
          width: 175, 
          height: 175, 
          i: -1
        })
      });
    }
  };

  onUninstall() {
    // Remove config files
    hmFS.remove("/storage/mmk_cards.json");
  }
}


let __$$app$$__ = __$$hmAppManager$$__.currentApp;
let __$$module$$__ = __$$app$$__.current;
__$$module$$__.module = DeviceRuntimeCore.Page({
  onInit(p) {
    AppGesture.withYellowWorkaround("left", {
      appid: 18858,
      url: "page/AboutScreen",
    });
    AppGesture.init();

    new AboutScreen().start();
  }
});
