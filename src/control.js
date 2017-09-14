Backbone.Form.Control = Backbone.View.extend({

    tagName: 'input',

    events: {
        'change':   'onChange',
        'blur':     'onBlur',
        'focus':    'onFocus'
    },

    initialize: function(options) {

        options = _.extend({
            id: null,
            name: null,
            attrs: {}
        }, options);

        var defaults = this.defaults || {};
        _.extend(this, defaults, options);

        this.id = this.id || options.id;
        this.name = this.name || options.name;
        this.attrs = this.attrs || options.attrs || this.defaultAttrs || {};
        this.options = _.omit(options, ['id', 'name', 'attrs']);

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