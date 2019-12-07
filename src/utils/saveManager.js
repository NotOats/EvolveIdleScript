import LZString from 'lz-string';

export class SaveManager {
    // TODO: Settings system
    #maxSlots = 5;
    #webStorageName = 'evolveIdleScriptSaves';
    #saveData;

    constructor() {
        this.load();
    }

    get saves() {
        return this.#saveData;
    }

    /**
     * Store an evolve save game into a slot with the specified name
     * @param {Number} id - The id to assign the same.
     *                      Defaults to next available.
     * @param {String} data - The save game to store (Evolve format).
     *                        Defaults to current game.
     * @param {String} name - The name to assign to the save.
     *                        Defaults to game race and biome.
     * @return {Boolean} - If the save was success full
     */
    storeSave(id = undefined, data = undefined, name = undefined) {
        // Check id
        if (id < 0 || id > this.#maxSlots) {
            id = this._nextEmptyId();
        }

        if (id == -1) {
            return false;
        }

        // Configure save data
        const timestamp = Date.now();
        data = data || window.exportGame();
        name = name || this._readSaveName(data, timestamp);

        // Try to set the slot
        for (const entry of this.#saveData) {
            if (entry.id == id) {
                entry.data = data;
                entry.name = name;
                entry.timestamp = timestamp;

                if (process.env.NODE_ENV == 'development') {
                    console.log(`[SaveManager] Saved ${name} in slot ${id}`);
                }

                return true;
            }
        }

        if (process.env.NODE_ENV == 'development') {
            console.log(`[SaveManager] [Error] Failed to save ${name} in slot ${id}`);
        }

        return false;
    }

    /**
     * Removes the specified save and sets it back to default
     * @param {Number} id - The save id
     * @return {Boolean} - If the save was successfully removed.
     */
    removeSave(id) {
        for (const entry of this.#saveData) {
            if (entry.id == id) {
                entry.data = undefined;
                entry.name = '';
                entry.timestamp = undefined;

                if (process.env.NODE_ENV == 'development') {
                    console.log(`[SaveManager] Removed save in slot ${id}`);
                }

                return true;
            }
        }

        if (process.env.NODE_ENV == 'development') {
            console.log(`[SaveManager] [Error] Failed to remove save in slot ${id}`);
        }

        return false;
    }

    /**
     * Loads the saved games from web storage.
     * Called by the class constructor.
     */
    load() {
        const rawData = localStorage.getItem(this.#webStorageName);
        const decompressed = LZString.decompressFromUTF16(rawData);

        // Decompress or load defaults
        let data = decompressed ? JSON.parse(decompressed) : this._generateDefaultSave();

        // Validate
        if (!Array.isArray(data) || data.length > this.#maxSlots) {
            throw Error('Invalid save data');
        }

        // Fill in empty slots, figure out how to delete on lowering maxSlots?
        if (data.length < this.#maxSlots) {
            const padded = this._generateDefaultSave(data.length, this.#maxSlots);
            data = data.concat(padded);
        }

        this.#saveData = data;

        if (process.env.NODE_ENV == 'development') {
            const slotsUsed = data.filter((x) => x.data != undefined).length;

            console.log(`[SaveManager] Loaded save data (${slotsUsed}/${this.#maxSlots} used)`);
            console.log(`[SaveManager] \tCompressed Length: ${rawData.length}`);
            console.log(`[SaveManager] \tDecompressed Length: ${decompressed.length}`);
        }
    }

    /**
     * Saves the saves games to web storage
     */
    save() {
        let data = this.#saveData;

        // Load defaults
        if (data == undefined) {
            data = this._generateDefaultSave(0, this.#maxSlots);
        }

        // Validate
        if (data != undefined &&
            (!Array.isArray(data) || data.length > this.#maxSlots)) {
            throw Error('Invalid save data');
        }

        const decompressed = JSON.stringify(data);
        const compressed = LZString.compressToUTF16(decompressed);
        localStorage.setItem(this.#webStorageName, compressed);

        if (process.env.NODE_ENV == 'development') {
            const slotsUsed = data.filter((x) => x.data != undefined).length;

            console.log(`[SaveManager] Loaded save data (${slotsUsed}/${this.#maxSlots} used)`);
            console.log(`[SaveManager] \tCompressed Length: ${compressed.length}`);
            console.log(`[SaveManager] \tDecompressed Length: ${decompressed.length}`);
        }
    }

    // Private methods broken with eslint
    _generateDefaultSave(start, max) {
        const saveObj = [];

        for (let i = start; i < max; ++i) {
            saveObj.push({
                id: i,
                name: '',
                timestamp: undefined,
                data: undefined,
            });
        }

        return saveObj;
    }

    _nextEmptyId() {
        let id = -1;

        this.#saveData.forEach((s) => {
            if (s.name == '' &&
                s.timestamp == undefined &&
                s.data == undefined) {
                id = s.id;
            }
        });

        return id;
    }

    _readSaveName(saveGame, timestamp) {
        function capitalize(str) {
            return str.toLowerCase()
                .split(' ')
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ');
        }

        // Pulled from game files
        const data = LZString.decompressFromBase64(saveGame);
        const global = JSON.parse(data);

        const race = global.race.species;
        const biome = global.city.biome;

        return `${capitalize(race)} - ${capitalize(biome)} @ ` +
                    `${new Date(timestamp).toLocaleString()}`;
    }
}
