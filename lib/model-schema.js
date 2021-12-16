const { isArray, isUndefined } = require("lodash");

/**
 * Adds definitions for referred entities undeclared in schema. 
 *
 * @param {*} [schema={entities: {}}] object with entities key, storing an object with names of entities as key, and a key/value value with entity properties.
 * @return {object} a schema object 
 */
 function addMissingEntities(schema = {entities: {}}) {
    let missingEntityNames = getMissingEntityNames(schema);
    missingEntityNames.forEach((entityName) => {
      schema.entities[entityName] = {};
    });
    
    return schema;
  }

/**
 * Checks whether given schema object contains the entities key.
 * 
 * @throws Schema missing entities key
 * @param {*} [schema={entities: {}}] object with entities key, storing an object with names of entities as key, a
 */
function checkSchema(schema = {entities: {}}) {
  if (!schema.entities) {
    throw new Error("Schema missing entities key");
  }
}

/**
 * Checks whether given schema contains a definition of an entity name.
 *
 * @param {object} schema object with entities key, storing an object with names of entities as key, and a key/value value with entity properties.
 * @param {*} entityName
 * @return {boolean} 
 */
function existsEntityName(schema, entityName) {
  return getEntityNames(schema).includes(entityName);
}

/**
 * Add missing relationships between entities in a schema.
 *
 * @param {object} [schema={entities: {}}] object with entities key, storing an object with names of entities as key, and a key/value value with entity properties.
 * @return {object} a schema object
 */
function fillMutualRelations(schema = {entities: {}}) {
    schema = addMissingEntities(schema);

    getEntityNames(schema).forEach(entityName => {
        let childrenEntityNames = getChildrenEntityNames(schema, entityName);
        childrenEntityNames.forEach(childName => {
            let parentEntityNames = getParentEntityNames(schema, childName);
            if (!parentEntityNames.includes(entityName)) {
                if (isUndefined(schema.entities[childName]['belongsTo'])) {
                    schema.entities[childName]['belongsTo'] = []
                }
                schema.entities[childName]['belongsTo'].push(entityName)
            }
        })
    })

    getEntityNames(schema).forEach(entityName => {
        let parentEntityNames = getParentEntityNames(schema, entityName);
        parentEntityNames.forEach(parentName => {
            let childrenEntityNames = getChildrenEntityNames(schema, parentName);
            if (!childrenEntityNames.includes(entityName)) {
                if (isUndefined(schema.entities[parentName]['hasMany'])) {
                    schema.entities[parentName]['hasMany'] = []
                }
                schema.entities[parentName]['hasMany'].push(entityName)
            }
        })
    })

    return schema;
}

/**
 * Get the list of referred entities for a given entity name.
 *
 * @param {object} schema object with entities key, storing an object with names of entities as key, and a key/value value with entity properties.
 * @param {string} entityName name of entity whose relatiosnships are processed.
 * @param {string: (hasMany|belongsTo)} relationType type of relationship (hasMany or belongsTo)
 * @return {Array[string]} array of entity names referreed by entityName
 */
function getReferredEntityNames(schema, entityName, relationType) {
    if (!existsEntityName(schema, entityName)) return [];
    if (!isArray(schema.entities[entityName][relationType])) return [];
    return schema.entities[entityName][relationType];
}

/**
 * Get the list of child entities for a given entity name.
 *
 * @param {object} schema object with entities key, storing an object with names of entities as key, and a key/value value with entity properties.
 * @param {string} entityName name of entity whose relationships are processed.
 * @return {Array[string]} array of entity names referreed by entityName
 */
function getChildrenEntityNames(schema, entityName) {
  return getReferredEntityNames(schema, entityName, "hasMany");
}

/**
 * Get a list of entity names defined in schema.
 *
 * @param {object} [schema={entities: {}}] object with entities key, storing an object with names of entities as key, and a key/value value with entity properties.
 * @return {Array[string]} array of entity names. 
 */
function getEntityNames(schema = {entities: {}}) {
    checkSchema(schema);
    return Object.keys(schema.entities);
}

/**
 *
 * @todo Remove duplicate from returned missing items.
 * @param {*} schema
 * @return {*} 
 */
 function getMissingEntityNames(schema = {entities: {}}) {
    let missing = [];
    getEntityNames(schema).forEach((entityName) => {
      let referredEntities = [
        ...getChildrenEntityNames(schema, entityName),
        ...getParentEntityNames(schema, entityName),
      ];
      referredEntities.forEach((e) => {
        missing.push(e);
      });
    });
    
    return missing;
  }

/**
 * Get the list of parent entities for a given entity name.
 *
 * @param {object} schema object with entities key, storing an object with names of entities as key, and a key/value value with entity properties.
 * @param {string} entityName name of entity whose relationships are processed.
 * @return {Array[string]} array of entity names referreed by entityName
 */
function getParentEntityNames(schema, entityName) {
    return getReferredEntityNames(schema, entityName, "belongsTo");
}

module.exports = {
  addMissingEntities,
  checkSchema,
  existsEntityName,
  fillMutualRelations,
  getChildrenEntityNames,
  getEntityNames,
  getMissingEntityNames,
  getParentEntityNames,
};
