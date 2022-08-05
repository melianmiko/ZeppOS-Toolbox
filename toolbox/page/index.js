(() => {
	const pageButtonStyle = {
		x: 12,
		w: 192-24,
		h: 64,
		normal_color: 0x222222,
		press_color: 0x444444,
		radius: 8
	};

	class QuickSettings {
		baseBrightnessConfig = {
			x: 12,
			y: 72,
			h: 80,
			radius: 8,
		};

		render() {
			// Draw elements
			this.drawBrightness();
			this.drawButtons();
		}

		drawButtons() {
			const buttons = {
				dnd: () => {
					hmApp.startApp({ url: "Settings_dndModelScreen", native: true });
				},
				flashlight: () => {
					hmApp.startApp({ url: "FlashLightScreen", native: true });
				},
				camera: () => {
					hmApp.startApp({url: "HidcameraScreen",native: true});
				},
				settings: () => {
					hmApp.startApp({url: "Settings_homeScreen",native: true});
				},
			};

			Object.keys(buttons).forEach((id, i) => {
				const x = 12 + (i % 2) * 90;
				const y = 164 + Math.floor(i / 2) * 90;

				hmUI.createWidget(hmUI.widget.IMG, {
					x,
					y,
					src: id + ".png",
				}).addEventListener(hmUI.event.CLICK_UP, () => {
					buttons[id]();
				});
			});
		}

		drawBrightness() {
			hmUI.createWidget(hmUI.widget.FILL_RECT, {
				...this.baseBrightnessConfig,
				color: 0x222222,
				w: 168,
			});
			this.widgetBrightness = hmUI.createWidget(hmUI.widget.FILL_RECT, {
				...this.baseBrightnessConfig,
				color: 0xffffff,
				alpha: 80,
			});
			hmUI.createWidget(hmUI.widget.IMG, {
				...this.baseBrightnessConfig,
				x: 20,
				y: this.baseBrightnessConfig.y + (80 - 36) / 2,
				alpha: 200,
				src: "brightness.png",
			});

			// Make click zones
			hmUI.createWidget(hmUI.widget.IMG, {
				...this.baseBrightnessConfig,
				src: "",
				w: 56,
			}).addEventListener(hmUI.event.CLICK_UP, () => {
				const val = Math.max(hmSetting.getBrightness() - 10, 0);
				hmSetting.setBrightness(val);
				this._updateBrightness();
			});
			hmUI.createWidget(hmUI.widget.IMG, {
				...this.baseBrightnessConfig,
				src: "",
				w: 56,
				x: 192 - 12 - 56,
			}).addEventListener(hmUI.event.CLICK_UP, () => {
				const val = Math.min(hmSetting.getBrightness() + 10, 100);
				hmSetting.setBrightness(val);
				this._updateBrightness();
			});

			this._updateBrightness();
		}

		_updateBrightness() {
			const val = 168 * (hmSetting.getBrightness() / 100);
			this.widgetBrightness.setProperty(hmUI.prop.MORE, {
				w: Math.max(val, 24),
				alpha: val == 0 ? 0 : 200,
			});
		}
	}

	let __$$app$$__ = __$$hmAppManager$$__.currentApp;
	let __$$module$$__ = __$$app$$__.current;
	__$$module$$__.module = DeviceRuntimeCore.Page({
		build() {
			hmUI.setLayerScrolling(true);

			// QuickSettings
			const qs = new QuickSettings();
			qs.render();

			// Apps btn
			hmUI.createWidget(hmUI.widget.IMG, {
				x: 12,
				y: 356,
				src: "apps.png"
			}).addEventListener(hmUI.event.CLICK_UP, () => {
				hmApp.gotoPage({url: "page/apps"});
			})

			// Files
			hmUI.createWidget(hmUI.widget.IMG, {
				x: 12,
				y: 432,
				src: "files.png"
			}).addEventListener(hmUI.event.CLICK_UP, () => {
				hmApp.gotoPage({url: "page/files"});
			});

			hmUI.createWidget(hmUI.widget.BUTTON, {
				...pageButtonStyle,
				y: 508,
				text: "AppListSort",
				click_func: () => {
					hmApp.startApp({ url: "Settings_applistSortScreen", native: true });
				}
			})

			hmUI.createWidget(hmUI.widget.TEXT, {
				x: 0,
				y: 600,
				w: 192,
				h: 32,
				text: "by MelianMiko",
				align_h: hmUI.align.CENTER_H,
				color: 0x999999
			})

			// Allow overscroll
			hmUI.createWidget(hmUI.widget.FILL_RECT, {
				x: 0,
				y: 640,
				w: 192,
				h: 80,
				color: 0x0
			})
		},
	});
})();
