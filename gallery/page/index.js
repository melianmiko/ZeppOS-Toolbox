import { AppGesture } from "../../lib/AppGesture";

class Gallery {
  contents = [];

  constructor(path) {
    this.path = path;
    this.current = 0;
    this.view = null;
  }

  getSelfPath() {
    const pkg = hmApp.packageInfo();
    const idn = pkg.appId.toString(16).padStart(8, "0").toUpperCase();
    return "/storage/js_" + pkg.type + "s/" + idn;
  }

  start() {
    const absPath = this.getSelfPath() + "/assets/" + this.path;
    const [filenames, e] = hmFS.readdir(absPath);
    console.log(filenames);

    this.contents = filenames;
    if (this.contents.length < 1) {
      return;
    }

    // Inage view
    this.view = hmUI.createWidget(hmUI.widget.IMG, {
      x: 0,
      y: 0,
      w: 192,
      h: 490,
      src: this.path + "/" + this.contents[0],
    });

    // Switch handlers
    hmUI
      .createWidget(hmUI.widget.IMG, {
        x: 0,
        y: 64,
        w: 192,
        h: (490 - 64) / 2,
        src: "",
      })
      .addEventListener(hmUI.event.CLICK_UP, () => {
        this.switch(-1);
      });
    hmUI
      .createWidget(hmUI.widget.IMG, {
        x: 0,
        y: 64 + (490 - 64) / 2,
        w: 192,
        h: (490 - 64) / 2,
        src: "",
      })
      .addEventListener(hmUI.event.CLICK_UP, () => {
        this.switch(1);
      });
  }

  switch(delta) {
    const val = this.current + delta;
    if (!this.contents[val]) return;

    this.view.setProperty(hmUI.prop.MORE, {
      src: this.path + "/" + this.contents[val],
    });
    this.current = val;
    console.log(this.path + "/" + this.contents[val]);
  }
}

let __$$app$$__ = __$$hmAppManager$$__.currentApp;
let __$$module$$__ = __$$app$$__.current;
__$$module$$__.module = DeviceRuntimeCore.Page({
  onInit() {
    AppGesture.on("left", () => {
      hmApp.gotoPage({
        url: "page/AboutScreen",
      });
    });
    AppGesture.init();

    const gal = new Gallery("images");
    gal.start();
  }
});
