import { ListScreen } from "../lib/mmk/ListScreen";
import { AppGesture } from "../lib/mmk/AppGesture";
import { IS_LOW_RAM_DEVICE } from "../lib/mmk/UiParams";

import {openPage} from "../utils/misc";

const { config, t } = getApp()._options.globalData;

class SettingsHomePage extends ListScreen {
  constructor() {
    super();
    this.fontSize = config.get("fontSize", this.fontSize);
  }

  start() {
    this.row({
      text: t("About"),
      icon: "menu/info.png",
      callback: () => openPage("AboutScreen")
    })

    this.headline(t("All tools:"));
    this.row({
      text: t("Apps manager"),
      icon: "menu/apps.png",
      callback: () => openPage("AppListScreen")
    });
    this.row({
      text: t("File manager"),
      icon: "menu/files.png",
      callback: () => openPage("FileManagerScreen")
    });
    this.row({
      text: t("Remote manager"),
      icon: "menu/remman.png",
      callback: () => openPage("RemoteManScreen")
    });
    this.row({
      text: t("Disk usage"),
      icon: "menu/storage.png",
      callback: () => openPage("StorageInfoScreen")
    });
    if(IS_LOW_RAM_DEVICE) this.row({
      text: t("Background timer"),
      icon: "menu/timer.png",
      callback: () => openPage("TimerSetScreen")
    });

    this.headline(t("Settings:"));
    this.row({
      text: t("Customize"),
      icon: "menu/ui.png",
      callback: () => openPage("SettingsUiScreen")
    });
    this.row({
      text: t("Font size"),
      icon: "menu/font_size.png",
      callback: () => {
        openPage("SettingsFontSize")
      }
    })
    this.row({
      text: t("Language"),
      icon: "menu/lang.png",
      callback: () => openPage("SettingsLangScreen")
    });
    this.row({
      text: t("Preferences"),
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
