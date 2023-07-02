import { t, extendLocale } from "../../lib/mmk/i18n";
import { ListScreen } from "../../lib/mmk/ListScreen";
import { AppGesture } from "../../lib/mmk/AppGesture";

import { SETTINGS_HOME_TRANSLATIONS, QS_TILE_NAMES } from "../utils/translations";
import {openPage} from "../utils/misc";

extendLocale(SETTINGS_HOME_TRANSLATIONS);
extendLocale(QS_TILE_NAMES);

export class SettingsHomePage extends ListScreen {
  start() {
    this.row({
      text: t("action_info"),
      icon: "menu/info.png",
      callback: () => openPage("AboutScreen")
    })

    this.headline(t("headline_all_tools"));
    this.row({
      text: t("qs_apps"),
      icon: "menu/apps.png",
      callback: () => openPage("AppListScreen")
    })
    this.row({
      text: t("qs_files"),
      icon: "menu/files.png",
      callback: () => openPage("FileManagerScreen")
    })
    this.row({
      text: t("qs_storage"),
      icon: "menu/storage.png",
      callback: () => openPage("StorageInfoScreen")
    })
    this.row({
      text: t("qs_timer"),
      icon: "menu/timer.png",
      callback: () => openPage("TimerSetScreen")
    })

    this.headline(t("headline_settings"));
    this.row({
      text: t("settings_ui"),
      icon: "menu/ui.png",
      callback: () => openPage("SettingsUiScreen")
    })
    this.row({
      text: t("settings_lang"),
      icon: "menu/lang.png",
      callback: () => openPage("SettingsLangScreen")
    })
    this.row({
      text: t("settings_misc"),
      icon: "menu/settings_misc.png",
      callback: () => openPage("SettingsMiscPage")
    });

    this.offset();
  }
}

Page({
  onInit(p) {
    AppGesture.withYellowWorkaround("left", {
      appid: 33904,
      url: "page/SettingsHomePage",
    });
    AppGesture.init();

    this.screen = new SettingsHomePage();
    this.screen.start();
  },
});
