export class CanvasTGA {
	fillStyle = "";
	palette = [];

	contextOffsetX = 0;
	contextOffsetY = 0;

	constructor(width, height){
		this._size = [width, height];
		this._reinit();
		this.addPalette({
			"white": 0xffffff,
			"black": 0x0
		})
	}

	static rotate90(source) {
		const dest = new CanvasTGA(source.height, source.width);
		dest.addPalette(source.currentPalette);

		for(let x = 0; x < source.width; x++) {
			for(let y = 0; y < source.height; y++) {
				const v = source._getPixel(x, y);
				dest._putPixel(y, x, v);
			}
		}

		return dest;
	}

	saveAsset(fn) {
		const buffer = this.data.buffer;
		const f = hmFS.open_asset(fn, hmFS.O_WRONLY | hmFS.O_CREAT);
		hmFS.write(f, buffer, 0, buffer.byteLength);
		hmFS.close(f);
	}

	save() {}
	restore() {}
	fillText() {}

	measureText(t) {
		const metrics = hmUI.getTextLayout(t, {
			text_size: 18,
			text_width: 490
		})

		return metrics;
	}

	addPalette(data) {
		let i = 0;

		for(let name in data) {
			const v = data[name];
			const col = [
				v & 0xFF,
				(v && 0xFF00) >> 8,
				(v && 0xFF0000) >> 16,
				255
			];
			this.palette[i] = name;
			this.data.set(col, 64 + i * 4);
			i++;
		}

		this.currentPalette = data;
	}

	_reinit() {
		const width = this._size[0];
		const height = this._size[1];
		const dataSize = 64 + (4*256) + (width*height);
		this.data = new Uint8Array(dataSize);
		this.data.set([
			46, 1, 1, 0, 0, 0, 1, 0x20,
			0, 0, 0, 0, width & 0xFF, width >> 8, height & 0xFF, height >> 8,
			0x08, 0x20, 0x53, 0x4f, 0x4d, 0x48, width
		]);

		this.addPalette(this.currentPalette);

		console.log("WARN reinit", this._size);
	}

	clearRect(x, y, w, h) {
		const [iw, ih] = this._size;

		for(let i = 0; i < h; i++) {
			for(let j = 0; j < w; j++) {
				const offset = 1088 + (y + this.contextOffsetY + i) * iw
					+ (x + this.contextOffsetX + j);
				this.data[offset] = 0;
			}
		}
	}

	translate(x, y) {
		this.contextOffsetX = x;
		this.contextOffsetY = y;
	}

	fillRect(x, y, w, h) {
		const id = this.palette.indexOf(this.fillStyle);
		if(id < 0) {
			console.log("Missing color", this.fillStyle);
			console.log(this.palette);
			return;
		}
		const [iw, ih] = this._size;

		for(let i = 0; i < h; i++) {
			for(let j = 0; j < w; j++) {
				const offset = 1088 + (y + this.contextOffsetY + i) * iw
					+ (x + this.contextOffsetX + j);
				this.data[offset] = id;
			}
		}
	}

	_getPixel(x, y) {
		const offset = 1088 + (y * this._size[0]) + x;
		return this.data[offset];
	}

	_putPixel(x, y, value) {
		const offset = 1088 + (y * this._size[0]) + x;
		this.data[offset] = value;
	}

	get width() {
		return this._size[0];
	}

	set width(v) {
		this._size[0] = v;
		this._reinit();
	}

	get height() {
		return this._size[1];
	}

	set height(v) {
		this._size[1] = v;
		this._reinit();
	}
 
	getContext() {
		return this; // JS canvas compitability
	}
}