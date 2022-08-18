import {FsUtils} from "../lib/FsUtils";
import {t, extendLocale} from "../lib/i18n";

extendLocale({
  "action_uninstall": {
      "en-US": "Uninstall",
      "zh-CN": "卸载",
      "zh-TW": "解除安裝",
      "ru-RU": "Удалить"
  },
  "apps_notice_uninstall": {
      "en-US": "Device will restart after uninstall",
      "zh-CN": "设备将重新启动",
      "zh-TW": "裝置將重新啟動",
      "ru-RU": "Устройство будет перезагружено"
  }
})

class AppEditScreen {
  constructor(data) {
    this.data = data;
  }

  start() {
    const group = hmUI.createWidget(hmUI.widget.GROUP, {
      x: 0,
      y: 0,
      w: 192,
      h: 482
    })

    // Icon
    group.createWidget(hmUI.widget.IMG, {
      x: 46,
      y: 48,
      src: this.data.icon
    });

    // App name
    group.createWidget(hmUI.widget.TEXT, {
      x: 0,
      y: 200,
      w: 192,
      text: this.data.name,
      color: 0xffffff,
      text_size: 26,
      align_h: hmUI.align.CENTER_H
    });

    // Vendor
    group.createWidget(hmUI.widget.TEXT, {
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
    group.createWidget(hmUI.widget.TEXT, {
      x: 0,
      y: 280,
      w: 192,
      h: 32,
      text: FsUtils.printBytes(size),
      color: 0xffffff,
      align_h: hmUI.align.CENTER_H
    });

    // Uninstall button
    group.createWidget(hmUI.widget.BUTTON, {
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

    // Uninstall notice
    group.createWidget(hmUI.widget.TEXT, {
      x: 0,
      y: 396,
      w: 192,
      h: 96,
      text: t("apps_notice_uninstall"),
      text_style: hmUI.text_style.WRAP,
      color: 0x999999,
      align_h: hmUI.align.CENTER_H
    });

    this.group = group;
  }

  uninstall() {
    FsUtils.rmTree("/storage/js_apps/" + this.data.dirname);
    FsUtils.rmTree("/storage/js_apps/data" + this.data.dirname);

    hmUI.deleteWidget(this.group);
    hmApp.gotoHome();
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
