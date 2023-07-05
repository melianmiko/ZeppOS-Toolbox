import { AppGesture } from "../lib/mmk/AppGesture";
import { Path, FsTools } from "../lib/mmk/Path";
import { WIDGET_WIDTH, SCREEN_MARGIN_Y, SCREEN_HEIGHT, SCREEN_WIDTH, SCREEN_MARGIN_X, BASE_FONT_SIZE } from "../lib/mmk/UiParams";

const { config } = getApp()._options.globalData;

class TextViewScreen {
	constructor(data) {
		this.PAGE_SIZE = 256;

		this.fontSize = config.get("fontSize", BASE_FONT_SIZE);
		this.position = 0;
		this.bufferSize = 0;
		this.backStack = [];
		this.entry = new Path("full", data);
	}

	start() {
		hmSetting.setBrightScreen(1800);
		hmUI.setLayerScrolling(false);
    hmUI.setStatusBarVisible(false);

		// Prepare file
		const [st, e] = this.entry.stat();
		this.file = this.entry.open(hmFS.O_RDONLY);
		this.fileSize = st.size;

		// Init
		this.makeWidgets();
		this.displayForward();
	}

	makeWidgets() {
		// Text view
		this.textView = hmUI.createWidget(hmUI.widget.TEXT, {
			x: SCREEN_MARGIN_X,
			y: SCREEN_MARGIN_Y,
			w: WIDGET_WIDTH,
			h: SCREEN_HEIGHT - (SCREEN_MARGIN_Y * 2),
			text_size: this.fontSize,
			color: 0xffffff,
			text_style: hmUI.text_style.WRAP,
			text: ""
		});

		// Position view
		this.posView = hmUI.createWidget(hmUI.widget.TEXT, {
			x: SCREEN_MARGIN_X,
			y: 0,
			w: WIDGET_WIDTH,
			h: SCREEN_MARGIN_Y,
			text_size: 20,
			align_h: hmUI.align.CENTER_H,
			align_v: hmUI.align.CENTER_V,
			color: 0x999999,
			text: ""
		})

		// Next btn
		hmUI.createWidget(hmUI.widget.IMG, {
			x: 0,
			y: SCREEN_HEIGHT / 2,
			w: SCREEN_WIDTH,
			h: SCREEN_HEIGHT / 2
		}).addEventListener(hmUI.event.CLICK_UP, () => {
			this.pageNext();
		});

		// Back btn
		hmUI.createWidget(hmUI.widget.IMG, {
			x: 0,
			y: 0,
			w: SCREEN_WIDTH,
			h: SCREEN_HEIGHT / 2
		}).addEventListener(hmUI.event.CLICK_UP, () => {
			this.pageBack();
		});
	}

	getTextHeight(text) {
		return hmUI.getTextLayout(text, {
			text_size: this.fontSize,
			text_width: WIDGET_WIDTH,
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
		this._displayForward();
	}

	_displayForward() {
		const temp = new Uint8Array(15 * 4);
		const boxHeight = SCREEN_HEIGHT - (SCREEN_MARGIN_Y * 2);

		hmFS.read(this.file, temp.buffer, 0, temp.byteLength);

		let readBytes = 0,
			readLimit = this.fileSize - this.position,
			readSinceLastSpace = 0,
			result = "";

		for(let step = 15; step > 0; step = Math.floor(step / 2)) {
			while(readBytes < readLimit) {
				hmFS.seek(this.file, this.position + readBytes, hmFS.SEEK_SET);
				hmFS.read(this.file, temp.buffer, 0, step * 4);

				const [char, byteLength] = FsTools.decodeUtf8(temp, step, 0);

				// Check screen fit
				if(this.getTextHeight(result + char) > boxHeight) {
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

	finish() {
		hmSetting.setBrightScreenCancel();
		hmFS.close(this.file);
	}
}


Page({
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
