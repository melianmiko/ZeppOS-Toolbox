import {FsUtils} from "../lib/FsUtils";
import {TouchEventManager} from "../lib/TouchEventManager";

class ColorPickerScreen {
  constructor(key) {
    this.key = key;
    this.root = `/storage/js_apps/2B8D8BAF`;

    const currentWF = hmFS.SysProGetInt("js_watchface_current_id");
    if(currentWF) {
      const hex = currentWF.toString(16).padStart(8, "0").toUpperCase();
      this.root = `/storage/js_watchfaces/${hex}`;
    }
  }

  start() {
    this._loadAll();

    this.preview = hmUI.createWidget(hmUI.widget.FILL_RECT, {
      x: 0,
      y: 96,
      w: 192,
      h: 64,
      color: this.getColor()
    })

    this._makeChannelUI("r", 0);
    this._makeChannelUI("g", 1);
    this._makeChannelUI("b", 2);
  }

  getColor() {
    return (this.color.r << 16) +
      (this.color.g << 8) +
      (this.color.b);
  }

  _makeChannelUI(key, pos) {
    const text = hmUI.createWidget(hmUI.widget.TEXT, {
      x: pos * 64,
      y: 250,
      w: 64,
      h: 48,
      text: String(this.color[key]),
      align_h: hmUI.align.CENTER_H,
      text_size: 30,
      color: 0xFFFFFF
    });

    const upBtn = hmUI.createWidget(hmUI.widget.TEXT, {
      x: pos * 64,
      y: 200,
      w: 64,
      h: 64,
      align_v: hmUI.align.CENTER_V,
      align_h: hmUI.align.CENTER_H,
      text_size: 24,
      color: 0xAAAAAA,
      text: "+"
    });
    const downBtn = hmUI.createWidget(hmUI.widget.TEXT, {
      x: pos * 64,
      y: 280,
      w: 64,
      h: 64,
      align_v: hmUI.align.CENTER_V,
      align_h: hmUI.align.CENTER_H,
      text_size: 24,
      color: 0xAAAAAA,
      text: "-"
    });

    const change = (delta) => {
      const v = Math.max(0, Math.min(this.color[key] + delta, 255));
      this.color[key] = v;

      text.setProperty(hmUI.prop.TEXT, String(v));

      this.preview.setProperty(hmUI.prop.MORE, {
        color: this.getColor()
      })
    }

    const upEvents = new TouchEventManager(upBtn);
    upEvents.ontouch = () => change(1);
    upEvents.onlongtouchrepeatly = () => change(2);

    const downEvents = new TouchEventManager(downBtn);
    downEvents.ontouch = () => change(-1);
    downEvents.onlongtouchrepeatly = () => change(-2);
  }

  save() {
    this.config[this.key] = this.getColor();
    FsUtils.writeText(`${this.root}/assets/cfg.json`, 
      JSON.stringify(this.config));
  }

  _loadAll() {
    try {
      this.config = FsUtils.fetchJSON(`${this.root}/assets/cfg.json`);

      const val = this.config[this.key];
      this.color = {
        r: (val & 0xFF0000) >> 16,
        g: (val & 0xFF00) >> 8,
        b: val & 0xFF
      };

      console.log(this.color);
    } catch(e) {
      console.log("err", e);
    }
  }
}

let current
let __$$app$$__ = __$$hmAppManager$$__.currentApp;
let __$$module$$__ = __$$app$$__.current;
__$$module$$__.module = DeviceRuntimeCore.Page({
  onInit(p) {
    hmSetting.setBrightScreen(300);
    current = new ColorPickerScreen(p);
    current.start();
  },
  onDestroy() {
    current.save();
  }
});
