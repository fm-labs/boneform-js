(function() {

    if (typeof ($.fn.pickadate) === "undefined") {
        console.warn("Pickadate JS is not loaded. Plugin skipped.");
        return;
    }

    Backbone.Form.controls.Datepicker = Backbone.Form.controls.Text.extend({

        initialize: function(options) {
            Backbone.Form.Control.prototype.initialize.call(this, options);

            this.pickerArgs = this.pickerArgs || options.picker || {};
        },

        render: function() {
            return this;
        }
    });

})();
