(function() {

    if (typeof ($.fn.pickadate) === "undefined") {
        console.warn("Pickadate JS is not loaded. Plugin skipped.");

        //fallback to Date control
        Backbone.Form.controls.DatePicker = Backbone.Form.controls.Date;
        return;
    }

    Backbone.Form.controls.DatePicker = Backbone.Form.controls.Date = Backbone.Form.controls.Text.extend({

        defaultFormat: 'dddd, dd mmm, yyyy', // 'dd.mm.yyyy', // format shown to user
        defaultFormatSubmit: 'yyyy-mm-dd', // format submitted in the form

        initialize: function(options) {
            Backbone.Form.Control.prototype.initialize.call(this, options);

            //@see http://amsul.ca/pickadate.js/date
            this.pickerOpts = _.extend({
                hiddenName: true, // only send the hidden value
                format: this.defaultFormat,
                formatSubmit: this.defaultFormatSubmit,
                container: 'body', // @todo reference the form container here
                editable: false
            }, this.pickerOpts, options.picker);
        },

        render: function() {
            Backbone.Form.Control.prototype.render.call(this);

            this.$el.pickadate(this.pickerOpts);
            return this;
        },

        getValue: function() {
            var format = this.pickerOpts.formatSubmit || this.defaultFormat;
            return this.$el.pickadate('picker').get('select', format);
        },

        setValue: function(val) {
            var format = this.pickerOpts.formatSubmit || this.defaultFormat;

            var picker = this.$el.pickadate('picker');
            if (picker) {
                picker.set('select', val, { format: format });
            };

            this.$el.attr('data-value', val);

            return this;
        }
    });

})();
