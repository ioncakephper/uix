
const fileEasy = require('file-easy')
const hbsr = require('hbsr')
const {isArray} = require('lodash')

/**
 *
 *
 * @class Renderable
 */
class Renderable {

    /**
     *
     *
     * @param {*} [values={}]
     * @memberof Renderable
     */
    render(values = {}) {
        return this.fill(this.template(), this.variables(values))
    }

    /**
     *
     *
     * @return {*} 
     * @memberof Renderable
     */
    template() {
        return ``
    }

    /**
     *
     *
     * @param {*} [values={}]
     * @return {*} 
     * @memberof Renderable
     */
    variables(values = {}) {
        return {
            ...this.defaultVariables(values),
            ...values,
        }
    }

    /**
     *
     *
     * @param {string} [template='']
     * @param {*} [variables={}]
     * @return {*} 
     * @memberof Renderable
     */
    fill(template = '', variables = {}) {
        return ''
    }

}

/**
 *
 *
 * @class UiField
 * @extends {Renderable}
 */
class UiField extends Renderable {
    constructor(type, label, options = {}) {
        super();
        this.props = {
            ...{
                type: type,
                label: label,
                name: fileEasy.slug(label),
            },
            ...this.defaultOptions(options),
            ...options,
        }
        // ensure name is slug-like
        this.props.name = fileEasy.slug(this.props.name)
    }

    /**
     *
     *
     * @param {*} [values={}]
     * @return {*} 
     * @memberof UiField
     */
    defaultOptions(values = {}) {
        return {}
    }

    /**
     *
     *
     * @return {*} 
     * @memberof UiField
     */
    template() {
        return 'uiField'
    }

    /**
     *
     *
     * @param {*} template
     * @param {*} [variables={}]
     * @return {*} 
     * @memberof UiField
     */
    fill(template, variables = {}) {
        return hbsr.render_template(template, variables)
    }

    /**
     *
     *
     * @param {*} [values={}]
     * @return {*} 
     * @memberof UiField
     */
    variables(values = {}) {
        return {
            ...this.defaultVariables(values),
            ...this.props,
            ...{value: this.getValue(values)},
            ...{content: this.renderContent(values)}
        }
    }

    /**
     *
     *
     * @param {*} [values={}]
     * @return {*} 
     * @memberof UiField
     */
    getValue(values = {}) {
        return values[this.props.name]
    }

    /**
     *
     *
     * @return {*} 
     * @memberof UiField
     */
    contentTemplate() {
        return fileEasy.slug(this.props.type)
    }

    /**
     *
     *
     * @param {*} [values={}]
     * @return {*} 
     * @memberof UiField
     */
    renderContent(values = {}) {
        return this.fill(this.contentTemplate(), this.contentVariables(values))
    }

    /**
     *
     *
     * @param {*} [values={}]
     * @return {*} 
     * @memberof UiField
     */
    contentVariables(values = {}) {
        return {
            ...this.props,
            ...{value: this.getValue(values)},
            ...this.defaultContentVariables(values)
        }
    }

    /**
     *
     *
     * @param {*} [values={}]
     * @return {*} 
     * @memberof UiField
     */
    defaultVariables(values = {}) {
        return {}
    }

    /**
     *
     *
     * @param {*} [values={}]
     * @return {*} 
     * @memberof UiField
     */
    defaultContentVariables(values = {}) {
        return {}
    }
}

/**
 *
 *
 * @class TextUiField
 * @extends {UiField}
 */
class TextUiField extends UiField {
    constructor(label, options = {}) {
        super('text', label, options)
    }
}

/**
 *
 *
 * @class OptionsUiField
 * @extends {UiField}
 */
class OptionsUiField extends UiField {

    /**
     *
     *
     * @param {*} [options={}]
     * @return {*} 
     * @memberof OptionsUiField
     */
    defaultOptions(options = {}) {
        return {
            options: "Option 1, Option 2".split(/\s*\,\s*/).map((label, idx) => {
                return {
                    label: label.trim(),
                    value: `${idx}`
                }
            })
        }
    }

    /**
     *
     *
     * @param {*} [values={}]
     * @return {*} 
     * @memberof OptionsUiField
     */
    defaultContentVariables(values = {}) {
        let currentValue = this.getValue(values)
        return {
            options: this.props.options.map(option => {
                return (`${currentValue}` == `${option.value}`) 
                ? {
                    ...option,
                    ...{checked: true},
                }
                : option;
            })
        }
    }
}

/**
 *
 *
 * @class RadioUiField
 * @extends {OptionsUiField}
 */
class RadioUiField extends OptionsUiField {
    constructor(label, options = {}) {
        super('radio', label, options)
    }
}

/**
 *
 *
 * @class CheckboxesUiField
 * @extends {RadioUiField}
 */
class CheckboxesUiField extends RadioUiField {
    constructor(label, options = {}) {
        super(label, options);
        this.props.type = 'checkboxes';
    }

    /**
     *
     *
     * @param {*} [values={}]
     * @return {*} 
     * @memberof CheckboxesUiField
     */
    getValue(values = {}) {
        let v = super.getValue(values);
        return isArray(v) ? v : [v];
    }

    /**
     *
     *
     * @param {*} [values={}]
     * @return {*} 
     * @memberof CheckboxesUiField
     */
    defaultContentVariables(values = {}) {
        let currentValue = this.getValue(values)
        return {
            options: this.props.options.map(option => {
                return (currentValue.includes(`${option.value}`)) 
                ? {
                    ...option,
                    ...{checked: true},
                }
                : option;
            })
        }
    }
}

/**
 *
 *
 * @class NumberUiField
 * @extends {UiField}
 */
class NumberUiField extends UiField {
    constructor(label, options = {}) {
        super('number', label, options);
    }
}

/**
 *
 *
 * @class CheckboxUiField
 * @extends {UiField}
 */
class CheckboxUiField extends UiField {
    constructor(label, options = {}) {
        super('checkbox', label, options)
    }
}

/**
 *
 *
 * @class DateUiField
 * @extends {UiField}
 */
class DateUiField extends UiField {
    constructor(label, options = {}) {
        super('date', label, options)
    }
}

/**
 *
 *
 * @class TimeUiField
 * @extends {UiField}
 */
class TimeUiField extends UiField {
    constructor(label, options = {}) {
        super('time', label, options)
    }
}

/**
 *
 *
 * @class DateTimeUiField
 * @extends {UiField}
 */
class DateTimeUiField extends UiField {
    constructor(label, options = {}) {
        super('datetime', label, options)
    }
}
/**
 *
 *
 * @class EmailUiField
 * @extends {UiField}
 */
class EmailUiField extends UiField {
    constructor(label, options = {}) {
        super('email', label, options)
    }
}

/**
 *
 *
 * @class PhoneUiField
 * @extends {UiField}
 */
class PhoneUiField extends UiField {
    constructor(label, options = {}) {
        super('phone', label, options)
    }
}

/**
 *
 *
 * @class ColorUiField
 * @extends {UiField}
 */
class ColorUiField extends UiField {
    constructor(label, options = {}) {
        super('color', label, options);
    }
}

/**
 *
 *
 * @class FileUiField
 * @extends {UiField}
 */
class FileUiField extends UiField {
    constructor(label, options = {}) {
        super('file', label, options);
    }  
}

/**
 *
 *
 * @class ImageUiField
 * @extends {UiField}
 */
class ImageUiField extends UiField {
    constructor(label, options = {}) {
        super('image', label, options);
    }  
}

/**
 *
 *
 * @class HiddenUiField
 * @extends {UiField}
 */
class HiddenUiField extends UiField {
    constructor(label, options = {}) {
        super('hidden', label, options);
    }  
}

/**
 *
 *
 * @class RangeUiField
 * @extends {UiField}
 */
class RangeUiField extends UiField {
    constructor(label, options = {}) {
        super('range', label, options);
    }  
}

/**
 *
 *
 * @class MonthUiField
 * @extends {UiField}
 */
class MonthUiField extends UiField {
    constructor(label, options = {}) {
        super('month', label, options);
    }  
}

/**
 *
 *
 * @class WeekUiField
 * @extends {UiField}
 */
class WeekUiField extends UiField {
    constructor(label, options = {}) {
        super('week', label, options);
    }  
}

module.exports = {
    CheckboxUiField: CheckboxUiField,
    CheckboxesUiField: CheckboxesUiField,
    ColorUiField: ColorUiField,
    DateUiField: DateUiField,
    DateTimeUiField: DateTimeUiField,
    EmailUiField: EmailUiField,
    FileUiField: FileUiField,
    HiddenUiField: HiddenUiField,
    ImageUiField: ImageUiField,
    MonthUiField: MonthUiField,
    NumberUiField: NumberUiField,
    PhoneUiField: PhoneUiField,
    RadioUiField: RadioUiField,
    RangeUiField: RangeUiField,
    Renderable: Renderable,
    TextUiField: TextUiField,
    TimeUiField: TimeUiField,
    UiField: UiField,
    WeekUiField: WeekUiField,
}