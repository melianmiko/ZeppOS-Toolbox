import {extendLocale, t} from "../../lib/i18n";

import {ABOUT_SCREEN_LANG} from "../src/Locale";

extendLocale(ABOUT_SCREEN_LANG);

const APP_VERSION = "v2023-01-18";
const ABOUT_INFO = [
  ["melianmiko", t("Main developer")],
  [t("info"), "Legal"]
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
      text: "IM-02",
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
      text: t("Donate"),
      radius: 24,
      color: 0xF48FB1,
      normal_color: 0x17030e,
      press_color: 0x380621,
      click_func: () => this.openDonate()
    })
  }

  openDonate() {
    hmApp.gotoPage({
      url: "page/DonateCode"
    })
  }

  drawInfo() {
    let posY = 304;
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
    this.drawBasement();
    this.drawInfo();
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
