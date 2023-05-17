import {TouchEventManager} from "./TouchEventManager";

const STYLE_HEADLINE = {
	x: 4,
	w: 192-8,
	h: 32,
	color: 0xEEEEEE,
	align_v: hmUI.align.CENTER_V
};

const STYLE_H1 = {
	x: 4,
	w: 192-8,
	h: 48,
	text_size: 32,
	color: 0xFFFFFF,
	align_v: hmUI.align.CENTER_V
}

const STYLE_BG = {
	x: 0,
	y: 0,
	w: 192,
	color: 0x111111,
	radius: 8
}


export class SettingsListScreen {
	constructor() {
		this.baseColor = 0xFFFFFF;
	}

	start() {
		this.posY = 96;
		this.build();

		hmUI.createWidget(hmUI.widget.FILL_RECT, {
			x: 0,
			y: this.posY,
			w: 192,
			h: 96
		});
	}

	image(src, height) {
		hmUI.createWidget(hmUI.widget.IMG, {
			x: 4,
			y: this.posY,
			src
		});

		this.posY += height + 8;
	}

	h1(title) {
		hmUI.createWidget(hmUI.widget.TEXT, {
			...STYLE_H1,
			y: this.posY,
			text: title
		});

		this.posY += 56;
	}

	text(text, size=20) {
		const metrics = hmUI.getTextLayout(text, {
			text_size: size,
			text_width: 192-8,
			wrapped: true
		});

		hmUI.createWidget(hmUI.widget.TEXT, {
			x: 4,
			y: this.posY,
			w: 192-8,
			h: metrics.height,
			text,
			text_size: size,
			text_style: hmUI.text_style.WRAP,
			color: 0xEEEEEE
		});

		this.posY += metrics.height + 8;
	}

	headline(title) {
		hmUI.createWidget(hmUI.widget.TEXT, {
			...STYLE_HEADLINE,
			y: this.posY,
			text: title
		});

		this.posY += 32;
	}

	clickableItem(name, icon, click_func) {
		const [group, viewHeight] = this._mkBaseGroup(name);

		group.createWidget(hmUI.widget.IMG, {
			x: 10,
			y: 20,
			src: icon
		});

		this._addClickEv(group, viewHeight, click_func);
	}

	field(name, value, callback) {
		const group = hmUI.createWidget(hmUI.widget.GROUP, {
			x: 0,
			y: this.posY,
			w: 192,
			h: 64
		});

		group.createWidget(hmUI.widget.FILL_RECT, {
			...STYLE_BG,
			h: 64
		});

		group.createWidget(hmUI.widget.TEXT, {
			x: 4,
			y: 4,
			w: 192,
			h: 24,
			align_v: hmUI.align.CENTER_V,
			text_size: 18,
			color: 0xAAAAAA,
			text: name
		});
		
		const viewValue = group.createWidget(hmUI.widget.TEXT, {
			x: 4,
			y: 28,
			w: 192,
			h: 32,
			align_v: hmUI.align.CENTER_V,
			text_size: 20,
			color: 0xFFFFFF,
			text: value
		});

		if(callback !== "") {
			this._addClickEv(group, 64, callback);
			return (v) => viewValue.setProperty(hmUI.prop.TEXT, v);
		} else {
			return [group, viewValue];
		}
	}

	checkbox(name, storage, key) {
		let value = !!storage[key];
		const [group, viewHeight] = this._mkBaseGroup(name);

		const icon = group.createWidget(hmUI.widget.IMG, {
			x: 10,
			y: 20,
			src: "menu/cb_" + value + ".png"
		})

		this._addClickEv(group, viewHeight, () => {
			storage[key] = !storage[key];

			icon.setProperty(hmUI.prop.MORE, {
				src: "menu/cb_" + (!!storage[key]) + ".png"
			})
		});
	}

	controlledInteger(name, value, callback) {
		const [group, textView] = this.field(name, value, "");

		textView.setProperty(hmUI.prop.MORE, {
			align_h: hmUI.align.CENTER_H
		});

		const img = group.createWidget(hmUI.widget.IMG, {
			x: 0,
			y: 28,
			src: "field/int.png"
		});

		this._addClickEv(group, 64, (e) => {
			value += (e.x > 96 ? 1 : -1);
			callback(value);
			textView.setProperty(hmUI.prop.TEXT, String(value));
		});
	}

	propInteger(name, key, fallback) {
		let value = hmFS.SysProGetInt(key);
		if(value === undefined) value = fallback;
		return this.controlledInteger(name, value, (v) => {
			hmFS.SysProSetInt(key, v);
		})
	}

	controlledCheckbox(name, value, onChange) {
		const [group, viewHeight] = this._mkBaseGroup(name);

		const icon = group.createWidget(hmUI.widget.IMG, {
			x: 10,
			y: 20,
			src: "menu/cb_" + value + ".png"
		})

		this._addClickEv(group, viewHeight, () => {
			value = !value;
			onChange(value);
			icon.setProperty(hmUI.prop.MORE, {
				src: "menu/cb_" + value + ".png"
			})
		});
	}

	propCheckbox(name, key, fallback) {
		let value = hmFS.SysProGetBool(key);
		if(value === undefined) value = fallback;

		return this.controlledCheckbox(name, value, (v) => {
			hmFS.SysProSetBool(key, value);
		});
	}

	_mkBaseGroup(name) {
		const textHeight = hmUI.getTextLayout(name, {text_size: 18, text_width: 144}).height;
		const viewHeight = Math.max(64, textHeight + 36);

		const group = hmUI.createWidget(hmUI.widget.GROUP, {
			x: 0,
			y: this.posY,
			w: 192,
			h: viewHeight
		});

		group.createWidget(hmUI.widget.FILL_RECT, {
			...STYLE_BG,
			h: viewHeight
		});

		group.createWidget(hmUI.widget.TEXT, {
			x: 44,
			y: 0,
			w: 144,
			h: viewHeight,
			align_v: hmUI.align.CENTER_V,
			text_style: hmUI.text_style.WRAP,
			text_size: 18,
			color: this.baseColor,
			text: name
		});

		return [group, viewHeight]
	}

	_addClickEv(group, viewHeight, click_func) {
		if(click_func) {
			const ch = group.createWidget(hmUI.widget.IMG, {
				x: 0,
				y: 0,
				w: 184,
				h: viewHeight,
				src: ""
			});

			const evm = new TouchEventManager(ch);
			evm.ontouch = click_func;
		}

		this.posY += viewHeight + 8;
	}
}
