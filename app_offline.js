import { ConfigStorage } from "./lib/mmk/ConfigStorage";
import { Path } from "./lib/mmk/Path";
import { t, loadLocale, setPreferedLanguage } from "./lib/mmk/i18n";
import { initTranslations } from "./utils/translations";
import {default_config} from "./utils/default_config";

const configFile = new Path("data", "config.json");
const config = new ConfigStorage(configFile, default_config);

App({
  globalData: {
    config,
    t,
    offline: true
  },
  onCreate(options) {
    config.load();
    setPreferedLanguage(config.get("locale", "false"));
    initTranslations(loadLocale);
  },
  onDestroy(options) {
  }
})