import {TouchEventManager} from "../lib/TouchEventManager";

export class SettingsListScreen {
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

	headline(title) {
		hmUI.createWidget(hmUI.widget.TEXT, {
			x: 4,
			y: this.posY,
			w: 192,
			h: 32,
			text: title,
			color: 0xAAAAAA,
			align_v: hmUI.align.CENTER_V
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

	propCheckbox(name, key, fallback) {
		let value = hmFS.SysProGetBool(key);
		if(value === undefined) value = fallback;

		const [group, viewHeight] = this._mkBaseGroup(name);

		const icon = group.createWidget(hmUI.widget.IMG, {
			x: 10,
			y: 20,
			src: "menu/cb_" + value + ".png"
		})

		this._addClickEv(group, viewHeight, () => {
			value = !value;
			hmFS.SysProSetBool(key, value);
			icon.setProperty(hmUI.prop.MORE, {
				src: "menu/cb_" + value + ".png"
			})
		});
	}

	_mkBaseGroup(name) {
		const textHeight = hmUI.getTextLayout(name, {text_size: 18, text_width: 120}).height;
		const viewHeight = Math.max(64, textHeight + 36);

		const group = hmUI.createWidget(hmUI.widget.GROUP, {
			x: 4,
			y: this.posY,
			w: 184,
			h: viewHeight
		});

		group.createWidget(hmUI.widget.FILL_RECT, {
			x: 0,
			y: 0,
			w: 184,
			h: viewHeight,
			color: 0x111111,
			radius: 8
		});

		group.createWidget(hmUI.widget.TEXT, {
			x: 44,
			y: 0,
			w: 120,
			h: viewHeight,
			align_v: hmUI.align.CENTER_V,
			text_style: hmUI.text_style.WRAP,
			text_size: 18,
			color: 0xffffff,
			text: name
		});

		return [group, viewHeight]
	}

	_addClickEv(group, viewHeight, click_func) {
		const ch = group.createWidget(hmUI.widget.IMG, {
			x: 0,
			y: 0,
			w: 184,
			h: viewHeight,
			src: ""
		});

		const evm = new TouchEventManager(ch);
		evm.ontouch = click_func;

		this.posY += viewHeight + 8;
	}
}