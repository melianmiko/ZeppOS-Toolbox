import {COLOR_NAMES} from "./Locale";
import {extendLocale, t} from "../../lib/i18n";

extendLocale(COLOR_NAMES);

export const BG_OPTION_KEY = "mmk_im_bg_color";
export const HIGHSCORE_KEY = "mmk_im02_highscore";

export const BG_OPTIONS = [
	[t("Light green"), 0xc8ffdb],
	[t("Dark green"), 0x6da175],
	[t("Sand yellow"), 0xc4b984],
	[t("Light yellow"), 0xfbffd9],
	[t("Pink"), 0xc484a2],
	[t("Gray"), 0xbbbbbb],
]
