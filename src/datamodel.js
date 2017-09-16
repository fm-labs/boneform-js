Backbone.Form.DataModel = Backbone.Model.extend({

    defaults: {
        "mode": "local"
    },

    initialize: function() {},

    save: false,
    sync: false,
    fetch: false,
    url: false,
    urlRoot: false

});