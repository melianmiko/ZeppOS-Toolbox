import {FsTools} from "../../lib/mmk/Path";
import { AppGesture } from "../../lib/mmk/AppGesture";
import { WIDGET_WIDTH, SCREEN_HEIGHT, SCREEN_WIDTH, SCREEN_MARGIN_X, SCREEN_MARGIN_Y } from "../../lib/mmk/UiParams";
import { deviceName, deviceClass } from "../../lib/mmk/DeviceIdentifier";

const { config, t } = getApp()._options.globalData;

class StorageInfoScreen {
  renderVerticalCup(config, storage) {
    const cupStyle = {
      x: SCREEN_MARGIN_X + 24,
      y: 48,
      w: 32,
      h: SCREEN_HEIGHT - 96,
      color: 0x111111
    };

    hmUI.createWidget(hmUI.widget.FILL_RECT, cupStyle);

    let usedY = 0;
    for (let i in config) {
      const currentRow = config[i];
      if(storage[currentRow.key] == 0) continue;

      if (currentRow.key != "free" && currentRow.key != "total") {
        let height = Math.round(
          cupStyle.h * (storage[currentRow.key] / storage.total)
        );
        if(height < 2) continue;

        hmUI.createWidget(hmUI.widget.FILL_RECT, {
          ...(cupStyle),
          y: cupStyle.y + cupStyle.h - usedY - height,
          h: height,
          color: currentRow.color,
        });

        usedY += height;
      }
    }

    this.posY = SCREEN_MARGIN_Y / 2;
    this.posX = SCREEN_MARGIN_X + 24 + 48;
  }

  renderLineCup(config, storage) {
    const cupStyle = {
      x: SCREEN_MARGIN_X,
      y: SCREEN_MARGIN_Y + 24,
      w: WIDGET_WIDTH,
      h: 32,
      color: 0x111111
    };

    hmUI.createWidget(hmUI.widget.FILL_RECT, cupStyle);

    let usedX = 0;
    for (let i in config) {
      const currentRow = config[i];
      if(storage[currentRow.key] == 0) continue;

      if (currentRow.key != "free" && currentRow.key != "total") {
        let width = Math.round(
          cupStyle.w * (storage[currentRow.key] / storage.total)
        );
        if(width < 2) continue;

        hmUI.createWidget(hmUI.widget.FILL_RECT, {
          ...(cupStyle),
          x: cupStyle.x + usedX,
          w: width,
          color: currentRow.color,
        });

        usedX += width;
      }
    }

    this.posX = SCREEN_MARGIN_X;
    this.posY = SCREEN_MARGIN_Y + 72;
  }

  start() {
    const storage = hmSetting.getDiskInfo();
    const config = [
      {
        key: "total",
        label: t("Total"),
        color: 0x999999,
      },
      {
        key: "free",
        label: t("Free"),
        color: 0xAAAAAA,
      },
      {
        key: "system",
        label: t("ZeppOS"),
        color: 0xFFCC80
      },
      {
        key: "watchface",
        label: t("Watchfaces"),
        color: 0x4fc3f7,
      },
      {
        key: "app",
        label: t("Apps"),
        color: 0xFFAB91,
      },
      {
        key: "unknown",
        label: t("Unknown"),
        color: 0x616161,
      },
    ];

    // Calc unknown
    storage.unknown = storage.total;
    for(let i in config)
      if(config[i].key !== "total" && config[i].key !== "unknown") 
        storage.unknown -= storage[config[i].key]

    // Graphics
    if(deviceClass == "band" || deviceClass == "miband") {
      this.renderVerticalCup(config, storage);
    } else {
      this.renderLineCup(config, storage);
    }

    // Text
    const compactRows = deviceName == "Band 7";
    const rowWidth = deviceClass == "band" || deviceClass == "miband" ? 120 : 160;
    const actualWidth = SCREEN_WIDTH - this.posX * 2;
    const columns = Math.max(1, Math.floor((actualWidth) / (rowWidth)));
    this.posX += Math.max(0, Math.floor((actualWidth - rowWidth * columns) / 2));
    console.log(columns);
    for (let i in config) {
      const currentRow = config[i];
      if(storage[currentRow.key] == 0) continue;

      // Text
      hmUI.createWidget(hmUI.widget.TEXT, {
        x: this.posX + (i % columns) * (rowWidth + 4) - 2,
        y: this.posY + Math.floor(i / columns) * (compactRows ? 56 : 64),
        w: rowWidth,
        h: 24,
        text_size: 18,
        color: currentRow.color,
        text: currentRow.label,
        align_h: hmUI.align.CENTER_H,
      });
      hmUI.createWidget(hmUI.widget.TEXT, {
        x: this.posX + (i % columns) * (rowWidth + 4),
        y: this.posY + Math.floor(i / columns) * (compactRows ? 56 : 64) + 24,
        w: rowWidth,
        h: compactRows ? 32 : 48,
        text_size: 24,
        color: 0xffffff,
        text: FsTools.printBytes(storage[currentRow.key]),
        align_h: hmUI.align.CENTER_H,
      });
    }
  }
}

Page({
  onInit(p) {
    AppGesture.withYellowWorkaround("left", {
      appid: 33904,
      url: "page/StorageInfoScreen",
    });
    AppGesture.init();

    new StorageInfoScreen().start();
  }
});
