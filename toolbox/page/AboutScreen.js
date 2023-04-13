import {QS_BUTTONS} from "../utils/data";
import { AppGesture } from "../../lib/AppGesture";
import { BaseAboutScreen } from "../../lib/BaseAboutScreen";
import {t, extendLocale} from "../../lib/i18n";

import {APP_EDIT_TRANSLATIONS} from "../utils/translations";

extendLocale(APP_EDIT_TRANSLATIONS)

class NewAboutScreen extends BaseAboutScreen {
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
}

const APP_VERSION = "v2023-01-21";

const AUTHORS = [
];

const COLORS = [
  [239, 83, 80],
  [171, 71, 188],
  [126, 87, 194],
  [92, 107, 192],
  [66, 165, 245],
  [66, 165, 245],
  [38, 198, 218],
  [38, 166, 154],
  [102, 187, 106],
  [102, 187, 106],
  [102, 187, 106],
  [255, 238, 88],
  [255, 202, 40],
  [255, 167, 38],
  [255, 112, 67],
];

class AboutScreen {
  initAnimation() {
    let level = 0, currentColor = 0, currentIcon = 0;

    const names = Object.keys(QS_BUTTONS);

    const bg = hmUI.createWidget(hmUI.widget.FILL_RECT, {
      color: 0x0,
      x: 0,
      y: 0,
      w: 100,
      h: 100,
      radius: 12
    });

    const img = hmUI.createWidget(hmUI.widget.IMG, {
      x: (192-78)/2,
      y: 64,
      src: "qs/" + names[0] + ".png"
    });

    // Let's do some animation =)
    timer.createTimer(0, 100, () => {
      const cl = (100-level) / 100;
      const size = 78 + (40 * level / 100);

      let [r,g,b] = COLORS[currentColor];
      r = Math.floor(r * cl);
      g = Math.floor(g * cl);
      b = Math.floor(b * cl);

      bg.setProperty(hmUI.prop.MORE, {
        color: (r << 16) + (g << 8) + b,
        x: (192-size) / 2,
        y: 103 - (size/2),
        w: size,
        h: size
      })

      level += 10;
      if(level > 100) {
        // Switch color and icon
        level = 0;
        currentColor = (currentColor + 1) % COLORS.length;

        img.setProperty(hmUI.prop.MORE, {
          src: "qs/" + names[currentIcon] + ".png"
        });

        currentIcon = (currentIcon + 1) % names.length;
      }
    })
  }

  drawBasement() {
    hmUI.createWidget(hmUI.widget.TEXT, {
      x: 0,
      y: 148,
      w: 192,
      h: 48,
      text: "Toolbox",
      text_size: 28,
      color: 0xFFFFFF,
      align_h: hmUI.align.CENTER_H
    });
    hmUI.createWidget(hmUI.widget.TEXT, {
      x: 0,
      y: 184,
      w: 192,
      h: 32,
      text: APP_VERSION,
      text_size: 18,
      color: 0xAAAAAA,
      align_h: hmUI.align.CENTER_H
    });
  }

  drawAuthors() {
    let posY = 240;
    for(let [name, info] of AUTHORS) {
      hmUI.createWidget(hmUI.widget.TEXT, {
        x: 0,
        y: posY,
        w: 192,
        h: 22,
        text_size: 18,
        color: 0xFFFFFF,
        text: name,
        align_h: hmUI.align.CENTER_H
      });
      hmUI.createWidget(hmUI.widget.TEXT, {
        x: 0,
        y: posY + 24,
        w: 192,
        h: 22,
        text_size: 16,
        color: 0xAAAAAA,
        text: info,
        align_h: hmUI.align.CENTER_H
      });

      posY += 64;
    }
  }

  start() {
    hmSetting.setBrightScreen(60);

    this.initAnimation();
    this.drawBasement();
    this.drawAuthors();
  }

  finish() {
    hmSetting.setBrightScreenCancel();
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

    this.screen = new NewAboutScreen();
    this.screen.start();
  }
});
