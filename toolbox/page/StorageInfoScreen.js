import {FsUtils} from "../../lib/FsUtils";
import {t, extendLocale} from "../../lib/i18n";
import { AppGesture } from "../../lib/AppGesture";

import {STORAGE_INFO_TRANSLATIONS} from "../utils/translations";

extendLocale(STORAGE_INFO_TRANSLATIONS);

class StorageInfoScreen {
  cupStyle = {
    x: 16,
    y: 72,
    w: 32,
    h: 320,
    color: 0x111111
  }

  start() {
    const storage = hmSetting.getDiskInfo();
    const config = [
      {
        key: "total",
        color: 0x999999,
      },
      {
        key: "free",
        color: 0xAAAAAA,
      },
      {
        key: "system",
        color: 0xFFCC80
      },
      {
        key: "watchface",
        color: 0x4fc3f7,
      },
      {
        key: "app",
        color: 0xFFAB91,
      },
      {
        key: "unknown",
        color: 0x616161,
      },
    ];

    // Calc unknown
    storage.unknown = storage.total;
    for(let i in config)
      if(config[i].key !== "total" && config[i].key !== "unknown") 
        storage.unknown -= storage[config[i].key]

    let posY = 56, usedY = 0;

    hmUI.createWidget(hmUI.widget.FILL_RECT, this.cupStyle);

    for (let i in config) {
      const currentRow = config[i];
      if(storage[currentRow.key] == 0) continue;

      // Text
      hmUI.createWidget(hmUI.widget.TEXT, {
        x: 72,
        y: posY,
        w: 120,
        h: 24,
        color: currentRow.color,
        text: t("storage_" + currentRow.key),
      });
      hmUI.createWidget(hmUI.widget.TEXT, {
        x: 72,
        y: posY + 24,
        w: 120,
        h: 48,
        text_size: 24,
        color: 0xffffff,
        text: FsUtils.printBytes(storage[currentRow.key]),
      });
      posY += 64;

      // Visual
      if (currentRow.key != "free" && currentRow.key != "total") {
        let height = Math.round(
          this.cupStyle.h * (storage[currentRow.key] / storage.total)
        );
        if(height < 2) continue;

        hmUI.createWidget(hmUI.widget.FILL_RECT, {
          ...(this.cupStyle),
          y: this.cupStyle.y + this.cupStyle.h - usedY - height,
          h: height,
          color: currentRow.color,
        });

        usedY += height;
      }
    }
  }
}


let __$$app$$__ = __$$hmAppManager$$__.currentApp;
let __$$module$$__ = __$$app$$__.current;
__$$module$$__.module = DeviceRuntimeCore.Page({
  onInit(p) {
    AppGesture.withYellowWorkaround("left", {
      appid: 33904,
      url: "page/StorageInfoScreen",
    });
    AppGesture.init();

    new StorageInfoScreen().start();
  }
});
