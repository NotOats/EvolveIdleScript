import $ from 'jquery';
import {BehaviorTree, Sequence, Task, SUCCESS, FAILURE} from 'behaviortree';

const selectResource = new Task({
    run: function(blackboard) {
        $('#resources > .resource').each(function(index, element) {
            // ex: resFood => Food
            const resourceName = element.id.slice(3);

            // Food (in res array) => food (city-food action id)
            const resourceActionName = resourceName.toLowerCase();

            // Check if it has an action associated with it
            const action = $(`div[id*='${resourceActionName}'].action:not(.cna) > a.button`);
            if (action.length) {
                // Check if we're at the resource cap
                const resource = blackboard.game.global.resource[resourceName];

                if (typeof(resource) !== 'undefined' && resource.amount < resource.max) {
                    blackboard.resource = action;
                    return false;
                }
            }
        });

        return typeof(blackboard.resource) !== 'undefined' ? SUCCESS : FAILURE;
    },
});

// TODO: Genericise this into RunActionByName via blackboard.selectedAction?
const gameFarmAction = new Task({
    run: function(blackboard) {
        if (typeof(blackboard.resource) === 'undefined') {
            return FAILURE;
        }

        // console.log(`[Debug] Farming: ${blackboard.resource.text()}`);

        // const element = $(`div[id*='${blackboard.resource}'].action > a.button`).get(0);
        const element = blackboard.resource.get(0);
        for (let i = 0; i < 5; i++) {
            element.click();
        }

        return SUCCESS;
    },
    end: function(blackboard) {
        // Clean up blackboard
        if (typeof(blackboard.resource) !== 'undefined') {
            delete blackboard.resource;
        }
    },
});

const autoResourceFarm = new Sequence({
    nodes: [
        selectResource,
        gameFarmAction,
    ],
});

BehaviorTree.register('autoResourceFarm', autoResourceFarm);
