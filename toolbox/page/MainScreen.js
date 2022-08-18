import {FsUtils} from "../lib/FsUtils";
import {t, extendLocale} from "../lib/i18n";
import {TouchEventManager} from "../lib/TouchEventManager";
import {QS_BUTTONS} from "../utils/QS_BUTTONS";

extendLocale({
  "action_customize": {
      "en-US": "Settings",
      "zh-CN": "设置",
      "zh-TW": "設置",
      "ru-RU": "Настроить"
  }
});

class MainScreen {
  baseBrightnessConfig = {
    x: 12,
    y: 72,
    h: 80,
    radius: 8,
  };

  _getSettings() {
    let settings = {
      tiles: ["apps", "files"],
      withBrightness: true,
      withBattery: false
    };

    try {
      settings = FsUtils.fetchJSON("settings.json");
    } catch(e) {
      console.log(e);
    }

    return settings;
  }

  start() {
    const {tiles, withBrightness, withBattery} = this._getSettings();
    const topOffset = withBrightness ? 164 : 72

    if(withBattery) this.drawBattery();
    if(withBrightness) this.drawBrightness();
    this.drawButtons(tiles, topOffset);
  }

  drawBattery() {
    const battery = hmSensor.createSensor(hmSensor.id.BATTERY);
    const value = battery.current + "%";

    hmUI.createWidget(hmUI.widget.IMG, {
      x: 60,
      y: 28,
      src: "battery.png"
    })
    hmUI.createWidget(hmUI.widget.TEXT, {
      x: 84,
      y: 28,
      w: 48,
      h: 24,
      text: value,
      color: 0x999999,
      align_h: hmUI.align.CENTER_H,
      align_v: hmUI.align.CENTER_V
    })
  }

  drawButtons(tiles, topOffset) {
    tiles.forEach((id, i) => {
      const config = QS_BUTTONS[id];
      if(!config) return;

      const widgetConfig = {
        x: 12 + (i % 2) * 90,
        y: topOffset + Math.floor(i / 2) * 90,
        w: 78,
        h: 78,
        src: "qs/" + id + ".png",
      }

      const widget = hmUI.createWidget(hmUI.widget.IMG, widgetConfig);
      const events = new TouchEventManager(widget);

      events.ontouch = () => {
        switch(config.type) {
          case "internal":
            hmApp.gotoPage({url: config.url});
            break;
          case "native":
            hmApp.startApp({url: config.url, native: true});
            break;
        }
      };
      
      events.onlongtouch = () => {
        hmApp.gotoPage({
          url: "page/SettingsUiScreen"
        })
      };
    });

    // Edit button
    const editButton = hmUI.createWidget(hmUI.widget.TEXT, {
      x: 0,
      y: topOffset + 12 + Math.ceil(tiles.length / 2) * 90,
      w: 192,
      h: 72,
      align_h: hmUI.align.CENTER_H,
      align_v: hmUI.align.CENTER_V,
      text: t("action_customize"),
      color: 0x999999
    });
    const editButtonEvents = new TouchEventManager(editButton);
    editButtonEvents.ontouch = () => {
      hmApp.gotoPage({
        url: "page/SettingsHomePage"
      })
    }
  }

  drawBrightness() {
    hmUI.createWidget(hmUI.widget.FILL_RECT, {
      ...this.baseBrightnessConfig,
      color: 0x222222,
      w: 168
    });

    this.widgetBrightness = hmUI.createWidget(hmUI.widget.FILL_RECT, {
      ...this.baseBrightnessConfig,
      color: 0x555555,
      alpha: 80,
      w: 10
    });

    const basement = hmUI.createWidget(hmUI.widget.IMG, {
      ...this.baseBrightnessConfig,
      w: 168,
      pos_x: 8,
      pos_y: 22,
      alpha: 200,
      src: "brightness.png",
    });

    // Events
    const handleChange = (e) => {
      const delta = e.x > 96 ? 1 : -1;

      let val = hmSetting.getBrightness() + (5 * delta);
      val = Math.min(Math.max(0, val), 100);

      hmSetting.setBrightness(val);
      this._updateBrightness();
    };

    const events = new TouchEventManager(basement);
    events.ontouch = handleChange;
    events.onlongtouch = handleChange;
    events.onlongtouchrepeatly = handleChange;

    this._updateBrightness();
  }

  _updateBrightness() {
    const val = 168 * (hmSetting.getBrightness() / 100);
    this.widgetBrightness.setProperty(hmUI.prop.MORE, {
      w: Math.max(val, 24),
      alpha: val == 0 ? 0 : 200,
    });
  }
}


let __$$app$$__ = __$$hmAppManager$$__.currentApp;
let __$$module$$__ = __$$app$$__.current;
__$$module$$__.module = DeviceRuntimeCore.Page({
  onInit(p) {
    new MainScreen().start();
  }
});
