import {t, extendLocale} from "../lib/i18n";

extendLocale({
  "settings_ui": {
      "en-US": "Customize",
      "zh-CN": "定制",
      "zh-TW": "定制",
      "ru-RU": "Главная"
  },
  "settings_lang": {
      "en-US": "Language",
      "zh-CN": "语",
      "zh-TW": "語",
      "ru-RU": "Язык"
  },
  "action_info": {
      "en-US": "About",
      "zh-CN": "关于",
      "zh-TW": "關於",
      "ru-RU": "О Toolbox"
  }
})

class SettingsHomePage {
  ROW_ITEM = {
    type_id: 1,
    item_height: 64,
    item_bg_color: 0x222222,
    item_bg_radius: 12,
    text_view: [{
      x: 56,
      y: 0,
      w: 108,
      h: 64,
      key: "name",
      color: 0xffffff,
      text_size: 22
    }],
    text_view_count: 1,
    image_view: [{
      x: 16,
      y: 20,
      w: 24,
      h: 24,
      key: "icon"
    }],
    image_view_count: 1
  }

  ROWS = [
  	{
      name: t("settings_ui"), 
      target: "SettingsUiScreen", 
      icon: "menu/ui.png"
    },
  	{
      name: t("settings_lang"), 
      target: "SettingsLangScreen", 
      icon: "menu/lang.png"
    },
  	{
      name: t("action_info"), 
      target: "AboutScreen", 
      icon: "menu/info.png"
    },
  ];

  start() {
  	hmUI.createWidget(hmUI.widget.SCROLL_LIST, {
      x: 12,
      y: 64,
      w: 192-24,
      h: 362,
      item_space: 12,
      item_config: [this.ROW_ITEM],
      item_config_count: 1,
      item_click_func: (_, i) => this.onSelect(i),
      data_type_config: [{
      	start: 0,
      	end: this.ROWS.length-1,
      	type_id: 1
      }],
      data_type_config_count: 1,
      data_array: this.ROWS,
      data_count: this.ROWS.length
    })
  }

  onSelect(i) {
  	const data = this.ROWS[i];
    hmApp.gotoPage({
      url: `page/${data.target}`
    });
  }
}


let __$$app$$__ = __$$hmAppManager$$__.currentApp;
let __$$module$$__ = __$$app$$__.current;
__$$module$$__.module = DeviceRuntimeCore.Page({
  onInit(p) {
    this.screen = new SettingsHomePage();
    this.screen.start();
  }
});
