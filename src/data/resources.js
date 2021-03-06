import $ from 'jquery';

/**
 * @enum {Number} ResourceType
 * @property {Number} Money - Money
 * @property {Number} Population - Population
 * @property {Number} Knowledge - Knowledge
 * @property {Number} Storage - Crates/Containers
 * @property {Number} Normal - Regular resources
 * @property {Number} Advanced - Advanced resources (usually crafted at a building)
 * @property {Number} Crafted - Cradted resources
 * @property {Number} Prestigue - Used for prestigue mechanics plasmid/phage/etc
 * @property {Object} properties - Maps numerical values back to text
 */
export const ResourceType = Object.freeze({
    Money: 0,
    Population: 1,
    Knowledge: 2,
    Storage: 3,
    Normal: 4,
    Advanced: 5,
    Crafted: 6,
    Prestigue: 7,

    properties: {
        0: {name: 'Money', value: 0},
        1: {name: 'Population', value: 1},
        2: {name: 'Knowledge', value: 2},
        3: {name: 'Storage', value: 3},
        4: {name: 'Normal', value: 4},
        5: {name: 'Advanced', value: 5},
        6: {name: 'Crafted', value: 6},
        7: {name: 'Prestigue', value: 7},
    },
});

/**
 * Represents an in-game resource.
 * Attempts to use vue data first before falling back to DOM parsing.
 */
export class Resource {
    #element;

    /**
     * Creates a new Resource for the specified element
     * The element should have a class of "resource"
     * @param {HTMLElement} element - The resource's HTMLElement
     */
    constructor(element) {
        this.#element = element;
    }

    // Private methods are currently broken with eslint-babel
    get _data() {
        return this.#element?.__vue__?._data;
    }

    /**
     * Resource name
     * @return {String}
     */
    get name() {
        const value = this._data?.name;
        if (value != undefined) {
            return value;
        }

        return $(this.#element).attr('id').substring('res'.length);
    }

    /**
     * Currently owned number of this resource
     * @return {Number}
     */
    get amount() {
        const value = this._data?.amount;
        if (value != undefined) {
            return value;
        }

        // Format is 'amount/max' or 'amount' (for crafting)
        const counts = $(this.#element).children('span.count').text().split('/');

        return counts[0];
    }

    // Debug method
    set _amount(count) {
        if (!Number.isInteger(count)) {
            return;
        }

        const data = this._data;
        if ('amount' in data) {
            data.amount = count;
        } else {
            throw Error('Failed to set resource amount, vue not found');
        }
    }

    /**
     * The maximum number of this resource
     * @return {Number}
     */
    get max() {
        const value = this._data?.max;
        if (value != undefined) {
            return value;
        }

        // Format is 'amount/max' or 'amount' (for crafting)
        const counts = $(this.#element).children('span.count').text().split('/');

        return counts.length == 2 ? counts[1] : -1;
    }

    /**
     * If this resource is displayed
     * @return {Boolean}
     */
    get display() {
        const value = this._data?.display;
        if (value != undefined) {
            return value;
        }

        return $('#resMoney').css('display') != 'none';
    }

    /**
     * The type of this resource
     * @return {ResourceType}
     */
    get type() {
        return mapClassToResource(this.#element);
    }
}

/**
 * Parses game resources from the DOM.
 * @return {Array.<Resource>} Array of resouces
 */
export function ParseResources() {
    return $('div.resources > div[id*="res"]')
        .map((index, element) => {
            // Some sanity checking
            if ('__vue__' in element) {
                return new Resource(element);
            }
        }).toArray();
}

// Helper functions
const resourceClassMap = new Map([
    ['has-text-success', ResourceType.Money],
    /*
    // These have special overrides
    ['', ResourceType.Population],
    ['', ResourceType.Knowledge],
    ['', ResourceType.Storage],
    */
    ['has-text-info', ResourceType.Normal],
    ['has-text-advanced', ResourceType.Advanced],
    ['has-text-danger', ResourceType.Crafted],
    ['has-text-special', ResourceType.Prestigue],
]);

const overrideResourceMap = new Map([
    /*
    // There still isn't a decent way to check this. So fallback as default override.
    ['', ResourceType.Population],
    */
    ['Knowledge', ResourceType.Knowledge],
    ['Crate', ResourceType.Storage],
    ['Container', ResourceType.Storage],
]);

function mapClassToResource(element) {
    const el = $(element);

    // Normal resource
    const normal = el.children('h3.res');
    if (normal.length) {
        const classes = normal.get(0).className.split(/\s+/)
            .filter((str) => str.startsWith('has-text'));

        for (const str of classes) {
            // Try regular map first
            if (resourceClassMap.has(str)) {
                return resourceClassMap.get(str);
            }

            // Override from normal map
            if (str == 'has-text-warning') {
                for (const [k, v] of overrideResourceMap.entries()) {
                    if (element.id.endsWith(k)) {
                        return v;
                    }
                }

                // If it's warning and not in the map it's population
                return ResourceType.Population;
            }
        }
    }

    // Prestigue resource
    const prest = el.children('span.res');
    if (prest.length) {
        return ResourceType.Prestigue;
    }

    return undefined;
}
