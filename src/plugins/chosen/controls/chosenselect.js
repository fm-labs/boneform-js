(function() {

    if (typeof ($.fn.chosen) === "undefined") {
        console.warn("Chosen JS is not loaded. Plugin skipped");

        // fallback to Select control
        Backbone.Form.controls.ChosenSelect = Backbone.Form.controls.Select.extend({});
        return;
    }

    /**
     * @param {Object} selectCtrlOptions    Options for hidden select control
     * @param {Object} chosenArgs   Chosen options https://harvesthq.github.io/chosen/options.html
     * @param {Backbone.Form.control.Select} select     Instance of hidden select control
     */
    Backbone.Form.controls.ChosenSelect = Backbone.Form.Control.extend({

        tagName: 'div',
        className: '',

        events: {},

        chosenDefaults: {
            width: '100%',
            search_contains: true,
            //disable_search_threshold: 10
        },

        initialize: function(options) {

            Backbone.Form.Control.prototype.initialize.call(this, _.omit(options, ['id', 'name']));

            var selectCtrlOptions = _.omit(this.options, ['chosen']);
            var chosenOpts = {'allow_single_deselect': !!this.options.placeholder};

            // placeholder: chosen-js requires empty select option without label nor value to work
            if (this.options.placeholder) {
                selectCtrlOptions.placeholder = null;
                if (this.options.placeholder !== true) { // ignore boolean values as placeholder
                    _.extend(chosenOpts, { 'placeholder_text_single': this.options.placeholder});
                }
            }

            this.options.chosen = _.extend(chosenOpts, this.chosenDefaults, this.options.chosen);

            // create hidden select control
            this.select = new Backbone.Form.controls.Select(selectCtrlOptions);
            this.select.undelegateEvents();

        },

        setup: function() {
        },

        render: function() {

            // render hidden select control
            this.$el.html(this.select.render().el);

            // activate chosen-js
            console.log(this.options.chosen);
            var self = this;
            this.select.$el
                .chosen(this.options.chosen)
                .on('chosen:ready', function(ev, params) {
                    console.log("Chosen select is ready");
                })
                .on('change', function(ev, params) {
                    self.trigger('change', self)
                })
                // dirty workaround for focus and blur events
                // @https://github.com/harvesthq/chosen/issues/1428
                .on('chosen:showing_dropdown', function(ev) {
                    self.trigger('focus', self)
                })
                .on('chosen:hiding_dropdown', function(ev) {
                    self.trigger('blur', self)
                });

            return this;
        },

        getValue: function() {
            return this.select.getValue();
        },

        setValue: function(val) {
            this.select.setValue(val);
            this.select.$el.trigger('chosen:updated');
            return this;
        },

        setOptions: function(options) {
            this.select.setOptions(options);
            this.select.$el.trigger('chosen:updated');
            return this;
        }
    });

})();
