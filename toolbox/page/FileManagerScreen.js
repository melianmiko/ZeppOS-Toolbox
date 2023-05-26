import { AppGesture } from "../../lib/AppGesture";
import { Path, FsTools } from "../../lib/Path";

import {openPage} from "../utils/misc";
import {HEADER_ROW_TYPE, FILE_ROW_TYPE, FILE_ROW_TYPE_WITH_SIZE} from "./styles/FileManagerRowTypes";

const { config } = getApp()._options.globalData;

class FileManagerScreen {
  constructor(params) {
    this.maxItems = 16;

    this.editPath = null;
    this.content = [];
    this.rows = [];

    this.showFileSizes = config.get("fmShowSizes", false);

    let currentPath = FsTools.fullAssetPath("");
    let lastPath = hmFS.SysProGetChars("mmk_tb_lastpath");
    if(params.path) {
      currentPath = params.path;
    } else if(!!lastPath) {
      currentPath = lastPath
    }

    this.entry = new Path("full", currentPath);
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
    this.applyPathEntry(this.entry);
  }

  modify(path) {
    if(config.get("autoOpenFiles", false) && path.endsWith(".txt")) {
      return openPage("TextViewScreen", path);
    }

    openPage("FileEditScreen", path);
  }

  applyPathEntry(entry) {
    this.entry = entry;
    this.refresh();
    hmFS.SysProSetChars("mmk_tb_lastpath", entry.absolutePath);
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
    console.log("refr", this.entry.absolutePath);
    const [dirContent, e] = this.entry.list();

    let folders = [],
      files = [];

    if (this.entry.absolutePath !== "/storage") {
      folders.push({
        name: "..", 
        icon: "files/up.png",
        size: "",
      });
    }

    for(let i = 0; i < Math.min(dirContent.length, this.maxItems); i++) {
      const fn = dirContent[i];
      const item = this.entry.get(fn);
      const isFolder = item.isFolder();

      const row = {
        name: fn,
        icon: isFolder ? "files/folder.png" : this.getFileIcon(fn),
        size: ""
      };

      if(!isFolder && this.showFileSizes) {
        try {
          const [st, e] = item.stat();
          if(st.size) {
            row.size = FsTools.printBytes(st.size);
          }
        } catch(e) {}
      }

      isFolder ? folders.push(row) : files.push(row);
    }

    folders.sort(this._sortFnc);
    files.sort(this._sortFnc);

    this.contents = [
      {
        title: this.entry.absolutePath, 
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
      return this.modify(this.entry.absolutePath);
    else if(this.contents[i].isExpand) {
      this.maxItems += 50;
      return this.refresh();
    }

    let val = this.contents[i].name;

    let path = this.entry.absolutePath;
    if (val == "..") {
      path = path.substring(0, path.lastIndexOf("/"));
    } else {
      path = path + "/" + val;
    }

    const entry = new Path("full", path);
    if (entry.isFolder()) {
      console.log("newpath", path);
      this.applyPathEntry(entry);
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

    let params = {};
    if(typeof p == "string" && p[0] == "{") {
      params = JSON.parse(p);
    }

    hmUI.setLayerScrolling(false);
    screen = new FileManagerScreen(params);
    screen.start();
  },
  onDestroy: () => {
    screen.finish();
  }
});
