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

      const widgetConfig = {
        x: 12 + (i % 2) * 90,
        y: topOffset + Math.floor(i / 2) * 90,
        w: 78,
        h: 78,
        src: id + ".png",
      }

      const widget = hmUI.createWidget(hmUI.widget.IMG, widgetConfig);
      const events = new TouchEventManager(widget);

      events.ontouch = () => {
        config.click();
      };
      events.onlongtouch = () => {
        gotoSubpage("customize");
      };
    });

    // Edit button
    const editButton = hmUI.createWidget(hmUI.widget.TEXT, {
      x: 0,
      y: topOffset + 12 + Math.ceil(tiles.length / 2) * 90,
      w: 192,
      h: 72,
      align_h: hmUI.align.CENTER_H,
      align_v: hmUI.align.CENTER_V,
      text: t("action_customize"),
      color: 0x999999
    });
    const editButtonEvents = new TouchEventManager(editButton);
    editButtonEvents.ontouch = () => {
      gotoSubpage("customize");
    }

    // Info button
    const infoButton = hmUI.createWidget(hmUI.widget.IMG, {
      x: 0,
      y: topOffset + 84 + Math.ceil(tiles.length / 2) * 90,
      w: 192,
      h: 48,
      pos_x: (192-24)/2,
      pos_y: 12,
      src: "info.png"
    });
    const infoButtonEvents = new TouchEventManager(infoButton);
    infoButtonEvents.ontouch = () => {
      gotoSubpage("about");
    };
  }

  drawBrightness() {
    hmUI.createWidget(hmUI.widget.FILL_RECT, {
      ...this.baseBrightnessConfig,
      color: 0x222222,
      w: 168
    });

    this.widgetBrightness = hmUI.createWidget(hmUI.widget.FILL_RECT, {
      ...this.baseBrightnessConfig,
      color: 0x555555,
      alpha: 80,
      w: 10
    });

    const basement = hmUI.createWidget(hmUI.widget.IMG, {
      ...this.baseBrightnessConfig,
      w: 168,
      pos_x: 8,
      pos_y: 22,
      alpha: 200,
      src: "brightness.png",
    });

    // Events
    const handleChange = (e) => {
      const delta = e.x > 96 ? 1 : -1;

      let val = hmSetting.getBrightness() + (5 * delta);
      val = Math.min(Math.max(0, val), 100);

      hmSetting.setBrightness(val);
      this._updateBrightness();
    };

    const events = new TouchEventManager(basement);
    events.ontouch = handleChange;
    events.onlongtouch = handleChange;
    events.onlongtouchrepeatly = handleChange;

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
