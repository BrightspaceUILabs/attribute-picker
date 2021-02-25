import '@brightspace-ui/core/components/icons/icon.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';
import { inputStyles } from '@brightspace-ui/core/components/inputs/input-styles.js';
import { Localizer } from './lang/localization.js';
import { RtlMixin } from '@brightspace-ui/core/mixins/rtl-mixin.js';

class AttributePicker extends RtlMixin(Localizer(LitElement)) {
	static get properties() {
		return {
			/* When true, the user can manually type any attribute they wish. If false, they must select from the dropdown. */
			allowFreeform: { type: Boolean, attribute: 'allow-freeform', reflect: true },

			/* Required. When true, the autocomplete dropdown will not be displayed to the user. */
			ariaLabel: { type: String, attribute: 'aria-label', reflect: true },

			/* An array of strings available in the dropdown list. */
			assignableAttributes: { type: Array, attribute: 'assignable-attributes', reflect: true },

			/* When true, the autocomplete dropdown will not be displayed to the user. */
			hideDropdown: { type: Boolean, attribute: 'hide-dropdown', reflect: true },

			/* The maximum number of attributes permitted. */
			limit: { type: Number, attribute: 'limit', reflect: true },

			/* An array of strings representing the attributes currently selected in the picker. */
			attributes: { type: Array, attribute: 'attributes', reflect: true },

			/* The inner text of the input. */
			text: { type: String, attribute: 'text', reflect: true },

			/* Represents the index of the currently focused attribute. If no attribute is focused, equals -1. */
			_activeAttributeIndex: { type: Number, reflect: false },

			/* Represents the index of the currently focused dropdown list item. If no item is focused, equals -1. */
			_dropdownIndex: { type: Number, reflect: false },

			/* When true, the user currently has focus within the input. */
			_inputFocused: { type: Boolean, reflect: false },
		};
	}

	static get styles() {
		return [inputStyles, css`
			:host {
				display: inline-block;
				width: 100%;
				font-size: 0.8rem;
			}
			:host:disabled {
				opacity: 0.5;
			}
			:host([hidden]) {
				display: none;
			}
			.d2l-attribute-picker-container {
				border-radius: 6px;
				border-style: solid;
				background-color: #fff;
				border-color: var(--d2l-color-mica);
				border-width: 1px;
				box-shadow: inset 0 2px 0 0 rgba(185, 194, 208, 0.2);
				padding: 5px 5px 5px 5px;
				vertical-align: middle;
			}
			.d2l-attribute-picker-container-focused {
				border-color: var(--d2l-color-celestine);
				border-width: 2px;
				padding: 4px 4px 4px 4px;
				outline-width: 0;
			}
			.d2l-attribute-picker-content {
				display: flex;
				flex-wrap: wrap;
				cursor: text;
				margin-top: -1px;
			}

			.d2l-attribute-picker-attribute {
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
			.d2l-attribute-picker-attribute:hover {
				background-color: var(--d2l-color-gypsum);
			}
			.d2l-attribute-picker-attribute:focus, .d2l-attribute-picker-attribute:focus > d2l-icon {
				outline: none;
				background-color: var(--d2l-color-celestine);
				color: #FFF;
			}
			d2l-icon {
				color: rgba(86, 90, 92, 0.5); /* --d2l-color-ferrite @ 50% */
				/* display: none; */
				margin-left: 0.3rem;
			}
			.d2l-attribute-picker-attribute:focus > d2l-icon,
			.d2l-attribute-picker-attribute:focus > d2l-icon:hover {
				color: #FFF;
			}
			.d2l-attribute-picker-input {
				width: 10px;
				background: transparent;
				border: none;
				box-shadow: none;
				box-sizing: border-box;
				flex-grow: 1;
				padding: 0px;



				/* Override d2l-input styles */
				min-height: 0rem;
				padding: 0 !important;
			}
			.d2l-attribute-list {
				/* Box Model */
				min-height: 0rem;
				max-height: 7.8rem;
				overflow-y: scroll;

				/* Typography */
				text-overflow: ellipsis;

				/* Visual */
				list-style: none;
				background-color: #ffffff;
				border: 1px solid #dddddd;
				border-radius: 6px;
				background-color: #fff;
			}

			.d2l-attribute-picker-li {
				padding: 0.4rem 6rem 0.4rem 0.6rem;
				margin:0px;
				cursor: pointer;
			}

			.d2l-attribute-picker-li.selected {
				color: var(--d2l-color-celestine);
				background-color: var(--d2l-color-celestine-plus-2);
			}

			.d2l-attribute-picker-absolute-container {
				margin: -0.3rem 0rem 0rem -0.3rem;
				position:absolute;
				z-index: 1;
				min-width: 96.5%;
			}
		`];
	}

	constructor() {
		super();
		this.attributes = [];
		this.assignableAttributes = [];
		this._text = '';
		this.hideDropdown = false;
		this._inputFocused = false;
		this._activeAttributeIndex = -1;
		this._dropdownIndex = -1;
	}

	clearText() {
		this._text = '';
	}

	updated(changedProperties) {
		super.updated(changedProperties);
		if (changedProperties.has('_activeAttributeIndex')) {
			this._activeAttributeIndexChanged(this._activeAttributeIndex);
		}
		if (changedProperties.has('assignableAttributes')) {
			this._assignableAttributesChanged();
		}
	}

	render() {
		//Hash active attributes and filter out unavailable and unmatching dropdown items.
		const hash = {};
		this.attributes.map((item) => hash[item] = true);
		const availableAttributes = this.assignableAttributes.filter(x => hash[x] !== true && (x === '' || x.includes(this._text)));
		let listIndex = 0;

		return html`
		<div role="application" class="d2l-attribute-picker-container ${this._inputFocused ? 'd2l-attribute-picker-container-focused' : ''}">
			<div class="d2l-attribute-picker-content" aria-live="polite">
				${this.attributes.map((item, index) => html`
				<div
					class="d2l-attribute-picker-attribute"
					tabindex="0"
					.index="${index}"
					aria-label="${this.localize('attribute_name', 'attribute', item)}"
					@keydown="${this._onAttributeKeydown}"
					@blur="${this._onAttributeBlur}"
					@focus="${this._onAttributeFocus}">
						${item}
					<d2l-icon
						aria-live="off"
						aria-label="${this.localize('remove_attribute', 'attribute', item)}"
						class="${(this._inputFocused || this._activeAttributeIndex > -1) ? 'focused' : ''}"
						.value="${item}" .index="${index}" ?hidden="${!this._inputFocused && this._activeAttributeIndex === -1}"
						icon="d2l-tier1:close-small"
						@click="${this._onAttributeRemoveClick}">
					</d2l-icon>
				</div>`)}

				<input
					aria-activedescendant="${this._dropdownIndex > -1 ? `attribute-dropdown-list-item-${this._dropdownIndex}` : ''}"
					aria-autocomplete="list"
					aria-haspopup="true"
					aria-expanded="${this._inputFocused}"
					aria-label="${this.ariaLabel}"
					aria-owns="attribute-dropdown-list"
					class="d2l-input d2l-attribute-picker-input"
					@blur="${this._onInputBlur}"
					@focus="${this._onInputFocus}"
					@keydown="${this._onInputKeydown}"
					@input="${this._onInputTextChanged}"
					role="combobox"
					type="text"
					.value="${this._text}">
				</input>
			</div>

			<div class="d2l-attribute-picker-absolute-container">
				<ul role="listbox"
					id="attribute-dropdown-list"
					?hidden="${!this._inputFocused || this.hideDropdown || availableAttributes.length === 0}"
					class="d2l-attribute-list">

					${availableAttributes.map((item) => html`
						<li id="attribute-dropdown-list-item-${listIndex}"
							aria-label="${this.localize('add_attribute', 'attribute', item)}"
							aria-selected="${this._dropdownIndex === listIndex ? true : false}"
							class="d2l-attribute-picker-li ${this._dropdownIndex === listIndex ? 'selected' : ''}"
							.text="${item}"
							.index=${listIndex++}
							@mouseover="${this._onListItemMouseOver}"
							@mousedown="${this._onListItemTapped}">
							${item}
						</li>
					`)}
				</ul>
			</div>
		</div>
		`;
	}

	/* Event handlers */
	_onAttributeBlur(e) {
		const targetIndex = e.target.index;
		this.updateComplete.then(() => {
			if (this._activeAttributeIndex === targetIndex) {
				this._activeAttributeIndex = -1;
			}
		});
	}

	_onAttributeFocus(e) {
		this._activeAttributeIndex = e.target.index;
	}

	_onAttributeKeydown(e) {
		if (e.keyCode === 8) {
			this._removeAttributeIndex(this._activeAttributeIndex);
			this.shadowRoot.querySelector('.d2l-attribute-picker-input').focus();
		}
		else if (e.keyCode === 37) { // left arrow
			if (this._activeAttributeIndex > 0 && this._activeAttributeIndex < this.attributes.length) {
				this._activeAttributeIndex -= 1;
			} else {
				this._activeAttributeIndex = this.attributes.length - 1;
			}
		}
		else if (e.keyCode === 39) { // right arrow
			if (this._activeAttributeIndex >= 0 && this._activeAttributeIndex < this.attributes.length - 1) {
				this._activeAttributeIndex += 1;
			} else {
				this._activeAttributeIndex = -1;
				this.shadowRoot.querySelector('.d2l-attribute-picker-input').focus();
			}
		}
	}

	_onAttributeRemoveClick(e) {
		this._removeAttributeIndex(e.target.index);
		this.shadowRoot.querySelector('input').focus();
	}

	_onInputBlur() {
		this._inputFocused = false;
	}

	_onInputFocus() {
		this._inputFocused = true;
		this._activeAttributeIndex = -1;
		this._dropdownIndex = -1;
	}

	_onInputKeydown(e) {
		if (e.keyCode === 8) { // backspace
			// if a value is selected, remove that value
			if (this._activeAttributeIndex >= 0) {
				this._removeAttributeIndex(this._activeAttributeIndex);
				this._activeAttributeIndex = -1;
				e.preventDefault();
				return;
			}

			// if we're at the beginning of the input,
			// select the last value
			if (e.srcElement.selectionStart === 0 &&
                    e.srcElement.selectionEnd === 0) {
				this._activeAttributeIndex = this.attributes.length - 1;
			}
		} else if (e.keyCode === 37) { // left arrow
			this._activeAttributeIndex = this.attributes.length - 1;

		} else if (e.keyCode === 38) { // up arrow
			const assignableCount = this.shadowRoot.querySelectorAll('li').length;
			if (this._dropdownIndex === -1) {
				this._dropdownIndex = assignableCount - 1;
			} else {
				this._dropdownIndex = this._mod(this._dropdownIndex - 1, assignableCount);
			}
			this._updateDropdownFocus();

		} else if (e.keyCode === 40) { // down arrow
			const assignableCount = this.shadowRoot.querySelectorAll('li').length;
			this._dropdownIndex = this._mod(this._dropdownIndex + 1, assignableCount);
			this._updateDropdownFocus();

		} else if (e.keyCode === 13) { //Enter
			const list = this.shadowRoot.querySelectorAll('li');
			if (this._attributeLimitReached()) {
				this.dispatchEvent(new CustomEvent('attribute-limit-reached', {
					bubbles: true,
					composed: true,
					detail: {
						limit: this.limit
					}
				}));
				return;
			}

			if (this._dropdownIndex >= 0 && this._dropdownIndex < list.length) {
				this._addAttribute(list[this._dropdownIndex].text);
				this._text = '';
				if (list.length === 1 || list.length - 1 === this._dropdownIndex) {
					this._dropdownIndex --;
				}
			} else if (this.allowFreeform) {
				const trimmedAttribute =  this._text.trim();
				if (trimmedAttribute.length > 0 && !this.attributes.includes(trimmedAttribute)) {
					this._addAttribute(this._text.trim());
					this._text = '';
				}
			}
			this._updateDropdownFocus();
		}
	}

	_onInputTextChanged(event) {
		this._text = event.target.value;
		this.requestUpdate();
	}

	_onListItemMouseOver(e) {
		this._dropdownIndex = e.target.index;
	}

	_onListItemTapped(e) {
		this._addAttribute(e.target.text);
		e.preventDefault();
	}

	_activeAttributeIndexChanged() {
		const selectedAttributes = this.shadowRoot.querySelectorAll('.d2l-attribute-picker-attribute');
		if (this._activeAttributeIndex >= 0 && this._activeAttributeIndex < selectedAttributes.length) {
			selectedAttributes[this._activeAttributeIndex].focus();
		}
	}

	_assignableAttributesChanged() {
		this._dropdownIndex = -1;
	}

	/* Helper functions */
	_addAttribute(newValue) {
		if (!newValue || this.attributes.findIndex(attribute => attribute.value === newValue) >= 0) {
			return;
		}
		this.attributes = [...this.attributes, newValue];
		this.requestUpdate();

		this.dispatchEvent(new CustomEvent('attributes-changed', {
			bubbles: true,
			composed: true,
			detail: {
				attributes: this.attributes
			}
		}));
	}

	_attributeLimitReached() {
		return this.limit && (this.attributes.length >= this.limit);
	}

	_menuItemFocused(e) {
		this._addAttribute(e.target.text);
		this._menuItemFocused = true;
	}

	_removeAttributeIndex(index) {
		this.attributes = this.attributes.slice(0, index).concat(this.attributes.slice(index + 1, this.attributes.length));
		this._activeAttributeIndex = -1;

		this.dispatchEvent(new CustomEvent('attributes-changed', {
			bubbles: true,
			composed: true,
			detail: {
				attributes: this.attributes
			}
		}));
	}

	_updateDropdownFocus() {
		this.updateComplete.then(() => {
			const items = this.shadowRoot.querySelectorAll('li');
			if (items.length > 0 && this._dropdownIndex >= 0) {
				items[this._dropdownIndex].scrollIntoViewIfNeeded(false);
			}
		});
	}

	// Absolute value % operator for navigating menus.
	_mod(x, y) {
		return ((x % y) + y) % y;
	}
}
customElements.define('d2l-labs-attribute-picker', AttributePicker);
