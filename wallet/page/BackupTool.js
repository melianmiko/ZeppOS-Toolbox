import { qrcode } from "../lib/external/qrcode";
import { CardsStorage } from "../utils/CardsStorage";
import { CanvasTGA } from "../lib/CanvasTGA.js";
import {FsUtils} from "../lib/FsUtils";
import {goBack} from "../lib/bugWorkaround";

class BackupTool {
	start() {
		hmSetting.setBrightScreen(600);

		hmUI.createWidget(hmUI.widget.TEXT, {
			x: 8,
			y: 120,
			w: 184,
			h: 24,
			color: 0xffffff,
			text: "Работаем...",
		});

		const t = timer.createTimer(0, 500, () => {
			timer.stopTimer(t);
			this.process();
		});
	}

	process() {
		const out = FsUtils.fetchTextFile("/storage/mmk_cards.json");
		(new QrDumpScreen(out)).start();
	}

	display(size, fn) {
		hmUI.createWidget(hmUI.widget.FILL_RECT, {
			x: 0,
			y: 0,
			w: 192,
			h: 490,
			color: 0xFFFFFF
		})

		hmUI.createWidget(hmUI.widget.IMG, {
			x: (192-size) / 2,
			y: (490-size) / 2,
			src: fn
		});
	}
}


class QrDumpScreen {
  constructor(data) {
  	this.data = data;
    this.tmp = "";

    this.canvas = new CanvasTGA(192, 192);
    this.canvas.contextOffsetX = 3;
    this.canvas.contextOffsetY = 3;

    this.position = 0;
  }

  start() {
    hmUI.createWidget(hmUI.widget.FILL_RECT, {
      x: 0,
      y: 0,
      w: 192,
      h: 490,
      color: 0xFFFFFF
    });

    this.info = hmUI.createWidget(hmUI.widget.TEXT, {
      x: 0,
      y: 400,
      w: 192,
      h: 40,
      text: "wait...",
      align_h: hmUI.align.CENTER_H,
      color: 0x0
    });

    this.image = hmUI.createWidget(hmUI.widget.IMG, {
      x: 0,
      y: 0,
      w: 192,
      h: 490,
      pos_x: 0,
      pos_y: 149,
      src: "wait..."
    });

    this.image.addEventListener(hmUI.event.CLICK_UP, () => {
      this.nextPage();
    })

    const t = timer.createTimer(0, 1000, () => {
      timer.stopTimer(t);
      try {
	      this.nextPage();
      } catch(e) {
      	console.log(e);
      	hmUI.showToast({text: String(e)});
      }
    })
  }

  nextPage() {
    if(this.position >= this.data.length) {
      try {
        hmFS.remove(FsUtils.fullPath(this.tmp));
      } catch(e) {}

      hmApp.goBack();
      console.log("END");
      return;
    }

    this.pageData();
  }

  pageData() {
    const len = Math.min(90, this.data.length - this.position);
    const data = this.data.substring(this.position, this.position + len);
    this.position += len;

  	console.log(data);
    const qr = qrcode(5, "L");
    qr.addData(data);
    qr.make();

    qr.renderTo2dContext(this.canvas, 5);
    this.setState(this.position + "/" + this.data.length);
    this.reloadImage();
  }

  reloadImage() {
    if(this.tmp !== "") hmFS.remove(FsUtils.fullPath(this.tmp));

    this.tmp = "tmp_" + Math.round(Math.random() * 1e10) + ".png";
    this.canvas.saveAsset(this.tmp);
    this.image.setProperty(hmUI.prop.MORE, {
      w: 192,
      h: 490,
      pos_x: 0,
      pos_y: (490-192)/2,
      src: this.tmp
    });
  }

  setState(p) {
    this.info.setProperty(hmUI.prop.TEXT, p);
  }
}



let __$$app$$__ = __$$hmAppManager$$__.currentApp;
let __$$module$$__ = __$$app$$__.current;
__$$module$$__.module = DeviceRuntimeCore.Page({
	onInit(params) {
		new BackupTool().start();
	},
});
