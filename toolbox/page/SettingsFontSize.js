import { FontSizeSetupScreen } from "../../lib/mmk/FontSizeSetupScreen";

const { config } = getApp()._options.globalData

class ConfiguredFontSizeSetupScreen extends FontSizeSetupScreen {
  getSavedFontSize() {
    return config.get("fontSize", 16);
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
