import { t, extendLocale } from "../../lib/i18n";
import { SettingsListScreen } from "../../lib/SettingsListScreen";
import { AppGesture } from "../../lib/AppGesture";

import { SETTINGS_HOME_TRANSLATIONS, QS_TILE_NAMES } from "../utils/translations";
import {openPage} from "../utils/misc";

extendLocale(SETTINGS_HOME_TRANSLATIONS);
extendLocale(QS_TILE_NAMES);

export class SettingsHomePage extends SettingsListScreen {
  build() {
    this.clickableItem(t("action_info"), "menu/info.png", () =>
      openPage("AboutScreen")
    );

    this.headline(t("headline_all_tools"));
    this.clickableItem(t("qs_apps"), "menu/apps.png", () =>
      openPage("AppListScreen")
    );
    this.clickableItem(t("qs_files"), "menu/files.png", () =>
      openPage("FileManagerScreen")
    );
    this.clickableItem(t("qs_storage"), "menu/storage.png", () =>
      openPage("StorageInfoScreen")
    );
    this.clickableItem(t("qs_timer"), "menu/timer.png", () =>
      openPage("TimerSetScreen")
    );

    this.headline(t("headline_settings"));
    this.clickableItem(t("settings_ui"), "menu/ui.png", () =>
      openPage("SettingsUiScreen")
    );
    this.clickableItem(t("settings_lang"), "menu/lang.png", () =>
      openPage("SettingsLangScreen")
    );
    this.clickableItem(t("settings_misc"), "menu/settings_misc.png", () =>
      openPage("SettingsMiscPage")
    );
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
