const {isEmpty, isObject, isArray} = require('lodash');
const html = require('html');

const {
    buildEntityAttributes,
    buildEntities,
    buildSchema,
} = require('../ideas')

describe('buildEntityAttributes', () => {
    it('returns empty attributes when no parameters provided', () => {
        let r = buildEntityAttributes();
        expect(isEmpty(r)).toBe(true)
    })

    it('returns an object when columnHeaders provided', () => {
        let r = buildEntityAttributes('Name', ["Customer"]);
        expect(isObject(r.columns)).toBe(true)
    })

    it('returns correct number of columns', () => {
        let r = buildEntityAttributes('Name, Gender', ["Customer"]);
        let columns = r.columns;
        expect(isArray(columns) && columns.length == 2).toBe(true)
    })

    it('returns reference column', () => {
        let r = buildEntityAttributes('Name, Gender, Customer', ["Customer"]);
        let columns = r.columns;
        let type = columns[2].props.type;
        expect(type).toBe('reference')
    })

})

describe('buildEntities', () => {

    it('returns schema with empty entities property', () => {
        let r = buildEntities()
        expect(r).toStrictEqual({})
    })

    it('return on object', () => {
        let project = {'Customer': 'ID, Name'}
        let entities = buildEntities(project)
        expect(isObject(entities)).toBe(true);
        expect(Object.keys(entities).includes('Customer')).toBe(true)

        expect(isArray(entities['Customer'].columns)).toBe(true)
    })
})

describe('buildSchema', () => {

    it('return a scheam with entities property as an empty object', () => {
        let emptyProject = {}
        let schema = buildSchema(emptyProject)
        expect(isEmpty(schema.entities)).toBe(true)
    })

    it('return a schema with entities property having an object whose keys are entity names', () => {

        let simpleProject = {
            "Customer": '',
        }

        let schema = buildSchema(simpleProject)
        let keys = Object.keys(schema.entities)
        expect(keys.includes('Customer')).toBe(true)
    })


    it('return a correct schema with empty object for each entityName', () => {

        let simpleProject = {
            "Customer": '',
        }
        let schema = buildSchema(simpleProject)
        expect(schema).toStrictEqual({entities: {"Customer": {}}})
    })

})

describe('using mocks', () => {

    it('invoke mocked tag', () => {
        let r = html.tag('p');
        expect(r.startsWith('<p')).toBe(true);
    })

    it('creates entity form', () => {
        let schema = buildSchema({
            'Customer': "ID, First name, Last name, Middle name, Gender, Date of Birth, Phone, Email, isManager, hasResponsabilities"
        })
        let fields = schema.entities['Customer'].columns;
        let isValid = fields.every(f => f.props.type.startsWith('text'));
        expect(isValid).toBe(true);
    })
})