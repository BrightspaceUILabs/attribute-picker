import '@brightspace-ui/core/components/icons/icon.js';
import '@brightspace-ui/core/components/colors/colors.js';
import '@brightspace-ui/core/components/dropdown/dropdown-menu.js';
import '@brightspace-ui/core/components/dropdown/dropdown.js';
import '@brightspace-ui/core/components/dropdown/dropdown-content.js';
import { inputStyles } from '@brightspace-ui/core/components/inputs/input-styles.js';
import '@brightspace-ui/core/components/menu/menu.js';
import '@brightspace-ui/core/components/menu/menu-item.js';
// import '@polymer/iron-a11y-keys/iron-a11y-keys.js';
// import '@polymer/iron-input/iron-input.js';
// import '../behavior/localize-behavior.js';
// import '../behavior/mr-aria-behavior.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';

class TagPicker extends LitElement {

	static get properties() {
		return {
			allowFreeform: { //TODO identify
				type: Boolean
			},
			data: {			//TODO indentify
				type: Array,
			},
			/*
			* When true, the autocomplete dropdown will not be displayed to the user.
			*/
			hideDropdown: {
				type: Boolean,
			},
			label: {
				type: String,
			},
			/*
			* The maximum number of tags permitted.
			*/
			limit: {
				type: Number
			},
			/*
			* The inner text of the input.
			*/
			text: {
				type: String,
			},
			/*
			An array of strings representing the attributes currently selected in the picker.
			*/
			tags: {
				type: Array,
			},
			/*
			* Represents the index of the currently focused tag. If no tag is focused, equals -1.
			*/
			_activeTagIndex: {
				type: Number,
			},
			_blurHandle: {
				type: Number,
			},
			_dropdownIndex: {
				type: Number,
			},
			_dropdownItem: {
				type: Object,
			},
			_dropdownOpened: {
				type: Boolean,
			},
			filteredData: {
				type: Array,
			},
			_inputFocused: {
				type: Boolean,
			},
			_inputStyle: {
				type: String,
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
			},
			_touch: {
				type: Boolean,
			},
			_uniqueId: {
				type: String,
			},
			_valueBlurHandle: Number,
			_valueFocused: {
				type: Boolean,
			}
		};
	}

	static get styles() {
		return [inputStyles, css`
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
		:host([hidden]) {
			display: none;
		}
		d2l-menu[hidden] {
			display: none;
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
			min-height: 0rem; /*Override d2l-input styles*/
		}
		.content {
			display: flex;
			flex-wrap: wrap;
			cursor: text;
			width: 100%;
			margin-top: -1px;
		}
		`];
	}

	constructor() {
		super();
		this.tags = [];
		this.text = '';
		this.data = [];
		this.hideDropdown = true;
		this._inputFocused = false;
		this._activeTagIndex = -1;
		this._dropdownIndex = -1;
		this._touch = false;
		this._valueFocused = false;
		this._templateStore = {};
		this._filteredData = ['four', 'five', 'six'];
		this.allowFreeform = true;
	}

	get filteredData() {
		if (Array.prototype.includes.call(arguments, undefined)) return [];
		if (!this.data || !this.data.filter) return [];

		return this.data.filter((item) => {
			return this.tags.findIndex((value) => {
				return ((value.value && value.value === item.value)
                    || (value === item));
			}) < 0;
		});
	}

	set filteredData(data) {
		this._filteredData = data;
	}

	get uniqueId() {
		return this.label.toLowerCase().replace(/[\W]/g, '');
	}

	set uniqueId(newId) {
		this._uniqueId = newId;
	}

	render() {
		return html`
		<div class="content js-refocusTarget">

		${this.tags.map((item) => html`
			<div class="selectedValue" tabindex="0" @click="${this._selectValue}" @keydown="${this._selectedKeydown}" @blur="${this._valueBlur}" @focus="${this._valueFocus}">
				${this._computeDisplay(item)}
				<d2l-icon class="${(this._inputFocused || this.valueFocused) ? 'focused' : ''}" icon="d2l-tier1:close-small" @click="${item.deleteMe}">
				</d2l-icon>
			</div>`)}
			<input
				aria-label="${this.ariaLabel}"
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

		<d2l-menu label="Menu Options" ?hidden="${this.hideDropdown}">
			${this._filteredData.map(item => html`
				<d2l-menu-item text="${item}" @keydown="${this._keydown}"></d2l-menu-item>
			`)}
		</d2l-menu>
		`;
	}

	updated(changedProperties) {
		super.updated(changedProperties);

		console.log('something got updated: ', Array.from(changedProperties.keys()));
		if (changedProperties.has('_activeTagIndex')) {
			console.log('activeValueIndex changed from ', changedProperties.get('_activeTagIndex'), ' to ', this._activeTagIndex);
			this._activeTagIndexChanged(this._activeTagIndex);
		}
		if (changedProperties.has('label')) {
			this._labelChanged();
		}
		if (changedProperties.has('_dropdownIndex')) {
			this._dropdownIndexChanged();
		}
		if (changedProperties.has('_filteredData')) {
			this._filteredDataChanged();
		}
	}

	clearText() {
		this.text = '';
	}

	focus(e) {
		const content = this.shadowRoot
			.querySelector('.content');
		if (!e || e.target === content) {
			this.shadowRoot.querySelector('input').focus();
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
		this.tags = [...this.tags, newTag];
	}

	_activeTagIndexChanged() {
		const selectedValues = this.shadowRoot.querySelectorAll('.selectedValue');
		if (this._activeTagIndex >= 0 && this._activeTagIndex < selectedValues.length) {
			selectedValues[this._activeTagIndex].focus();
		}
	}

	_applyPrefix(uniqueId, id, index) {
		return (typeof index === 'number') ?
			`${uniqueId}_${id}_${index}` :
			`${uniqueId}_${id}`;
	}

	_upArrow(e) {
		console.log("hi");
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

	_computeInputStyle(text) {
		if (Array.prototype.includes.call(arguments, undefined)) return;
		const length = text && text.length || 0;
		return `width:${10 * (length + 1)}px;`;
	}

	_dropdownIndexChanged() {
		this._selectDropdownItem(this.dropdownIndex);
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

	_filteredDataChanged() {
		console.log('filteredDataChanged');
		if (this._filteredData && this._filteredData.length > 0 && this._inputFocused) {
			this._selectDropdownIndex(0, true);
			// this.shadowRoot.querySelector('iron-dropdown').open();
		} else {
			// this.shadowRoot.querySelector('iron-dropdown').close();
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
		console.log('handleBlur');
		this._blurHandle = null;
		this._inputFocused = false;
		this.data = [];
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
		this.blurHandle = setTimeout(this._handleBlur, 300);
	}

	_focus() {
		this._inputFocused = true;
		this._activeTagIndex = -1;
		this.dispatchEvent(new CustomEvent('input-focus'));
	}

	_keydown(e) {
		console.log('keydown: ', e.keyCode);
		if (e.keyCode === 8) { // backspace
			// if a value is selected, remove that value
			if (this._activeTagIndex >= 0) {
				console.log('about to remove (via backspace): ', this._activeTagIndex);
				this._removeSelected(this._activeTagIndex);
				this._activeTagIndex = -1;
				e.preventDefault();
				return;
			}

			// if we're at the beginning of the input,
			// select the last value
			if (e.srcElement.selectionStart === 0 &&
                    e.srcElement.selectionEnd === 0) {
				this._activeTagIndex = this.tags.length - 1;
			}
		} else if (e.keyCode === 37) { // left arrow
			console.log('pressed left with active value index: ', this._activeTagIndex);
			this._activeTagIndex = this.tags.length - 1;
		} else if (e.keyCode === 40) { // down arrow
			if (this.hideDropdown) {
				this.hideDropdown = false;
				this._dropdownIndex = 0;
			} else {
				this._dropdownIndex = this._dropdownIndex + 1 % this._filteredData.length;
			}
			setTimeout(() => {
				const items = this.shadowRoot.querySelectorAll('d2l-menu-item');
				console.log('items: ', items);
				items[this._dropdownIndex].focus();
			});
		} else if (e.keyCode === 13) {
			if (this._dropdownIndex >= 0 && this._dropdownIndex < this._filteredData.length) {
				console.log('pressed enter');
				this._addTag(this._filteredData[this._dropdownIndex]);
				this._filteredData.splice(this._dropdownIndex, 1);
				this._dropdownIndex--;
			}
		}
	}

	_selectedKeydown(e) {
		if (e.keyCode === 8) {
			console.log('removeSelected from selectedKeydown');
			this._removeSelected(this._activeTagIndex);
			this.shadowRoot.querySelector('.selectize-input').focus();
		}
		else if (e.keyCode === 37) { // left arrow
			console.log('pressed left with active value index: ', this._activeTagIndex);
			if (this._activeTagIndex > 0 && this._activeTagIndex < this.tags.length) {
				this._activeTagIndex -= 1;
			} else {
				this._activeTagIndex = this.tags.length - 1;
			}
		}
		else if (e.keyCode === 39) { // right arrow
			console.log('pressed left with active value index: ', this._activeTagIndex);
			if (this._activeTagIndex >= 0 && this._activeTagIndex < this.tags.length - 1) {
				this._activeTagIndex += 1;
			} else {
				this._activeTagIndex = -1;
				this.shadowRoot.querySelector('.selectize-input').focus();
			}
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
		const data = e.target.value;
		this._addTag(data);
	}

	_onSelectEnterPressed() {
		console.log('_onSelectEnterPressed');
		const index = this._dropdownIndex;
		const data = this._filteredData[index];
		this._addTag(data);
	}

	_removeSelected(index) {
		console.log('removeSelected called: ', index);
		this.tags.splice(index, 1);
		this.data = [];
		if (index === this._activeTagIndex) {
			this._activeTagIndex = -1;
		} else if (index < this._activeTagIndex) {
			setTimeout(() => {
				this._activeTagIndex -= 1;
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

	_selectValue(e) {
		if (e.srcElement.tagName.toLowerCase() === 'span') {
			this._activeTagIndex = e.model.index;
		}
	}

	_textChanged(event) {
		this.text = event.target.value;
	}

	_textForItem(item) {
		return item && item.text || item;
	}

	_valueBlur() {
		this._valueBlurHandle = setTimeout(this._handleValueBlur, 100);
	}

	_valueFocus() {
		if (this._valueBlurHandle) {
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
