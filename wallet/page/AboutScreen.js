import { FsUtils } from "../../lib/FsUtils";
import { AppGesture } from "../../lib/AppGesture";
import { BaseAboutScreen } from "../../lib/BaseAboutScreen";

class AboutScreen extends BaseAboutScreen {
  constructor() {
    super();
    this.appId = 18858;
    this.appName = "Кошелёк";
    this.version = "v2023-05-08";

    this.infoRows = [
      ["MelianMiko", "Разработчик"],
      ["melianmiko.ru", "Загружено с"],
      ["JsBarcode\nqrcode-generator\npdf417-js", "Исп. библиотеки"]
    ];

    this.donateText = "Поддержать";

    this.uninstallText = "Удалить";
    this.uninstallConfirm = "Нажмите ещё раз для подтверждения";
    this.uninstallResult = "Приложение и все его данные удалены. Немедленно перезагрузите устройство.";
  }

  donateUrl() {
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


Page({
  onInit(p) {
    AppGesture.withYellowWorkaround("left", {
      appid: 18858,
      url: "page/AboutScreen",
    });
    AppGesture.init();

    new AboutScreen().start();
  }
});
