import {BehaviorTree, Sequence, Task, SUCCESS, FAILURE} from 'behaviortree';

const selectResource = new Task({
    run: function(blackboard) {
        $('#resources > .resource > .res').each(function() {
            // Pull the resource name
            let resourceName = this.innerText.toLowerCase();

            // Check if it has an action associated with it
            let action = $(`div[id*='${resourceName}'].action`);
            if(action.length) {
                // Check if we're at the resource cap
                let resource = blackboard.game.global.resource[this.innerText];

                if(resource.amount < resource.max) {
                    blackboard.resource = resourceName;
                    return false;
                }
            }
        });

        return typeof(blackboard.resource) !== 'undefined' ? SUCCESS : FAILURE;
    }
});

// TODO: Genericise this into RunActionByName via blackboard.selectedAction?
const gameFarmAction = new Task({
    run: function(blackboard) {
        if(typeof(blackboard.resource) === 'undefined') {
            return FAILURE;
        }

        //console.log(`[Debug] Farming ${blackboard.resource}`);
        
        const element = $(`div[id*='${blackboard.resource}'].action > a.button`).get(0);

        for(let i = 0; i < 5; i++) {
            element.click();
        }

        return SUCCESS;
    },
    end: function(blackboard) {
        // Clean up blackboard
        if(typeof(blackboard.resource) !== 'undefined') {
            delete blackboard.resource;
        }
    }
});

const autoResourceFarm = new Sequence({
    nodes: [
        selectResource,
        gameFarmAction
    ]
});

BehaviorTree.register('autoResourceFarm', autoResourceFarm);