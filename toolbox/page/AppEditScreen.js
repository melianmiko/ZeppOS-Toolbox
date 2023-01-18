import {FsUtils} from "../../lib/FsUtils";
import {t, extendLocale} from "../../lib/i18n";
import {SettingsListScreen} from "../../lib/SettingsListScreen";

import {APP_EDIT_TRANSLATIONS} from "../utils/translations";

extendLocale(APP_EDIT_TRANSLATIONS)

class AppEditScreen extends SettingsListScreen {
	dontKeepSettings = true;

	constructor(dirname) {
		super();
		
		this.dirname = dirname;
		this.path = "/storage/js_apps/" + dirname;
		this.appConfig = {};
	}

	build() {
		this.preloadAll();

		let size = FsUtils.sizeTree(this.path);

		this.image(this.iconPath, 100);
		this.h1(this.appConfig.app.appName);

		this.clickableItem(t("action_launch"), "menu/play.png", () => {
			hmApp.startApp({
				appid: this.appConfig.app.appId,
				url: this.appConfig.module.page.pages[0]
			});
		});

		this.field(t("field_vendor"), this.appConfig.app.vender);
		this.field(t("field_size"), FsUtils.printBytes(size));

		this.baseColor = 0xFF8888;
		this.clickableItem(t("action_uninstall"), "menu/delete.png", () => {
			this.uninstall();
		})

		this.baseColor = 0xFFFFFF;
		if(this.appConfig.externalFilesList) {
			let configSize = 0;
			for(const path of this.appConfig.externalFilesList) {
				const [st, e] = FsUtils.stat(path);
				if(st !== null && st.size) configSize += st.size;
			}

			this.headline(t("headline_adv"));
			this.field(t("file_size_ext"), FsUtils.printBytes(configSize));
			this.checkbox(t("conf_full"), this, "dontKeepSettings");
		}

		this._prepareFinishGroup();
	}

	preloadAll() {
			try {
				this.appConfig = FsUtils.fetchJSON(this.path + '/app.json');

				let icon = this.path + "/assets/" + this.appConfig.app.icon;
				this.iconPath = this._prepareTempFile(icon);
			} catch (e) {
				console.log(e);
			}
	}

	_prepareFinishGroup() {
		const group = hmUI.createWidget(hmUI.widget.GROUP, {
			x: 0,
			y: 0,
			w: 192,
			h: 482
		});
		group.createWidget(hmUI.widget.FILL_RECT, {
			x: 0,
			y: 0,
			w: 192,
			h: 482,
			color: 0x0
		});
		group.createWidget(hmUI.widget.TEXT, {
			x: 0,
			y: 120,
			w: 192,
			h: 48,
			text_size: 26,
			text_style: hmUI.text_style.WRAP,
			align_h: hmUI.align.CENTER_H,
			color: 0x66BB6A,
			text: t("uninstall_complete")
		});
		group.createWidget(hmUI.widget.TEXT, {
			x: 0,
			y: 180,
			w: 192,
			h: 80,
			text_size: 20,
			text_style: hmUI.text_style.WRAP,
			align_h: hmUI.align.CENTER_H,
			color: 0xffffff,
			text: t("apps_notice_uninstall")
		});

		group.createWidget(hmUI.widget.IMG, {
			x: 0,
			y: 320,
			w: 192,
			h: 48,
			pos_x: (192-48)/2,
			pos_y: 0,
			src: "i_next.png"
		}).addEventListener(hmUI.event.CLICK_UP, () => {
			hmApp.startApp({
				url: "Settings_systemScreen",
				native: true
			});
		});

		group.setProperty(hmUI.prop.VISIBLE, false);
		this.finishGroup = group;
	}

	_prepareTempFile(sourcePath) {
		const current = hmFS.SysProGetChars("mmk_tb_temp");
		if(current) {
			const path = FsUtils.fullPath(current);
			hmFS.remove(path);
		}

		if(sourcePath === "") return "";
			
		const data = FsUtils.read(sourcePath);
		const newFile = "temp_" + Math.round(Math.random() * 100000) + ".png";
		const dest = hmFS.open_asset(newFile, hmFS.O_WRONLY | hmFS.O_CREAT);
		hmFS.seek(dest, 0, hmFS.SEEK_SET);
		hmFS.write(dest, data, 0, data.byteLength);
		hmFS.close(dest);

		hmFS.SysProSetChars("mmk_tb_temp", newFile);
		return newFile;
	}

	uninstall() {
		FsUtils.rmTree("/storage/js_apps/" + this.dirname);
		FsUtils.rmTree("/storage/js_apps/data" + this.dirname);

		if(this.appConfig.externalFilesList) {
			for(const path of this.appConfig.externalFilesList) {
				try {
					hmFS.remove(path);
				} catch(e) {
					console.log(e);
				}
			}
		}

		hmApp.setLayerY(0);
		hmUI.setLayerScrolling(false);
		this.finishGroup.setProperty(hmUI.prop.VISIBLE, true);
	}
}


let __$$app$$__ = __$$hmAppManager$$__.currentApp;
let __$$module$$__ = __$$app$$__.current;
__$$module$$__.module = DeviceRuntimeCore.Page({
	onInit(dirname) {
		this.screen = new AppEditScreen(dirname);
		this.screen.start();
	}
});
