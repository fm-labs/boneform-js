Backbone.Form.controls.Checkbox = Backbone.Form.Control.extend({

    tagName: 'input',

    initialize: function(options) {
        Backbone.Form.Control.prototype.initialize.call(this, options);

        this.$el.attr('type', 'checkbox');
        //this.$el.attr(this.attrs);
    },

    getValue: function() {
        return (this.$el.prop('checked') | 0);
    },

    setValue: function(val) {
        this.$el.attr('checked', !!val);

        return this;
    }
});