export class Race {
    constructor(id, evolveSequence) {
        this.id = id;
        this.evolveSequence = evolveSequence;
    }

    get name() {
        if(typeof(unsafeWindow.game) === 'undefined' 
        || typeof(unsafeWindow.game.races) === 'undefined') {
            return null;
        }

        return unsafeWindow.game.races[this.id].name;
    }

    get type() {
        if(typeof(unsafeWindow.game) === 'undefined' 
        || typeof(unsafeWindow.game.races) === 'undefined') {
            return null;
        }

        return unsafeWindow.game.races[this.id].type;
    }
}

// Phagocytosis
const bilateralSymmetry = ['bilateral_symmetry', 'multicellular', 'phagocytosis', 'sexual_reproduction'];

const anthropods = ['sentience', 'athropods'].concat(bilateralSymmetry);

const animalism = ['sentience', 'animalism', 'mammals'].concat(bilateralSymmetry);
const dwarfism = ['sentience', 'dwarfism', 'mammals'].concat(bilateralSymmetry);
const gigantism = ['sentience', 'gigantism', 'mammals'].concat(bilateralSymmetry);
const humonoids = ['sentience', 'humanoid', 'mammals'].concat(bilateralSymmetry);

const ectothermic = ['sentience', 'ectothermic', 'eggshell'].concat(bilateralSymmetry);
const endothermic = ['sentience', 'endothermic', 'eggshell'].concat(bilateralSymmetry);

// Chloroplasts & chitin
const chitin = ['sentience', 'bryophyte', 'spores', 'multicellular', 'chitin', 'sexual_reproduction'];
const chloroplasts = ['sentience', 'bryophyte', 'poikilohydric', 'multicellular', 'chloroplasts', 'sexual_reproduction'];

export const races =  {
    // Phagocytosis
        // Arthropods
        antid: new Race('antid', anthropods),
        mantis: new Race('mantis', anthropods),
        scorpid: new Race('scorpid', anthropods),

        // Mammals
            // Animalism
            cath: new Race('cath', animalism),
            centaur: new Race('centaur', animalism),
            wolven: new Race('wolven', animalism),

            // Dwarfism
            kobold: new Race('kobold', dwarfism),
            gnome: new Race('gnome', dwarfism),
            goblin: new Race('goblin', dwarfism),

            // Gigantism
            cyclops: new Race('cyclops', gigantism),
            ogre: new Race('orge', gigantism),
            troll: new Race('troll', gigantism),

            // Humanoid
            elf: new Race('elven', humonoids),
            human: new Race('human', humonoids),
            ork: new Race('orc', humonoids),
    
        // Eggshells
            // Ectothermic
            gecko: new Race('gecko', ectothermic),
            slitheryn: new Race('slitheryn', ectothermic),
            tortoisan: new Race('tortoisan', ectothermic),

            // Endothermic
            arrak: new Race('arraak', endothermic),
            dracnid: new Race('dracnid', endothermic),
            pterodacti: new Race('pterodacti', endothermic),

    // Chitin
    shroomi: new Race('shroomi', chitin),
    sporgar:  new Race('sporgar', chitin),

    // Chloroplasts
    cacti: new Race('cacti', chloroplasts),
    ent: new Race('entish', chloroplasts),

    // Aquatic?
    sharkin: new Race('sharkin', []),
    octigoran: new Race('octigoran', []),

    // Demonic?
    balorg: new Race('balorg', []),
    imp: new Race('imp', []),

    // Achievement
    junker: new Race('junker', [])
};