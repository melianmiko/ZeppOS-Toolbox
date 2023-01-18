import {t, extendLocale} from "../lib/i18n";
import { SettingsListScreen } from "../utils/SettingsListScreen";

extendLocale({
	"danger_warn": {
		"en-US": "This option will show some features, that may cause your device to fail to boot. Continuing, you agree that in some moment all settings of that device may become lost.",
		"es-Es": "Esta opción mostrará algunas características que pueden causar que su dispositivo no arranque. Continuando, usted acepta que en algún momento se pueden perder todas las configuraciones de ese dispositivo."

	},
	"danger_agree": {
		"en-US": "Agree, enable",
		"es-Es": "Aceptar, habilitar"
	}
})

class DnagerToggle extends SettingsListScreen {
	build() {
    const allowDanger = hmFS.SysProGetBool("mmk_tb_danger_mode");
    if(allowDanger) {
    	hmFS.SysProSetBool("mmk_tb_danger_mode", false);
    	hmApp.goBack();
    	return;
    }

    this.text(t("danger_warn"));
    this.clickableItem(t("danger_agree"), "menu/cb_true.png", () => {
    	hmFS.SysProSetBool("mmk_tb_danger_mode", true);
    	hmApp.goBack();
    });
	}
}

let __$$app$$__ = __$$hmAppManager$$__.currentApp;
let __$$module$$__ = __$$app$$__.current;
__$$module$$__.module = DeviceRuntimeCore.Page({
  onInit(p) {
  	(new DnagerToggle).start();
  }
});
