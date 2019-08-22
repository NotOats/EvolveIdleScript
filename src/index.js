import { BehaviorTree, Sequence, Task, SUCCESS, FAILURE } from 'behaviortree'

const myTask = new Task({
    start: function(bb) { bb.isStarted = true; },
    end: function(bb) { bb.isStarted = false; },
    run: function(bb) {
        console.log("IT WORKED")
        return SUCCESS
    }
})

const mySequence = new Sequence({
    nodes: [
        myTask
    ]
})

var bTree = new BehaviorTree({
    tree: mySequence,
    blackboard: {}
})

bTree.step()
bTree.step()