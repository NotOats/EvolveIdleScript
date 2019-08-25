import {BehaviorTree, Sequence, Selector, Task, SUCCESS, FAILURE} from 'behaviortree';
import {races} from '../data/races.js';

// Success if we're in the evolution stage, failure otherwise
const evolutionStageCheck = new Task({
    run: function(blackboard) {
        // We're in evo state, try to initialize if needed.
        if($('#evolution:visible').length){
            if(typeof(blackboard.evo === 'undefined')) {
                blackboard.evo = {};
            }

            return SUCCESS;
        }

        // We're done, no longer in evo state. Cleanup time.
        if(typeof(blackboard.evo !== 'undefined')) {
            delete blackboard.evo;
        }

        return FAILURE;
    }
});

const selectPlanet = new Task({
    run: function(blackboard) {
        return FAILURE;
    }
});

const selectRace = new Task({
    run: function(blackboard) {
        const bb = blackboard.evo;
        const target = races['human'];

        for(const building of target.evolveSequence) {
            const element = $(`div[id*='${building}'].action:not(.cna)`);

            if(element.length) {
                console.log(`[Debug] Selecting ${building}`);

                bb.nextAction = building;

                return SUCCESS;
            }
        }

        return FAILURE;
    }
});

const selectChallenge = new Task({
    run: function(blackboard) {
        return FAILURE;
    }
});

const selectBuildAction = new Task({
    run: function(blackboard) {
        const bb = blackboard.evo;
        const buildingOrder = new Map([
            ['mitochondria', 3],
            ['eukaryotic_cell', 5],
            ['nucleus', 5],
            ['organelles', 15],
            ['membrane', 10]
        ]);

        for(const [building, maxCount] of buildingOrder) {
            // Select element (cna = can not afford)
            const element = $(`div[id*='${building}'].action:not(.cna)`);

            // Check if action is locked or we're at the maximum number required
            const currentCount = element.find('.button > span.count').text();
            
            if(!element.length || currentCount >= maxCount) {
                continue;
            }
            
            console.log(`[Debug] Selecting ${building} (${currentCount}/${maxCount})`);

            bb.nextAction = building;

            return SUCCESS;
        }

        return FAILURE;
    }
});

const runBuildAction = new Task({
    run: function(blackboard) {
        const bb = blackboard.evo;

        if(typeof(bb.nextAction) === 'undefined') {
            return FAILURE;
        }

        console.log(`[Debug] Running ${bb.nextAction}`);

        $(`div[id*='${bb.nextAction}'].action > a.button`).get(0).click();

        return SUCCESS;
    },
});

// Check if we're in evo stage.
// Pick an action
// Run the action
const autoEvolution = new Sequence({
    nodes: [
        evolutionStageCheck,        // Ensure we're in the evo stage
        new Selector({
            nodes: [
                selectPlanet,               // Select Planet? Haven't gotten to the point in-game yet but I am told it exists.
                selectRace,                 // Select Race? Not sure how this works, haven't seen in-game.
                selectChallenge,            // Select Challenges
                selectBuildAction,          // Select which building to make next, failure if none
            ]
        }),
        runBuildAction,             // Build the building, failure if can't build
    ]
});

BehaviorTree.register('autoEvolution', autoEvolution);