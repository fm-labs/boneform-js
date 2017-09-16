/**
 * @param {Backbone.Form} form
 */
Backbone.Form.Field = Backbone.View.extend({

    /*
    template: _.template('\
        <div class="form-group">\
            <label class="col-xs-4 col-sm-5 control-label" for="<%= controlId %>">\
                <span><%= label %></span>\
                <button type="button" class="btn btn-link" data-toggle="tooltip" title="<%= help %>"><i class="fa fa-question-circle" aria-hidden="true"></i></button>\
            </label>\
            <div class="col-xs-8 col-sm-7">\
                <span data-control>&nbsp;</span>\
                <p class="help-block" data-error></p>\
            </div>\
        </div>\
    '),
    */

    template: _.template('\
        <div class="form-group">\
            <label class="control-label" for="<%= controlId %>">\
                <span><%= label %></span>\
                <button type="button" class="btn btn-link" data-toggle="tooltip" title="<%= help %>"><i class="fa fa-question-circle" aria-hidden="true"></i></button>\
            </label>\
            <!--<div class="control-item">-->\
                <span data-control>&nbsp;</span>\
                <p class="help-block" data-error></p>\
            <!--</div>-->\
        </div>\
    '),

    errorClass: '',
    validClass: '',
    activeClass: 'is-active',

    defaultOptions: {
        // references
        form: null,
        model: null,

        // validation
        rules: null,

        // field (will be passed to the control as well, except 'fieldAttrs')
        key: null,
        type: null,
        idPrefix: '',
        label: '',
        help: '',
        required: false,
        fieldAttrs: {},

        // control (will be passed to the control as 'attrs' option)
        controlAttrs: {}
    },

    initialize: function(options) {

        options = _.extend({}, this.defaultOptions, options);

        this.errors = [];
        this.key = options.key || undefined;
        this.form = options.form || this.form || null;
        this.model = options.model || this.model || null;
        this.rules = options.rules || this.rules || {};
        this.controlAttrs = options.controlAttrs || this.controlAttrs || {};
        this.fieldAttrs = options.fieldAttrs || this.fieldAttrs || {};
        this.options = _.omit(options, ['key', 'form', 'model', 'rules', 'controlAttrs', 'fieldAttrs']);

        // generate control id
        this.controlId = this.options.idPrefix + this.key;

        // create control
        if (!_.has(Backbone.Form.controls, this.options.type)) {
            //throw new Error("Control " + this.options.type + " not found!");
            console.warn("Control '" + this.options.type + "' not found for field '" + this.key + "'");
            this.options.type = 'Text';
        }
        var ctrlOpts = _.extend({
            form: this.form,
            data: this.model.get(this.key),
            field: this,
            id: this.controlId,
            name: this.key,
            attrs: this.controlAttrs
        }, this.options);
        this.control = new Backbone.Form.controls[this.options.type](ctrlOpts);

        // auto-attach 'required' validator
        if (this.options.required && this.rules.required === undefined) {
            this.rules.notempty = {};
        }

        // load validators
        this.validators = {};
        _.each(this.rules, function(voptions, vkey) {
            var validator = Backbone.Form.validators[vkey];
            if (validator === undefined) {
                console.error("Validator " + vkey + " for field " + this.key + " not found");
                return;
            }

            //console.log("Added Validator " + vkey + " for field " + this.key);
            this.validators[vkey] = validator(voptions);
        }, this);
    },

    render: function() {

        // render field and attach control listeners
        var $field = this.template({
            controlId: this.controlId,
            help: this.options.help || this.options.label || this.key + ' : ' + this.options.type,
            label: this.options.label || this.key
        });
        this.setElement($field);

        this.$el.attr(this.fieldAttrs);
        this.$el.find('[data-control]').replaceWith(this.control.render().el);
        this.control.trigger('afterRender', this);

        this.listenTo(this.control, 'change', this.handleChange);
        this.listenTo(this.control, 'blur', this.handleBlur);
        this.listenTo(this.control, 'focus', this.handleFocus);

        // help tooltip
        // https://getbootstrap.com/docs/3.3/javascript/#tooltips
        this.$el.find('[data-toggle="tooltip"]').tooltip({
            placement: 'auto right',
            html: false
        });

        return this;
    },

    getControl: function() {
        return this.control;
    },

    getValue: function()
    {
        return this.control.getValue();
    },

    setValue: function(val)
    {
        this.control.setValue(val);
    },

    validate: function() {
        var value = this.getValue();

        this.errors = [];
        _.each(this.validators, function(validator, vkey) {
            //console.log("Run validator " + vkey + " for field " + this.key);
            var err =  validator(value);
            if (err) {
                this.errors.push(err);
            }
        }, this);

        this.updateErrorState();

        return this.errors;
    },

    setError: function(err) {
        if (err === false) {
            this.errors = [];
            return this;
        }

        this.errors.push(err);

        return this;
    },

    getError: function()
    {
        return (this.errors[0] !== undefined) ? this.errors[0] : null;
    },

    updateErrorState: function() {
        if (!_.isEmpty(this.errors)) {
            var err = this.errors[0];
            var msg = (_.isObject(err)) ? err.message + "(" + err.type + ")" : err;
            this.$el.find('[data-error]').html(msg);
            this.$el.removeClass(this.validClass);
            this.$el.addClass(this.errorClass);

            this.$el.parent('fieldset').addClass(this.errorClass);

        } else {
            this.$el.find('[data-error]').html("");
            this.$el.removeClass(this.errorClass);
            this.$el.addClass(this.validClass);

            this.$el.parent('fieldset').removeClass(this.errorClass);
        }
        return this;
    },

    resetErrorState: function() {
        this.$el.removeClass(this.validClass);
        this.$el.removeClass(this.errorClass);
        return this;
    },

    handleChange: function(control) {
        //console.log('Changed ' + control.schema.name);
        this.trigger('change', this);
    },

    handleFocus: function(control) {
        //console.log('Focused ' + control.schema.name);
        this.$el.addClass(this.activeClass);
        this.trigger('focus', this);
    },

    handleBlur: function(control) {
        //console.log('Blured ' + control.schema.name);
        this.$el.removeClass(this.activeClass);
        this.trigger('blur', this);
    }

});
