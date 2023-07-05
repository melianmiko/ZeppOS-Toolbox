import {ListScreen} from "../../lib/mmk/ListScreen";
import { AppGesture } from "../../lib/mmk/AppGesture";

const available_locales = {
  "en-US": "English",
  "es-ES": "Español",
  "de-DE": "Deutsch",
  "ru-RU": "Русский",
  "pt-BR": "Português",
  "zh-CN": "简体中文",
  "zh-TW": "繁體中文",
};

const { config } = getApp()._options.globalData;

class SettingsLangScreen extends ListScreen {
  constructor() {
    super();
    this.fontSize = config.get("fontSize", this.fontSize);
  }

	start() {
		this.current = config.get("locale", "false");
		if(!this.current) this.current = "false";

		const osLocale = DeviceRuntimeCore.HmUtils.getLanguage();

		this.localeRow(`System (${osLocale})`, 'false');
		this.headline("Supported:");

		for(let key in available_locales)
			this.localeRow(available_locales[key], key);
    this.offset();
	}

	localeRow(prettyName, key) {
		const active = this.current == key;
    this.row({
      text: prettyName,
      icon: `menu/cb_${active}.png`,
      callback: () => {
        config.set("locale", key);
  			hmApp.goBack();
  		}
    });
	}
}

Page({
  onInit(p) {
    AppGesture.withYellowWorkaround("left", {
      appid: 33904,
      url: "page/SettingsLangScreen",
    });
    AppGesture.init();

    this.screen = new SettingsLangScreen();
    this.screen.start();
  }
});
