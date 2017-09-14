Backbone.Form.controls.Button = Backbone.Form.Control.extend({

    tagName: 'button',

    render: function() {
        this.$el.attr('type', 'submit');
        this.$el.html("Submit");
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