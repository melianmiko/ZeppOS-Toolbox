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
    hmUI.createWidget(hmUI.widget.TEXT, {
      x: 0,
      y: 280,
      w: 192,
      h: 32,
      text: this.getAppSize(),
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

    // Uninstall notice
    hmUI.createWidget(hmUI.widget.TEXT, {
      x: 0,
      y: 396,
      w: 192,
      h: 96,
      text: t("apps_notice_uninstall"),
      text_style: hmUI.text_style.WRAP,
      color: 0x999999,
      align_h: hmUI.align.CENTER_H
    });
  }

  uninstall() {
    FsUtils.rmTree("/storage/js_apps/" + this.data.dirname);
    FsUtils.rmTree("/storage/js_apps/data" + this.data.dirname);

    hmApp.gotoHome();
  }

  getAppSize() {
    const options = ["B", "KB", "MB"];
    const path = "/storage/js_apps/" + this.data.dirname;

    let val = FsUtils.sizeTree(path);
    let curr = 0;

    while (val > 800 && curr < options.length) {
      val = val / 1000;
      curr++;
    }

    return Math.round(val * 100) / 100 + " " + options[curr];
  }
}
