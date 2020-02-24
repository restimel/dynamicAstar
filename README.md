# dynamicAstar
An A* algorithm in JS implementation where the graph can be built dynamically.

## Purpose

This project should propose a A* algorithm which can be used efficiently and easily in any JS project.

### Keep it simple

There is nothing more to import than this module to use this A* algorithm, and it does not have any dependencies (it is only standard JS).

## Syntax

```js
const path = AStar(firstNode, getNeighbours, options);
```

* **firstNode** _(Node)_: an object describing the start node
* **getNeighbours** _((Node) => Node[])_: a function which is called to retrieve all nodes accessible from a specific node. It should return an iterator of Nodes.
* **options** _(Option?)_: Algorithm configuration.

### Node ###

A node describe a state (which can represent a place or a situation).

Two nodes with the same id represent the exact same situation. From both of them it shoulb be possible to move to the same neighbours. If a place has contextual path (it possible to go to a neighbour only in some condition) it should be representated by a different node (with a different id).

A Node is an object with following mandatory attributes:

* **id** _(any)_: unique identifier in order to compare similar nodes.
* **cost** _(number)_: The current cost to access this node.
* **costEstimation** _(number | () => number)_: This is the cost estimation to reach the target. The closest this value is from real cost the fastest the algorithm will be.
If computing the heuristic is quite heavy, it is better to set a function as value, in order to run the computation only if it is needed.

It is possible to attach any other information on nodes if it can help.
However these properties are used internally (and are added to node objects): virtualCost, parentNode.

### Option ###

This is an optional parameter to change the default settings:

* **isFinalNode** _((Node) => boolean)_: This is a function which is called to know if the given node is the target (it should return true if it is the target). By default it only checks that `costEstimation` is worth `0` so if it does not fit your environment you should rewrite this ending condition.
* **max** _(boolean)_: If this value is `false`, it looks for the shortest path. If this value is `true`, it looks for the longest path. The default value is `false`.

Please note that it can be very tricky to set a correct environment to find the longest path mainly to find a correct heuristic (estimation cost).

## Examples

```js
import AStar from 'dynamic-astar';

/* Context */
// Here the maze is static but it doesn't change if it is computed dynamically (getNeighbours
// should just know how to return the next nodes)
const maze = [
    [0, 0, 0, 1, 0, 1, 0],
    [0, 1, 0, 1, 0, 0, 0],
    [0, 0, 0, 1, 0, 1, 1],
    [0, 1, 1, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 1, 0],
    [0, 1, 1, 1, 1, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
]; // 0 are accessible cells, 1 are wall cells
const maxSize = 6;

function estimation(x, y, finish) {
    return Math.abs(x - finish.x) + Math.abs(y - finish.y);
}

function buildNode(x, y, fromNode) {
    return {
        id: `${x}-${y}`,
        cost: fromNode.cost + 1,
        costEstimation: estimation(x, y, fromNode.finish),
        x: x,
        y: y,
        finish: fromNode.finish,
    };
}

function *getNeighbours(node) {
    const x = node.x, y = node.y;
    if (x > 0 && !maze[y][x -1]) {
        yield buildNode(x - 1, y, node);
    }
    if (y > 0 && !maze[y - 1][x]) {
        yield buildNode(x, y - 1, node);
    }
    if (node.x < maxSize && !maze[y][x + 1]) {
        yield buildNode(x + 1, y, node);
    }
    if (node.y < maxSize && !maze[y + 1][x]) {
        yield buildNode(x, y + 1, node);
    }
}

/* Algorithm initialization */
const target = { x: 6, y: 0 };
const firstNode = {
    id: '0-6',
    x: 0,
    y: 6,
    cost: 0,
    costEstimation: estimation(0, 6, target),
    finish: target,
};

/* Run the algorithm */
const path = AStar(firstNode, getNeighbours);

/* path is the list of nodes (from start to end) representing the shortest path */
path.map(node => node.id));
/* → ['0-6', '0-5', '0-4', '1-4', '2-4', '3-4', '3-3',
      '4-3', '4-2', '4-1', '5-1', '6-1', '6-0']
*/
```

## About A* algorithm

A* is a path finding algorithm. It allows to find the shortest path between 2 nodes in an oriented graph.

Its efficiency depends on the heuristic. If the estimation always returns 0 the A* algorithm is equivalent to Djisktra algorithm.

### Important tip

* Cost movement between 2 nodes should never be negative

* Heuristic cost should always returns a value less or equal than the real cost (when looking for the shortest cost). When looking for the longest path, the heuristic cost should always be greater or equal than the real cost.

If these tips are not followed there is no guarentee to find the best path.
