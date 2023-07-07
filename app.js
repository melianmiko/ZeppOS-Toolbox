import { ConfigStorage } from "./lib/mmk/ConfigStorage";
import {FsTools, Path} from "./lib/mmk/Path";
import { t, loadLocale, setPreferedLanguage } from "./lib/mmk/i18n";
import { initTranslations } from "./utils/translations";
import {default_config} from "./utils/default_config";

FsTools.appTags = [33904, "app"];

const configFile = new Path("data", "config.json");
const config = new ConfigStorage(configFile, default_config);

App({
  globalData: {
    config,
    t,
    appTags: FsTools.appTags,
    offline: false,
  },
  onCreate(options) {
    config.load();
    setPreferedLanguage(config.get("locale", "false"));
    initTranslations(loadLocale);
  },
  onDestroy(options) {
  }
})