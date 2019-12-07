import $ from 'jquery';

/**
 * @enum {Number} ActionType
 * @property {Number} Evolution - Evolution
 * @property {Number} City - City
 * @property {Number} Technology - Research Technology
 * @property {Number} Genes - Genes Editing
 * @property {Number} Space - Interplanetary
 * @property {Number} Interseteller - Interseteller
 * @property {Number} StarDock - StarDock for bioseeding
 * @property {Number} Portal - Portal to hell
 * @property {Object} properties - Maps numerical values back to text
 */
export const ActionType = Object.freeze({
    Evolution: 0,
    City: 1,
    Technology: 2,
    Genes: 3,
    Space: 4,
    Interseteller: 5,
    StarDock: 6,
    Portal: 7,

    properties: {
        0: {name: 'Evolution', value: 0},
        1: {name: 'City', value: 1},
        2: {name: 'Technology', value: 2},
        3: {name: 'Genes', value: 3},
        4: {name: 'Space', value: 4},
        5: {name: 'Interseteller', value: 5},
        6: {name: 'StarDock', value: 6},
        7: {name: 'Portal', value: 7},
    },
});

/**
 * Represents an in-game action.
 * Attemps to use vue data/methods first before falling back to DOM parsing.
 */
export class Action {
    #element;

    constructor(element) {
        this.#element = element;
    }

    // Private methods are currently broken with eslint-babel
    get _vue() {
        return this.#element?.__vue__;
    }

    /**
     * The title that's display in the action button
     * @type {String}
     */
    get title() {
        const title = this._vue?.title;
        if (title != undefined) {
            return title;
        }

        return $(this.#element).find('.aTitle').text();
    }

    /**
     * Current amount of buildings owned
     * @type {Number}
     */
    get count() {
        const count = this._vue?.act?.count;
        if (count != undefined) {
            return count;
        }

        return $(this.#element).find('a.button > .count').text();
    }

    /**
     * If the action is affordable
     * Note: There is no way to do this with vue data.
     * @type {Boolean}
     */
    get affordable() {
        return !$(this.#element).hasClass('cna');
    }

    /**
     * If the action is ever affordable
     * Note: There is no way to do this with vue data.
     * @type {Boolean}
     */
    get beyondAffordable() {
        return !$(this.#element).hasClass('cnam');
    }
}

/**
 * Parses game actions from the DOM
 * @param {ActionType} actionType - Which action type to read
 * @return {(Array.<Action>|undefined)}
 */
export function parseActions(actionType) {
    if (actionType == undefined) {
        throw Error('Invalid action type');
    }

    const finder = actionFinderMap.get(actionType);
    if (finder != undefined && typeof finder == 'function') {
        const elements = finder();
        return Array.isArray(elements) && elements.length > 0 ?
            elements.map((element) => new Action(element)) : undefined;
    }

    return undefined;
}

// #region actionFinderMap
const actionFinderMap = new Map([
    [ActionType.Evolution, () => genericActionFinder('#evolution')],
    [ActionType.City, () => genericActionFinder('#city')],
    // These are CRISPR genes, not sure how to map it.
    // Need to make a save with no CRISPR upgrades.
    // [ActionType.Genes, () => genericActionFinder()],
    [ActionType.Technology, () => genericActionFinder('#tech')],
    [ActionType.Space, () => genericActionFinder('#space')],
    [ActionType.Interseteller, () => genericActionFinder('#interstellar')],
    [ActionType.StarDock, () => genericActionFinder('#starDock')], // Requires modal to be open
    [ActionType.Portal, () => genericActionFinder('#portal')],
]);

function genericActionFinder(rootElement) {
    return $(rootElement).children('.action').toArray();
}
// #endregion
