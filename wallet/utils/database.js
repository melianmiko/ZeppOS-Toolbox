const NOTICE_EAN13 = "Номер, указанный ПОД штрих-кодом, НЕ номер карты. 13 цифр.";

function formatEan13(v) {
	if(v.length == 0) return "";
	return v[0] + " " + 
		(v.substring(1).match(/.{1,6}/g) || []).join(" ");
}

function format3(v) {
	return v.match(/.{1,3}/g).join(" ");
}

function format4(v) {
	return v.match(/.{1,4}/g).join(" ");
}

export const CardTypes = {
	"5ka": {
		format: "EAN13",
		keyboard: "123",
		info: NOTICE_EAN13,
		displayFormat: formatEan13
	},
	"auchan": {
		format: "EAN13",
		keyboard: "123",
		displayFormat: formatEan13
	},
	"lenta": {
		format: "CODE128",
		keyboard: "123",
		displayFormat: format3
	},
	"perekrestok": {
		format: "EAN13",
		keyboard: "123",
		info: NOTICE_EAN13,
		displayFormat: formatEan13
	},
	"magnit": {
		format: "QR",
		keyboard: "123",
		displayFormat: format4,
		codePostProcessing: (v) => {
			return `E${v}`;
		}
	},
	"sportmaster": {
		format: "EAN13",
		keyboard: "123",
		displayFormat: formatEan13
	},
	"okay": {
		format: "EAN13",
		keyboard: "123",
		displayFormat: (v) => {
			return [
				v.substring(0,2), 
				v.substring(2,4), 
				...v.substring(4).match(/.{1,3}/g)
			].join(" ");
		}
	},
	"citilink": {
		format: "CODE39",
		keyboard: "123",
		displayFormat: format3
	},
	"fixprice": {
		format: "EAN13",
		keyboard: "123",
		info: "Только первые 9 цифр с физической карты. Либо 13 под штрих-кодом",
		displayFormat: format3,
		codePostProcessing: (v) => {
			if(!v.startsWith("2041"))
				v += "2041";
			return v;
		}
	},
	"detmir": {
		format: "CODE128",
		keyboard: "123",
		displayFormat: format4
	},
	"ostin": {
		format: "EAN13",
		keyboard: "123",
		info: NOTICE_EAN13,
		displayFormat: formatEan13
	},
	"covid": {
		format: "QR",
		keyboard: ["EN", "123"],
		info: "Отсканируйте ваш QR-код чем-нибудь, посмотрите ссылку. Наберите весь текст после \"status/\" и до \"?\".",
		codePostProcessing: (v) => {
			return `https://www.gosuslugi.ru/covid-cert/status/${v}?lang=ru`;
		}
	},
	"vernij": {
		format: "EAN13",
		keyboard: "123",
		displayFormat: formatEan13
	},
	"agrokomplex": {
		format: "EAN13",
		keyboard: "123",
		displayFormat: formatEan13
	},
	"farmlend": {
		format: "CODE128",
		keyboard: "123",
		codePostProcessing: (v) => {
			return `FLEND2012Y${v}`;
		}
	},
	"edelweis": {
		format: "EAN13",
		keyboard: "123",
		displayFormat: formatEan13
	},
	"april": {
		format: "EAN13",
		keyboard: "123",
		info: "Код под штрих-кодом на пластиковой карте. Из приложеиния скорее всего работать не будет. 13 цифр",
		displayFormat: formatEan13
	},
	"karusel": {
		format: "EAN13",
		keyboard: "123",
		info: NOTICE_EAN13,
		displayFormat: formatEan13
	},
	"maksimdom": {
		format: "CODE39",
		keyboard: "123",
		info: "7 цифр, указанные под штрих-кодом. Буквы DK в начале писать не нужно",
		codePostProcessing: (v) => {
			return `DK${v}`;
		}
	},
	"euroopt": {
		format: "CODE128",
		keyboard: "123"
	},
	"spar": {
		format: "QR",
		keyboard: "123",
		displayFormat: format4
	},
};
