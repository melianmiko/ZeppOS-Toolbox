import {FsUtils} from "../../lib/FsUtils";
import {t, extendLocale} from "../../lib/i18n";
import {SettingsListScreen} from "../../lib/SettingsListScreen";

import {FILE_EDIT_TRANSLATIONS} from "../utils/translations";

extendLocale(FILE_EDIT_TRANSLATIONS);

class FileEditScreen extends SettingsListScreen {
  constructor(data) {
    super();
    this.path = data;
  }

  build() {
    // Stats
    this.field("Location", this.path);

    let fileSize = 0;
    try {
      const [st, e] = FsUtils.stat(this.path);
      if(st.size) {
        this.field(t("field_size"), FsUtils.printBytes(st.size));
        fileSize = st.size;
      }
    } catch(e) {}

    // Open btns
    if(fileSize > 0) {
      if(this.path.endsWith(".png")) {
        this.clickableItem(t("file_view_as_image"), "files/img.png", () => {
          hmApp.gotoPage({
            url: "page/ImageViewScreen",
            param: this.prepareTempFile(this.path)
          });
        })
      }

      this.clickableItem(t("file_view_as_text"), "files/text.png", () => {
        hmApp.gotoPage({
          url: "page/TextViewScreen",
          param: this.path
        });
      });

      this.clickableItem(t("file_view_as_bin"), "files/file.png", () => {
        hmApp.gotoPage({
          url: "page/HexdumpScreen",
          param: this.path
        });
      });
    }

    // Delete btn
    this.headline(t("file_manage"));
    if(this.canPaste() && fileSize == 0) {
      this.clickableItem(t("file_paste"), "menu/paste.png", () => {
        this.doPaste();
      })
    }
    this.clickableItem(t("file_cut"), "menu/cut.png", () => {
      this.pathToBuffer(true);
    });
    this.clickableItem(t("file_copy"), "menu/copy.png", () => {
      this.pathToBuffer(false);
    });
    this.clickableItem(t("file_delete"), "menu/delete.png", () => {
      this.delete();
    });
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


let __$$app$$__ = __$$hmAppManager$$__.currentApp;
let __$$module$$__ = __$$app$$__.current;
__$$module$$__.module = DeviceRuntimeCore.Page({
  onInit(p) {
    new FileEditScreen(p).start();
  }
});
