import { FontSizeSetupScreen } from "../lib/mmk/FontSizeSetupScreen";

const { config } = getApp()._options.globalData

class ConfiguredFontSizeSetupScreen extends FontSizeSetupScreen {
  getSavedFontSize(v) {
    return config.get("fontSize", v);
  }

  onChange(v) {
    config.set("fontSize", v);
  }
}

Page({
  onInit() {
    hmUI.setStatusBarVisible(true);
    hmUI.updateStatusBarTitle("");

    new ConfiguredFontSizeSetupScreen().start();
  }
})
