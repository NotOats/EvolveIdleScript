import {BehaviorTree, Sequence, Selector, Task, SUCCESS, FAILURE} from 'behaviortree';

// Success if we're in the evolution stage, failure otherwise
const evolutionStageCheck = new Task({
    run: function(blackboard) {
        return $('#evolution:visible').length ? SUCCESS : FAILURE;
    }
});

const selectPlanet = new Task({
    run: function(blackboard) {
        return FAILURE;
    }
});

const selectRace = new Task({
    run: function(blackboard) {
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

            blackboard.nextAction = building;

            return SUCCESS;
        }

        return FAILURE;
    }
});

const runBuildAction = new Task({
    run: function(blackboard) {
        if(typeof(blackboard.nextAction) === 'undefined') {
            return FAILURE;
        }

        console.log(`[Debug] Running ${blackboard.nextAction}`);

        $(`div[id*='${blackboard.nextAction}'].action > a.button`).get(0).click();

        return SUCCESS;
    },
    end: function(blackboard) {
        // Clean up blackboard
        if(typeof(blackboard.nextAction) !== 'undefined') {
            delete blackboard.nextAction;
        }
    }
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