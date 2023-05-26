import {Path} from "../../lib/Path";
import { AppGesture } from "../../lib/AppGesture";
import { t, extendLocale } from "../../lib/i18n";

import { APP_LIST_TRANSLATIONS } from "../utils/translations";
import { FILE_ROW_TYPE, HEADER_ROW_TYPE } from "./styles/FileManagerRowTypes";
import { openPage } from "../utils/misc";

extendLocale(APP_LIST_TRANSLATIONS);

class AppsListScreen {
  constructor() {
    this.root = new Path("full", "/storage/js_apps");
  }

  mkEditParam(dirname) {
    try {
      const appConfig = this.root.get(`${dirname}/app.json`).fetchJSON();

      let name = appConfig.app.appName;
      let vender = appConfig.app.vender;
      let data = { dirname, name, vender };
      let icon = this.root.get(`${dirname}/assets/${appConfig.app.icon}`);
      icon = this.prepareTempFile(icon);

      return { dirname, name, vender, icon }
    } catch (e) {
      return {};
    }
  }

  fetchApps() {
    const out = [];
    const [contents, e] = this.root.list();

    for (let i in contents) {
      const dirname = contents[i];
      if (dirname == "data") continue;

      try {
        const jsonString = this.root.get(`${dirname}/app.json`).fetchText(368);

        const appNameIndex = jsonString.indexOf("appName") + 8;
        const stIndex = jsonString.indexOf("\"", appNameIndex) + 1;
        const endIndex = jsonString.indexOf("\"", stIndex);

        let name = jsonString.substring(stIndex, endIndex);
        if (stIndex < 0 || endIndex < 0) name = dirname;

        out.push({ 
          name, 
          dirname,
          icon: "menu/apps.png"
        });
      } catch (e) {
        console.log(e);
        out.push({
          name: dirname,
          icon: "menu/files.png",
          dirname
        });
      }
    }

    return out;
  }

  prepareTempFile(sourcePath) {
    const current = hmFS.SysProGetChars("mmk_tb_temp");
    if (current) {
      hmFS.remove(path);
    }

    if (sourcePath === "") return "";

    const data = new Path("full", sourcePath).fetch();
    const newFile = "temp_" + Math.round(Math.random() * 100000) + ".png";
    const dest = hmFS.open(newFile, hmFS.O_WRONLY | hmFS.O_CREAT);
    hmFS.seek(dest, 0, hmFS.SEEK_SET);
    hmFS.write(dest, data, 0, data.byteLength);
    hmFS.close(dest);

    hmFS.SysProSetChars("mmk_tb_temp", newFile);
    return newFile;
  }

  start() {
    hmUI.setLayerScrolling(false);

    const apps = this.fetchApps();

    hmUI.createWidget(hmUI.widget.SCROLL_LIST, {
      x: 0,
      y: 0,
      w: 192,
      h: 490,
      item_space: 8,
      item_config: [HEADER_ROW_TYPE, FILE_ROW_TYPE],
      item_config_count: 2,
      item_click_func: (list, index) => {
        if(index == 0) return;
        const data = apps[index - 1];
        openPage("AppEditScreen", data.dirname);
      },
      data_type_config: [{
          start: 0,
          end: 0,
          type_id: 1,
        },
        {
          start: 1,
          end: apps.length,
          type_id: 2,
        },
        {
          start: apps.length + 1,
          end: apps.length + 1,
          type_id: 1,
        },
      ],
      data_type_config_count: 3,
      data_array: [
        {
          title: t("title_apps"),
          icon: "",
        },
        ...apps,
        {
          title: "",
          icon: "",
        },
      ],
      data_count: apps.length + 2,
    });
  }
}

Page({
  onInit(p) {
    AppGesture.withYellowWorkaround("left", {
      appid: 33904,
      url: "page/AppsListScreen",
    });
    AppGesture.init();

    new AppsListScreen().start();
  }
});