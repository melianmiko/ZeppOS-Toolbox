import { DEFAULT_SETTINGS } from "./utils/data";
import { ConfigStorage } from "../lib/mmk/ConfigStorage";
import { Path } from "../lib/mmk/Path";

const configFile = new Path("full", "/storage/mmk_tb_layout.json");
const config = new ConfigStorage(configFile, DEFAULT_SETTINGS);

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