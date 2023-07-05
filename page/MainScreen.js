import {TouchEventManager} from "../lib/mmk/TouchEventManager";
import { AppGesture } from "../lib/mmk/AppGesture";
import { WIDGET_WIDTH, SCREEN_WIDTH, SCREEN_MARGIN_X, IS_LOW_RAM_DEVICE } from "../lib/mmk/UiParams";
import { deviceName } from "../lib/mmk/DeviceIdentifier";

import { QS_BUTTONS } from "../utils/data";
import {openPage} from "../utils/misc";

const { config, t } = getApp()._options.globalData;

class MainScreen {
  start() {
    this.allowDanger = config.get("allowDanger", false);

    const withBattery = config.get("withBattery", false);
    const withBrightness = config.get("withBrightness", true);
    const compact = deviceName == "Band 7";
    hmUI.setStatusBarVisible(!withBattery);

    if(withBattery) this.drawBattery();
    if(withBrightness) this.drawBrightness(compact ? 48 : 72);

    this.drawButtons(config.get("tiles", []), compact ? 48 : 72, withBrightness ? 2 : 0);
  }

  drawBattery() {
    const battery = hmSensor.createSensor(hmSensor.id.BATTERY);
    const value = battery.current + "%";
    const compact = deviceName == "Band 7";

    const text = hmUI.createWidget(hmUI.widget.TEXT, {
      x: 0,
      y: compact ? 7 : 28,
      w: SCREEN_WIDTH,
      h: 24,
      text: value,
      text_size: 20,
      color: 0x999999,
      align_h: hmUI.align.CENTER_H,
      align_v: hmUI.align.CENTER_V
    });

    const batEv = new TouchEventManager(text);
    batEv.ontouch = () => hmApp.startApp({
      url: "Settings_batteryManagerScreen",
      native: true
    });
  }

  drawButtons(tiles, topOffset, countExists = 0) {
    const columns = Math.floor((WIDGET_WIDTH + 4) / 96);
    const offsetX = Math.floor((SCREEN_WIDTH - (96 * columns) + 4) / 2);

    let i = countExists;
    tiles.forEach((id) => {
      const config = QS_BUTTONS[id];
      if(!config) return;
      if(config.danger && !this.allowDanger) return;
      if(config.lowRamOnly && !IS_LOW_RAM_DEVICE) return;

      let iconName = `qs/${id}.png`;
      if(config.isEnabled && config.isEnabled())
        iconName = `qs/${id}_on.png`

      const widgetConfig = {
        x: offsetX + (i % columns) * 96,
        y: topOffset + Math.floor(i / columns) * 96,
        w: 92,
        h: 92,
        src: iconName,
      }

      const widget = hmUI.createWidget(hmUI.widget.IMG, widgetConfig);
      const events = new TouchEventManager(widget);

      events.ontouch = () => {
        switch(config.type) {
          case "internal":
            openPage(config.url);
            break;
          case "native":
            hmApp.startApp({
              url: config.url, 
              native: true,
              param: config.param
            });
            break;
        }
      };
      
      i++;
    });

    // Edit button
    const withCustomize = WIDGET_WIDTH >= 300;
    const editButtonEvents = new TouchEventManager(hmUI.createWidget(hmUI.widget.TEXT, {
      x: SCREEN_MARGIN_X,
      y: topOffset + 12 + Math.ceil(i / columns) * 100,
      w: WIDGET_WIDTH / (withCustomize ? 2 : 1) - (withCustomize ? 8 : 0),
      h: 72,
      align_h: withCustomize ? hmUI.align.RIGHT : hmUI.align.CENTER_H,
      align_v: hmUI.align.CENTER_V,
      text: t("Settings"),
      text_size: 18,
      color: 0x999999
    }));
    editButtonEvents.ontouch = () => {
      openPage("SettingsHomePage");
    }

    if(withCustomize) {
      const customizeButtonEvents = new TouchEventManager(hmUI.createWidget(hmUI.widget.TEXT, {
        x: SCREEN_MARGIN_X + (WIDGET_WIDTH / 2) + 16,
        y: topOffset + 12 + Math.ceil(i / columns) * 100,
        w: WIDGET_WIDTH / 2 - 2,
        h: 72,
        align_h: withCustomize ? hmUI.align.LEFT : hmUI.align.CENTER_H,
        align_v: hmUI.align.CENTER_V,
        text: t("Customize"),
        text_size: 18,
        color: 0x999999
      }));
      customizeButtonEvents.ontouch = () => {
        openPage("SettingsUiScreen");
      }
    }
  }

  drawBrightness(y) {
    const columns = Math.floor((WIDGET_WIDTH + 4) / 96);
    const offsetX = Math.floor((SCREEN_WIDTH - (96 * columns) + 4) / 2);
    const baseBrightnessConfig = {
      x: offsetX,
      y,
      h: 92,
      radius: 46,
    };

    hmUI.createWidget(hmUI.widget.FILL_RECT, {
      ...baseBrightnessConfig,
      color: 0x222222,
      w: 188
    });

    if(hmSetting.getScreenAutoBright()) {
      const t = hmUI.createWidget(hmUI.widget.TEXT, {
        ...baseBrightnessConfig,
        w: 188,
        text_size: 22,
        align_h: hmUI.align.CENTER_H,
        align_v: hmUI.align.CENTER_V,
        text: "Automatic",
        color: 0xAAAAAA
      });

      const ev = new TouchEventManager(t);
      ev.ontouch = () => hmApp.startApp({url: "Settings_lightAdjustScreen", native: true})
      return;
    }

    this.widgetBrightness = hmUI.createWidget(hmUI.widget.FILL_RECT, {
      ...baseBrightnessConfig,
      color: 0x999999,
      alpha: 80,
      w: 10
    });

    const basement = hmUI.createWidget(hmUI.widget.IMG, {
      ...baseBrightnessConfig,
      w: 188,
      pos_x: 20,
      pos_y: 28,
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
    const val = 188 * (hmSetting.getBrightness() / 100);
    this.widgetBrightness.setProperty(hmUI.prop.MORE, {
      w: Math.max(val, 24),
      alpha: val == 0 ? 0 : 200,
    });
  }
}

Page({
  onInit(p) {
    const skipMain = config.get("skipMainPage", false);
    if(skipMain) return hmApp.reloadPage({
      appid: 33904,
      url: "page/SettingsHomePage"
    })

    AppGesture.withYellowWorkaround("left", {
      appid: 33904,
      url: "page/MainScreen",
    });
    AppGesture.init();
      
    const screen = new MainScreen();
    screen.start();
  }
});
