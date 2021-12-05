const fileEasy = require('file-easy');
const hbsr = require('hbsr');
const ui = require('./lib/ui')

let formFields = [
    new ui.TextUiField('First name'),
    new ui.TextUiField('Last name', {required: true}),
    new ui.TextUiField('Middle name'),
    new ui.RadioUiField('Gender', {
        options: ["Female", "Male"].map((label, idx) => {
            return {
                label: label.trim(),
                value: `${idx}`,
            }
        })
    }),     
    new ui.RangeUiField('Range'),
    new ui.MonthUiField('Month'),
    new ui.WeekUiField('Week'), 
    new ui.FileUiField('File'),
    new ui.ImageUiField('Image'),
    new ui.HiddenUiField('Hidden'),
    new ui.ColorUiField('Background'), 
    new ui.PhoneUiField('Phone'), 
    new ui.CheckboxesUiField('Roles'),
    new ui.NumberUiField('Applications'),
    new ui.CheckboxUiField('Manager'),
    new ui.DateUiField('Date of Birth'),
    new ui.TimeUiField('Local time'),
    new ui.DateTimeUiField('Date and time'),
    new ui.EmailUiField('Email'), 
 
]  

let values = {'roles': ['0', '1']}
let results = formFields.map(f => f.render(values)).join('\n');

let content = hbsr.render_template('page', {content: results});
fileEasy.saveDocument('sample.html', content)
console.log(results);









