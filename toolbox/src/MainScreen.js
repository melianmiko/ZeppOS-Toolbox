class MainScreen {
  baseBrightnessConfig = {
    x: 12,
    y: 72,
    h: 80,
    radius: 8,
  };

  _getSettings() {
    let settings = {
      tiles: ["apps", "files"],
      withBrightness: true
    };

    try {
      settings = FsUtils.fetchJSON("settings.json");
    } catch(e) {
      console.log(e);
    }

    return settings;
  }

  start() {
    const {tiles, withBrightness} = this._getSettings();
    const topOffset = withBrightness ? 164 : 72

    if(withBrightness) this.drawBrightness();
    this.drawButtons(tiles, topOffset);
  }

  drawButtons(tiles, topOffset) {
    tiles.forEach((id, i) => {
      const config = QS_BUTTONS[id];
      if(!config) return;

      const x = 12 + (i % 2) * 90;
      const y = topOffset + Math.floor(i / 2) * 90;

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
    const edit_y = topOffset + 12 + Math.ceil(tiles.length / 2) * 90;
    hmUI.createWidget(hmUI.widget.TEXT, {
      x: 0,
      y: edit_y,
      w: 192,
      h: 72,
      align_h: hmUI.align.CENTER_H,
      align_v: hmUI.align.CENTER_V,
      text: t("action_customize"),
      color: 0x999999
    }).addEventListener(hmUI.event.CLICK_UP, () => {
      gotoSubpage("customize");
    });

    // Copyright
    hmUI.createWidget(hmUI.widget.IMG, {
      x: 0,
      y: edit_y + 72,
      w: 192,
      h: 48,
      pos_x: (192-24)/2,
      pos_y: 12,
      src: "info.png"
    }).addEventListener(hmUI.event.CLICK_UP, () => {
      gotoSubpage("about");
    })
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
      w: 84,
    }).addEventListener(hmUI.event.CLICK_UP, () => {
      const val = Math.max(hmSetting.getBrightness() - 10, 0);
      hmSetting.setBrightness(val);
      this._updateBrightness();
    });

    hmUI.createWidget(hmUI.widget.IMG, {
      ...this.baseBrightnessConfig,
      src: "",
      w: 84,
      x: 96,
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
