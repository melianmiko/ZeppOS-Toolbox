import { ConfigStorage } from "../lib/mmk/ConfigStorage";
import { Path } from "../lib/mmk/Path";
import { t, loadLocale, setPreferedLanguage } from "../lib/mmk/i18n";
import { initTranslations } from "./utils/translations";

const configFile = new Path("full", "/storage/mmk_tb_layout.json");
const config = new ConfigStorage(configFile, {
  tiles: [
    "apps",
    "files",
    "storage",
    "timer",
    "remman",
    "dnd",
    "camera"
  ],
  withBrightness: true,
  withBattery: false
});

App({
  globalData: {
    config,
    t
  },
  onCreate(options) {
    config.load();

    setPreferedLanguage(config.get("locale", "false"));
    initTranslations(loadLocale);
  },
  onDestroy(options) {
  }
})