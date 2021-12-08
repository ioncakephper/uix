const hbsr = require("hbsr");
const fileEasy = require("file-easy");


const ui = require("./lib/ui");
const { TextUiField } = require("./lib/ui");


class UiForm extends ui.UiField {
    constructor(formFields, options = {}) {
        super('form', '', options);
        this.props = {
            ...this.props,
            ...{formFields: formFields},
            ...{
                method: "POST",
                action: ""
            },
        }
        this.props.formFields.push(new ui.ButtonUiField('Submit'))
    }


    contentVariables(values = {}) {
        return {
            fields: this.props.formFields.map(formField => {
                return formField.render(values)
            }),
            method: this.props.method,
            action: this.props.action,
        }
    }
}

class TableUiField extends ui.UiField {
    constructor(label, headers = [], rows = [], options = {}) {
        super('table', label, options);
        this.props = {
            ...this.props,
            ...{
                headers: headers,
                rows: rows,
            }
        }
    }
}


class GroupUiField extends ui.UiField {
    constructor(label, items = [], options = {}) {
        super('group', label, {...options, ...{items: items}})
    }

    contentVariables(values = {}) {
        return {...super.contentVariables(values), ...{
            fields: this.props.items.map(field => field.render(values))
        },}

    }
}
  

class GenderUiField extends ui.RadioUiField {
    constructor(label, options = {}) {
        super(label, options);
    }
    
    defaultOptions(options = {}) {
        return {
            options: ["Female", "Male"].map((label, idx) => {
                return {
                    label: label,
                    value: `${idx}`,
                }
            })
        }
    }
}

// let headers = ['Name', 'DOB']
// let rows = [
//     ['Cooper, Dale', '12/11/1961'],
//     ['Cooper, Dale', '12/11/1961'],
//     ['Cooper, Dale', '12/11/1961'],
//     ['Cooper, Dale', '12/11/1961'],
//     ['Cooper, Dale', '12/11/1961'],
// ]
// let f = new UiForm([new ui.TextUiField('First name', {required: true}),
// new TableUiField('Table', headers, rows),
// new ui.SelectUiField('Dropdown'),
// new ui.CheckboxUiField('Required'),
// new GroupUiField('Name', [
//     new ui.TextUiField('First name'),
//     new ui.TextUiField('Last name'),
//     new ui.TextUiField('Middle name'),
//     new GenderUiField('Gender'),
// ], {required: true})]);
 
// let results = f.render({})
// console.log(results)

// let content = hbsr.render_template('page', {content: results});
// fileEasy.saveDocument('sample.html', content)



// let formFields = [
//     new TextUiField('Field label', {
//         validators: [
//             {
//                 name: 'required',
//                 value: `true`,
//             }
//         ]
//     })
// ]

// let formDemo = new UiForm(formFields)


// let formHtml = formDemo.render({});
// let validation = hbsr.render(`
// {
//     rules: {
//         {{#each fields as |field|}}
//         "{{{field.props.name}}}": {
//             {{#each field.props.validators as |validator|}}
//             "{{{validator.name}}}": {{{validator.value}}},
//             {{/each}}
//         }
//         {{/each}}
//     },
//     messages: {
//         {{#each fields as |field|}}
//         "{{{field.props.name}}}": {
//             {{#each field.props.validators as |validator|}}
//             "{{{validator.name}}}": {{{validator.message}}},
//             {{/each}}
//         }
//         {{/each}}
//     }
// }`, {
//     fields: formDemo.props.formFields
// })


// console.log(`${formHtml}
// <script>
//     $().ready(function() {
//         $('#formHtml').validate(
//             ${JSON.stringify(validation, null, 4)}
//         )
//     })
// </script>
// `)



let fieldPropertiesFields = [
    new ui.TextUiField('Label', {
        required: true,
    }),
    new ui.TextUiField('Name', {
        required: true,
    }),
    new ui.SelectUiField('Type', {
        required: true,
        options: "Text Number Boolean Radio Checkboxes Select Color Range File Image Textarea".split(/\s+/).sort().map((label, idx) => {
            return {
                label: label,
                value: `${idx}`
            }
        })
    }), 
    new ui.CheckboxUiField('Required'),
    new ui.TextUiField('Help text'),
    new ui.CheckboxUiField('Is record key'),
    new ui.CheckboxUiField('Is record label'),
    new ui.TextareaUiField('Description'),
]
let fieldPropertiesForm = new UiForm(fieldPropertiesFields);


let results = fieldPropertiesForm.render({})
console.log(results)

let content = hbsr.render_template('page', {content: results});
fileEasy.saveDocument('sample.html', content) 
