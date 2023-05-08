import {FsUtils} from "./FsUtils";

export class BaseAboutScreen {
  constructor() {
    this.appId = 0;
    this.appName = "AppName";
    this.version = "1.0";
    this.infoRows = [
      ["melianmiko", "Developer"]
    ];

    this.donateText = "Donate";
    this.donateUrl = null;

    this.uninstallText = "Uninstall";
    this.uninstallConfirm = "Tap again to confirm";
    this.uninstallResult = "Ready, please reboot your device. Click to open settings";

    this.posY = 240;
  }

  drawBasement() {
    hmUI.createWidget(hmUI.widget.IMG, {
      x: (192 - 100) / 2,
      y: 48,
      src: "icon.png"
    });
    hmUI.createWidget(hmUI.widget.TEXT, {
      x: 0,
      y: 158,
      w: 192,
      h: 48,
      text: this.appName,
      text_size: 28,
      color: 0xFFFFFF,
      align_h: hmUI.align.CENTER_H
    });

    hmUI.createWidget(hmUI.widget.TEXT, {
      x: 0,
      y: 194,
      w: 192,
      h: 32,
      text: this.version,
      text_size: 18,
      color: 0xAAAAAA,
      align_h: hmUI.align.CENTER_H
    });

    if (this.donateUrl) {
      hmUI.createWidget(hmUI.widget.BUTTON, {
        x: 16,
        y: this.posY,
        w: 192 - 32,
        h: 48,
        text: this.donateText,
        radius: 24,
        color: 0xF48FB1,
        normal_color: 0x17030e,
        press_color: 0x380621,
        click_func: () => this.openDonate()
      });
      this.posY += 64;
    }

    if(this.appId) {
      hmUI.createWidget(hmUI.widget.BUTTON, {
        x: 16,
        y: this.posY,
        w: 192 - 32,
        h: 48,
        text: this.uninstallText,
        radius: 24,
        color: 0xFFFFFF,
        normal_color: 0x333333,
        press_color: 0x555555,
        click_func: () => this.uninstall()
      });
      this.posY += 64;
    }
  }

  uninstall() {
    if(!this.confirmed) {
      hmUI.showToast({
        text: this.uninstallConfirm
      });
      this.confirmed = true;
      return;
    }

    const dirname = this.appId.toString(16).padStart(8, "0").toUpperCase();
    this.onUninstall();

    FsUtils.rmTree("/storage/js_apps/" + dirname);
    FsUtils.rmTree("/storage/js_apps/data" + dirname);

    hmApp.setLayerY(0);
    hmUI.setLayerScrolling(false);
    hmUI.createWidget(hmUI.widget.FILL_RECT, {
      x: 0,
      y: 0,
      w: 192,
      h: 482,
      color: 0x0
    });
    hmUI.createWidget(hmUI.widget.TEXT, {
      x: 0,
      y: 200, 
      w: 192,
      h: 290,
      text: this.uninstallResult,
      text_style: hmUI.text_style.WRAP,
      align_h: hmUI.align.CENTER_H,
      color: 0xFFFFFF,
    });
    hmUI.createWidget(hmUI.widget.IMG, {
      x: 0,
      y: 0,
      w: 192,
      h: 490,
      src: ""
    }).addEventListener(hmUI.event.CLICK_UP, () => {
      hmApp.startApp({
        url: "Settings_systemScreen",
        native: true
      });
    });
  }

  onUninstall() {

  }

  openDonate() {
    if(typeof this.donateUrl == "function") 
      return this.donateUrl();

    hmApp.gotoPage({
      url: this.donateUrl
    })
  }

  drawInfo() {
    for (let [name, info] of this.infoRows) {
      const metrics = hmUI.getTextLayout(name, {
        text_width: 192,
        text_size: 18
      });

      hmUI.createWidget(hmUI.widget.TEXT, {
        x: 0,
        y: this.posY,
        w: 192,
        h: 24,
        text_size: 16,
        color: 0xAAAAAA,
        text: info,
        align_h: hmUI.align.CENTER_H
      });

      hmUI.createWidget(hmUI.widget.TEXT, {
        x: 0,
        y: this.posY + 24,
        w: 192,
        h: metrics.height + 24,
        text_size: 18,
        color: 0xFFFFFF,
        text: name,
        text_style: hmUI.text_style.WRAP,
        align_h: hmUI.align.CENTER_H
      });

      this.posY += metrics.height + 32;
    }

    hmUI.createWidget(hmUI.widget.IMG, {
      x: 0,
      y: this.posY + 64,
      w: 192,
      h: 2,
      src: ""
    })
  }

  start() {
    this.drawBasement();
    this.drawInfo();
  }
}