import { AppGesture } from "../../lib/mmk/AppGesture";
import { Path } from "../../lib/mmk/Path";
import { WIDGET_WIDTH, SCREEN_MARGIN_Y, SCREEN_HEIGHT, SCREEN_WIDTH, SCREEN_MARGIN_X } from "../../lib/mmk/UiParams";

class HexdumpScreen {
	constructor(data) {
		this.entry = new Path("full", data);
		this.offset = 0;
		this.count = Math.floor(WIDGET_WIDTH / 42);
		this.count -= this.count % 4;
		this.lines = 10;
	}

	start() {
    hmUI.setStatusBarVisible(false);
		const offsetX = Math.floor((WIDGET_WIDTH - this.count * 42) / 2) + SCREEN_MARGIN_X
		this.size = this.entry.stat()[0].size;
		this.file = this.entry.open();

		this.header = hmUI.createWidget(hmUI.widget.TEXT, {
			x: SCREEN_MARGIN_X,
			y: 0,
			w: WIDGET_WIDTH,
			h: SCREEN_MARGIN_Y,
			align_h: hmUI.align.CENTER_H,
			align_v: hmUI.align.CENTER_V,
			text: "hello",
			color: 0x999999,
			text_size: 22,
		});

		this.columns = [];
		this.textColumns = [];
		for(let i = 0; i < this.count; i++) {
			this.columns.push(hmUI.createWidget(hmUI.widget.TEXT, {
				x: offsetX + (26*i),
				y: SCREEN_MARGIN_Y,
				w: 30,
				h: SCREEN_HEIGHT - SCREEN_MARGIN_Y,
				text_size: 18,
				text: "00\n00\n00",
				color: 0xFFFFFF,
				align_h: hmUI.align.CENTER_H
			}));

			this.textColumns.push(hmUI.createWidget(hmUI.widget.TEXT, {
				x: offsetX + (26 * this.count) + 2 + (16*i),
				y: SCREEN_MARGIN_Y,
				w: 18,
				h: SCREEN_HEIGHT - SCREEN_MARGIN_Y,
				text_size: 18,
				text: "a",
				color: 0xAAAAAA,
				align_h: hmUI.align.CENTER_H
			}))
		}

		hmUI.createWidget(hmUI.widget.IMG, {
			x: 0,
			y: 0,
			w: SCREEN_WIDTH,
			h: Math.floor(SCREEN_HEIGHT / 2),
			src: ""
		}).addEventListener(hmUI.event.CLICK_UP, () => {
			this.refresh(this.offset - (this.lines * this.count));
		})
		hmUI.createWidget(hmUI.widget.IMG, {
			x: 0,
			y: Math.floor(SCREEN_HEIGHT / 2),
			w: SCREEN_WIDTH,
			h: Math.floor(SCREEN_HEIGHT / 2),
			src: ""
		}).addEventListener(hmUI.event.CLICK_UP, () => {
			this.refresh(this.offset + (this.lines * this.count));
		})

		this.refresh(this.offset);
	}

	refresh(newOffset) {
		const lines = this.lines;

		if(newOffset > this.size) return;
		if(newOffset < 0) return;

		const headerText = newOffset.toString(16) + " / " + this.size.toString(16);
		this.header.setProperty(hmUI.prop.TEXT, headerText.toUpperCase());

		const buffer = new ArrayBuffer(this.count * lines);
		const view = new Uint8Array(buffer);
		hmFS.seek(this.file, newOffset, hmFS.SEEK_SET);
		hmFS.read(this.file, buffer, 0, this.count * lines);

		// Update byte columns
		for(let i = 0; i < this.count; i++) {
			let data = "", text = "";
			for(let j = 0; j < lines; j++) {
				if(newOffset + (this.count*j) + i > this.size) break;
				let charCode = view[(this.count*j) + i];
				if(charCode < 32 || charCode > 126)
					charCode = 46; // .

				data += view[(this.count*j) + i].toString(16).padStart(2, "0").toUpperCase() + "\n";
				text += String.fromCharCode(charCode) + "\n";
			}

			this.columns[i].setProperty(hmUI.prop.TEXT, data);
			this.textColumns[i].setProperty(hmUI.prop.TEXT, text);
		}

		this.offset = newOffset;
	}
}

Page({
  onInit(p) {
    AppGesture.withYellowWorkaround("left", {
      appid: 33904,
      url: "page/HexdumpScreen",
      param: p,
    });
    AppGesture.init();
    new HexdumpScreen(p).start();
  }
});
