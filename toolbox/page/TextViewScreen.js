import {FsUtils} from "../../lib/FsUtils";
import { AppGesture } from "../../lib/AppGesture";

const BOX_HEIGHT = 300;

class TextViewScreen {
	PAGE_SIZE = 256;

	fontSize = 16;
	position = 0;
	bufferSize = 0;
	backStack = [];

	constructor(data) {
		this.path = data;
	}

	start() {
		hmSetting.setBrightScreen(1800);
		hmUI.setLayerScrolling(false);

		// Prepare config
		const userFontSize = hmFS.SysProGetInt("mmk_tb_fontsize");
		if(userFontSize) this.fontSize = userFontSize;

		// Prepare file
		this.file = FsUtils.open(this.path, hmFS.O_RDONLY);
		const [st, e] = FsUtils.stat(this.path);
		this.fileSize = st.size;

		// Init
		this.makeWidgets();
		this.displayForward();
	}

	makeWidgets() {
		// Text view
		this.textView = hmUI.createWidget(hmUI.widget.TEXT, {
			x: 0,
			y: (490 - BOX_HEIGHT) / 2,
			w: 192,
			h: BOX_HEIGHT,
			text_size: this.fontSize,
			color: 0xffffff,
			text_style: hmUI.text_style.WRAP,
			text: ""
		});

		// Position view
		this.posView = hmUI.createWidget(hmUI.widget.TEXT, {
			x: 0,
			y: 0,
			w: 192,
			h: (490 - BOX_HEIGHT) / 2,
			text_size: 20,
			align_h: hmUI.align.CENTER_H,
			align_v: hmUI.align.CENTER_V,
			color: 0x999999,
			text: ""
		})

		// Next btn
		hmUI.createWidget(hmUI.widget.IMG, {
			x: 0,
			y: 490/2,
			w: 192,
			h: 490/2
		}).addEventListener(hmUI.event.CLICK_UP, () => {
			this.pageNext();
		});

		// Back btn
		hmUI.createWidget(hmUI.widget.IMG, {
			x: 0,
			y: 0,
			w: 192,
			h: 490/2
		}).addEventListener(hmUI.event.CLICK_UP, () => {
			this.pageBack();
		});

		// Overlay
		// this.overlay = hmUI.createWidget(hmUI.widget.IMG, {
		// 	x: 0,
		// 	y: 0,
		// 	src: "loading.png",
		// 	alpha: 200
		// });
	}

	getTextHeight(text) {
		return hmUI.getTextLayout(text, {
			text_size: this.fontSize,
			text_width: 192,
			wrapped: true
		}).height;
	}

	pageNext() {
		if(this.position + this.bufferSize >= this.fileSize) return;
		this.backStack.push(this.position);
		this.position += this.bufferSize;
		this.displayForward();
	}

	pageBack() {
		if(this.backStack.length < 1) return;
		this.position = this.backStack.pop();
		this.displayForward();
	}

	displayForward() {
		// this.overlay.setProperty(hmUI.prop.VISIBLE, true);
		// const ti = timer.createTimer(150, 150, () => {
			// timer.stopTimer(ti);
			this._displayForward();
			// this.overlay.setProperty(hmUI.prop.VISIBLE, false);
		// });
	}

	_displayForward() {
		const temp = new Uint8Array(15 * 4);

		hmFS.read(this.file, temp.buffer, 0, temp.byteLength);

		let readBytes = 0,
			readLimit = this.fileSize - this.position,
			readSinceLastSpace = 0,
			result = "";

		for(let step = 15; step > 0; step = Math.floor(step / 2)) {
			while(readBytes < readLimit) {
				hmFS.seek(this.file, this.position + readBytes, hmFS.SEEK_SET);
				hmFS.read(this.file, temp.buffer, 0, step * 4);

				const [char, byteLength] = FsUtils.decodeUtf8(temp, step, 0);

				// Check screen fit
				if(this.getTextHeight(result + char) > BOX_HEIGHT) {
					if(char != " " && char != "\n" && readBytes - readSinceLastSpace > 0) {
						readBytes -= readSinceLastSpace;
						result = result.substring(0, result.lastIndexOf(" "));
					}
					break;
				}

				readBytes += byteLength;
				const spaceIndex = char.indexOf(" ");
				if(spaceIndex > -1) {
					readSinceLastSpace = spaceIndex;
				} else {
					readSinceLastSpace += byteLength;
				}

				result += result.length == 0 ? char.trim() : char;
			}
		}

		this.bufferSize = readBytes;
		this.textView.setProperty(hmUI.prop.TEXT, result);

		const progress = Math.floor((this.position + this.bufferSize) / this.fileSize * 100);
		this.posView.setProperty(hmUI.prop.TEXT, progress + "%");
	}

	switchPage(delta) {
		const newOffset = this.offset + (this.PAGE_SIZE*delta);
		if(newOffset < 0) return;

		hmFS.seek(this.file, newOffset, hmFS.SEEK_SET);
		hmFS.read(this.file, buffer, 0, this.PAGE_SIZE);

		const text = FsUtils.Utf8ArrayToStr(new Uint8Array(buffer));
		const {height} = hmUI.getTextLayout(text, {
			text_size: 20,
			text_width: 176,
			wrapped: 1
		});

		console.log(height, text);

		this.textView.setProperty(hmUI.prop.MORE, {
			h: height
		});
		this.textView.setProperty(hmUI.prop.TEXT, text);
		this.buttonMore.setProperty(hmUI.prop.Y, height + 72);

		this.offset = newOffset;
		hmApp.setLayerY(0);
	}

	finish() {
		hmSetting.setBrightScreenCancel();
		hmFS.close(this.file);
	}
}


let __$$app$$__ = __$$hmAppManager$$__.currentApp;
let __$$module$$__ = __$$app$$__.current;
__$$module$$__.module = DeviceRuntimeCore.Page({
  onInit(p) {
    AppGesture.withYellowWorkaround("left", {
      appid: 33904,
      url: "page/TextViewScreen",
      param: p,
    });
    AppGesture.init();

  	if(!p) p = "/storage/js_apps/00008470/README.txt";
    new TextViewScreen(p).start();
  }
});
