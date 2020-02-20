import AStar from '../../src/AStar.js';

describe('AStar.js', () => {
    describe('unitary', () => {
        describe('getNeighbours', () => {
            it('should call getNeighbours', () => {
                const node = {
                    id: 1,
                    cost: 0,
                    costEstimation: 10,
                };
                let called = 0;
                let correctNode = false;
                function neighbours(testedNode) {
                    called++;
                    correctNode = testedNode === node;
                    return [];
                }

                const rslt = AStar(node, neighbours);

                expect(rslt).toEqual([]);
                expect(called).toBe(1);
                expect(correctNode).toBe(true);
            });

            it('should handle neighbours', () => {
                const node = {
                    id: 1,
                    cost: 0,
                    costEstimation: 10,
                };
                let called = 0;
                function neighbours(nd) {
                    called++;
                    if (nd.id === 1) {
                        return [{
                            id: 2,
                            cost: 5,
                            costEstimation: 2,
                        }, {
                            id: 3,
                            cost: 5,
                            costEstimation: 3,
                        }];
                    }
                    return [];
                }

                const rslt = AStar(node, neighbours);

                expect(rslt).toEqual([]);
                expect(called).toBe(3);
            });

            it('should handle neighbours with callback estimation', () => {
                const node = {
                    id: 1,
                    cost: 0,
                    costEstimation: 10,
                };
                let called = 0;
                let callEstimation = 0;
                function neighbours() {
                    called++;
                    return [{
                        id: 2,
                        cost: 5,
                        costEstimation: function() {
                            callEstimation++;
                            return 3;
                        },
                    }, {
                        id: 3,
                        cost: 5,
                        costEstimation: function() {
                            callEstimation++;
                            return 5;
                        },
                    }];
                }

                const rslt = AStar(node, neighbours);

                expect(rslt).toEqual([]);
                expect(called).toBe(3);
                expect(callEstimation).toBe(2);
            });

            it('should handle neighbours in right order', () => {
                const node = {
                    id: 0,
                    cost: 0,
                    costEstimation: 10,
                };
                let called = 0;
                let order = 1;
                function neighbours(nd) {
                    called += (10 ** nd.id) * order++;

                    return [{
                        id: 1,
                        cost: 4,
                        costEstimation: 3,
                    }, {
                        id: 2,
                        cost: 6,
                        costEstimation: 1,
                    }, {
                        id: 3,
                        cost: 5,
                        costEstimation: 2,
                    }, {
                        id: 4,
                        cost: 5,
                        costEstimation: 3,
                    }, {
                        id: 5,
                        cost: 5,
                        costEstimation: 1,
                    }];
                }

                const rslt = AStar(node, neighbours);

                expect(rslt).toEqual([]);
                expect(called).toBe(264351);
            });

            it('should handle neighbours in reverse order', () => {
                const node = {
                    id: 0,
                    cost: 0,
                    costEstimation: 10,
                };
                let called = 0;
                let order = 1;
                function neighbours(nd) {
                    called += (10 ** nd.id) * order++;

                    return [{
                        id: 1,
                        cost: 4,
                        costEstimation: 3,
                    }, {
                        id: 2,
                        cost: 6,
                        costEstimation: 1,
                    }, {
                        id: 3,
                        cost: 5,
                        costEstimation: 2,
                    }, {
                        id: 4,
                        cost: 5,
                        costEstimation: 3,
                    }, {
                        id: 5,
                        cost: 5,
                        costEstimation: 1,
                    }];
                }

                const rslt = AStar(node, neighbours, { max: true });

                expect(rslt).toEqual([]);
                expect(called).toBe(624531);
            });

            it('should handle undefined neighbours', () => {
                const node = {
                    id: 1,
                    cost: 0,
                    costEstimation: 10,
                };
                let called = 0;
                function neighbours() {
                    called++;
                    return [{
                        id: 2,
                        cost: 5,
                        costEstimation: 3,
                    },
                    undefined, {
                        id: 3,
                        cost: 5,
                        costEstimation: 5,
                    }, null, false];
                }

                const rslt = AStar(node, neighbours);

                expect(rslt).toEqual([]);
                expect(called).toBe(3);
            });

            it('should handle getNeighbours as a generator', () => {
                const node = {
                    id: 1,
                    cost: 0,
                    costEstimation: 10,
                };
                let called = 0;
                let stepCall = 0;
                function *neighbours() {
                    called++;
                    stepCall++;
                    yield {
                        id: 2,
                        cost: 5,
                        costEstimation: 3,
                    };
                    stepCall++;
                    yield {
                        id: 3,
                        cost: 5,
                        costEstimation: 5,
                    };
                    stepCall++;
                }

                const rslt = AStar(node, neighbours);

                expect(rslt).toEqual([]);
                expect(called).toBe(3);
                expect(stepCall).toBe(9);
            });
        });

        describe('final', () => {
            it('should find final automatically', () => {
                const node = {
                    id: 1,
                    cost: 0,
                    costEstimation: 5,
                };
                function neighbours(nd) {
                    return [{
                        id: nd.id + 1,
                        cost: nd.cost + 1,
                        costEstimation: function() {
                            return Math.max(0, 5 - nd.cost);
                        },
                    }, {
                        id: nd.id + 2,
                        cost: nd.cost + 1,
                        costEstimation: function() {
                            return Math.max(0, 5 - nd.cost);
                        },
                    }];
                }

                const rslt = AStar(node, neighbours);

                expect(rslt).toBeInstanceOf(Array);
                expect(rslt.length).toBe(7);
                expect(rslt[6].costEstimation).toBe(0);
                expect(rslt[6].cost).toBe(6);
            });

            it('should find defined final', () => {
                const node = {
                    id: 1,
                    cost: 0,
                    costEstimation: 5,
                };
                function neighbours(nd) {
                    return [{
                        id: nd.id + 1,
                        cost: nd.cost + 1,
                        costEstimation: function() {
                            return Math.max(0, 5 - nd.cost);
                        },
                    }, {
                        id: nd.id + 2,
                        cost: nd.cost + 1,
                        costEstimation: function() {
                            return Math.max(0, 5 - nd.cost);
                        },
                    }];
                }

                const rslt = AStar(node, neighbours, { isFinalNode: (nd) => nd.cost === 12 });

                expect(rslt).toBeInstanceOf(Array);
                expect(rslt.length).toBe(13);
                expect(rslt[12].costEstimation).toBe(0);
                expect(rslt[12].cost).toBe(12);
            });
        });
    });

    describe('real case', () => {
        describe('maze', () => {
            const maze = [
                [0, 0, 0, 1, 0, 1, 0],
                [0, 1, 0, 1, 0, 0, 0],
                [0, 0, 0, 1, 0, 1, 1],
                [0, 1, 1, 0, 0, 0, 0],
                [0, 0, 0, 0, 1, 1, 0],
                [0, 1, 1, 1, 1, 0, 0],
                [0, 0, 0, 0, 0, 0, 0],
            ];
            let estimation;
            let buildNode;

            const getNeighbours = (node) => {
                const list = [];
                const x = node.x, y = node.y;
                const maxSize = 6;
                if (x > 0 && !maze[y][x -1]) {
                    list.push(buildNode(x - 1, y, node));
                }
                if (y > 0 && !maze[y - 1][x]) {
                    list.push(buildNode(x, y - 1, node));
                }
                if (node.x < maxSize && !maze[y][x + 1]) {
                    list.push(buildNode(x + 1, y, node));
                }
                if (node.y < maxSize && !maze[y + 1][x]) {
                    list.push(buildNode(x, y + 1, node));
                }

                return list;
            };

            beforeEach(() => {
                estimation = (x, y, finish) => {
                    return Math.abs(x - finish.x) + Math.abs(y - finish.y);
                };

                buildNode = (x, y, node) => {
                    return {
                        id: `${x}-${y}`,
                        cost: node.cost + 1,
                        costEstimation: estimation(x, y, node.finish),
                        x: x,
                        y: y,
                        finish: node.finish,
                    };
                };
            });

            it('should find best path', () => {
                const firstNode = {
                    x: 0,
                    y: 6,
                    id: '0-6',
                    cost: 0,
                    costEstimation: 14,
                    finish: {
                        x: 6,
                        y: 0,
                    },
                };

                const rslt = AStar(firstNode, getNeighbours);

                expect(rslt.length).toBe(13);
                expect(rslt.map(n => n.id)).toEqual(['0-6', '0-5', '0-4', '1-4',
                    '2-4', '3-4', '3-3', '4-3', '4-2', '4-1', '5-1', '6-1', '6-0']);
            });

            it('should find best path with back step', () => {
                const firstNode = {
                    x: 5,
                    y: 5,
                    id: '5-5',
                    cost: 0,
                    costEstimation: 14,
                    finish: {
                        x: 2,
                        y: 1,
                    },
                };

                const rslt = AStar(firstNode, getNeighbours);

                expect(rslt.length).toBe(14);
                expect(rslt.map(n => n.id)).toEqual(['5-5', '5-6', '4-6', '3-6',
                    '2-6', '1-6', '0-6', '0-5', '0-4', '0-3', '0-2', '1-2', '2-2', '2-1']);
            });
        });

        describe('fill it', () => {
            const size = 5;

            function getCost(zone, estimate) {
                const defaultValue = estimate ? 5 : 0;
                let sum = 0;
                for( let i = 0; i < size; i++) {
                    if (i > 0) {
                        const val = zone[i-1] || defaultValue;
                        sum += 2 * val;
                    }
                    if (i < size - 1) {
                        const val = zone[i + 1] || defaultValue;
                        sum += val;
                    }
                    {
                        const val = zone[i] || defaultValue;
                        if (i === 1) {
                            sum += 1.5 * val;
                        } else if (i === 1) {
                            sum += 0.5 * val;
                        } else {
                            sum += val;
                        }
                    }
                }
                return sum;
            }

            const buildNode = (idx, node) => {
                const zone = node.zone.slice();
                const value = node.currentValue + 1;
                zone[idx] = value;
                const cost = getCost(zone, false);

                return {
                    id: zone.join(','),
                    cost: cost,
                    costEstimation: () => getCost(zone, true) - cost,
                    zone: zone,
                    currentValue: value,
                };
            };

            function *getNeighbours(node) {
                const zone = node.zone;
                for (let i = 0; i < size; i++) {
                    if (zone[i]) {
                        continue;
                    }
                    yield buildNode(i, node);
                }
            }

            it('should find best max path', () => {
                const firstNode = {
                    id: 'first',
                    cost: 0,
                    costEstimation: size ** size,
                    zone: new Array(size),
                    currentValue: 0,
                };
                const rslt = AStar(firstNode, getNeighbours, { max: true });

                expect(rslt.length).toBe(size + 1); /* there is also the first node */
                expect(rslt[size].zone).toEqual([2, 5, 3, 4, 1]);
            });
        });
    });
});
