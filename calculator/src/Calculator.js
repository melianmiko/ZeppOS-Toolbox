export class Calculator {
	buttons = [];
	screen = null;
	screenData = "";

	currentSet = [];
	currentSetId = -1;
	buttonSets = [
		["7", "8", "9", "4", "5", "6", "1", "2", "3", "0", "."],
		["+", "-", "*", "/", "√", "log", "sin", "cos", "π", "(", ")"],
	];

	operations = {
		"+": " + ",
		"-": " - ",
		"*": " * ",
		"/": " / ",
		"√": "sqrt(",
		"π": "PI",
		log: "log(",
		sin: "sin(",
		cos: "cos(",
	};

	start() {
		// Init screen
		this.screen = hmUI.createWidget(hmUI.widget.TEXT, {
			x: 8,
			y: 72,
			w: 192 - 16,
			h: 80,
			text: "",
			color: 0xffffff,
			text_size: 24,
			text_style: hmUI.text_style.WRAP,
			align_v: hmUI.align.CENTER_V,
		});

		this.screen.addEventListener(hmUI.event.CLICK_UP, () => {
			this.backspace();
		});

		// Init buttons
		for (let i = 0; i < 12; i++) {
			this.buttons[i] = hmUI.createWidget(hmUI.widget.BUTTON, {
				x: (i % 3) * 64 + 2,
				y: Math.floor(i / 3) * 64 + 160,
				w: 60,
				h: 60,
				radius: 8,
				text_size: 28	,
				text: "-",
				normal_color: 0x222222,
				press_color: 0x333333,
				click_func: this.initButtonEvents(i),
			});
		}

		this.buttons[11].setProperty(hmUI.prop.MORE, {
			normal_color: 0x444444,
			press_color: 0x666666,
			text: "...",
		});

		this.switchSet();

		// Init remove and process buttons
		hmUI.createWidget(hmUI.widget.BUTTON, {
			x: 0,
			y: 420,
			w: 192,
			h: 70,
			text: "=",
			normal_color: 0x222222,
			press_color: 0x444444,
			text_size: 32,
			click_func: () => {
				this.process();
			},
		});

		hmUI.createWidget(hmUI.widget.BUTTON, {
			x: 0,
			y: 0,
			w: 192,
			h: 70,
			text: "Clear",
			text_size: 20,
			color: 0x999999,
			click_func: () => {
				this.clear();
			},
		});

		// Load saved?
		const saved = hmFS.SysProGetChars("calc_display");
		if(saved) {
			this.screenData = saved;
			this.updateScreen();
		}
	}

	save() {
		hmFS.SysProSetChars("calc_display", this.screenData);
	}

	process() {
		const brDiff =
			this._countIncl(this.screenData, "(") -
			this._countIncl(this.screenData, ")");

		if (brDiff === 0) {
			const sqrt = (v) => Math.sqrt(v);
			const log = (v) => Math.log(v);
			const sin = (v) => Math.sin(v);
			const cos = (v) => Math.cos(v);
			const PI = Math.PI;

			try {
				let result = eval(this.screenData);
				result = Math.round(result * 1e6) / 1e6;
				this.screenData = result.toString();
			} catch (e) {
				console.warn(e);
				this.screenData = "E";
			}
		} else {
			for (let i = 0; i < brDiff; i++) this.screenData += ")";
		}

		this.updateScreen();
	}

	_countIncl(str, chr) {
		let c = 0;
		for (let i in str) if (str[i] === chr) c++;
		return c;
	}

	switchSet() {
		const newId = (this.currentSetId + 1) % this.buttonSets.length;
		const newSet = this.buttonSets[newId];

		for (let i = 0; i < newSet.length; i++) {
			this.buttons[i].setProperty(hmUI.prop.TEXT, newSet[i]);
		}

		this.currentSetId = newId;
		this.currentSet = newSet;
	}

	initButtonEvents(i) {
		return () => {
			if (i == 11) return this.switchSet();

			let val = this.currentSet[i];
			if (this.operations[val]) val = this.operations[val];
			this.appendScreen(val);

			if (this.currentSetId != 0) this.switchSet();
		};
	}

	appendScreen(val) {
		this.screenData += val;
		this.updateScreen();
	}

	updateScreen() {
		this.screen.setProperty(hmUI.prop.MORE, {
			text: this.screenData,
		});
	}

	clear() {
		this.screenData = "";
		this.updateScreen();
	}

	backspace() {
		this.screenData = this.screenData
			.substring(0, this.screenData.length - 1)
			.trim();
		this.updateScreen();
	}
}
