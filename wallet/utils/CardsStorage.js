import {FsUtils} from "../lib/FsUtils";

export class CardsStorage {
	constructor() {
		this.data = [];
		this._load();
	}

	static startWrite(data) {
		let url;

		switch(data.format) {
			case "QR":
				url = "page/WriteQR";
				break;
			case "PDF417":
				url = "page/WritePDF417";
				break;
			case "INT2OF5":
				url = "page/WriteInt2of5";
				break;
			default:
				url = "page/WriteBarcode";
		}

	    hmFS.SysProSetBool("mmk_c_aw", true);
		hmApp.gotoPage({
			url, 
			param: JSON.stringify(data)
		});
	}

	addCard(data, canvas) {
		// Maybe card with this value already exists?
		for(let i = 0; i < this.data.length; i++) {
			const row = this.data[i];
			if(row.content === data.content && 
				row.format === data.format &&
				row.icon === data.icon
			) {
				console.log("recover exiting card!");
				
				row.width = canvas.width;
				row.height = canvas.height;
				this._writeCanvas(canvas, row.filename);
				this._write();
				return row;
			}
		}

		let fn = `card_${Math.round(Math.random() * 1e8)}.png`;
		if(data.forceFilename) fn = data.forceFilename;
		this._writeCanvas(canvas, fn);

		const newData = {
			...data,
			filename: fn,
			width: canvas.width,
			height: canvas.height,
			index: this.data.length
		};

		if(data.noStore) return newData;

		console.log("Register new card");
		this.data.push(newData);
		this._write();

		return newData;
	}

	_writeCanvas(canvas, fn) {
		const buffer = canvas.data.buffer;
		const f = FsUtils.open(FsUtils.fullPath(fn), hmFS.O_WRONLY | hmFS.O_CREAT);
		hmFS.write(f, buffer, 0, buffer.byteLength);
		hmFS.close(f);
	}

	loadBackup(backup) {
		this.data = backup;
		this._write();
	}

	deleteCard(data) {
		const index = data.index;
		if(index < 0) return;
		
		try {
			const fn = this.data[index].filename;
			hmFS.remove(FsUtils.fullPath(fn));
		} catch(e) {}

		const newData = [];
		for(let i = 0; i < this.data.length; i++) {
			if(i == index) continue;
			newData.push(this.data[i]);
		}

		this.data = newData;
		this._write();
	}

	_write() {
		console.log("dump json", this.data);
		FsUtils.writeText("/storage/mmk_cards.json", JSON.stringify(this.data));
	}

	_load() {
		try {
			this.data = FsUtils.fetchJSON("/storage/mmk_cards.json");
		} catch(e) {}
	}
}