const {getEntityNames, existsEntityName, getMissingEntityNames, addMissingEntities, fillMutualRelations, getChildrenEntityNames, getParentEntityNames} = require('../lib/model-schema');

describe('getEntities', () => {

    it('returns number of entities declared in schema', () => {
        let schema = {
            entities: {
                'A': {},
                'B': {}
            }
        }
        let names = getEntityNames(schema);
        expect(names.length).toBe(2)
    })

    it('throws error when schema is not valid', () => {
        let schema = {}
        const shouldThrow = () => {
            return getEntityNames(schema)
        }
        expect(shouldThrow).toThrow()
    })
})

describe('existsEntityName', () => {

    it('returns true when entity name exists in schema', () => {
        let schema = {
            entities: {
                'A': {},
                'B': {}
            }
        }
        let r = existsEntityName(schema, 'A')
        expect(r).toBe(true);
    })

    it('returns false when entity name does not exist in schema', () => {
        let schema = {
            entities: {
                'A': {},
                'B': {}
            }
        }
        let r = existsEntityName(schema, 'C')
        expect(r).toBe(false);       
    })
})

describe('getMissingEntityNames', () => {

    it('should return 0 when all entity names exist', () => {
        let schema = {
            entities: {
                'A': {},
                'B': {}
            }
        }
        let men = getMissingEntityNames(schema)
        expect(men).toStrictEqual([]);
    })

    it('returns names of missing entities defined as children', () => {
        let schema = {
            entities: {
                'A': {
                    hasMany: [
                        'C',
                        'D'
                    ]
                }
            } 
        }
        let men = getMissingEntityNames(schema);
        expect(men).toStrictEqual(['C', 'D'])
    })

    
    it('returns names of missing entities defined as parents', () => {
        let schema = {
            entities: {
                'A': {
                    belongsTo: [
                        'C',
                        'D',
                        'E'
                    ]
                }
            } 
        }
        let men = getMissingEntityNames(schema);
        expect(men).toStrictEqual(['C', 'D', 'E'])
    })

    it('returns names of missing entities mentioned both as children or parents', () => {
        let schema = {
            entities: {
                'A': {
                    belongsTo: [
                        'C',
                        'D',
                        'E',
                        'F'
                    ]
                },
                'B': {
                    hasMany: [
                        'F',
                        'G'
                    ]
                }
            } 
        }
        let men = getMissingEntityNames(schema);
        expect(men).toStrictEqual(['C', 'D', 'E', 'F', 'F', 'G'])
    })
    
})

describe('addMissingEntities', () => {

    it('return unchanged schema when no entities to add exist', () => {
        let schema = {
            entities: {
                'A': {},
                'B': {},
                'C': {
                    hasMany: [],
                    belongsTo: [],
                },
                'D': {
                    hasMany: []
                },
                'E': {
                    belongsTo: []
                }
            }
        }
        let r = addMissingEntities(schema)
        expect(getEntityNames(r)).toStrictEqual(['A', 'B', 'C', 'D', 'E'])
    })

    it('', () => {
        let schema = {
            entities: {
                'A': {
                    hasMany: [
                        'B',
                        'C',
                    ],
                    belongsTo: [
                        'D',
                        'B'
                    ]
                },            
            }
        }
        let r = addMissingEntities(schema);
        expect(getEntityNames(r)).toStrictEqual(['A', 'B', 'C', 'D'])
    })
})

describe('filMutualRelations', () => {

    it('returns the same schema', () => {
        let schema = {
            entities: {
                'A': {},
                'B': {}
            }
        }
        let r = fillMutualRelations(schema)
        expect(getEntityNames(r)).toStrictEqual(['A', 'B'])
    })

    it('sets mutual for hasMany', () => {
        let schema = {
            entities: {
                'A': {
                    hasMany: [
                        'B'
                    ]
                }
            }
        }

        let r = fillMutualRelations(schema);
        expect(getChildrenEntityNames(schema, 'A')).toStrictEqual(['B'])
        expect(getEntityNames(r)).toStrictEqual(['A', 'B'])
    })


    it('sets mutual for belongsTo', () => {
        let schema = {
            entities: {
                'A': {
                    belongsTo: [
                        'B'
                    ]
                }
            }
        }

        let r = fillMutualRelations(schema);
        expect(getParentEntityNames(schema, 'A')).toStrictEqual(['B'])
        expect(getEntityNames(r)).toStrictEqual(['A', 'B'])
    })

    it('sets mutual for  belongsTo and hasMany', () => {
        let schema = {
            entities: {
                'A': {
                    belongsTo: [
                        'B'
                    ]
                },
                'C': {
                    hasMany: [
                        'D'
                    ]
                }
            }
        }

        let r = fillMutualRelations(schema);
        expect(getChildrenEntityNames(r, 'B')).toStrictEqual(['A'])
        expect(getParentEntityNames(r, 'D')).toStrictEqual(['C'])
        expect(getEntityNames(r).sort()).toStrictEqual(['A', 'B', 'C', 'D'])
    })
})

