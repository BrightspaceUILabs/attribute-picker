import { LocalizeDynamicMixin } from '@brightspace-ui/core/mixins/localize-dynamic-mixin.js';

export const Localizer = superclass => class extends LocalizeDynamicMixin(superclass) {
	static get localizeConfig() {
		return {
			importFunc: async lang => {
				switch (lang) {
					case 'ar':
						return (await import('./lang/ar.js')).default;
						break;
					case 'da':
						return (await import('./lang/da.js')).default;
						break;
					case 'de':
						return (await import('./lang/de.js')).default;
						break;
					case 'en':
						return (await import('./lang/en.js')).default;
						break;
					case 'es':
						return (await import('./lang/es.js')).default;
						break;
					case 'fr':
						return (await import('./lang/fr.js')).default;
						break;
					case 'ja':
						return (await import('./lang/ja.js')).default;
						break;
					case 'ko':
						return (await import('./lang/ko.js')).default;
						break;
					case 'nl':
						return (await import('./lang/nl.js')).default;
						break;
					case 'pt':
						return (await import('./lang/pt.js')).default;
						break;
					case 'sv':
						return (await import('./lang/sv.js')).default;
						break;
					case 'tr':
						return (await import('./lang/tr.js')).default;
						break;
					case 'zh-tw':
						return (await import('./lang/zh-tw.js')).default;
						break;
					case 'zh':
						return (await import('./lang/zh.js')).default;
						break;
					default :
						return (await import('./lang/en.js')).default;
						break;
				}
			}
		};
	}
};
