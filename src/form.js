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
        this.schema = this.schema || options.schema || model.schema || {};

        console.log(this.schema);

        if (this.model === undefined && options.data) {
            this.model = new Backbone.Form.DataModel(options.data);
            console.log(this.model.toJSON());
        }

        this.options = _.extend({
            method: 'POST',
            action: null,
            ajax: false,
            idPrefix: '',
            formAttrs: {},
            formValidate: false, // use HTML5 form validation
        }, _.omit(options, ['schema', 'model', 'data']));

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

        // apply form attributes
        this.$el.attr('method', this.options.method);
        this.$el.attr('action', this.options.action);
        this.$el.attr('role', 'form');
        this.$el.attr(this.options.formAttrs);
        if (!this.options.formValidate) {
            this.$el.attr('novalidate', 'novalidate');
        }
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

        this.$el.html("");

        // render controls
        _.each(this.fields, function(field, fkey) {
            this.$el.append(field.render().el);
        }, this);

        // fill form data
        if (this.model) {
            this.setData(this.model.toJSON());
        } else if (this.data) {
            this.setData(this.data);
        }

        // render submit button
        $button = new Backbone.Form.controls.Button({
            label: "Submit"
        });
        this.$el.append($button.render().el);

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

    invalidate: function(errors) { // errors = { [field] => [error message] }
        _.each(errors, function(err, fkey) {
            if (_.has(this.fields, fkey)) {
                this.fields[fkey].setError({type: 'model', message: err}).updateErrorState();
            }
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

        // a) submit directly via multipart form
        if (this.options.action && !this.options.ajax) {
            console.log("Submit via http post");
            return true;
        }

        // b) submit via xhr request (jqXHR)
        else if (this.options.action && this.options.ajax) {
            console.log("Submit via xhr post");

            var self = this;
            var ajaxSuccess = function(result) {
                console.log("Yea!", result);

                if (_.isObject(result)) {
                    if (result.errors) {
                        self.invalidate(result.errors);
                    }
                } else {
                    console.warn("Unhandled result type");
                }

                /*
                try {
                    var json = JSON.parse(result);
                    if (json.errors) {
                        this.invalidate(json.errors);
                    }
                } catch (ex) {
                    console.log("Result was not a valid JSON");
                }
                */
            };
            var ajaxError = function(xhr, textStatus) {
                console.error("Dooo!", textStatus);
            };

            var ajaxSettings = {
                url: action,
                method: 'POST',
                data: data,
                success: ajaxSuccess,
                error: ajaxError
            };

            // json
            if (this.options.ajax === 'json') {
                console.log("Submit via json post");

                ajaxSettings = _.extend(ajaxSettings, {
                    data: JSON.stringify(data),
                    contentType: "application/json; charset=utf-8",
                    dataType: 'json',
                });
            }
            $.ajax(ajaxSettings);
        }

        // c) submit via model sync (jqXHR)
        else if (this.model && _.isFunction(this.model.save)) {
            try {
                this.model.save({}, {
                    success: function() {
                        console.log("Saving was successful")
                    },
                    error: function() {
                        console.log("Saving failed")
                    }
                });
            } catch (ex) {
                console.error(ex);
            }
        } else {
            console.error("No suitable submit handler found");
        }

        return false;
    },

    handleSubmitEvent: function(ev) {

        var ret = this.submit();
        if (!ret) {
            ev.preventDefault();
        }
        return ret;
    },

    handleFieldEvent: function(event, field) {

        // trigger [eventname]:[fieldname]
        this.trigger(event + ':' + field.key, field, this);

        // trigger [eventname]
        this.trigger(event, field, this);
    }
});

Backbone.Form.controls = {};
Backbone.Form.validators = {};