var missions = [
    { //battle mode
        texturePack: 0,
        mapCoords: { x: 0, y: 0 },
        levels:
            [
                function () { //normal mode
                    return {
                        music: 0,
                        hasBlocks: true,
                        sizeX: 13,
                        sizeY: 11,
                        bonuses: [0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1],
                        enemies: [0, 0, 1, 1]
                    }
                },
                function () { //skull mode
                    return {
                        music: 0,
                        hasBlocks: true,
                        sizeX: 13,
                        sizeY: 11,
                        bonuses: [0, 0, 0, 0, 1, 1, 1, 1, 8, 8, 8, 8],
                        enemies: [0, 0, 1, 1]
                    }
                }
            ]
    },
    {
        texturePack: 1,
        mapCoords: { x: 10, y: 204 },
        levels:
            [
                function () { //1-1
                    return {
                        hasBlocks: true,
                        sizeX: 13,
                        sizeY: 11,
                        bonuses: [0, 1],
                        enemies: [0, 0, 0]
                    }
                },
                function () { //1-2
                    return {
                        hasBlocks: true,
                        sizeX: 13,
                        sizeY: 11,
                        bonuses: [1, 0],
                        enemies: [0, 0, 0, 3]
                    }
                },
                function () { //1-3
                    return {
                        hasBlocks: true,
                        sizeX: 13,
                        sizeY: 11,
                        bonuses: [3, 2],
                        enemies: [0, 0, 3, 3, 10]
                    }
                },
                function () { //1-4
                    return {
                        hasBlocks: true,
                        sizeX: 13,
                        sizeY: 27,
                        bonuses: [2, 3],
                        enemies: [0, 0, 3, 3, 10, 7]
                    }
                },
                function () { //1-5
                    return {
                        hasBlocks: false,
                        sizeX: 13,
                        sizeY: 11,
                        bonuses: [],
                        enemies: [18, 7, 7]
                    }
                }
            ]
    },
    {
        texturePack: 2,
        mapCoords: { x: 102, y: 158 },
        levels:
            [
                function () { //2-1
                    return {
                        hasBlocks: true,
                        sizeX: 13,
                        sizeY: 11,
                        bonuses: [0, 4],
                        enemies: [2, 2, 6, 6, 10]
                    }
                },
                function () { //2-2
                    return {
                        hasBlocks: true,
                        sizeX: 13,
                        sizeY: 11,
                        bonuses: [6, 2],
                        enemies: [2, 2, 6, 6, 10, 10]
                    }
                },
                function () { //2-3
                    return {
                        hasBlocks: true,
                        sizeX: 13,
                        sizeY: 27,
                        bonuses: [2, 7],
                        enemies: [2, 2, 6, 6, 7, 12, 14]
                    }
                },
                function () { //2-4
                    return {
                        hasBlocks: true,
                        sizeX: 27,
                        sizeY: 11,
                        bonuses: [7, 5],
                        enemies: [2, 2, 2, 2, 10, 10, 12, 12]
                    }
                },
                function () { //2-5
                    return {
                        hasBlocks: false,
                        sizeX: 27,
                        sizeY: 11,
                        bonuses: [],
                        enemies: [7, 14, 24]
                    }
                }
            ]
    },
    {
        texturePack: 3,
        mapCoords: { x: 120, y: 268 },
        levels:
            [
                function () { //3-1
                    return {
                        hasBlocks: true,
                        sizeX: 13,
                        sizeY: 27,
                        bonuses: [2],
                        enemies: [4, 5, 10, 10, 12, 12, 14]
                    }
                },
                function () { //3-2
                    return {
                        hasBlocks: true,
                        sizeX: 27,
                        sizeY: 11,
                        bonuses: [1],
                        enemies: [4, 5, 5, 10, 10, 12, 12]
                    }
                },
                function () { //3-3
                    return {
                        hasBlocks: true,
                        sizeX: 27,
                        sizeY: 11,
                        bonuses: [7],
                        enemies: [5, 5, 5, 7, 7, 10, 12, 12, 12]
                    }
                },
                function () { //3-4
                    return {
                        hasBlocks: true,
                        sizeX: 13,
                        sizeY: 27,
                        bonuses: [5],
                        enemies: [4, 4, 4, 5, 5, 10, 12, 12, 14]
                    }
                },
                function () { //3-5
                    return {
                        hasBlocks: false,
                        sizeX: 13,
                        sizeY: 27,
                        bonuses: [],
                        enemies: [18, 18, 7, 14]
                    }
                }
            ]
    },
    {
        texturePack: 4,
        mapCoords: { x: 222, y: 176 },
        levels:
            [
                function () { //4-1
                    return {
                        hasBlocks: true,
                        sizeX: 13,
                        sizeY: 27,
                        bonuses: [1],
                        enemies: [11, 11, 7, 10, 10, 12, 12, 14]
                    }
                },
                function () { //4-2
                    return {
                        hasBlocks: true,
                        sizeX: 27,
                        sizeY: 11,
                        bonuses: [4],
                        enemies: [9, 11, 10, 10, 12, 12, 14, 14]
                    }
                },
                function () { //4-3
                    return {
                        hasBlocks: true,
                        sizeX: 27,
                        sizeY: 11,
                        bonuses: [0],
                        enemies: [9, 9, 9, 11, 10, 10, 12, 12, 12]
                    }
                },
                function () { //4-4
                    return {
                        hasBlocks: true,
                        sizeX: 27,
                        sizeY: 11,
                        bonuses: [0],
                        enemies: [9, 9, 9, 9, 11, 10, 12, 12, 12]
                    }
                },
                function () { //4-5
                    return {
                        hasBlocks: false,
                        sizeX: 27,
                        sizeY: 11,
                        bonuses: [],
                        enemies: [21, 22, 22, 22, 22, 7]
                    }
                }
            ]
    },
    {
        texturePack: 5,
        mapCoords: { x: 308, y: 200 },
        levels:
            [
                function () { //5-1
                    return {
                        hasBlocks: true,
                        sizeX: 27,
                        sizeY: 11,
                        bonuses: [5],
                        enemies: [8, 8, 15, 15, 15, 10, 12, 12]
                    }
                },
                function () { //5-2
                    return {
                        hasBlocks: true,
                        sizeX: 13,
                        sizeY: 27,
                        bonuses: [0],
                        enemies: [8, 8, 15, 15, 15, 7, 14, 14, 12]
                    }
                },
                function () { //5-3
                    return {
                        hasBlocks: true,
                        sizeX: 27,
                        sizeY: 11,
                        bonuses: [1],
                        enemies: [8, 8, 8, 15, 12, 12, 12, 14, 14]
                    }
                },
                function () { //5-4
                    return {
                        hasBlocks: true,
                        sizeX: 27,
                        sizeY: 11,
                        bonuses: [4],
                        enemies: [8, 8, 8, 15, 10, 10, 10, 12, 12]
                    }
                },
                function () { //5-5
                    return {
                        hasBlocks: false,
                        sizeX: 27,
                        sizeY: 11,
                        bonuses: [],
                        enemies: [7, 24, 24, 24]
                    }
                }
            ]
    },
    {
        texturePack: 6,
        mapCoords: { x: 420, y: 195 },
        levels:
            [
                function () { //6-1
                    return {
                        hasBlocks: true,
                        sizeX: 13,
                        sizeY: 27,
                        bonuses: [1],
                        enemies: [17, 17, 17, 20, 20, 10, 10, 12, 12, 12]
                    }
                },
                function () { //6-2
                    return {
                        hasBlocks: true,
                        sizeX: 13,
                        sizeY: 27,
                        bonuses: [0],
                        enemies: [17, 17, 20, 20, 20, 10, 10, 12, 12, 12, 12]
                    }
                },
                function () { //6-3
                    return {
                        hasBlocks: true,
                        sizeX: 27,
                        sizeY: 11,
                        bonuses: [1],
                        enemies: [17, 17, 17, 20, 20, 7, 7, 10, 10, 14]
                    }
                },
                function () { //6-4
                    return {
                        hasBlocks: true,
                        sizeX: 27,
                        sizeY: 11,
                        bonuses: [0],
                        enemies: [10, 10, 10, 10, 12, 12, 12, 12]
                    }
                },
                function () { //6-5
                    return {
                        hasBlocks: false,
                        sizeX: 27,
                        sizeY: 11,
                        bonuses: [],
                        enemies: [21, 21, 21, 22, 22, 22, 22, 22, 22, 22, 22]
                    }
                }
            ]
    },
    {
        texturePack: 7,
        mapCoords: { x: 422, y: 124 },
        levels:
            [
                function () { //7-1
                    return {
                        hasBlocks: true,
                        sizeX: 27,
                        sizeY: 11,
                        bonuses: [1],
                        enemies: [13, 13, 16, 7, 10, 10, 10, 12, 12]
                    }
                },
                function () { //7-2
                    return {
                        hasBlocks: true,
                        sizeX: 13,
                        sizeY: 27,
                        bonuses: [7],
                        enemies: [13, 13, 13, 13, 16, 16, 10, 10, 12, 12, 12, 12, 14, 14]
                    }
                },
                function () { //7-3
                    return {
                        hasBlocks: true,
                        sizeX: 27,
                        sizeY: 11,
                        bonuses: [2],
                        enemies: [13, 13, 13, 13, 13, 7, 10, 10, 12, 12, 12, 14, 14]
                    }
                },
                function () { //7-4
                    return {
                        hasBlocks: true,
                        sizeX: 27,
                        sizeY: 11,
                        bonuses: [1],
                        enemies: [13, 13, 16, 16, 16, 7, 7, 10, 10, 10, 12, 12, 12, 12]
                    }
                },
                function () { //7-5
                    return {
                        hasBlocks: false,
                        sizeX: 27,
                        sizeY: 11,
                        bonuses: [],
                        enemies: [23, 23, 23, 23]
                    }
                }
            ]
    },
    {
        texturePack: 8,
        mapCoords: { x: 438, y: 72 },
        levels:
            [
                function () { //8-1
                    return {
                        hasBlocks: true,
                        sizeX: 27,
                        sizeY: 11,
                        bonuses: [7],
                        enemies: [0, 0, 6, 6, 6, 7, 7, 10, 12, 12, 14, 14]
                    }
                },
                function () { //8-2
                    return {
                        hasBlocks: true,
                        sizeX: 27,
                        sizeY: 11,
                        bonuses: [0],
                        enemies: [0, 0, 0, 6, 6, 6, 7, 7, 7, 10, 10, 12, 12, 19]
                    }
                },
                function () { //8-3
                    return {
                        hasBlocks: true,
                        sizeX: 27,
                        sizeY: 11,
                        bonuses: [1],
                        enemies: [0, 0, 0, 6, 6, 6, 7, 7, 10, 10, 12, 12, 14, 19, 19]
                    }
                },
                function () { //8-4
                    return {
                        hasBlocks: true,
                        sizeX: 13,
                        sizeY: 27,
                        bonuses: [2],
                        enemies: [10, 10, 10, 7, 14, 12, 12, 12, 19, 19, 19]
                    }
                },
                function () { //8-5
                    return {
                        hasBlocks: false,
                        sizeX: 27,
                        sizeY: 11,
                        bonuses: [],
                        enemies: [26, 27, 28, 29, 30]
                    }
                }
            ]
    }
]