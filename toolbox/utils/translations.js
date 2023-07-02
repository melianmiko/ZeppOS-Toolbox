import {strings as englishStrings} from "./translations/en-US.js";
import {strings as deutchStrings} from "./translations/de-DE.js";
import {strings as espanolStrings} from "./translations/es-ES.js";
import {strings as portugaleStrings} from "./translations/pt-BR.js";
import {strings as russianStrings} from "./translations/ru-RU.js";
import {strings as chineseStrings} from "./translations/zh-CN.js";
import {strings as taiwanStrings} from "./translations/zh-TW.js";

export function initTranslations(loadLocale) {
  loadLocale("en-US", englishStrings);
  loadLocale("de-DE", deutchStrings);
  loadLocale("es-ES", espanolStrings);
  loadLocale("pt-BR", portugaleStrings);
  loadLocale("ru-RU", russianStrings);
  loadLocale("zh-CN", chineseStrings);
  loadLocale("zh-TW", taiwanStrings);
}
