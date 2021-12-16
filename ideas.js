const fileEasy = require('file-easy')


class Column {
    constructor(label, options = {}) {
        this.props = {
            ...{
                label: label.trim(),
                name: fileEasy.slug(label),
                type: 'text'
            },
            ...this.defaultOptions(options),
            ...options
        }
        this.props.name = fileEasy.slug(this.props.name)
    }

    defaultOptions(options = {}) {
        return {}
    }
}

class ColumnFactory {
    constructor(tableNames = []) {
        this.tableNames = tableNames;
        this.COLUMNTYPE = {
            Text: 0,
            Date: 1,
            Boolean: 2,
            Enum: 3,
            Address: 4,
            Number: 5,
            Name: 8,
            Key: 6,
            Reference: 7,
        }
    }

    createColumn(columnHeader) {
        switch(this.inferType(columnHeader)) {
            case this.COLUMNTYPE.Key:
                return this.createKeyColumn(columnHeader)
            case this.COLUMNTYPE.Reference:
                return this.createReferenceColumn(columnHeader)
            case this.COLUMNTYPE.Date:
                return this.createDateColumn(columnHeader)
            case this.COLUMNTYPE.Name:
                return this.createNameColumn(columnHeader)
            default:
                return this.createTextColumn(columnHeader)
        }
    }

    inferType(columnHeader) {
        if (this.tableNames.includes(columnHeader)) {
            return this.COLUMNTYPE.Reference
        }
        let r;
        r = /^ID$/ig;
        if (r.test(columnHeader))
            return this.COLUMNTYPE.Key
        r = /Name/ig;
        if (r.test(columnHeader))
            return this.COLUMNTYPE.Name

        r = /^is.+/ig
        if (r.test(columnHeader)) 
            return this.COLUMNTYPE.Boolean;

        r = /(Date)/ig;
        if (r.test(columnHeader))
            return this.COLUMNTYPE.Date;

        return this.COLUMNTYPE.Text;
    }

    createTextColumn(columnHeader) {
        return new Column(columnHeader, {type: 'text'})
    }

    createNameColumn(columnHeader) {
        let column = this.createTextColumn(columnHeader);
        column.props.validators = ["isPersonName"]
        return column;
    }

    createDateColumn(columnHeader) {
        return new Column(columnHeader, {type: 'date'})
    }

    createReferenceColumn(columnHeader) {
        let column = this.createTextColumn(columnHeader);
        column.props.validators = [["references", `"${columnHeader}"`]];
        return column
    }

    createKeyColumn(columnHeader) {
        return new Column(columnHeader, {
            validators: [
                "isUnique"
            ]
        })
    }
}

class UiForm {
    constructor(fields= [], options= {}) {
        this.props = {
            ...{
                fields: fields,
            },
            ...options,
        }
    }
}

class UiField {
    constructor(type, label, options = {}) {
        this.props = {
            ...{
                type: type,
                label: label.trim(),
                name: fileEasy.slug(label),
            },
            ...this.defaultOptions(options),
            ...options,
        }
        this.props.name = fileEasy.slug(this.props.name)
    }

    defaultOptions(options = {}) {
        return {}
    }
}

class FormFieldFactory {
    createField(column) {
        switch (column.type) {
            default: return new UiField('text', column.props.label)
        }
    }
}

let columnHeaders = "ID, First name, Last name, Middle name, DOB, Gender, Address, Apartment";

let columnHeaderNames = columnHeaders.split(/\s*\,\s*/);
let columnFactory = new ColumnFactory(["Apartment"]);
let columns = columnHeaderNames.map(colHeaderName => {
    return columnFactory.createColumn(colHeaderName)
})

console.log(JSON.stringify(columns, null, 4))


// Create entities from column headers

let entityHeaders = {
    'Tenant': {
        columnHeaders:  "ID, First name, Last name, Middle name, DOB, Gender, Address, Apartment",
    },
    'Apartment': {
        columnHeaders: "ID, Title, Unit",
    },

    'Unit': {
        columnHeaders: "ID, Title, Address"
    }
}

let tableNames = Object.keys(entityHeaders);
columnFactory = new ColumnFactory(tableNames);

let tables = {};
tableNames.forEach(tableName => {
    let columnHeaderNames = entityHeaders[tableName].columnHeaders.split(/\s*\,\s*/)
    tables[tableName] = {
        name: tableName,
        columns: columnHeaderNames.map(columnHeader => {
            return columnFactory.createColumn(columnHeader)
        })
    }
})

console.log(JSON.stringify(tables, null, 4))

let formFieldFactory = new FormFieldFactory();

let tableForms = tableNames.map(tableName => {
    let columns = tables[tableName].columns;
    let fields = columns.map(column => formFieldFactory.createField(column));
    let newFields = columns.filter(column => column.props.type != "key").map(column => formFieldFactory.createField(column));
    return {
        table: tableName,
        form: {
            "default": new UiForm(fields, {method: "POST", name: tableName}),
            "new": new UiForm(newFields, {method: "POST", name: tableName}),
        },
        grid: {
            'default': ''
        }
    }
})

console.log(JSON.stringify(tableForms, null, 4))
