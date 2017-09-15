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
            this.key = options.key || this.key || 'submit';

            this.options = _.extend({
                // field
                idPrefix: '',
                label: '',
                help: '',

                control: {},
                controlAttrs: {}
                //fieldAttrs: {},
            }, _.omit(options, ['key', 'form']));

            this.errors = [];

            // generate control id
            this.controlId = this.options.idPrefix + this.key;

            // create control
            var ctrlOpts = _.extend({
                form: this.form,
                data: null,
                field: this,
                id: this.controlId,
                name: this.key,
                attrs: this.options.controlAttrs,

                label: this.label,
            }, this.options.control);
            this.control = new Backbone.Form.controls['Button'](ctrlOpts);
        },

        render: function() {

            // render field and attach control listeners
            var $field = this.template({
                controlId: this.controlId,
                help: this.options.help || this.options.label || this.key + ' : ' + this.options.type,
                label: this.options.label || this.key
            });
            this.setElement($field);

            this.$el.find('[data-control]').replaceWith(this.control.render().el);

            return this;
        },

        getControl: function() {
            return this.control;
        }

    });

})();

