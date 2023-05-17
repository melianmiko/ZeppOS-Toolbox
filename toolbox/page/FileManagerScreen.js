import { AppGesture } from "../../lib/AppGesture";
import {FsUtils} from "../../lib/FsUtils";

import {openPage} from "../utils/misc";
import {HEADER_ROW_TYPE, FILE_ROW_TYPE, FILE_ROW_TYPE_WITH_SIZE} from "./styles/FileManagerRowTypes";

const { config } = getApp()._options.globalData;

class FileManagerScreen {
  constructor(path) {
    this.maxItems = 16;

    this.path = path ? path : "/storage/js_apps";
    this.editPath = null;
    this.content = [];
    this.rows = [];

    this.path = FsUtils.getSelfPath();
    this.showFileSizes = config.get("fmShowSizes", false);

    const lastPath = hmFS.SysProGetChars("mmk_tb_lastpath");
    if(!!lastPath & !path) this.path = lastPath;
  }

  finish() {
    hmSetting.setBrightScreenCancel();
  }

  start() {
    hmSetting.setBrightScreen(1800);

    this.viewFiles = hmUI.createWidget(hmUI.widget.SCROLL_LIST, {
      x: 0,
      y: 0,
      w: 192,
      h: 490,
      item_space: 8,
      item_config: [
        FILE_ROW_TYPE,
        HEADER_ROW_TYPE,
        FILE_ROW_TYPE_WITH_SIZE,
      ],
      item_config_count: 3,
      item_click_func: (_, i) => this.onRowClick(i),
      data_type_config: [],
      data_type_config_count: 0,
      data_array: [],
      data_count: 0
    });

    // Run
    this.applyPath(this.path);
  }

  modify(path) {
    if(config.get("autoOpenFiles", false) && path.endsWith(".txt")) {
      return openPage("TextViewScreen", path);
    }

    openPage("FileEditScreen", path);
  }

  applyPath(path) {
    this.path = path;
    this.refresh();
    hmFS.SysProSetChars("mmk_tb_lastpath", path);
  }

  isFolder(path) {
      const [st, e] = FsUtils.stat(path);
      if(st == null) return true; // force for unavailables
      return (st.mode & 32768) == 0;
  }

  getFileIcon(path) {
    if(path.endsWith(".png")) {
      return "files/img.png";
    } else if(path.endsWith(".txt")) {
      return "files/text.png";
    } else if(path.endsWith(".js") || path.endsWith(".json")) {
      return "files/code.png";
    }

    return "files/file.png";
  }

  refresh() {
    const [dirContent, e] = hmFS.readdir(this.path);
    console.log("refr", this.path);

    let folders = [],
      files = [];

    if (this.path !== "/storage") {
      folders.push({
        name: "..", 
        icon: "files/up.png",
        size: "",
      });
    }

    for(let i = 0; i < Math.min(dirContent.length, this.maxItems); i++) {
      const fn = dirContent[i];
      const path = `${this.path}/${fn}`
      const isFolder = this.isFolder(path);

      const row = {
        name: fn,
        icon: isFolder ? "files/folder.png" : this.getFileIcon(fn),
        size: ""
      };

      if(!isFolder && this.showFileSizes) {
        try {
          const [st, e] = FsUtils.stat(path);
          if(st.size) {
            row.size = FsUtils.printBytes(st.size);
          }
        } catch(e) {}
      }

      isFolder ? folders.push(row) : files.push(row);
    }

    folders.sort(this._sortFnc);
    files.sort(this._sortFnc);

    this.contents = [
      {
        title: this.path, 
        icon: "menu/context.png",
        isContext: true
      },
      ...folders, 
      ...files
    ];

    this.contents.push(dirContent.length > this.maxItems ? {
      title: "",
      icon: "menu/expand.png",
      isExpand: true
    } : {
      title: "",
      icon: ""
    })

    console.log(this.contents);

    this.viewFiles.setProperty(hmUI.prop.UPDATE_DATA, {
      data_type_config: [
        {
          start: 0,
          end: 0,
          type_id: 1,
        },
        {
          start: 1,
          end: this.contents.length - 2,
          type_id: this.showFileSizes ? 3 : 2,
        },
        {
          start: this.contents.length - 1,
          end: this.contents.length - 1,
          type_id: 1,
        },
      ],
      data_type_config_count: 3,
      data_array: this.contents,
      data_count: this.contents.length,
      on_page: 1
    })
  }

  onRowClick(i) {
    if(!this.contents[i]) return;

    if(this.contents[i].isContext) 
      return this.modify(this.path);
    else if(this.contents[i].isExpand) {
      this.maxItems += 50;
      return this.refresh();
    }

    let val = this.contents[i].name;

    let path = this.path + "/" + val;
    if (val == "..") {
      path = this.path.substring(0, this.path.lastIndexOf("/"));
    }

    if (this.isFolder(path)) {
      console.log("newpath", path);
      this.applyPath(path);
    } else {
      this.modify(path);
    }
  }

  _sortFnc(a, b) {
    return a.name < b.name ? -1 : 1;
  }
}


let screen;
Page({
  onInit(p) {
    AppGesture.withYellowWorkaround("left", {
      appid: 33904,
      url: "page/FileManagerScreen",
    });
    AppGesture.init();

    hmUI.setLayerScrolling(false);
    screen = new FileManagerScreen(p);
    screen.start();
  },
  onDestroy: () => {
    screen.finish();
  }
});
