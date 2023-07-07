import {strings as enStrings} from "./translations/en-US.js";
import {strings as deStrings} from "./translations/de-DE.js";
import {strings as esStrings} from "./translations/es-ES.js";
import {strings as ptStrings} from "./translations/pt-BR.js";
import {strings as ruStrings} from "./translations/ru-RU.js";
import {strings as cnStrings} from "./translations/zh-CN.js";
import {strings as cnTwStrings} from "./translations/zh-TW.js";

export function initTranslations(loadLocale) {
  loadLocale("en-US", enStrings);
  loadLocale("de-DE", deStrings);
  loadLocale("es-ES", esStrings);
  loadLocale("pt-BR", ptStrings);
  loadLocale("ru-RU", ruStrings);
  loadLocale("zh-CN", cnStrings);
  loadLocale("zh-TW", cnTwStrings);
}
