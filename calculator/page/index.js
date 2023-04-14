import { AppGesture } from "../../lib/AppGesture";
import { Calculator } from "../src/Calculator";

let __$$app$$__ = __$$hmAppManager$$__.currentApp;
let __$$module$$__ = __$$app$$__.current;
__$$module$$__.module = DeviceRuntimeCore.Page({
	onInit() {
		hmUI.setLayerScrolling(false);
		AppGesture.on("left", () => {
			hmApp.gotoPage({
				url: "page/AboutScreen",
			});
		});
		AppGesture.init();
		
		this.calculator = new Calculator();
		this.calculator.start();
	},
	onDestroy() {
		this.calculator.save();
	}
});
