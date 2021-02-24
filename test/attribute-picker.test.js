import '../attribute-picker.js';
import { expect, fixture, html } from '@open-wc/testing';
import { runConstructor } from '@brightspace-ui/core/tools/constructor-test-helper.js';

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
		it('should fire the attributes-changed event when adding a tag', async() => {

		});

		it('should fire the attributes-changed event when removing a tag', async() => {

		});

		it('should fire the attribute-limit-reached event when attempting to add a tag beyond the limit', async() => {

		});
	});
});
