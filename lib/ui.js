
/**
 * 
 */
const fileEasy = require('file-easy')
const hbsr = require('hbsr')



class Renderable {

    /**
     *
     *
     * @param {*} [values={}]
     * @memberof Renderable
     */
    render(values = {}) {
        this.fill(this.template(), this.variables(values))
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

class UiField extends Renderable {
    constructor(type, label, options = {}) {
        this.props = {
            ...{
                type: type,
                label: label,
                name: fileEasy.slug(label),
            },
            ...this.defaultOptions(values),
            ...options,
        }
        this.props.name = fileEasy.slug(this.props.name)
    }

    template() {
        return 'uiField'
    }

    fill(template, variables = {}) {
        return hbsr.render_template(template, variables)
    }

    variables(values = {}) {
        return {
            ...this.defaultVariables(values),
            ...this.props,
            ...{value: this.getValue(values)},
            ...{content: this.renderContent(values)}
        }
    }

    contentTemplate() {
        return this.fileEasy.slug(this.props.type)
    }

    renderContent(values = {}) {
        return this.fill(this.contentTemplate(), this.contentVariables(values))
    }

    contentVariables(values = {}) {
        return {
            ...this.props,
            ...{value: this.getValue(values)},
            ...this.defaultContentVariables(values)
        }
    }

    defaultContentVariables(values = {}) {
        return {}
    }
}

module.exports = {
    Renderable: Renderable,
    UiField: UiField,
}