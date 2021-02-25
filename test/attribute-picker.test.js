import '../attribute-picker.js';
import { expect, fixture, html, oneEvent } from '@open-wc/testing';
import { runConstructor } from '@brightspace-ui/core/tools/constructor-test-helper.js';

// returns either the event or the returnValIfTimeout, whichever is resolved first
const timeout = 1000;
async function verifyEventTimeout(listener, returnValIfTimeout) {
	return await Promise.race([
		listener,
		new Promise(resolve => setTimeout(() => resolve(returnValIfTimeout), timeout))
	]);
}

describe('d2l-labs-attribute-picker', () => {

	describe('accessibility', () => {
		it('should pass all axe tests', async() => {
			const el = await fixture(html`<d2l-labs-attribute-picker></d2l-labs-attribute-picker>`);
			await expect(el).to.be.accessible();
		});
	});

	describe('constructor', () => {
		it('should construct', () => {
			runConstructor('d2l-labs-attribute-picker');
		});
	});

	describe('render', () => {
		it('should display the initial attributes and dropdown values', async() => {
			const attributeList = ['one', 'two', 'three'];
			const availableAttributeList = ['one', 'two', 'three', 'four', 'five', 'six'];
			const el = await fixture(
				html`<d2l-labs-attribute-picker
						allow-freeform
						.attributes="${attributeList}"
						.available-attributes="${availableAttributeList}"
					</d2l-labs-attribute-picker>`
			);

			const pageNumberInput = el.shadowRoot.querySelector('input');
			pageNumberInput.focus();

			const pageNumberInput = el.shadowRoot.querySelectorAll('.d2l-attribute-picker-attribute');

			const pageNumberInput = el.shadowRoot.querySelectorAll('d2l-attribute-picker-li');


		});

		it('should adjust the attributes and dropdown values when set to new values', async() => {

		});

		it('should display the dropdown list based on hide-dropdown', async() => {

		});

		it('should allow new values only if allow-freeform is enabled.', async() => {

		});
	});

	describe('interaction', () => {
		it('should scroll through the dropdown using the up and down arrow keys', async() => {

		});

		it('should scroll through tags using left and right arrow keys', async() => {

		});

		it('should delete a focused tag using backspace', async() => {

		});

		it('should create a tag matching the dropdown list selection', async() => {

		});
	});

	describe('eventing', () => {
		const attributeList = ['one', 'two', 'three'];
		const availableAttributeList = ['one', 'two', 'three', 'four', 'five', 'six'];
		let el;
		beforeEach(async() => {
			el = await fixture(
				html`<d2l-labs-attribute-picker
						allow-freeform
						.attributes="${attributeList}"
						.available-attributes="${availableAttributeList}"
						limit="5">
					</d2l-labs-attribute-picker>`
			);
		});

		it('should fire the attributes-changed event when adding a tag', async() => {
			const listener = oneEvent(el, 'attributes-changed');

			const pageNumberInput = el.shadowRoot.querySelector('input');
			pageNumberInput.focus();
			el._text = 'four';
			pageNumberInput.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', keyCode: 13}));

			const result = await verifyEventTimeout(listener, 'no event fired');
			expect(result).to.not.equal('no event fired');
			expect(result.detail.attributes.length).to.equal(4);
		});

		it('should fire the attributes-changed event when removing a tag', async() => {
			const listener = oneEvent(el, 'attributes-changed');

			const pageNumberInput = el.shadowRoot.querySelector('input');
			pageNumberInput.focus();
			pageNumberInput.dispatchEvent(new KeyboardEvent('keydown', { key: 'Left', keyCode: 37}));
			pageNumberInput.dispatchEvent(new KeyboardEvent('keydown', { key: 'Backspace', keyCode: 8}));

			const result = await verifyEventTimeout(listener, 'no event fired');
			expect(result).to.not.equal('no event fired');
		});

		it('should fire the attribute-limit-reached event when attempting to add a tag beyond the limit', async() => {
			const listener = oneEvent(el, 'attribute-limit-reached');

			const pageNumberInput = el.shadowRoot.querySelector('input');
			expect(el.attributes.length).to.equal(3);

			pageNumberInput.focus();
			el._text = 'four';
			pageNumberInput.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', keyCode: 13}));
			await el.requestUpdate;
			expect(el.attributes.length).to.equal(4);
			el._text = 'five';
			pageNumberInput.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', keyCode: 13}));
			await el.requestUpdate;
			expect(el.attributes.length).to.equal(5);
			el._text = 'six';
			pageNumberInput.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', keyCode: 13}));
			expect(el.attributes.length).to.equal(5);
			await el.requestUpdate;

			const result = await verifyEventTimeout(listener, 'no event fired');
			expect(result).to.not.equal('no event fired');
		});
	});
});
