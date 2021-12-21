const { isUndefined, isEmpty } = require("lodash");
const { UiField } = require("./lib/ui");

class TypeMatcherFactory {
  static create(type) {
      const matcher = require(`./lib/matcher/${type}Matcher`)
      return new matcher.Matcher()
  }
}

class FieldFactory {
  constructor(params = {}) {
    this.tables = params.tables || [];
  }

  createField(columnHeader) {
    switch (this.inferType(columnHeader)) {
      default:
          if (this.tables.includes(columnHeader)) {
              return new UiField('reference', columnHeader)
          }
        return new UiField("text", columnHeader);
    }
  }

  inferType(columnHeader) {
    let result = "";
    let alternatives = [
      "Date", "Text", "Number", "Boolean", "Email", "Address"
    ]
    alternatives.some((type) => {
      let matchedType = this.doesTypeMatchHeader(type, columnHeader);
      result = matchedType ? type : result;
      return matchedType;
    });

    return result;
  }

  doesTypeMatchHeader(type, columnHeader) {
    let matcher = TypeMatcherFactory.create(type);
    return matcher.matches(columnHeader);
  }
}

let schema = {
  entities: {},
};

let project = {
  Customer: "ID, First name, Last name, Middle name, Date of Birth, Gender",
};

let tables = Object.keys(project);

let fieldFactory = new FieldFactory({
  tables: tables,
});

tables.forEach((table) => {
  let columnNames = project[table]
    .split(/\s*\,\s*/)
    .filter((n) => !isEmpty(n.trim()));
  let definition = {};
  if (columnNames.length > 0) {
    let columns = columnNames.map((columnName) => {
      return fieldFactory.createField(columnName);
    });

    definition["columns"] = columns;

    let parentEntityNames = columns
      .filter(
        (column) => !isUndefined(column.props.isRef) && column.props.isRef
      )
      .map((column) => column.label);

    if (parentEntityNames.length > 0) {
      definition = {
        ...definition,
        ...{ belongsTo: parentEntityNames },
      };
    }
  }

  schema.entities[table] = definition;
});

console.log(JSON.stringify(schema, null, 4));

/**
 *
 *
 * @param {*} project
 * @return {*} 
 */
function buildSchema(project) {
    return {
        entities: buildEntities(project)
    }
}

/**
 *
 *
 * @param {*} [project={}]
 * @return {*} 
 */
function buildEntities(project = {}) {
    let entities = {}
    let entityNames = Object.keys(project);
    entityNames.forEach(entityName => {
        entities[entityName] = buildEntityAttributes(project[entityName], entityNames)
    })
    return entities;
}

/**
 *
 *
 * @param {string} [columnHeaders='']
 * @param {*} [entityNames=[]]
 * @return {*} 
 */
function buildEntityAttributes(columnHeaders = '', entityNames = []) {

    let entityAttributes = {}
    let columns = buildEntityColumns(columnHeaders, entityNames);
    if (!isEmpty(columns)) {
        entityAttributes['columns'] = columns;
    }
    return entityAttributes;
}

/**
 *
 *
 * @param {string} [columnHeaders='']
 * @param {*} [entityNames=[]]
 * @return {*} 
 */
function buildEntityColumns(columnHeaders = '', entityNames = []) {
    
    if (isEmpty(columnHeaders.trim())) {
        return [];
    }
    let fieldFactory = new FieldFactory({tables: entityNames});
    let columns = columnHeaders.trim().split(/\s*\,\s*/).map(columnHeader => {
        return fieldFactory.createField(columnHeader)
    });
    return columns;
}

module.exports = {
    buildEntityAttributes,
    buildEntityColumns,
    buildEntities,
    buildSchema,
}


