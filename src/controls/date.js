Backbone.Form.controls.Date = Backbone.Form.Control.extend({

    tagName: 'input',

    initialize: function(options) {
        Backbone.Form.Control.prototype.initialize.call(this, options);

        this.$el.attr('type', 'date');
        //this.$el.attr(this.options.attrs);
    }

});