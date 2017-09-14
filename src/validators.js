Backbone.Form.validators = Backbone.Form.validators || {};


Backbone.Form.validators.notempty = function(options) {
    options = _.extend({
    }, options);

    return function(value) {
        var err = {
            type: 'empty',
            message: 'This field can not be left empty'
        };

        console.log("Check if value is empty: ", value);

        if (value === null || value === undefined || value === '') return err;
    }
};

Backbone.Form.validators.email = function(options) {
    options = _.extend({
    }, options);

    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;


    return function(value) {

        var err = {
            type: 'email',
            message: 'Not a valid email address'
        };

        if (value && !re.test(value)) return err;
    }
};


Backbone.Form.validators.numeric = function(options) {
    options = _.extend({
    }, options);


    return function(value) {

        var err = {
            type: 'numeric',
            message: 'The value must be numeric'
        };

        if (value && isNaN(value)) return err;
    }
};

Backbone.Form.validators.range = function(options) {
    options = _.extend({
        min: 0,
        max: 99
    }, options);

    return function(value) {

        console.log("range check", value, options);
        var err = {
            type: 'range',
            message: 'The value must be between ' + options.min + ' and ' + options.max
        };

        if (value === null || value === undefined || value === '' || isNaN(value) || value < options.min || value > options.max) return err;
    }
};