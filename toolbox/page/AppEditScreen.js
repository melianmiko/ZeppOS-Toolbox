import {t, extendLocale} from "../../lib/i18n";
import {SettingsListScreen} from "../../lib/SettingsListScreen";
import { AppGesture } from "../../lib/AppGesture";
import {FsTools, Path} from "../../lib/Path";

import {APP_EDIT_TRANSLATIONS} from "../utils/translations";

extendLocale(APP_EDIT_TRANSLATIONS)

class AppEditScreen extends SettingsListScreen {
	constructor(dirname) {
		super();
		
		this.dirname = dirname;
		this.dontKeepSettings = true;
		this.entry = new Path("full", `/storage/js_apps/${dirname}`);
		this.dataEntry = new Path("full", `/storage/js_apps/data/${dirname}`);
		this.appConfig = {};
	}

	build() {
		this.preloadAll();

		let size = this.entry.size();
		this.image(this.iconPath, 100);
		this.h1(this.appConfig.app.appName);

		this.clickableItem(t("action_launch"), "menu/play.png", () => {
			hmApp.startApp({
				appid: this.appConfig.app.appId,
				url: this.appConfig.module.page.pages[0]
			});
		});

		this.field(t("field_vendor"), this.appConfig.app.vender);
		this.field(t("field_size"), FsTools.printBytes(size));

		this.baseColor = 0xFF8888;
		this.clickableItem(t("action_uninstall"), "menu/delete.png", () => {
			this.uninstall();
		})

		this.baseColor = 0xFFFFFF;
		this.headline(t("headline_adv"));
		this.field("ID (dec / hex", `${this.appConfig.app.appId} / ${this.dirname}`);
		this.clickableItem(t("action_show_files"), "menu/files.png", () => {
			const path = `/storage/js_apps/${this.dirname}`;
			hmApp.gotoPage({
				url: "page/FileManagerScreen",
				param: JSON.stringify({
					path
				})
			})
		});

		if(this.appConfig.externalFilesList) {
			let configSize = 0;
			for(const path of this.appConfig.externalFilesList) {
				const [st, e] = new Path("full", path).stat();
				if(st !== null && st.size) configSize += st.size;
			}

			this.field(t("file_size_ext"), FsTools.printBytes(configSize));
			this.checkbox(t("conf_full"), this, "dontKeepSettings");
		}

		this._prepareFinishGroup();
	}

	preloadAll() {
		try {
			this.appConfig = this.entry.get("app.json").fetchJSON();

			let icon = this.entry.get(`assets/${this.appConfig.app.icon}`);
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

	_prepareTempFile(sourceEntry) {
		const current = hmFS.SysProGetChars("mmk_tb_temp");
		if(current) {
			new Path("assets", current).remove();
		}

		if(!sourceEntry.exists()) return "";

		const newFile = "temp_" + Math.round(Math.random() * 100000) + ".png";
		const dest = new Path("assets", newFile);
		sourceEntry.copy(dest);

		hmFS.SysProSetChars("mmk_tb_temp", newFile);
		return newFile;
	}

	uninstall() {
		this.entry.removeTree();
		this.dataEntry.removeTree();

		if(this.appConfig.externalFilesList) {
			for(const path of this.appConfig.externalFilesList) {
				try {
					new Path("full", path).remove();
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


Page({
	onInit(dirname) {
		AppGesture.withYellowWorkaround("left", {
			appid: 33904,
			url: "page/AppEditScreen",
		});
		AppGesture.init();

		this.screen = new AppEditScreen(dirname);
		this.screen.start();
	}
});
