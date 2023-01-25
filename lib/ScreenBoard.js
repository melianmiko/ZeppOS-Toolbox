const CAPS_SYM = "CAPS";
const SB_DATASETS = {
	"123": [
		"1", "2", "3", "4", "5", "6", "7", "8", "9", "0"
	],
	"EN": [
		[".", ",", "-", "/", "?", "!", ":", ";", "(", ")", "1"],
		["a", "b", "c", "2"],
		["d", "e", "f", "3"],
		["g", "h", "i", "4"],
		["j", "k", "l", "5"],
		["m", "n", "o", "6"],
		["p", "q", "r", "s", "7"],
		["t", "u", "v", "8"],
		["w", "x", "y", "z", "9"],
		[" ", "0"],
		CAPS_SYM
	],
	"RU": [
		[".", ",", "-", "/", "?", "!", ":", ";", "(", ")", "1"],
		["а", "б", "в", "г", "2"],
		["д", "е", "ё", "ж", "з", "3"],
		["и", "й", "к", "л", "4"],
		["м", "н", "о", "п", "5"],
		["р", "с", "т", "у", "6"],
		["ф", "х", "ц", "ч", "7"],
		["ш", "щ", "ъ", "ы", "8"],
		["ь", "э", "ю", "я", "9"],
		[" ", "0"],
		CAPS_SYM
	]
}

export class ScreenBoard {
	isSubpage = false;
	currentContents = [];
	_displayValue = "";
	_modeList = [];
	_currentMode = "";
	_capsState = false;

	constructor(mode) {
		this._build();
		if(typeof mode == "string") {
			this.setMode(mode);
		} else {
			this._modeList = mode;
			this.setMode(mode[0]);
		}
	}

	get value() {
		return this._displayValue;
	}

	set value(v) {
		this._valueScreen.setProperty(hmUI.prop.TEXT, this.displayFormat(v));
		this._displayValue = v;
	}

	set title(v) {
		this._titleBox.setProperty(hmUI.prop.TEXT, v);
	}

	set confirmButtonText(v) {
		this._confirmBtn.setProperty(hmUI.prop.TEXT, v);
	}

	get visible() {
		return this.group.getProperty(hmUI.prop.VISIBLE);
	}

	set visible(v) {
		this.group.setProperty(hmUI.prop.VISIBLE, v);
		hmApp.setLayerY(0);
	}

	onConfirm() {
		console.log("override me");
	}

	displayFormat(v) {
		return v;
	}

	setMode(mode) {
		const data = SB_DATASETS[mode];
		this.rootData = data;

		this.isSubpage = false;
		this._currentMode = mode;
		this._loadButtons(data);

		if(this._modeList.length > 0) {
			this._buttons[10].setProperty(hmUI.prop.TEXT, mode);
		}
	}

	_build() {
		this.group = hmUI.createWidget(hmUI.widget.GROUP, {
			x: 0,
			y: 0,
			w: 192,
			h: 490
		});

		this.group.createWidget(hmUI.widget.FILL_RECT, {
			x: 0,
			y: 0,
			w: 192,
			h: 490,
			color: 0x0
		});

		this._titleBox = this.group.createWidget(hmUI.widget.TEXT, {
			x: 24,
			y: 0,
			w: 144,
			h: 96,
			align_h: hmUI.align.CENTER_H,
			align_v: hmUI.align.CENTER_V,
			text_style: hmUI.text_style.WRAP,
			text: "Input",
			color: 0xAAAAAA
		})

		this.group.createWidget(hmUI.widget.IMG, {
			x: 160,
			y: 80,
			w: 32,
			h: 104,
			pos_x: 4,
			pos_y: 40,
			alpha: 120,
			src: "backspace.png"
		}).addEventListener(hmUI.event.CLICK_UP, () => this._backspace());

		this._valueScreen = this.group.createWidget(hmUI.widget.TEXT, {
			x: 0,
			y: 80,
			w: 160,
			h: 104,
			text: "",
			text_size: 22,
			color: 0xFFFFFF,
			align_v: hmUI.align.CENTER_V,
			text_style: hmUI.text_style.WRAP
		});

		this._confirmBtn = this.group.createWidget(hmUI.widget.BUTTON, {
			x: 0,
			y: 420,
			w: 192,
			h: 70,
			text: "Confirm",
			color: 0xFFFFFF,
			normal_color: 0x111111,
			press_color: 0x222222,
			click_func: () => this.onConfirm(this.value)
		});

		this._buttons = [];
		for(let i = 0; i < 12; i++) {
			this._mkButton(i);
		}
	}

	_mkButton(i) {
		this._buttons.push(this.group.createWidget(hmUI.widget.BUTTON, {
			x: 64 * (i % 3),
			y: 192 + 52 * Math.floor(i / 3),
			w: 64,
			h: 52,
			text: "",
			text_size: 22,
			normal_color: 0x050505,
			press_color: 0x111111,
			color: 0xCCCCCC,
			click_func: () => this._handleClick(i)
		}));
	}

	_loadButtons(data) {
		for(let i = 0; i < 11; i++) {
			let value = "", content = "";
			if(i < data.length) {
				content = data[i];
				if(typeof data[i] != "string") {
					for(let j = 0; j < 3; j++) {
						if(j >= data[i].length) break;
						value += data[i][j];
					}
				} else {
					value = data[i];
				}
			}

			value = value.replace(" ", "_");

			if(i === 10) i = 11;
			this._buttons[i].setProperty(hmUI.prop.TEXT, value);

			this.currentContents[i] = content;
		}
	}

	_handleClick(i) {
		let val = this.currentContents[i];

		// Tecn btns
		if(i == 10) 
			return this._modeSwitch();
		if(val == CAPS_SYM) 
			return this._switchCaps();

		if(typeof val != "string") {
			this.isSubpage = true;
			this._loadButtons(val);
			return;
		}

		if(this._capsState) val = val.toUpperCase();

		this.value += val;

		if(this.isSubpage) {
			this._loadButtons(this.rootData);
			this.isSubpage = false;
		}
	}

	_switchCaps() {
		this._capsState = !this._capsState;
		hmUI.showToast({
			text: this._capsState ? "ABC" : "abc"
		});
	}

	_modeSwitch() {
		if(this._modeList.length < 1) return;
		const cur = this._modeList.indexOf(this._currentMode);
		const next = (cur + 1) % this._modeList.length;
		this.setMode(this._modeList[next]);
	}

	_backspace() {
		this.value = this.value.substring(0, this.value.length-1);
	}
}
