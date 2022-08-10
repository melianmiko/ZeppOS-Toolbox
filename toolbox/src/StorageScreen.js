class StorageScreen {
  cupStyle = {
    x: 16,
    y: 72,
    w: 32,
    h: 320,
    color: 0x111111
  }

  printBytes(val) {
    const options = ["B", "KB", "MB"];
    let curr = 0;

    while (val > 800 && curr < options.length) {
      val = val / 1000;
      curr++;
    }

    return Math.round(val * 100) / 100 + " " + options[curr];
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
        text: this.printBytes(storage[currentRow.key]),
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