import { AppGesture } from "../../lib/AppGesture";
import {FsUtils} from "../../lib/FsUtils";

class HexdumpScreen {
	constructor(data) {
		this.path = data;
		this.offset = 0;
	}

	start() {
		this.size = FsUtils.stat(this.path)[0].size;
		this.file = FsUtils.open(this.path);

		this.header = hmUI.createWidget(hmUI.widget.TEXT, {
			x: 0,
			y: 0,
			w: 192,
			h: 72,
			align_h: hmUI.align.CENTER_H,
			align_v: hmUI.align.CENTER_V,
			text: "hello",
			color: 0x999999
		});

		this.columns = [];
		this.textColumns = [];
		for(let i = 0; i < 4; i++) {
			this.columns.push(hmUI.createWidget(hmUI.widget.TEXT, {
				x: 4 + (26*i),
				y: 96,
				w: 30,
				h: 320,
				text_size: 18,
				text: "00\n00\n00",
				color: 0xFFFFFF,
				align_h: hmUI.align.CENTER_H
			}));

			this.textColumns.push(hmUI.createWidget(hmUI.widget.TEXT, {
				x: 116 + (18*i),
				y: 96,
				w: 18,
				h: 320,
				text_size: 18,
				text: "a",
				color: 0xAAAAAA,
				align_h: hmUI.align.CENTER_H
			}))
		}

		hmUI.createWidget(hmUI.widget.IMG, {
			x: 0,
			y: 0,
			w: 192,
			h: 245,
			src: ""
		}).addEventListener(hmUI.event.CLICK_UP, () => {
			this.refresh(this.offset - 64);
		})
		hmUI.createWidget(hmUI.widget.IMG, {
			x: 0,
			y: 245,
			w: 192,
			h: 245,
			src: ""
		}).addEventListener(hmUI.event.CLICK_UP, () => {
			this.refresh(this.offset + 64);
		})

		this.refresh(this.offset);
	}

	refresh(newOffset) {
		const lines = 16;

		if(newOffset > this.size) return;
		if(newOffset < 0) return;

		const headerText = newOffset.toString(16) + " / " + this.size.toString(16);
		this.header.setProperty(hmUI.prop.TEXT, headerText.toUpperCase());

		const buffer = new ArrayBuffer(4 * lines);
		const view = new Uint8Array(buffer);
		hmFS.seek(this.file, newOffset, hmFS.SEEK_SET);
		hmFS.read(this.file, buffer, 0, 4 * lines);

		// Update byte columns
		for(let i = 0; i < 4; i++) {
			let data = "", text = "";
			for(let j = 0; j < lines; j++) {
				if(newOffset + (4*j) + i > this.size) break;
				let charCode = view[(4*j) + i];
				if(charCode < 32 || charCode > 126)
					charCode = 46; // .

				data += view[(4*j) + i].toString(16).padStart(2, "0").toUpperCase() + "\n";
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
