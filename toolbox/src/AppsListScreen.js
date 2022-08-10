class AppsListScreen {
  app_list_item_type = {
    type_id: 1,
    item_height: 64,
    item_bg_color: 0x222222,
    item_bg_radius: 8,
    text_view: [
      {
        x: 0,
        y: 0,
        w: 192 - 16,
        h: 64,
        key: "name",
        color: 0xffffff,
        text_size: 26,
      },
    ],
    text_view_count: 1,
  }

  fetchApps() {
    const out = [];
    const [contents, e] = hmFS.readdir("/storage/js_apps");

    for (let i in contents) {
      const dirname = contents[i];
      if (dirname == "data") continue;

      try {
        const path = "/storage/js_apps/" + dirname;
        const appConfig = FsUtils.fetchJSON(path + '/app.json');

        let name = appConfig.app.appName;
        let vender = appConfig.app.vender;
        let icon = path + "/assets/" + appConfig.app.icon;
        let data = {dirname, name, vender};

        out.push({ name, data, icon });
      } catch (e) {
        console.warn(e);
      }
    }

    return out;
  }

  prepareTempFile(sourcePath) {
    const current = hmFS.SysProGetChars("mmk_tb_temp");
    if(current) {
      const path = FsUtils.fullPath(current);
      hmFS.remove(path);
    }

    const data = FsUtils.read(sourcePath);
    const newFile = "temp_" + Math.round(Math.random() * 100000) + ".png";
    const dest = hmFS.open_asset(newFile, hmFS.O_WRONLY | hmFS.O_CREAT);
    hmFS.seek(dest, 0, hmFS.SEEK_SET);
    hmFS.write(dest, data, 0, data.byteLength);
    hmFS.close(dest);

    hmFS.SysProSetChars("mmk_tb_temp", newFile);
    return newFile;
  }

  start() {
    hmUI.setLayerScrolling(false);

    const apps = this.fetchApps();

    hmUI.createWidget(hmUI.widget.TEXT, {
      x: 48,
      y: 0,
      w: 96,
      h: 64,
      text: t("title_apps"),
      color: 0xffffff,
      align_h: hmUI.align.CENTER_H,
      align_v: hmUI.align.CENTER_V,
    });

    hmUI.createWidget(hmUI.widget.SCROLL_LIST, {
      x: 8,
      y: 64,
      w: 192 - 16,
      h: 445,
      item_space: 8,
      item_config: [this.app_list_item_type],
      item_config_count: 1,
      item_click_func: (list, index) => {
        const data = apps[index];
        const newFile = this.prepareTempFile(data.icon);

        gotoSubpage('app_edit', {
          ...data.data,
          icon: newFile
        })
      },
      data_type_config: [
        { start: 0, end: apps.length - 1, type_id: 1 },
      ],
      data_type_config_count: 1,
      data_array: apps,
      data_count: apps.length,
    });
  }
}