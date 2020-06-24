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
				type: Boolean
			},
			data: {
				type: Array,
			},
			inputFocused: {
				type: Boolean,
			},
			label: {
				type: String,
				observer: '_labelChanged'
			},
			limit: {
				type: Number
			},
			text: {
				type: String,
			},
			tags: {
				type: Array,
			},
			_activeValueIndex: {
				type: Number,
				observer: '_activeValueIndexChanged'
			},
			_blurHandle: Number,
			_dropdownIndex: {
				type: Number,
				observer: '_dropdownIndexChanged'
			},
			_dropdownItem: Object,
			_dropdownOpened: Boolean,
			_filteredData: {
				type: Array,
				// computed: '_computeFilteredData(values, data, _touch)',
				// observer: '_filteredDataChanged'
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
					const refocusTargets = this.shadowRoot
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
			},
			_uniqueId: {
				type: String,
				computed: '_computeUniqueIdPrefix(label)'
			},
			_valueBlurHandle: Number,
			_valueFocused: {
				type: Boolean,
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
		this.tags = [];
		this.text = '';
		this.data = [];
		this.inputFocused = false;
		this._activeValueIndex = -1;
		this._dropdownIndex = -1;
		this._touch = false;
		this._valueFocused = false;

		this._addTag('one');
		this._addTag('two');
		this._addTag('three');

		this._filteredData = ['four', 'five', 'six'];
		this.allowFreeform = true;
	}

	render() {
		return html`
		<div class="content js-refocusTarget">
		<!-- <template is="dom-repeat" items="[[values]]"> -->
		<!-- replace these divs with tags when we're done with everything else -->
		${this.tags.map((item) => html`
			<div class="selectedValue" tabindex="0" @click="${this._selectValue}" @keydown="${this._selectedKeydown}" @blur="${this._valueBlur}" @focus="${this._valueFocus}">
				${this._computeDisplay(item)}
				<d2l-icon class="${(this.inputFocused || this.valueFocused) ? 'focused' : ''}" icon="d2l-tier1:close-small" @click="${item.deleteMe}">
				</d2l-icon>
			</div>`)}
		<!-- </template> -->
		<!-- <d2l-input bind-value="{{text}}"> -->
		<!-- class="d2l-body-compact selectize-input"-->
		<!-- style="style$="[[_inputStyle]]"" -->
			<input
				aria-activedescendant="${this._applyPrefix(this._uniqueId, 'item', this._dropdownIndex)}"
				aria-autocomplete="list"
				aria-expanded="${this.computeAriaBoolean(this._dropdownOpened)}"
				aria-haspopup="true"
				aria-owns="${this._applyPrefix(this._uniqueId, 'dropdown')}"
				class="d2l-input selectize-input"
				@blur="${this._blur}"
				@focus="${this._focus}"
				@keydown="${this._keydown}"
				@tap="${this._focus}"
				@input="${this._textChanged}"
				@change="${this._onInputEnterPressed}"
				role="combobox"
				type="text"
				.value="${this.text}">
			</input>
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

	<select class="dropdown-content list d2l-input-select" 
		opened="${this._dropdownOpened}" 
		focus-target="${this._inputTarget}"
		no-animations 
		no-overlap 
		slot="dropdown-content" 
		id="${this._applyPrefix(this._uniqueId, 'dropdown')}" 
		role="listbox" 
		aria-multiselectable="true"
		@change="${this._onListItemTapped}">
		<option disabled selected></option>
		${this._filteredData.map(item => html`
			<option aria-label="${this._textForItem(item)}" 
			aria-selected="${this._computeAriaSelected(this._dropdownIndex, this._filteredData, item)}" 
			class="${this._computeListItemClass(this._dropdownIndex, this._filteredData, item)}" 
			@mouseover="${this._onListItemMouseOver}">
				${this._textForItem(item)}
			</option>
		`)}
	</select>

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
		this._inputTarget = this.shadowRoot.querySelector('input');
	}

	updated(changedProperties) {
		super.updated(changedProperties);

		console.log('something got updated: ', changedProperties);
		if (changedProperties.has('_activeValueIndex')) {
			console.log('activeValueIndex changed from ', changedProperties.get('_activeValueIndex'), ' to ', this._activeValueIndex);
			this._activeValueIndexChanged(this._activeValueIndex);
		}
	}

	clearText() {
		this.text = '';
	}

	focus(e) {
		const content = this.shadowRoot
			.querySelector('.content');
		if (!e || e.target === content) {
			this._inputTarget.focus();
		}
	}

	_addTag(newValue) {
		if (!newValue || this.tags.findIndex(tag => tag.value === newValue) >= 0) {
			return;
		}
		const newTag = {
			value: newValue,
			deleteMe: () => {
				this._removeSelected(this.tags.indexOf(newTag));
			}
			// note: binding the index instead of creating a new arrow function,
			// i.e. deleteMe: this._removeSelected.bind(this, this.tags.indexOf(v))
			// doesn't work because each item's index is captured once and never updated,
			// so once we start adding and removing items, those initially bound indicies would be out of date
		};
		console.log('created new tag: ', newTag);
		this.tags = [...this.tags, newTag];
		console.log('tags after pushing: ', this.tags);
	}

	_activeValueIndexChanged(index) {
		const content = this.shadowRoot
			.querySelector('.content');
		const selectedValues = this.shadowRoot.querySelectorAll('.selectedValue'); // yolo
		console.log('activeValueIndexChanged: ', index, selectedValues);
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

		const input = this.shadowRoot
			.querySelector('.selectize-input');
		const inBounds = this._activeValueIndex >= 0 ||
            (input.selectionStart === 0 &&
            input.selectionEnd === 0);
		if (inBounds) {
			if (this._activeValueIndex > 0) {
				this._activeValueIndex -= 1;
			} else if (this._activeValueIndex < 0) {
				this._activeValueIndex = this.tags.length - 1;
			}
			kE.preventDefault();
		}
	}

	_rightArrow(e) {
		const kE = e.detail.keyboardEvent;
		if (kE.altKey || kE.ctrlKey || kE.metaKey || kE.shiftKey)
			return;

		const input = this.shadowRoot
			.querySelector('.selectize-input');
		if (this._activeValueIndex >= 0) {
			let next = this._activeValueIndex + 1;
			if (next >= this.tags.length) {
				next = -1;
				input.focus();
			}
			this._activeValueIndex = next;
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
		return this.limit && (this.tags.length + increment > this.limit);
	}

	_onInputEnterPressed() {
		console.log('onInputEnterPressed', this.allowFreeform);
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
				this._addTag(this.text.trim());
				this.text = '';
			}
		} else {
			if (this._dropdownItem) {
				this._addTag(this._dropdownItem);
				this.text = '';
				this._touch = !this._touch;
				this.data = [];
			} else {
				this._fireAutoComplete();
			}
		}
	}

	_filteredDataChanged(filteredData) {
		if (filteredData && filteredData.length > 0 && this.inputFocused) {
			this._selectDropdownIndex(0, true);
			this.shadowRoot.querySelector('iron-dropdown').open();
		} else {
			this.shadowRoot.querySelector('iron-dropdown').close();
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
		this.inputFocused = false;
		this.data = [];
		this.shadowRoot.querySelector('iron-dropdown').close();
		this.dispatchEvent(new CustomEvent('input-blur'));
	}

	_handleValueBlur() {
		this._valueBlurHandle = null;
		this.valueFocused = false;
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
		// this._blurHandle = this.async(this._handleBlur, 300);
		this.blurHandle = setTimeout(this._handleBlur, 300);
	}

	_focus() {
		if (this._blurHandle) {
			this.cancelAsync(this._blurHandle);
		}
		this.inputFocused = true;
		this._activeValueIndex = -1;
		this.dispatchEvent(new CustomEvent('input-focus'));
	}

	_keydown(e) {
		if (e.keyCode === 8) { // backspace
			// if a value is selected, remove that value
			if (this._activeValueIndex >= 0) {
				console.log('about to remove (via backspace): ', this._activeValueIndex);
				this._removeSelected(this._activeValueIndex);
				this._activeValueIndex = -1;
				e.preventDefault();
				return;
			}

			// if we're at the beginning of the input,
			// select the last value
			if (e.srcElement.selectionStart === 0 &&
                    e.srcElement.selectionEnd === 0) {
				this._activeValueIndex = this.tags.length - 1;
			}
		} else if (e.keyCode === 13) { // Pressed enter
			// this._onSelectEnterPressed();
		}
	}

	_labelChanged() {
		this.shadowRoot.querySelector('.selectize-input').setAttribute('aria-label', this.label);
	}

	_listItemIndexForEvent(e) {
		const list = this.shadowRoot.querySelector('ul');
		const index = Array.from(list.childNodes).indexOf(e.target);
		return index;
	}

	_onListItemMouseOver(e) {
		const index = this._listItemIndexForEvent(e);
		this._selectDropdownIndex(index);
	}

	_onListItemTapped(e) {
		console.log('tapped: [', e.target.value, ']');
		// const index = this._listItemIndexForEvent(e);
		// const data = this._filteredData[index];
		const data = e.target.value;
		// this.dispatchEvent(new CustomEvent('selectize-item-selected', {
		// 	bubbles: true,
		// 	composed: true,
		// 	detail: {
		// 		index,
		// 		item: data
		// 	}
		// }));
		this._addTag(data);
	}

	_onSelectEnterPressed() {
		console.log('_onSelectEnterPressed');
		const index = this._dropdownIndex;
		const data = this._filteredData[index];
		// this.dispatchEvent(new CustomEvent('selectize-item-selected', {
		// 	bubbles: true,
		// 	composed: true,
		// 	detail: {
		// 		index,
		// 		item: data
		// 	}
		// }));
		this._addTag(data);
	}

	_removeSelected(index) {
		console.log('removeSelected called: ', index);
		this.tags.splice(index, 1);
		this.data = [];
		if (index === this._activeValueIndex) {
			this._activeValueIndex = -1;
		} else if (index < this._activeValueIndex) {
			setTimeout(() => {
				this._activeValueIndex -= 1;
			}, 5);
		}
	}

	_scrollList(index) {
		const list = this.shadowRoot.querySelector('.list');
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
		this._dropdownIndex = index;
	}

	_selectDropdownItem(index) {
		const inBounds = index >= 0 &&
            this._filteredData &&
            this._filteredData.length > 0 &&
            index < this._filteredData.length;
		if (inBounds) {
			this._dropdownItem = this._filteredData[index];
		} else {
			this._dropdownItem = null;
		}
	}

	_selectedKeydown(e) {
		if (e.keyCode === 8) {
			console.log('removeSelected from selectedKeydown');
			// this._removeSelected(e);
			this._removeSelected(this._activeValueIndex);
			this.shadowRoot.querySelector('.selectize-input').focus();
		}
	}

	_selectValue(e) {
		if (e.srcElement.tagName.toLowerCase() === 'span') {
			this._activeValueIndex = e.model.index;
		}
	}

	_textChanged(event) {
		this.text = event.target.value;
		this.dispatchEvent(new CustomEvent('text-changed', {detail: this.text})); // is this needed?
	}

	_computeUniqueIdPrefix(label) {
		if (Array.prototype.includes.call(arguments, undefined)) return;
		return label.toLowerCase().replace(/[\W]/g, '');
	}

	_textForItem(item) {
		return item && item.text || item;
	}

	_valueBlur() {
		// this._valueBlurHandle = this.async(this._handleValueBlur, 100);
		this._valueBlurHandle = setTimeout(this._handleValueBlur, 100);
		// this is an awful variable name, who's idea was this
	}

	_valueFocus() {
		if (this._valueBlurHandle) {
			// this.cancelAsync(this._valueBlurHandle);
			clearTimeout(this._valueBlurHandle);
			return;
		}
		this._valueFocused = true;
	}

	_onValuesChanged() {
		if (Array.prototype.includes.call(arguments, undefined)) return;
		this.dispatchEvent(new CustomEvent('values-updated'));
	}

	// was a behaviour in manager-view-fra - having it copy & pasted may not be the best thing
	computeAriaBoolean(booleanValue) {
		return booleanValue ? 'true' : 'false';
	}
}
customElements.define('d2l-labs-tag-picker', TagPicker);
