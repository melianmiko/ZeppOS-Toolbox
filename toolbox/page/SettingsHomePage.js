import { t, extendLocale } from "../lib/i18n";
import { SettingsListScreen } from "../utils/SettingsListScreen";

extendLocale({
  cfg_timer_keep: {
    "en-US": "Keep last timer value",
    "zh-CN": "保留最后一个计时器值",
    "zh-TW": "保留最後一個計時器值",
    "ru-RU": "Запоминать посл. таймер",
    "de-DE": "Letzten Timerwert bebehalten"
  },
  cfg_fs_unit: {
    "en-US": "Use Base-2 filesize\n1KB = 1024 B",
    "zh-CN": "使用 Base-2 文件大小\n1KB = 1024 B",
    "zh-TW": "使用 Base-2 文件大小\n1KB = 1024 B",
    "ru-RU": "Считать размер файлов в осн. 2\n1KB = 1024 B",
    "de-DE": "Base-2 Dateigröße\n1KB = 1024 B"
  },
  cfg_danger_mode: {
    "en-US": "Show danger features",
    "ru-RU": "Разрешить опасные функции"
  },
  settings_ui: {
    "en-US": "Customize",
    "zh-CN": "定制",
    "zh-TW": "定製",
    "ru-RU": "Главная",
    "de-DE": "Anpassen"
  },
  settings_lang: {
    "en-US": "Language",
    "zh-CN": "语言",
    "zh-TW": "語言",
    "ru-RU": "Язык",
    "de-DE": "Sprache"
  },
  action_info: {
    "en-US": "About",
    "zh-CN": "关于",
    "zh-TW": "關於",
    "ru-RU": "О Toolbox",
    "de-DE": "Über..."
  },
});

class SettingsHomePage extends SettingsListScreen {
  build() {
    this.clickableItem(t("settings_ui"), "menu/ui.png", () =>
      this.openPage("SettingsUiScreen")
    );
    this.clickableItem(t("settings_lang"), "menu/lang.png", () =>
      this.openPage("SettingsLangScreen")
    );

    this.propCheckbox(t("cfg_timer_keep"), "mmk_tb_cfg_timer_keep", true);
    this.propCheckbox(t("cfg_fs_unit"), "mmk_tb_fs_unit", false);

    const allowDanger = !!hmFS.SysProGetBool("mmk_tb_danger_mode");
    this.clickableItem(t("cfg_danger_mode"), `menu/cb_${allowDanger}.png`, () => {
      hmApp.gotoPage({url: "page/ToggleDanger"});
    })

    this.clickableItem(t("action_info"), "menu/info.png", () =>
      this.openPage("AboutScreen")
    );
  }

  openPage(id) {
    hmApp.gotoPage({ url: "page/" + id });
  }
}

let __$$app$$__ = __$$hmAppManager$$__.currentApp;
let __$$module$$__ = __$$app$$__.current;
__$$module$$__.module = DeviceRuntimeCore.Page({
  onInit(p) {
    this.screen = new SettingsHomePage();
    this.screen.start();
  },
});
