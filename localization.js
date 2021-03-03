import { LocalizeDynamicMixin } from '@brightspace-ui/core/mixins/localize-dynamic-mixin.js';

export const Localizer = superclass => class extends LocalizeDynamicMixin(superclass) {
	static get localizeConfig() {
		return {
			importFunc: async lang => {
				switch (lang) {
					case 'ar':
						return (await import('./lang/ar.js')).default;
					case 'da':
						return (await import('./lang/da.js')).default;
					case 'de':
						return (await import('./lang/de.js')).default;
					case 'en':
						return (await import('./lang/en.js')).default;
					case 'es':
						return (await import('./lang/es.js')).default;
					case 'fr':
						return (await import('./lang/fr.js')).default;
					case 'ja':
						return (await import('./lang/ja.js')).default;
					case 'ko':
						return (await import('./lang/ko.js')).default;
					case 'nl':
						return (await import('./lang/nl.js')).default;
					case 'pt':
						return (await import('./lang/pt.js')).default;
					case 'sv':
						return (await import('./lang/sv.js')).default;
					case 'tr':
						return (await import('./lang/tr.js')).default;
					case 'zh-tw':
						return (await import('./lang/zh-tw.js')).default;
					case 'zh':
						return (await import('./lang/zh.js')).default;
					default :
						return (await import('./lang/en.js')).default;
				}
			}
		};
	}
};
