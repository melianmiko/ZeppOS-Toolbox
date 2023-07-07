import { Path, FsTools } from "../lib/mmk/Path";
import { ListScreen } from "../lib/mmk/ListScreen";
import { AppGesture } from "../lib/mmk/AppGesture";

import {openPage} from "../utils/misc";

const { config, t } = getApp()._options.globalData;

class FileEditScreen extends ListScreen {
  constructor(data) {
    super();
    this.entry = new Path("full", data);
  }

  start() {
    const path = this.entry.absolutePath;

    this.allowDanger = config.get("allowDanger", false);

    // Stats
    this.field({
      headline: t("Location"), 
      text: path
    });

    let fileSize = 0;
    try {
      const [st, e] = this.entry.stat();
      if(st.size) {
        this.field({
          headline: t("Size"), 
          text: FsTools.printBytes(st.size, config.get("FsBase2", false))
        });
        fileSize = st.size;
      }
    } catch(e) {}

    // Open btns
    if(fileSize > 0) {
      if(path.endsWith(".png") || path.endsWith(".tga")) {
        this.row({
          text: t("View as image"),
          icon: "menu/file_png.png",
          callback: () => {
            openPage("ImageViewScreen", this.prepareTempFile());
          }
        })
      }

      this.row({
        text: t("View as text"),
        icon: "menu/file_txt.png",
        callback: () => {
          openPage("TextViewScreen", path);
        }
      });
      this.row({
        text: t("View as binary"),
        icon: "menu/file_base.png",
        callback: () => {
          openPage("HexdumpScreen", path);
        }
      });
    }

    if(this.path == "/storage") return;

    if(this.canEdit()) {
      this.buildEditRows(fileSize)
    } else {
      this.text({text: t("To edit this file/folder, unlock \"Danger features\" in app settings")});
    }

    this.offset();
  }

  buildEditRows(fileSize) {
    this.headline(t("Edit..."));
    if(this.canPaste() && fileSize == 0)
      this.row({
        text: t("Paste"),
        icon: "menu/paste.png",
        callback: () => {
          this.doPaste();
        }
      });

    this.row({
      text: t("Cut"),
      icon: "menu/cut.png",
      callback: () => {
        this.pathToBuffer(true);
      }
    });
    this.row({
      text: t("Copy"),
      icon: "menu/copy.png",
      callback: () => {
        this.pathToBuffer(false);
      }
    });
    this.row({
      text: t("Delete"),
      icon: "menu/delete.png",
      callback: () => {
        this.delete();
      }
    });
  }

  canEdit() {
    if(this.allowDanger) return true;
    
    const editablePaths = [
      "/storage/js_apps",
      "/storage/js_watchfaces"
    ];

    for(const ep of editablePaths)
      if(this.entry.absolutePath.startsWith(ep))
        return true;

    return false;
  }

  delete() {
    this.entry.removeTree();
    hmApp.goBack();
  }

  canPaste() {
    const val = config.get("fmClipboard", false);
    if(!val) return false;

    const [st, e] = new Path("full", val).stat();
    return e == 0 && !this.entry.absolutePath.startsWith(val) && this.entry.absolutePath != val;
  }

  doPaste() {
    const src = config.get("fmClipboard", false);
    const deleteSource = config.get("fmPasteMode") == "cut";
    const filename = src.substring(src.lastIndexOf("/"));
    const dest = this.entry.get(filename);

    new Path("full", src).copyTree(dest, deleteSource);
    if(deleteSource) config.set("fmClipboard", "");
    hmApp.goBack();
  }

  pathToBuffer(deleteSource) {
    config.update({
      fmClipboard: this.entry.absolutePath,
      fmPasteMode: deleteSource ? "cut" : "copy"
    })
    hmApp.goBack();
  }

  prepareTempFile(sourcePath) {
    const current = config.get("imageViewTempFile", false);
    if(current) {
      new Path("assets", current).remove();
    }

    // const data = FsUtils.read(sourcePath);
    const newFile = "temp_" + Math.round(Math.random() * 100000) + ".png";
    const dest = new Path("assets", newFile);
    this.entry.copy(dest);

    config.set("imageViewTempFile", newFile);
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
