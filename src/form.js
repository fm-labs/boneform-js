/**
 * @param {Object} options
 * @param {Object} schema
 * @param {Object} fields
 * @param {Object} data
 * @param {Backbone.Model} model
 */
Backbone.Form = Backbone.View.extend({

    tagName: 'form',

    events: {
        'submit': 'handleSubmitEvent'
    },

    //options: {},
    //fields: {},

    initialize: function(options) {
        //console.log(options);

        this.model = this.model || options.model || undefined;
        this.schema = this.schema || options.schema || this.model.schema || {};

        if ((this.model === undefined || this.model === null) && options.data) {
            this.model = new Backbone.Form.DataModel(options.data);
            console.log("init default data model", this.model.toJSON());
        }

        if (options.$el) {
            this.setElement(options.$el);
        }

        // allow complete override of submit and validate functions
        //_.extend(this, _.pick(options, ['submit', 'validate']));

        this.options = _.extend({
            method: 'POST',
            action: null,
            ajax: false,
            idPrefix: '',
            formAttrs: {},
            formValidate: false, // use HTML5 form validation
            onSubmit: function(form, data, options) {}
        }, _.omit(options, ['schema', 'model', 'data', '$el']));

        // init controls
        this.fields = {};
        _.each(this.schema, function(fschema, fkey) {
            //console.log(fkey, fschema);
            try {
                this.fields[fkey] = this._buildField(fkey, fschema);
                this.listenTo(this.fields[fkey], 'all', this.handleFieldEvent);
            } catch (ex) {
                console.error(ex);
                //@TODO handle _buildField exception
            }
        }, this);

    },

    _buildField: function(fkey, fschema) {

        fschema = _.extend({
            form: this,
            model: this.model,
            key: fkey,
            idPrefix: this.options.idPrefix,
            type: null,
            required: null,
            controlAttrs: {},
            //fieldAttrs: {}
        }, fschema);


        return new Backbone.Form.Field(fschema);
    },

    getField: function(fkey) {
        //console.log("get field " + fkey);
        if (_.has(this.fields, fkey)) {
            return this.fields[fkey];
        }
    },

    getData: function()
    {
        var data = {};
        var self = this;
        _.each(this.fields, function(field, fkey) {
            //console.log(fkey, field);
            data[fkey] = field.getValue();
        });

        return data;
    },

    setData: function(data) {
        var self = this;
        _.each(data, function(v,k) {
           if (_.has(self.fields, k)) {
               self.fields[k].setValue(v);
           } else {
               console.log("form SETDATA failed: field does not exist: " + k);
           }
        });
    },

    render: function() {

        var self = this;

        // trigger 'afterRender' event
        this.trigger('beforeRender', this);

        // apply form attributes
        this.$el.attr('method', this.options.method);
        this.$el.attr('action', this.options.action);
        this.$el.attr('role', 'form');
        this.$el.attr(this.options.formAttrs);
        if (!this.options.formValidate) {
            this.$el.attr('novalidate', 'novalidate');
        }


        // render fieldsets
        var $fieldsets = this.$el.find('fieldset[data-fields]');
        if ($fieldsets.length > 0) {
            $fieldsets.each(function() {
                // read field names from 'data-fields' attribute
                // if 'data-fields' is set, but no value given, all fields in schema will be injected
                var fields = [];
                if ($(this).data('fields')) {
                    fields = $(this).data('fields').split(",")
                    //console.log("Found fields", fields);
                } else {
                    //console.log("Found fields wildcard - Injecting all fields");
                    fields = _.keys(self.fields);
                }

                // inject a legend
                if ($(this).find('legend').length < 1 && $(this).data('legend')) {
                    $(this).prepend($('<legend>').html($(this).data('legend')));
                }

                // inject field stubs into fieldset
                _.each(fields, function(field) {
                    //console.log("Add field to fieldset", field);
                    $(this).append($('<span>').attr({'data-field': field}));
                }, this)
            });
        }

        // render fields
        var $fields = this.$el.find('[data-field]');
        if ($fields.length > 0) {
            var _rendered = {};
            $fields.each(function() {
                var fieldName = $(this).data('field');
                if (_.has(self.fields, fieldName) && _rendered[fieldName] !== true) {
                    var field = self.fields[fieldName];
                    $(this).replaceWith(field.render().el);
                    _rendered[fieldName] = true;
                }
            });
        } else {

            // if no data-fieldsets or data-field elements are found in the form body
            // render all fields in the schema
            _.each(this.fields, function(field, fkey) {
                this.$el.append(field.render().el);
            }, this);
        }

        // fill form data
        if (this.model) {
            this.setData(this.model.toJSON());
        } else if (this.data) {
            this.setData(this.data);
        }

        // render submit button
        var $button = new Backbone.Form.Submit();
        this.$el.append($button.render().el);

        // trigger 'afterRender' event
        this.trigger('afterRender', this);

        return this;
    },

    validate: function() {

        var errors = {};
        var self = this;
        _.each(this.fields, function(field, fkey) {

            var ferrs = field.validate();
            //console.log(fkey, field, ferrs);
            if (!_.isEmpty(ferrs)) {
                errors[fkey] = ferrs;
            }
        });

        return errors;
    },

    /**
     * Invalidate fields
     * Sets error message for given fields
     * Optionally update field's error state (renders the error message)
     *
     * @param errors
     * @param options
     */
    invalidate: function(errors, options) { // errors = { [field] => [error message] }

        options = _.extend({ updateState: true }, options);

        _.each(errors, function(err, fkey) {
            if (_.has(this.fields, fkey)) {
                this.fields[fkey].setError({type: 'model', message: err});

                if (options.updateState) {
                    this.fields[fkey].updateErrorState();
                }
            }
        }, this);
    },

    /**
     * Force update of field error states
     */
    updateErrorStates: function() {
        _.each(this.fields, function(field, fkey) {
            field.updateErrorState();
        }, this);
    },

    /**
     * Force reset of field error states
     */
    resetErrorStates: function() {

        // reset fieldsets states
        this.$el.find('fieldset').each(function(){
            $(this).removeClass(Backbone.Form.Field.prototype.errorClass);
        });

        // reset field states
        _.each(this.fields, function(field, fkey) {
            field.setError(false).resetErrorState();
        }, this);
    },

    /**
     * Commit form data to model
     */
    commit: function(options) {
        if (!this.model) { //@TODO Add commit callback for model-less forms
            throw new Error("Can not commmit form data on model-less form");
        }

        options = _.extend({ validate: true }, options);

        this.model.set(this.getData());

        var errors = {};
        if (options.validate === true && _.isFunction(this.model.validate)) {
            errors = this.model.validate.apply(this.model);
        }

        this.invalidate(errors);

        return errors;
    },

    submit: function() {

        var data = this.getData();
        var action = this.options.action;
        console.log("SUBMIT", data);

        var errors = this.validate(); // validate against form validators
        console.log("Submit errors", errors);

        var modelErrors = this.commit({ validate: true });
        console.log("Model errors", modelErrors);

        if (!_.isEmpty(errors) || !_.isEmpty(modelErrors)) {
            console.error("Form has errors. Abort submit.");
            return;
        }

        if (typeof this.options.onSubmit === "function") {
            return this.options.onSubmit.apply(this, [this, data, this.options]);
        }

        this.trigger('submit', this, data, this.options);

        return false;
    },

    /**
     * Handle DOM event 'submit' in context of the jquery form object
     * @param ev
     * @returns bool
     */
    handleSubmitEvent: function(ev) {

        var ret = this.submit();
        if (!ret || ev.isPropagationStopped()) {
            ev.preventDefault();
        }
        return ret;
    },

    handleFieldEvent: function(eventName, field) {

        switch(eventName) {
            case "change":
                this.resetErrorStates();
                //field.setError(false).resetErrorState();
                break;
        }

        // trigger [eventname]:[fieldname]
        this.trigger(eventName + ':' + field.key, field, this);

        // trigger [eventname]
        this.trigger(eventName, field, this);
    }
});

Backbone.Form.controls = {};
Backbone.Form.validators = {};
Backbone.Form.handlers = {};