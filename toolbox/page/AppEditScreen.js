import {FsUtils} from "../../lib/FsUtils";
import {t, extendLocale} from "../../lib/i18n";
import {SettingsListScreen} from "../utils/SettingsListScreen";

extendLocale({
	"action_uninstall": {
		"en-US": "Uninstall",
		"zh-CN": "卸载",
		"zh-TW": "卸載",
		"ru-RU": "Удалить",
		"de-DE": "Deinstallieren",
		"es-Es": "Desinstalar"
	},
	"action_launch": {
		"en-US": "Launch",
		"zh-CN": "发射",
		"zh-TW": "發射",
		"ru-RU": "Запустить",
		"de-DE": "Starten",
		"es-Es": "Ejecutar"
	},
	"uninstall_complete": {
		"en-US": "Uninstalled",
		"zh-CN": "已卸载",
		"zh-TW": "已卸載",
		"ru-RU": "Удалено",
		"de-DE": "Deinstalliert",
		"es-Es": "Desinstalado"
	},
	"apps_notice_uninstall": {
		"en-US": "Please reboot device to finish",
		"zh-CN": "请重启设备以完成",
		"zh-TW": "請重啟設備以完成",
		"ru-RU": "Перезагрузите устройство для завершения",
		"de-DE": "Bitte das Gerät neustarten um abzuschließen",
		"es-Es": "Por favor reinicie el dispositivo"
	},
	"field_size": {
		"en-US": "Size",
		"zh-CN": "应用程序大小",
		"zh-TW": "應用程序大小",
		"ru-RU": "Размер",
		"de-DE": "Größe",
		"es-Es": "Tamaño"
	},
	"field_vendor": {
		"en-US": "Vendor",
		"zh-TW": "小販",
		"zh-CN": "小贩",
		"ru-RU": "Разработчик",
		"de-DE": "Hersteller",
		"es-Es": "Desarrollador"
	},
	"file_size_ext": {
		"en-US": "Size (ext. config)",
		"zh-CN": "大小（外部文件）",
		"zh-TW": "大小（外部文件）",
		"ru-RU": "Размер (внешн. файлы)",
		"de-DE": "Größe (ext. config)",
		"es-Es": "Tamaño (ext. config)"
	},
	"conf_full": {
		"en-US": "Don't keep ext. files on uninstall",
		"zh-CN": "卸载时删除外部文件",
		"zh-TW": "卸載時刪除外部文件",
		"ru-RU": "Также удалять внешние файлы",
		"de-DE": "ext Dateien bei Deinstallation NICHT bebehalten",
		"es-Es": "No conservar archivos ext. después de desinstalar"
	},
	"headline_adv": {
		"en-US": "Advanced",
		"zh-CN": "先进的",
		"zh-TW": "先進的",
		"ru-RU": "Дополнительно",
		"de-DE": "Erweitert",
		"es-Es": "Avanzado"
	}
})

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
