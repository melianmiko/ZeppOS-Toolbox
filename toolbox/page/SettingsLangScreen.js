
class SettingsLangScreen {
	start() {
		let current = hmFS.SysProGetChars("mmk_tb_lang");
		if(!current) current = "false";

		const data = {
			"false": "(system)",
      "en-US": "English",
      "zh-CN": "简体中文",
      "zh-TW": "繁體中文",
      "ru-RU": "Русский",
	  "de-de": "Deutsch"
		};

		let y = 64;
		for(let key in data) {
			this.makeRow(key, data[key], y, current === key);
			y += 76;
		}
	}

	makeRow(key, name, y, active) {
		hmUI.createWidget(hmUI.widget.BUTTON, {
			x: 8,
			y,
			w: 192-16,
			h: 64,
			press_color: active ? 0x09253b : 0x333333,
			normal_color: active ? 0x09253b : 0x222222,
			radius: 12,
			text: name,
			color: active ? 0x008fff : 0xffffff,
			click_func: () => {
				hmFS.SysProSetChars("mmk_tb_lang", key);
				hmApp.goBack();
			}
		})
	}
}

let __$$app$$__ = __$$hmAppManager$$__.currentApp;
let __$$module$$__ = __$$app$$__.current;
__$$module$$__.module = DeviceRuntimeCore.Page({
  onInit(p) {
    this.screen = new SettingsLangScreen();
    this.screen.start();
  }
});
