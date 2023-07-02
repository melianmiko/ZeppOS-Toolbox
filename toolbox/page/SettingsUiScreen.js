import {TouchEventManager} from "../../lib/TouchEventManager";
import { AppGesture } from "../../lib/AppGesture";

import {QS_BUTTONS} from "../utils/data";

const { config, t } = getApp()._options.globalData;

class SettingsUiScreen {
  constructor() {
    this.userTiels = null;
  }

  start () {
    const allowDanger = config.get("allowDanger", false);

    // Battety
    let withBattery = config.get("withBattery", false);
    const batteryToggle = hmUI.createWidget(hmUI.widget.IMG, {
      x: 60,
      y: 28,
      src: 'edit/battery_pv.png',
      alpha: withBattery ? 255 : 100
    });
    const batteryToggleEvents = new TouchEventManager(batteryToggle);
    batteryToggleEvents.ontouch = () => {
      withBattery = !withBattery;
      config.set("withBattery", withBattery);
      batteryToggle.setProperty(hmUI.prop.MORE, {
        alpha: withBattery ? 255 : 100
      })
    };

    // Brightness
    let withBrightness = config.get("withBrightness");
    const brightnessToggle = hmUI.createWidget(hmUI.widget.IMG, {
      x: 0,
      y: 72,
      src: "edit/brightness_cfg.png",
      alpha: withBrightness ? 255 : 100
    });
    const brightnessToggleEvents = new TouchEventManager(brightnessToggle);
    brightnessToggleEvents.ontouch = () => {
      withBrightness = !withBrightness
      config.set('withBrightness', withBrightness);
      brightnessToggle.setProperty(hmUI.prop.MORE, {
        alpha: withBrightness ? 255 : 100
      })
    };

    let i = 0;
    const tiles = config.get("tiles", []);
    Object.keys(QS_BUTTONS).forEach((id) => {
      const config = QS_BUTTONS[id];
      if(!config) return;
      if(config.danger && !allowDanger) return;

      const x = (i % 2) * 100;
      const y = 154 + Math.floor(i / 2) * 100;

      const btn = hmUI.createWidget(hmUI.widget.IMG, {
        x,
        y,
        w: 92,
        h: 92,
        alpha: tiles.indexOf(id) > -1 ? 255 : 100,
        src: `qs/${id}.png`,
      });

      const events = new TouchEventManager(btn);
      events.ontouch = () => {
        hmUI.showToast({text: config.title})
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

  _toggleTile(id, btn) {
    let tiles = config.get("tiles", []);
    const ind = tiles.indexOf(id);

    if(ind < 0) {
      tiles.push(id);
      btn.setProperty(hmUI.prop.MORE, {alpha: 255})
    } else {
      tiles = tiles.filter((i) => i !== id);
      console.log(tiles);
      btn.setProperty(hmUI.prop.MORE, {alpha: 100})
    }

    config.set("tiles", tiles);
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
});
