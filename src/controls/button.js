Backbone.Form.controls.Button = Backbone.Form.Control.extend({

    tagName: 'button',

    initialize: function(options) {
        Backbone.Form.Control.prototype.initialize.call(this, options);

        this.label = this.options.label || options.label || "Submit";
        this.type = this.options.type || 'submit';
    },

    render: function() {
        this.$el.attr('type', this.type);
        this.$el.html(this.label);
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
    }
});