import {FsUtils} from "../../lib/FsUtils";
import {t} from "../../lib/i18n";
import {TouchEventManager} from "../../lib/TouchEventManager";
import { AppGesture } from "../../lib/AppGesture";

import {QS_BUTTONS, DEFAULT_SETTINGS} from "../utils/data";

class SettingsUiScreen {
  constructor() {
    this.userTiels = null;
    this.settings = null;
  }

  _load() {
    try {
      this.settings = FsUtils.fetchJSON("/storage/mmk_tb_layout.json");
    } catch(e) {
      console.log(e);
      this.settings = DEFAULT_SETTINGS;
    }
  }

  start () {
    this._load();
    this.allowDanger = hmFS.SysProGetBool("mmk_tb_danger_mode");

    // Battety
    const batteryToggle = hmUI.createWidget(hmUI.widget.IMG, {
      x: 60,
      y: 28,
      src: 'edit/battery_pv.png',
      alpha: this.settings.withBattery ? 255 : 100
    });
    const batteryToggleEvents = new TouchEventManager(batteryToggle);
    batteryToggleEvents.ontouch = () => {
      this.settings.withBattery = !this.settings.withBattery;
      batteryToggle.setProperty(hmUI.prop.MORE, {
        alpha: this.settings.withBattery ? 255 : 100
      })
    };

    // Brightness
    const brightnessToggle = hmUI.createWidget(hmUI.widget.IMG, {
      x: 0,
      y: 72,
      src: "edit/brightness_cfg.png",
      alpha: this.settings.withBrightness ? 255 : 100
    });
    const brightnessToggleEvents = new TouchEventManager(brightnessToggle);
    brightnessToggleEvents.ontouch = () => {
      this.settings.withBrightness = !this.settings.withBrightness;
      brightnessToggle.setProperty(hmUI.prop.MORE, {
        alpha: this.settings.withBrightness ? 255 : 100
      })
    };

    let i = 0;
    Object.keys(QS_BUTTONS).forEach((id) => {
      const config = QS_BUTTONS[id];
      if(!config) return;
      if(config.danger && !this.allowDanger) return;

      const x = (i % 2) * 100;
      const y = 154 + Math.floor(i / 2) * 100;

      const btn = hmUI.createWidget(hmUI.widget.IMG, {
        x,
        y,
        w: 92,
        h: 92,
        alpha: this.settings.tiles.indexOf(id) > -1 ? 255 : 100,
        src: `qs/${id}.png`,
      });

      const events = new TouchEventManager(btn);
      events.ontouch = () => {
        hmUI.showToast({text: t("qs_" + id)})
        this._toggleTile(id, btn);
      };

      i++;
    });

    // Screen overflow
    const end_y = 166 + Math.ceil(Object.keys(QS_BUTTONS).length / 2) * 100;
    hmUI.createWidget(hmUI.widget.TEXT, {
      x: 0,
      y: end_y,
      w: 192,
      h: 72,
      text: ""
    });
  }

  finish() {
    FsUtils.writeText("/storage/mmk_tb_layout.json", JSON.stringify(this.settings));
  }

  _toggleTile(id, btn) {
    const ind = this.settings.tiles.indexOf(id);

    if(ind < 0) {
      this.settings.tiles.push(id);
      btn.setProperty(hmUI.prop.MORE, {alpha: 255})
    } else {
      this.settings.tiles = this.settings.tiles.filter((i) => i !== id);
      console.log(this.settings.tiles);
      btn.setProperty(hmUI.prop.MORE, {alpha: 100})
    }
  }
}


let screen;
Page({
  onInit(p) {
    AppGesture.withYellowWorkaround("left", {
      appid: 33904,
      url: "page/SettingsUiScreen",
    });
    AppGesture.init();

    screen = new SettingsUiScreen();
    screen.start();
  },
  onDestroy: () => {
    screen.finish();
  }
});
