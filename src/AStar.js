/* A* algorithm */

/** Node
 * id: unique identifier in order to compare similar nodes
 * cost: current cost to access this node
 * costEstimation: estimated cost to reach the final node (note that if value is always Infinity the algorithm is equivalent to Dijkstra})
 * virtualCost: sum of cost and costEstimation node.
 * parentNode: reference to parent
 *
 * Type (The following attributes should be return by getNeighbourgs):
 * id: any
 * cost: number
 * costEstimation: number | ()=>number
 */

/** function getNeighbourgs(node) => Node[] */

export default function AStar(firstNode, getNeighbourgs, {isFinalNode = isFinalNd, max = false} = {}) {
    const done = new Set();
    const todo = new Map();
    let finalNode;

    todo.set(firstNode.id, computeNode(firstNode));

    function *nextNodeMin() {
        while (todo.size) {
            let value = Infinity;
            let valueEst = Infinity;
            let ref;

            for (let [,node] of todo) {
                if (node.virtualCost < value) {
                    value = node.virtualCost;
                    valueEst = node.costEstimation;
                    ref = node;
                } else if (node.virtualCost === value && node.costEstimation < valueEst) {
                    value = node.virtualCost;
                    valueEst = node.costEstimation;
                    ref = node;
                }
            }
            yield ref;
        }
        return;
    }

    function* nextNodeMax() {
        while (todo.size) {
            let value = -Infinity;
            let valueEst = -Infinity;
            let ref;

            for (let [, node] of todo) {
                if (node.virtualCost > value) {
                    value = node.virtualCost;
                    valueEst = node.costEstimation;
                    ref = node;
                } else if (node.virtualCost === value && node.costEstimation > valueEst) {
                    value = node.virtualCost;
                    valueEst = node.costEstimation;
                    ref = node;
                }
            }
            yield ref;
        }
        return;
    }

    function computeNode(node) {
        if (typeof node.costEstimation === 'function') {
            node.costEstimation = node.costEstimation();
        }
        node.virtualCost = node.cost + node.costEstimation;

        return node;
    }

    const nextNode = max ? nextNodeMax : nextNodeMin;

    // look for the final node
    for (let node of nextNode()) {
        if (isFinalNode(node)) {
            // the final node has been found
            finalNode = node;
            break;
        }

        const nodeId = node.id;
        done.add(nodeId);
        todo.delete(nodeId);

        for (let children of getNeighbourgs(node)) {
            if (!children || children.id === void 0) {
                // reject invalid node
                continue;
            }
            const childrenId = children.id;
            if (done.has(childrenId)) {
                // this child node has already been analyzed
                continue;
            }
            if (todo.has(childrenId)) {
                const refNode = todo.get(childrenId);
                const isBetter = max ? refNode.cost < children.cost : refNode.cost > children.cost;
                if (isBetter) {
                    refNode.parentNode = node;
                    refNode.cost = children.cost;
                    refNode.parent = node;
                    computeNode(refNode);
                }
                continue;
            }
            children.parent = node;
            todo.set(childrenId, computeNode(children));
        }
    }

    // rebuild path from final node
    const path = [];

    let pathNode = finalNode;
    while(pathNode) {
        path.push(pathNode);
        pathNode = pathNode.parent;
    }

    return path.reverse();
}

function isFinalNd(node) {
    return node.costEstimation === 0;
}
