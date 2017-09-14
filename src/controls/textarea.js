Backbone.Form.controls.Textarea = Backbone.Form.Control.extend({

    tagName: 'textarea',

    initialize: function(options) {
        Backbone.Form.Control.prototype.initialize.call(this, options);

        //this.$el.attr(this.options.attrs);
    }

});