import {FsUtils} from "../lib/FsUtils";
import {CardsStorage} from "../utils/CardsStorage";
import {TouchEventManager} from "../lib/TouchEventManager";
import {loadBackup} from "../utils/BackupLoader.js";

class HomePage {
  viewerVisible = false;
  lastBrightness = 0;

  constructor() {
    this.storage = new CardsStorage();

    const [st, e] = FsUtils.stat(FsUtils.fullPath('backup.txt'));
    if(e == 0) {
      try {
        loadBackup(this.storage);
      } catch(e) {
        console.log(e);
        hmUI.showToast({text: "Не удалось восстановить бэкап"});
      }
    }
  }

  start() {
    const data = this.storage.data;
    const viewData = [
      ...data,
      {icon: "action_new", url: "page/NewCardPicker"},
      {icon: "action_info", url: "page/AboutScreen"}
    ]

    hmUI.createWidget(hmUI.widget.FILL_RECT, {
      x: 0,
      y: Math.max(490, 96 + 77 * Math.ceil(viewData.length / 2)),
      w: 1,
      h: 96,
      color: 0x0
    })

    viewData.forEach((info, i) => {
      if(info.color) hmUI.createWidget(hmUI.widget.FILL_RECT, {
        x: 100 * (i % 2), 
        y: 96 + 77 * Math.floor(i / 2),
        w: 92,
        h: 69,
        radius: 8,
        color: info.color
      });

      if(info.title) hmUI.createWidget(hmUI.widget.TEXT, {
        x: 100 * (i % 2), 
        y: 96 + 77 * Math.floor(i / 2),
        w: 92,
        h: 69,
        text: info.title,
        color: 0xFFFFFF,
        align_h: hmUI.align.CENTER_H,
        align_v: hmUI.align.CENTER_V
      });

      const b = hmUI.createWidget(hmUI.widget.IMG, {
        x: 100 * (i % 2), 
        y: 96 + 77 * Math.floor(i / 2),
        w: 92,
        h: 69,
        src: `cards/${info.icon}.png`
      });

      const events = new TouchEventManager(b);
      events.ontouch = () => {
        if(info.url) return hmApp.gotoPage({url: info.url});

        this.openImage(info);
      };
    });
  }

  openImage(data) {
    const [st, e] = FsUtils.stat(FsUtils.fullPath(data.filename));
    if(e != 0)
      return CardsStorage.startWrite(data);

    hmApp.gotoPage({
      url: "page/CardView",
      param: JSON.stringify(data)
    });
  }
}


let __$$app$$__ = __$$hmAppManager$$__.currentApp;
let __$$module$$__ = __$$app$$__.current;
__$$module$$__.module = DeviceRuntimeCore.Page({
  onInit() {
    (new HomePage()).start();
  }
});
