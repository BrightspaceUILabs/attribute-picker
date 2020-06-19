import '@brightspace-ui/core/components/icons/icon.js';
import '@brightspace-ui/core/components/colors/colors.js';
import '@brightspace-ui/core/components/dropdown/dropdown-menu.js';
import '@brightspace-ui/core/components/inputs/input-styles.js';
import '@brightspace-ui/core/components/inputs/input-select-styles.js';
// import '@polymer/iron-a11y-keys/iron-a11y-keys.js';
// import '@polymer/iron-input/iron-input.js';
// import '../behavior/localize-behavior.js';
// import '../behavior/mr-aria-behavior.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';

class TagPicker extends LitElement {

	static get properties() {
		return {
			prop1: {
				type: String
			},
			allowFreeform: {
				type: Boolean,
				value: false
			},
			data: {
				type: Array,
				value() { return []; },
				notify: true
			},
			inputFocused: {
				type: Boolean,
				reflectToAttribute: true,
				value: false
			},
			label: {
				type: String,
				observer: '_labelChanged'
			},
			limit: {
				type: Number
			},
			placeholderText: {
				type: String,
				value: ''
			},
			text: {
				type: String,
				notify: true,
				observer: '_textChanged'
			},
			values: {
				type: Array,
				value() { return []; },
				notify: true
			},
			_activeValueIndex: {
				type: Number,
				value: -1,
				observer: '_activeValueIndexChanged'
			},
			_blurHandle: Number,
			_dropdownIndex: {
				type: Number,
				value: -1,
				observer: '_dropdownIndexChanged'
			},
			_dropdownItem: Object,
			_dropdownOpened: Boolean,
			_filteredData: {
				type: Array,
				computed: '_computeFilteredData(values, data, _touch)',
				observer: '_filteredDataChanged'
			},
			_inputTarget: {
				type: Object
			},
			_inputStyle: {
				type: String,
				computed: '_computeInputStyle(text)'
			},
			_refocusTargets: {
				type: Array,
				value() {
					//const refocusTargets = dom(this.root)
					// I have no idea if this is equivalent:
					const refocusTargets = this.shadowroot
						.querySelectorAll('.js-refocusTarget');
					return [this].concat(refocusTargets);
				}
			},
			_templateStore: {
				type: Object,
				value() { return {}; }
			},
			_touch: {
				type: Boolean,
				value: false
			},
			_uniqueId: {
				type: String,
				computed: '_computeUniqueIdPrefix(label)'
			},
			_valueBlurHandle: Number,
			_valueFocused: {
				type: Boolean,
				value: false
			}
		};
	}

	static get styles() {
		return css`
		:host {
			border-radius: 6px;
			border-style: solid;
			box-sizing: border-box;
			display: inline-block;
			min-height: 42px;
			margin: 0;
			vertical-align: middle;
			width: 100%;
			-webkit-transition-duration: 0.5s;
							transition-duration: 0.5s;
			-webkit-transition-timing-function: ease;
							transition-timing-function: ease;
			-webkit-transition-property: background-color, border-color;
			transition-property: background-color, border-color;
			color: var(--d2l-color-ferrite);
			font-size: 0.8rem;
			font-family: inherit;
			font-weight: 400;
			letter-spacing: 0.01rem;
			line-height: 1.4rem;
		}
		:host::-webkit-input-placeholder,
		:host::-moz-placeholder,
		:host:-ms-input-placeholder,
		:host::placeholder {
			color: var(--d2l-color-mica);
		}
		:host,
		:host:hover:disabled {
			background-color: #fff;
			border-color: var(--d2l-color-mica);
			border-width: 1px;
			box-shadow: inset 0 2px 0 0 rgba(185, 194, 208, 0.2);
			padding: 0.3rem 0.3rem;
		}
		:host:hover,
		:host:focus,
		:host([input-focused]) {
			border-color: var(--d2l-color-celestine);
			border-width: 2px;
			outline-width: 0;
			padding: -webkit-calc(0.3rem - 1px) -webkit-calc(0.3rem - 1px);
			padding: calc(0.3rem - 1px) calc(0.3rem - 1px);
		}
		:host([aria-invalid="true"]) {
			border-color: var(--d2l-color-cinnabar);
		}
		:host:disabled {
			opacity: 0.5;
		}
		:host::-ms-clear {
			display: none;
			width: 0;
			height: 0;
		}
		input[type=text]:hover,
		input[type=text]:focus {
			padding: 0 !important;
		}
		input[type=text] {
			color: inherit;
			vertical-align: middle;
		}
		/* out of scope */
		.d2l-input.d2l-input-text {
			border: none;
			box-shadow: none;
		}
		/* gets applied, but not to the right element */
		d2l-input-text {
			border: none;
			box-shadow: none;
		}
		.dropdown-content {
			background-color: #fff;
			max-height: 150px;
			min-width: 100px;
			text-overflow: ellipsis;
			margin: 0px;
			padding: 0px;
			border: 1px solid #DDDDDD;
			list-style: none;
		}
		li {
			box-sizing: 'border-box';
			cursor: pointer;
			padding: 8px;
		}
		/* hide the dropdown arrow on the select element */
		select:not([multiple]) {
			background-image: none;
		}
		li.selected {
			background-color: var(--d2l-color-celestine-plus-2);
			color: var(--d2l-color-celestine);
		}
		.list {
			display: flex;
			flex-direction: column;
			width: 100%;
		}
		.selectedValue {
			align-items: center;
			background-color: var(--d2l-color-sylvite);
			border-radius: 6px;
			color: var(--d2l-color-ferrite);
			cursor: pointer;
			display: flex;
			margin: 1px 5px 1px 1px;
			overflow: hidden;
			padding: 0px 8px;
			position: relative;
			text-overflow: ellipsis;
			height: 1.55rem;
		}
		.selectedValue:hover {
			background-color: var(--d2l-color-gypsum);
		}
		.selectedValue:focus, .selectedValue:focus > d2l-icon {
			outline: none;
			background-color: var(--d2l-color-celestine);
			color: #FFF;
		}
		d2l-icon {
			color: rgba(86, 90, 92, 0.5); /* --d2l-color-ferrite @ 50% */
			/* display: none; */
			margin-left: 4px;
		}
		d2l-icon.focused {
			display: inline-flex;
		}
		.selectedValue:focus ~ .selectedValue > d2l-icon:hover,
		:host([input-focused]) > .content > .selectedValue > d2l-icon:hover,
		.selectedValue > d2l-icon:hover {
			color: var(--d2l-color-ferrite);
		}
		.selectedValue:focus > d2l-icon,
		.selectedValue:focus > d2l-icon:hover {
			color: #FFF;
		}
		.selectize-input {
			width: 10px;
			background: transparent;
			border: none;
			outline: 0px;
			box-shadow: none;
			box-sizing: border-box;
			padding: 0px;
			line-height: 1.4rem;
			flex-grow: 1;
		}
		.content {
			display: flex;
			flex-wrap: wrap;
			cursor: text;
			width: 100%;
			margin-top: -1px;
		}
		`;
	}

	constructor() {
		super();

		if (!this.prop1) this.prop1 = 'tag-picker (default value)';
		this.values = ['one', 'two', 'three'];
	}

	render2() {
		return html`
			<h2>I'm ${this.prop1}, 2.0, hee ho!</h2>
		`;
	}

	render() {
		return html`
		<div class="content js-refocusTarget">
		<!-- <template is="dom-repeat" items="[[values]]"> -->
		<!-- replace these divs with tags when we're done with everything else -->
		${this.values.map((item, index) => html`
			<div class="selectedValue" tabindex="0" @click="${this._selectValue}" @keydown="${this._selectedKeydown}" @blur="${this._valueBlur}" @focus="${this._valueFocus}">
				${index}, ${this._computeDisplay(item)}
				<d2l-icon class="${(this.inputFocused || this.valueFocused) ? 'focused' : ''}" icon="d2l-tier1:close-small" @click="${() => this._removeSelected(index)}}">
				</d2l-icon>
			</div>`)}
		<!-- </template> -->
		<!-- <d2l-input bind-value="{{text}}"> -->
		<!-- class="d2l-body-compact selectize-input"-->
		<!-- style="style$="[[_inputStyle]]"" -->
		<!-- <input
			aria-activedescendant="[[_applyPrefix(_uniqueId, 'item', _dropdownIndex)]]"
			aria-autocomplete="list"
			aria-expanded="[[computeAriaBoolean(_dropdownOpened)]]"
			aria-haspopup="true"
			aria-owns="[[_applyPrefix(_uniqueId, 'dropdown')]]"
			class="d2l-input selectize-input"
			@blur="_blur"
			@focus="_focus"
			@keydown="_keydown"
			@tap="_focus"
			placeholder="[[placeholderText]]"
			role="combobox"
			type="text"
			value="{{text::change}}">
		</input> -->
	</div>
	<!-- original implementation for reference-->
	<!-- <iron-dropdown opened="{{_dropdownOpened}}" focus-target="[[_inputTarget]]" no-animations no-overlap>
		<ul slot="dropdown-content" id="[[_applyPrefix(_uniqueId, 'dropdown')]]" role="listbox" aria-multiselectable="true" class="dropdown-content list">
			<template is="dom-repeat" items="[[_filteredData]]">
				<li aria-label$="[[_textForItem(item)]]" aria-selected$="[[_computeAriaSelected(_dropdownIndex, _filteredData, item)]]" class$="[[_computeListItemClass(_dropdownIndex, _filteredData, item)]]" on-mouseover="_onListItemMouseOver" on-tap="_onListItemTapped">[[_textForItem(item)]]
				</li>
			</template>
		</ul>
	</iron-dropdown> -->
	<!-- d2l dropdown style version -->

	<!-- <select class="dropdown-content list" 
		opened="{{_dropdownOpened}}" 
		focus-target="[[_inputTarget]]" 
		no-animations 
		no-overlap 
		slot="dropdown-content" 
		id="[[_applyPrefix(_uniqueId, 'dropdown')]]" 
		role="listbox" 
		aria-multiselectable="true">
		<template is="dom-repeat" items="[[_filteredData]]">
			<option aria-label="[[_textForItem(item)]]" 
				aria-selected="[[_computeAriaSelected(_dropdownIndex, _filteredData, item)]]" 
				class="[[_computeListItemClass(_dropdownIndex, _filteredData, item)]]" 
				@mouseover="_onListItemMouseOver" 
				@tap="_onListItemTapped">
				[[_textForItem(item)]]
			</option>
		</template>
	</select> -->

	<!-- d2l-dropdown version -->
	<!-- <d2l-dropdown-button>
		<d2l-dropdown-menu 
			opened="{{_dropdownOpened}}" 
			focus-target="[[_inputTarget]]" 
			no-animations 
			no-overlap>
			<d2l-menu 
				class="dropdown-content list"
				slot="dropdown-content" 
				id="[[_applyPrefix(_uniqueId, 'dropdown')]]" 
				role="listbox" 
				aria-multiselectable="true">
				<template is="dom-repeat" items="[[_filteredData]]">
					<d2l-menu-item 
						aria-label$="[[_textForItem(item)]]" 
						aria-selected$="[[_computeAriaSelected(_dropdownIndex, _filteredData, item)]]" 
						class$="[[_computeListItemClass(_dropdownIndex, _filteredData, item)]]" 
						on-mouseover="_onListItemMouseOver" 
						on-tap="_onListItemTapped">
						[[_textForItem(item)]]
					</d2l-menu-item>
				</template>
			</d2l-menu>
		</d2l-dropdown-menu>
	</d2l-dropdown-button> -->
		`;
	}

	// observers: [
	// 	'_onValuesChanged(values.splices)'
	// ],

	// listeners: {
	// 	'tap': '_handleTap'
	// },

	ready() {
		this._inputTarget = this.shadowroot.querySelector('input');
	}

	clearText() {
		this.set('text', '');
	}

	focus(e) {
		const content = this.shadowroot
			.querySelector('.content');
		if (!e || e.target === content) {
			this._inputTarget.focus();
		}
	}

	_activeValueIndexChanged(index) {
		const content = this.shadowroot
			.querySelector('.content');
		// const selectedValues = dom(content) // not sure what the equivalent here is
			// .querySelectorAll('.selectedValue');
		const selectedValues = this.shadowroot.querySelector(content).querySelectorAll('.selectedContent');

		if (index >= 0 && index < selectedValues.length) {
			selectedValues[index].focus();
		}
	}

	_applyPrefix(uniqueId, id, index) {
		return (typeof index === 'number') ?
			`${uniqueId}_${id}_${index}` :
			`${uniqueId}_${id}`;
	}

	_upArrow(e) {
		const kE = e.detail.keyboardEvent;
		if (kE.altKey || kE.ctrlKey || kE.metaKey || kE.shiftKey)
			return;

		const inBounds = (this._dropdownIndex - 1) >= 0 &&
            (this._dropdownIndex - 1) < this._filteredData.length;
		if (inBounds) {
			this._selectDropdownIndex(this._dropdownIndex - 1, true);
		} else {
			this._selectDropdownIndex(this._filteredData.length - 1, true);
			if (this._filteredData.length === 0) {
				this._fireAutoComplete();
			}
		}
		kE.preventDefault();
	}

	_downArrow(e) {
		const kE = e.detail.keyboardEvent;
		if (kE.altKey || kE.ctrlKey || kE.metaKey || kE.shiftKey)
			return;

		if ((this._dropdownIndex + 1) < this._filteredData.length) {
			this._selectDropdownIndex(this._dropdownIndex + 1, true);
		} else {
			this._selectDropdownIndex(0, true);
			if (this._filteredData.length === 0) {
				this._fireAutoComplete();
			}
		}
		kE.preventDefault();
	}

	_leftArrow(e) {
		const kE = e.detail.keyboardEvent;
		if (kE.altKey || kE.ctrlKey || kE.metaKey || kE.shiftKey)
			return;

		const input = this.shadowroot
			.querySelector('.selectize-input');
		const inBounds = this._activeValueIndex >= 0 ||
            (input.selectionStart === 0 &&
            input.selectionEnd === 0);
		if (inBounds) {
			if (this._activeValueIndex > 0) {
				this.set('_activeValueIndex', this._activeValueIndex - 1);
			} else if (this._activeValueIndex < 0) {
				this.set('_activeValueIndex', this.values.length - 1);
			}
			kE.preventDefault();
		}
	}

	_rightArrow(e) {
		const kE = e.detail.keyboardEvent;
		if (kE.altKey || kE.ctrlKey || kE.metaKey || kE.shiftKey)
			return;

		const input = this.shadowroot
			.querySelector('.selectize-input');
		if (this._activeValueIndex >= 0) {
			let next = this._activeValueIndex + 1;
			if (next >= this.values.length) {
				next = -1;
				input.focus();
			}
			this.set('_activeValueIndex', next);
			kE.preventDefault();
		}
	}

	_computeAriaSelected(dropdownIndex, filteredData, item) {
		if (Array.prototype.includes.call(arguments, undefined)) return;
		const index = filteredData.indexOf(item);
		return index === dropdownIndex;
	}

	_computeCloseIconClass(inputFocused, valueFocused) {
		if (Array.prototype.includes.call(arguments, undefined)) return;
		return (inputFocused || valueFocused) ? 'focused' : '';
	}

	_computeListItemClass(dropdownIndex, filteredData, item) {
		if (Array.prototype.includes.call(arguments, undefined)) return;
		const index = filteredData.indexOf(item);
		return index === dropdownIndex ? 'selected' : '';
	}

	_computeDisplay(item) {
		return item.text || item.value || item;
	}

	_computeFilteredData(values, data) {
		if (Array.prototype.includes.call(arguments, undefined)) return;
		if (!data || !data.filter) return;

		return data.filter((item) => {
			return values.findIndex((value) => {
				return ((value.value && value.value === item.value)
                    || (value === item));
			}) < 0;
		});
	}

	_computeInputStyle(text) {
		if (Array.prototype.includes.call(arguments, undefined)) return;
		const length = text && text.length || 0;
		return `width:${10 * (length + 1)}px;`;
	}

	_dropdownIndexChanged(index) {
		this._selectDropdownItem(index);
	}

	_limitReached(increment) {
		return this.limit && (this.values.length + increment > this.limit);
	}

	_enter() {
		if (this._limitReached(1)) {
			this.dispatchEvent(new CustomEvent('selectize-limit-reached', {
				bubbles: true,
				composed: true,
				detail: {
					limit: this.limit
				}
			}));
			return;
		}

		if (this.allowFreeform) {
			if (this.text.trim().length > 0) {
				this.push('values', this.text.trim());
				this.set('text', '');
			}
		} else {
			if (this._dropdownItem) {
				this.push('values', this._dropdownItem);
				this.set('text', '');
				this.set('_touch', !this._touch);
				this.set('data', []);
			} else {
				this._fireAutoComplete();
			}
		}
	}

	_filteredDataChanged(filteredData) {
		if (filteredData && filteredData.length > 0 && this.inputFocused) {
			this._selectDropdownIndex(0, true);
			this.shadowroot.querySelector('iron-dropdown').open();
		} else {
			this.shadowroot.querySelector('iron-dropdown').close();
			this._selectDropdownIndex(-1, true);
		}
	}

	_fireAutoComplete() {
		this.dispatchEvent(new CustomEvent('auto-complete', {
			bubbles: true,
			composed: true
		}));
	}

	_firstElementChild(elem) {
		let node;
		const nodes = elem.childNodes;
		let i = 0;
		while (node = nodes[i++]) { // eslint-disable-line no-cond-assign
			if (node.nodeType === 1) {
				return node;
			}
		}
		return null;
	}

	_handleBlur() {
		this._blurHandle = null;
		this.set('inputFocused', false);
		this.set('data', []);
		this.shadowroot.querySelector('iron-dropdown').close();
		this.fire('input-blur');
	}

	_handleValueBlur() {
		this._valueBlurHandle = null;
		this.set('_valueFocused', false);
	}

	_handleTap(event) {
		const shouldRefocus = this._refocusTargets
			.indexOf(event.target) >= 0;
		if (shouldRefocus) {
			event.preventDefault();
			this.focus();
		}
	}

	_blur() {
		this._blurHandle = this.async(this._handleBlur, 300);
	}

	_focus() {
		if (this._blurHandle) {
			this.cancelAsync(this._blurHandle);
		}
		this.set('inputFocused', true);
		this.set('_activeValueIndex', -1);
		this.fire('input-focus');
	}

	_keydown(e) {
		if (e.keyCode === 8) { // backspace
			// if a value is selected, remove that value
			if (this._activeValueIndex >= 0) {
				this._removeSelected(this._activeValueIndex);
				this.set('_activeValueIndex', -1);
				e.preventDefault();
				return;
			}

			// if we're at the beginning of the input,
			// select the last value
			if (e.srcElement.selectionStart === 0 &&
                    e.srcElement.selectionEnd === 0) {
				this.set('_activeValueIndex', this.values.length - 1);
			}
		} else if (e.keyCode === 13) { // Pressed enter
			this._onEnterPressed();
		}
	}

	_labelChanged() {
		this.shadowroot.querySelector('.selectize-input').setAttribute('aria-label', this.label);
	}

	_listItemIndexForEvent(e) {
		const list = this.shadowroot.querySelector('ul');
		const index = Array.from(list.childNodes).indexOf(e.target);
		return index;
	}

	_onListItemMouseOver(e) {
		const index = this._listItemIndexForEvent(e);
		this._selectDropdownIndex(index);
	}

	_onListItemTapped(e) {
		const index = this._listItemIndexForEvent(e);
		const data = this._filteredData[index];
		this.dispatchEvent(new CustomEvent('selectize-item-selected', {
			bubbles: true,
			composed: true,
			detail: {
				index,
				item: data
			}
		}));
	}

	_onEnterPressed() {
		const index = this._dropdownIndex;
		const data = this._filteredData[index];
		this.dispatchEvent(new CustomEvent('selectize-item-selected', {
			bubbles: true,
			composed: true,
			detail: {
				index,
				item: data
			}
		}));
	}

	_removeSelected(e) {
		console.log('removeSelected called: ', e, this._activeValueIndex);
		const index = Number.isInteger(e) ? e : (e.model ? e.model.index : 0);
		// this.splice('values', index, 1);
		this.values.splice(index, 1); // for testing, don't actually remove anything yet
		// this.set('data', []);
		this.data = [];
		if (index === this._activeValueIndex) {
			// this.set('_activeValueIndex', -1);
			this._activeValueIndex = -1;
		} else if (index < this._activeValueIndex) {
			setTimeout(() => {
				// this.set('_activeValueIndex', this._activeValueIndex - 1);
				this._activeValueIndex -= 1;
			}, 5);
		}
	}

	_scrollList(index) {
		const list = this.shadowroot.querySelector('.list');
		if (index >= 0 && index < list.children.length) {
			const elem = list.children[index];
			if (elem.offsetTop < list.scrollTop) {
				list.scrollTop = elem.offsetTop;
			} else if (elem.offsetHeight + elem.offsetTop > list.offsetHeight + list.scrollTop) {
				list.scrollTop = elem.offsetTop + elem.offsetHeight - list.offsetHeight;
			}
		}
	}

	_selectDropdownIndex(index, shouldScroll) {
		// don't want to scroll on mouseover
		if (shouldScroll) this._scrollList(index);
		this.set('_dropdownIndex', index);
	}

	_selectDropdownItem(index) {
		const inBounds = index >= 0 &&
            this._filteredData &&
            this._filteredData.length > 0 &&
            index < this._filteredData.length;
		if (inBounds) {
			this.set('_dropdownItem', this._filteredData[index]);
		} else {
			this.set('_dropdownItem', null);
		}
	}

	_selectedKeydown(e) {
		if (e.keyCode === 8) {
			this._removeSelected(e);
			this.shadowroot.querySelector('.selectize-input').focus();
		}
	}

	_selectValue(e) {
		if (e.srcElement.tagName.toLowerCase() === 'span') {
			// this.set('_activeValueIndex', e.model.index);
			this._activeValueIndex = e.model.index;
		}
	}

	_textChanged(text) {
		this.fire('text-changed', text);
	}

	_computeUniqueIdPrefix(label) {
		if (Array.prototype.includes.call(arguments, undefined)) return;
		return label.toLowerCase().replace(/[\W]/g, '');
	}

	_textForItem(item) {
		return item && item.text || item;
	}

	_valueBlur() {
		this._valueBlurHandle = this.async(this._handleValueBlur, 100);
	}

	_valueFocus() {
		if (this._valueBlurHandle) {
			this.cancelAsync(this._valueBlurHandle);
			return;
		}
		// this.set('_valueFocused', true);
		this._valueFocused = true;
	}

	_onValuesChanged() {
		if (Array.prototype.includes.call(arguments, undefined)) return;
		this.fire('values-updated');
	}
}
customElements.define('d2l-labs-tag-picker', TagPicker);
