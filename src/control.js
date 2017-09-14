Backbone.Form.Control = Backbone.View.extend({

    tagName: 'input',

    events: {
        'change':   'onChange',
        'blur':     'onBlur',
        'focus':    'onFocus'
    },

    initialize: function(options) {

        options = _.extend({
            form: null,
            field: null,
            data: null,
            id: null,
            name: null,
            attrs: {}
        }, options);

        var defaults = this.defaults || {};
        _.extend(this, defaults, options);

        this.form = options.form || this.form;
        this.field = options.field || this.field;
        this.data = options.data || this.data;

        this.id = options.id || this.id;
        this.name = options.name || this.name;
        this.attrs = options.attrs || this.attrs || this.defaultAttrs || {};
        this.options = _.omit(options, ['id', 'name', 'attrs', 'form', 'field', 'data']);

        this.$el.attr('id', this.id);
        this.$el.attr('name', this.name);
        this.$el.attr(this.attrs);

        this.setup(); // @TODO !drop?
    },

    setup: function() {
        //this.$el.prop('required', this.options.required);
        //console.log("init control", schema);
    },

    render: function() {
        return this;
    },

    getValue: function()
    {
        return this.$el.val();
    },

    setValue: function($val)
    {
        this.$el.val($val);
        return this;
    },

    onChange: function(ev) {
        this.trigger('change', this);
    },

    onBlur: function(ev) {
        this.trigger('blur', this);
    },

    onFocus: function(ev) {
        this.trigger('focus', this);
    }
});