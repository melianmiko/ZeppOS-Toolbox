import {FsUtils} from "../lib/FsUtils";
import {t} from "../lib/i18n";
import {TouchEventManager} from "../lib/TouchEventManager";
import {QS_BUTTONS, DEFAULT_SETTINGS} from "../utils/data";

class SettingsUiScreen {
  userTiels = null;
  settings = null;

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
      x: 12,
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

      const x = 12 + (i % 2) * 90;
      const y = 164 + Math.floor(i / 2) * 90;

      const btn = hmUI.createWidget(hmUI.widget.IMG, {
        x,
        y,
        w: 78,
        h: 78,
        alpha: this.settings.tiles.indexOf(id) > -1 ? 255 : 100,
        src: "qs/" + id + ".png",
      });

      const events = new TouchEventManager(btn);
      events.ontouch = () => {
        hmUI.showToast({text: t("qs_" + id)})
        this._toggleTile(id, btn);
      };

      i++;
    });

    // Screen overflow
    const end_y = 176 + Math.ceil(Object.keys(QS_BUTTONS).length / 2) * 90;
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
let __$$app$$__ = __$$hmAppManager$$__.currentApp;
let __$$module$$__ = __$$app$$__.current;
__$$module$$__.module = DeviceRuntimeCore.Page({
  onInit(p) {
    screen = new SettingsUiScreen();
    screen.start();
  },
  onDestroy: () => {
    screen.finish();
  }
});
