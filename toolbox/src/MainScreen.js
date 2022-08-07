class MainScreen {
  baseBrightnessConfig = {
    x: 12,
    y: 72,
    h: 80,
    radius: 8,
  };

  start() {
    this.drawBrightness();
    this.drawButtons();
  }

  _listTiles() {
    let tiles = ["apps", "files"]

    try {
      tiles = FsUtils.fetchJSON("settings.json").tiles;
    } catch(e) {
      console.warn(e);
    }

    return tiles;
  }

  drawButtons() {
    const tiles = this._listTiles();

    tiles.forEach((id, i) => {
      const config = QS_BUTTONS[id];
      if(!config) return;

      const x = 12 + (i % 2) * 90;
      const y = 164 + Math.floor(i / 2) * 90;

      hmUI.createWidget(hmUI.widget.IMG, {
        x,
        y,
        w: 78,
        h: 78,
        src: id + ".png",
      }).addEventListener(hmUI.event.CLICK_UP, () => {
        config.click();
      });
    });

    // Edit button
    const edit_y = 176 + Math.ceil(tiles.length / 2) * 90;
    hmUI.createWidget(hmUI.widget.TEXT, {
      x: 0,
      y: edit_y,
      w: 192,
      h: 72,
      align_h: hmUI.align.CENTER_H,
      align_v: hmUI.align.CENTER_V,
      text: "Customize",
      color: 0x999999
    }).addEventListener(hmUI.event.CLICK_UP, () => {
      gotoSubpage("customize");
    });
  }

  drawBrightness() {
    hmUI.createWidget(hmUI.widget.FILL_RECT, {
      ...this.baseBrightnessConfig,
      color: 0x222222,
      w: 168,
    });

    this.widgetBrightness = hmUI.createWidget(hmUI.widget.FILL_RECT, {
      ...this.baseBrightnessConfig,
      color: 0x555555,
      alpha: 80,
    });

    hmUI.createWidget(hmUI.widget.IMG, {
      ...this.baseBrightnessConfig,
      x: 20,
      y: this.baseBrightnessConfig.y + (80 - 36) / 2,
      alpha: 200,
      src: "brightness.png",
    });

    // Make click zones
    hmUI.createWidget(hmUI.widget.IMG, {
      ...this.baseBrightnessConfig,
      src: "",
      w: 56,
    }).addEventListener(hmUI.event.CLICK_UP, () => {
      const val = Math.max(hmSetting.getBrightness() - 10, 0);
      hmSetting.setBrightness(val);
      this._updateBrightness();
    });

    hmUI.createWidget(hmUI.widget.IMG, {
      ...this.baseBrightnessConfig,
      src: "",
      w: 56,
      x: 192 - 12 - 56,
    }).addEventListener(hmUI.event.CLICK_UP, () => {
      const val = Math.min(hmSetting.getBrightness() + 10, 100);
      hmSetting.setBrightness(val);
      this._updateBrightness();
    });

    this._updateBrightness();
  }

  _updateBrightness() {
    const val = 168 * (hmSetting.getBrightness() / 100);
    this.widgetBrightness.setProperty(hmUI.prop.MORE, {
      w: Math.max(val, 24),
      alpha: val == 0 ? 0 : 200,
    });
  }
}
