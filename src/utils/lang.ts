import { langs } from '../constants/langs.enum';

export function getTitleByLang(
  entity: any,
  lang: langs = langs.eng,
  options?: { rusPropName: string; engPropName: string },
): string {
  const rusPropName = options ? options.rusPropName : 'titleRus';
  const engPropName = options ? options.engPropName : 'titleEng';

  return lang === langs.rus ? entity[rusPropName] : entity[engPropName];
}
