import {SettingsListScreen} from "../../lib/SettingsListScreen";
import { AppGesture } from "../../lib/AppGesture";

const available_locales = {
  "en-US": "English",
  "es-ES": "Español",
  "de-DE": "Deutsch",
  "ru-RU": "Русский",
  "pt-BR": "Português",
  "zh-CN": "简体中文",
  "zh-TW": "繁體中文",
};

class SettingsLangScreen extends SettingsListScreen {
	build() {
		this.current = hmFS.SysProGetChars("mmk_tb_lang");
		if(!this.current) this.current = "false";

		const osLocale = DeviceRuntimeCore.HmUtils.getLanguage();

		this.localeRow(`System (${osLocale})`, 'false');
		this.headline("Supported:");

		for(let key in available_locales)
			this.localeRow(available_locales[key], key);
	}

	localeRow(prettyName, key) {
		const active = this.current == key;
		this.clickableItem(prettyName, `menu/cb_${active}.png`, () => {
			hmFS.SysProSetChars("mmk_tb_lang", key);
			hmApp.goBack();
		});
	}
}

let __$$app$$__ = __$$hmAppManager$$__.currentApp;
let __$$module$$__ = __$$app$$__.current;
__$$module$$__.module = DeviceRuntimeCore.Page({
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
