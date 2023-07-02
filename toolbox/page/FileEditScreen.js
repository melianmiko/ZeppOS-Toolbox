import {FsUtils} from "../../lib/FsUtils";
import {SettingsListScreen} from "../../lib/SettingsListScreen";
import { AppGesture } from "../../lib/AppGesture";

import {openPage} from "../utils/misc";

const { config, t } = getApp()._options.globalData;

class FileEditScreen extends SettingsListScreen {
  constructor(data) {
    super();
    this.path = data;
  }

  build() {
    this.allowDanger = hmFS.SysProGetBool("mmk_tb_danger_mode");

    // Stats
    this.field(t("Location"), this.path);

    let fileSize = 0;
    try {
      const [st, e] = FsUtils.stat(this.path);
      if(st.size) {
        this.field(t("Size"), FsUtils.printBytes(st.size));
        fileSize = st.size;
      }
    } catch(e) {}

    // Open btns
    if(fileSize > 0) {
      if(this.path.endsWith(".png") || this.path.endsWith(".tga")) {
        this.clickableItem(t("View as image"), "files/img.png", () => {
          openPage("ImageViewScreen", this.prepareTempFile(this.path));
        })
      }

      this.clickableItem(t("View as text"), "files/text.png", () => {
        openPage("TextViewScreen", this.path);
      });

      this.clickableItem(t("View as binary"), "files/file.png", () => {
        openPage("HexdumpScreen", this.path);
      });
    }

    if(this.path == "/storage") return;

    if(this.canEdit()) {
      this.buildEditRows(fileSize)
    } else {
      this.text(t("To edit this file/folder, unlock \"Danger features\" in app settings"));
    }
  }

  buildEditRows(fileSize) {
    this.headline(t("Edit..."));
    if(this.canPaste() && fileSize == 0)
      this.clickableItem(t("Paste"), "menu/paste.png", () => {
        this.doPaste();
      })

    this.clickableItem(t("Cut"), "menu/cut.png", () => {
      this.pathToBuffer(true);
    });

    this.clickableItem(t("Copy"), "menu/copy.png", () => {
      this.pathToBuffer(false);
    });

    this.clickableItem(t("Delete"), "menu/delete.png", () => {
      this.delete();
    });
  }

  canEdit() {
    if(this.allowDanger) return true;
    
    const editablePaths = [
      "/storage/js_apps",
      "/storage/js_watchfaces"
    ];

    for(const ep of editablePaths)
      if(this.path.startsWith(ep))
        return true;

    return false;
  }

  delete() {
    FsUtils.rmTree(this.path);
    hmApp.goBack();
  }

  canPaste() {
    const val = hmFS.SysProGetChars("mmk_tb_fm_buffer_path");
    if(!val) return false;

    const [st, e] = FsUtils.stat(val);
    return e == 0 && !this.path.startsWith(val) && this.path != val;
  }

  doPaste() {
    const src = hmFS.SysProGetChars("mmk_tb_fm_buffer_path");
    const deleteSource = hmFS.SysProGetBool("mmk_tb_buffer_del");
    const filename = src.substring(src.lastIndexOf("/"));
    const dest = this.path + filename;

    FsUtils.copyTree(src, dest, deleteSource);
    hmFS.SysProSetChars("mmk_tb_fm_buffer_path", "");
    hmApp.goBack();
  }

  pathToBuffer(deleteSource) {
    hmFS.SysProSetChars("mmk_tb_fm_buffer_path", this.path);
    hmFS.SysProSetBool("mmk_tb_buffer_del", deleteSource);
    hmApp.goBack();
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
}


Page({
  onInit(p) {
    AppGesture.withYellowWorkaround("left", {
      appid: 33904,
      url: "page/FileEditScreen",
      param: p,
    });
    AppGesture.init();
    
    new FileEditScreen(p).start();
  }
});
