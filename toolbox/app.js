import { DEFAULT_SETTINGS } from "./utils/data";
import { ConfigStorage } from "../lib/ConfigStorage";

const config = new ConfigStorage("/storage/mmk_tb_layout.json", DEFAULT_SETTINGS);

App({
  globalData: {
    config
  },
  onCreate(options) {
    config.load();
  },

  onDestroy(options) {
  }
})