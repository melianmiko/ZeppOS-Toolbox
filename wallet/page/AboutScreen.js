import {FsUtils} from "../../lib/FsUtils";

const APP_VERSION = "v2023-02-04";

const ABOUT_INFO = [
  ["melianmiko", "Разработчик"],
  ["JsBarcode\nqrcode-generator\npdf417-js", "Исп. библиотеки"]
];

class AboutScreen {
  drawBasement() {
    hmUI.createWidget(hmUI.widget.IMG, {
      x: (192-100)/2,
      y: 48,
      src: "icon.png"
    });
    hmUI.createWidget(hmUI.widget.TEXT, {
      x: 0,
      y: 158,
      w: 192,
      h: 48,
      text: "Wallet",
      text_size: 28,
      color: 0xFFFFFF,
      align_h: hmUI.align.CENTER_H
    });
    hmUI.createWidget(hmUI.widget.TEXT, {
      x: 0,
      y: 194,
      w: 192,
      h: 32,
      text: APP_VERSION,
      text_size: 18,
      color: 0xAAAAAA,
      align_h: hmUI.align.CENTER_H
    });

    hmUI.createWidget(hmUI.widget.BUTTON, {
      x: 16,
      y: 240,
      w: 192-32,
      h: 48,
      text: "Поддержать",
      radius: 24,
      color: 0xF48FB1,
      normal_color: 0x17030e,
      press_color: 0x380621,
      click_func: () => this.openDonate()
    })
    hmUI.createWidget(hmUI.widget.BUTTON, {
      x: 16,
      y: 296,
      w: 192-32,
      h: 48,
      text: "Экспорт",
      radius: 24,
      color: 0xFFFFFF,
      normal_color: 0x111111,
      press_color: 0x222222,
      click_func: () => this.openBackup()
    })
  }

  openBackup() {
    hmApp.gotoPage({
      url: "page/BackupTool"
    })
  }

  openDonate() {
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
        param: JSON.stringify({filename: 'donate.png', width: 175, height: 175, i: -1})
      });
    }
  }

  drawInfo() {
    let posY = 364;
    for(let [name, info] of ABOUT_INFO) {
      const metrics = hmUI.getTextLayout(name, {
        text_width: 192,
        text_size: 18
      });

      hmUI.createWidget(hmUI.widget.TEXT, {
        x: 0,
        y: posY,
        w: 192,
        h: 24,
        text_size: 16,
        color: 0xAAAAAA,
        text: info,
        align_h: hmUI.align.CENTER_H
      });

      hmUI.createWidget(hmUI.widget.TEXT, {
        x: 0,
        y: posY + 24,
        w: 192,
        h: metrics.height + 24,
        text_size: 18,
        color: 0xFFFFFF,
        text: name,
        text_style: hmUI.text_style.WRAP,
        align_h: hmUI.align.CENTER_H
      });

      posY += metrics.height + 32;
    }
  }

  start() {
    hmSetting.setBrightScreen(60);
    this.drawBasement();
    this.drawInfo();
  }

  finish() {
    hmSetting.setBrightScreenCancel();
  }
}

let __$$app$$__ = __$$hmAppManager$$__.currentApp;
let __$$module$$__ = __$$app$$__.current;
__$$module$$__.module = DeviceRuntimeCore.Page({
  onInit(p) {
    this.screen = new AboutScreen();
    this.screen.start();
  }
});
