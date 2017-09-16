/**
 * @param {Object} options          Control options
 * @param {Object|function} selectOptions    Select options
 * @param {bool|null} placeholder   If TRUE uses default placeholder. If FALSE no placeholder rendered. If NULL empty select option will be rendered
 */
Backbone.Form.controls.Select = Backbone.Form.Control.extend({

    tagName: 'select',

    defaultPlaceholder: "Select an option",

    initialize: function(options) {
        Backbone.Form.Control.prototype.initialize.call(this, options);

        this.selectOptions = options.options || this.options.options || this.selectOptions || {};
        this.placeholder = this.options.placeholder || this.placeholder;
        if (this.placeholder === true) { this.placeholder = this.defaultPlaceholder; } // set default placeholder

        if (_.isFunction(this.selectOptions)) {
            this.selectOptions = this.selectOptions.apply(this);
        }
    },

    render: function() {

        this.$el.html("");

        if (this.placeholder !== false) {
            this.$el.append($('<option>').text(this.placeholder).val(null));
        }
        _.map(this.selectOptions, function(label, val) {
            this.$el.append($('<option>').val(val).text(label));
        }, this);

        return this;
    },

    getValue: function() {
        return this.$el.val();
    },

    setValue: function(val)
    {
        this.$el.val(val);
        //this.$el.find('option').prop('selected', false);
        //this.$el.find('option[value="' + val + '"]').prop('selected', true);
    }
});