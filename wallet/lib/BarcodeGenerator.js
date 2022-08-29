import {JsBarcode} from "./external/JsBarcode/JsBarcode.js"
import {qrcode} from "./external/qrcode";
import {CanvasTGA} from "./CanvasTGA.js";

export class BarcodeGenerator {
	constructor(type, content) {
		this.type = type;
		this.content = content;
	}

	createCanvas() {
		switch(this.type) {
			// case "PDF417":
			// 	return this._makePDF417();
			case "QR":
				return this._makeQr();
			default:
				return this._makeBarcode();
		}
	}

	_makePDF417() {
	    PDF417.init(this.content);

	    const {num_cols, num_rows, bcode} = PDF417.getBarcodeArray();
	    const canvas = new CanvasTGA(num_cols * 3, num_rows * 2);
	    canvas.fillStyle = "black";

	    for(let i = 0; i < num_rows; i++) {
	      for(let j = 0; j < num_cols; j++) {
	        if(bcode[i][j] == 1)
	          canvas.fillRect(3 * j, 2 * i, 3, 2);
	      }
	    }

	    return this._processCanvas(canvas);
	}

	_makeQr() {
		const qr = qrcode(5, "L");
		qr.addData(this.content);
		qr.make();

		const count = qr.getModuleCount();
		const canvas = new CanvasTGA(count * 5, count * 5);
		qr.renderTo2dContext(canvas, 5);

	    return this._processCanvas(canvas);
	}

	_makeBarcode() {
		const canvas = new CanvasTGA(1, 1);
	    canvas.addPalette({
			"#ffffff": 0xFFFFFF,
			"#000000": 0x0
		});

		JsBarcode(canvas, this.content, {
			format: this.type,
			flat: this.type.startsWith("EAN"),
			height: 60,
			width: 2,
			displayValue: false
		});

	    return this._processCanvas(canvas);
	}

	_processCanvas(canvas) {
		canvas = CanvasTGA.rotate90(canvas);

		if(canvas.height * 2 <= 480 && canvas.width * 2 <= 180) {
			// Scale x2
			console.log("Perform scale x2");

			const newCanvas = new CanvasTGA(canvas.width * 2, canvas.height * 2);
			newCanvas.addPalette(canvas.currentPalette);

			for(let x = 0; x < canvas.width; x++) {
				for(let y = 0; y < canvas.height; y++) {
					const val = canvas._getPixel(x, y);
					newCanvas.fillStyle = newCanvas.palette[val];
					newCanvas.fillRect(x * 2, y * 2, 2, 2);
				}
			}

			canvas = newCanvas;
		}

		return canvas;
	}
}