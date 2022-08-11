class TextViewScreen {
	PAGE_SIZE = 256;

	constructor(data) {
		this.path = data.file;
		this.offset = 0;
	}

	start() {
		hmSetting.setBrightScreen(1800);
		hmUI.setLayerScrolling(true);

		this.file = FsUtils.open(this.path, hmFS.O_RDONLY);

		hmUI.createWidget(hmUI.widget.BUTTON, {
			x: 0,
			y: 0,
			w: 192,
			h: 72,
			normal_color: 0x222222,
			press_color: 0x333333,
			text: "/\\",
			click_func: () => {
				this.switchPage(-1);
			}
		});

		this.textView = hmUI.createWidget(hmUI.widget.TEXT, {
			x: 8,
			y: 72,
			w: 176,
			h: 20,
			text_size: 20,
			color: 0xffffff,
			text_style: hmUI.text_style.WRAP,
			text: ""
		});

		this.buttonMore = hmUI.createWidget(hmUI.widget.BUTTON, {
			x: 0,
			y: 72,
			w: 192,
			h: 72,
			normal_color: 0x222222,
			press_color: 0x333333,
			text: "\\/",
			click_func: () => {
				this.switchPage(1);
			}
		});

		this.switchPage(0);
	}

	switchPage(delta) {
		const newOffset = this.offset + (this.PAGE_SIZE*delta);
		if(newOffset < 0) return;

		const buffer = new ArrayBuffer(this.PAGE_SIZE);
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