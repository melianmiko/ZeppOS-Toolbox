import {FsUtils} from "../lib/FsUtils";
import {t, extendLocale} from "../lib/i18n";

extendLocale({
  "action_uninstall": {
    "en-US": "Uninstall",
    "zh-CN": "卸载",
    "zh-TW": "卸載",
    "ru-RU": "Удалить"
  },
  "uninstall_complete": {
    "en-US": "Uninstalled",
    "zh-CN": "已卸载",
    "zh-TW": "已卸載",
    "ru-RU": "Удалено"
  },
  "apps_notice_uninstall": {
    "en-US": "Please reboot device to finish",
    "zh-CN": "请重启设备以完成",
    "zh-TW": "請重啟設備以完成",
    "ru-RU": "Перезагрузите устройство для завершения"
  }
})

class AppEditScreen {
  constructor(data) {
    this.data = data;
  }

  start() {
    // Icon
    hmUI.createWidget(hmUI.widget.IMG, {
      x: 46,
      y: 48,
      src: this.data.icon
    });

    // App name
    hmUI.createWidget(hmUI.widget.TEXT, {
      x: 0,
      y: 200,
      w: 192,
      text: this.data.name,
      color: 0xffffff,
      text_size: 26,
      align_h: hmUI.align.CENTER_H
    });

    // Vendor
    hmUI.createWidget(hmUI.widget.TEXT, {
      x: 0,
      y: 248,
      w: 192,
      h: 32,
      text: this.data.vender,
      color: 0xffffff,
      align_h: hmUI.align.CENTER_H
    });

    // App size
    const size = FsUtils.sizeTree("/storage/js_apps/" + this.data.dirname);
    hmUI.createWidget(hmUI.widget.TEXT, {
      x: 0,
      y: 280,
      w: 192,
      h: 32,
      text: FsUtils.printBytes(size),
      color: 0xffffff,
      align_h: hmUI.align.CENTER_H
    });

    // Uninstall button
    hmUI.createWidget(hmUI.widget.BUTTON, {
      x: 8,
      y: 320,
      w: 192-16,
      h: 64,
      color: 0xff2222,
      normal_color: 0x111111,
      press_color: 0x333333,
      text: t("action_uninstall"),
      click_func: () => this.uninstall()
    });

    // Finish page
    const group = hmUI.createWidget(hmUI.widget.GROUP, {
      x: 0,
      y: 0,
      w: 192,
      h: 482
    });
    group.createWidget(hmUI.widget.FILL_RECT, {
      x: 0,
      y: 0,
      w: 192,
      h: 482,
      color: 0x0
    });
    group.createWidget(hmUI.widget.TEXT, {
      x: 0,
      y: 120,
      w: 192,
      h: 48,
      text_size: 26,
      text_style: hmUI.text_style.WRAP,
      align_h: hmUI.align.CENTER_H,
      color: 0x66BB6A,
      text: t("uninstall_complete")
    });
    group.createWidget(hmUI.widget.TEXT, {
      x: 0,
      y: 180,
      w: 192,
      h: 80,
      text_size: 20,
      text_style: hmUI.text_style.WRAP,
      align_h: hmUI.align.CENTER_H,
      color: 0xffffff,
      text: t("apps_notice_uninstall")
    });

    group.createWidget(hmUI.widget.IMG, {
      x: 0,
      y: 320,
      w: 192,
      h: 48,
      pos_x: (192-48)/2,
      pos_y: 0,
      src: "i_next.png"
    }).addEventListener(hmUI.event.CLICK_UP, () => {
      hmApp.startApp({
        url: "Settings_systemScreen",
        native: true
      });
    });

    group.setProperty(hmUI.prop.VISIBLE, false);
    this.finishGroup = group;
  }

  uninstall() {
    FsUtils.rmTree("/storage/js_apps/" + this.data.dirname);
    FsUtils.rmTree("/storage/js_apps/data" + this.data.dirname);

    this.finishGroup.setProperty(hmUI.prop.VISIBLE, true);
  }
}


let __$$app$$__ = __$$hmAppManager$$__.currentApp;
let __$$module$$__ = __$$app$$__.current;
__$$module$$__.module = DeviceRuntimeCore.Page({
  onInit(p) {
    const data = JSON.parse(p);

    this.screen = new AppEditScreen(data);
    this.screen.start();
  }
});
