import {SettingsListScreen} from "../utils/SettingsListScreen";
import {FsUtils} from "../lib/FsUtils";

const preferedLang = [
    hmFS.SysProGetChars("mmk_tb_lang"),
    DeviceRuntimeCore.HmUtils.getLanguage(),
    "en-US"
];


class MenuScreen extends SettingsListScreen {
  constructor(pagename) {
    super();
    if(!pagename) pagename = "menu";
    this.pagename = pagename;
    this.root = `/storage/js_apps/2B8D8BAF`;

    const currentWF = hmFS.SysProGetInt("js_watchface_current_id");
    if(currentWF) {
      const hex = currentWF.toString(16).padStart(8, "0").toUpperCase();
      this.root = `/storage/js_watchfaces/${hex}`;
    }
  }

  build() {
    this._loadAll();

    if(!this.menuConfig) {
      this.text("Current watchface isn't supported.");
      return
    }

    for(const menuItem of this.menuConfig) {
      switch(menuItem.type) {
        case "headline":
          this.headline(this.t(menuItem.text));
          break;
        case "text":
          this.text(this.t(menuItem.text));
          break;
        case "checkbox":
          this.checkbox(this.t(menuItem.text), 
            this.config, 
            menuItem.key);
          break;
        case "color":
          this.clickableItem(this.t(menuItem.text), 
            "menu/color.png",
            this._mkColorClickHandler(menuItem.key));
          break;
        case "select":
          this._mkSelect(menuItem);
          break;
        default:
          console.log("Not supported", menuItem);
      }
    }
  }

  _mkSelect(menuItem) {
    const setScreenValue = this.field(this.t(menuItem.text),
      this.config[menuItem.key], () => {
        let index = menuItem.options.indexOf(this.config[menuItem.key]);
        index = (index + 1) % menuItem.options.length;

        this.config[menuItem.key] = menuItem.options[index];
        setScreenValue(menuItem.options[index]);
      });
  }

  _mkColorClickHandler(key) {
    return () => {
      hmApp.gotoPage({
        url: "page/ColorPickerScreen",
        param: key
      })
    };
  }

  _loadAll() {
    const pathMenu = `${this.root}/assets/cfg.${this.pagename}.json`;
    console.log(pathMenu);

    try {
      this.config = FsUtils.fetchJSON(`${this.root}/assets/cfg.json`);
      this.menuConfig = FsUtils.fetchJSON(pathMenu);
    } catch(e) {
      console.log(e);
      this.menuConfig = false;
    }
  }

  _isSupported() {
    const path = `${this.root}/assets/cfg.${this.pagename}.json`;
    const [st, e] = FsUtils.stat(path);
    return e === 0;
  }

  t(strings) {
    for(let ln of preferedLang) {
      if(strings[ln] === undefined) continue;
      return strings[ln];
    }

    return null;
  }

  save() {
    FsUtils.writeText(`${this.root}/assets/cfg.json`, 
      JSON.stringify(this.config));
  }
}


let current
let __$$app$$__ = __$$hmAppManager$$__.currentApp;
let __$$module$$__ = __$$app$$__.current;
__$$module$$__.module = DeviceRuntimeCore.Page({
  onInit(p) {
    hmSetting.setBrightScreen(300);
    current = new MenuScreen(p);
    current.start();
  },
  onDestroy() {
    current.save();
  }
});
