(function() {

    /**
     * @param {Backbone.Form} form
     */
    Backbone.Form.Submit = Backbone.View.extend({

        template: _.template('\
            <div class="form-group">\
                <div class="col-xs-offset-4 col-xs-8 col-sm-offset-6 col-sm-6">\
                    <span data-control>&nbsp;</span>\
                </div>\
            </div>\
        '),

        initialize: function(options) {

            options = _.extend({}, options);

            this.form = options.form || this.form || undefined;

            this.options = _.extend({
                // field
                label: '',

                control: {},
                controlAttrs: {}
            }, _.omit(options, ['form']));

            // create control
            var ctrlOpts = _.extend({
                form: this.form,
                field: this,
                attrs: this.options.controlAttrs,

                label: this.options.label
            }, this.options.control);
            this.control = new Backbone.Form.controls['Button'](ctrlOpts);
        },

        render: function() {

            var $field = this.template({});
            this.setElement($field);

            this.$el.find('[data-control]').replaceWith(this.control.render().el);

            return this;
        },

        getControl: function() {
            return this.control;
        }

    });

})();

