Backbone.Form.DataModel = Backbone.Model.extend({

    defaults: {
        "mode": "local"
    },

    initialize: function() {
        console.log("init default data model");
    },

    save: false,

    sync: false,

    fetch: false,

    url: false,

    urlRoot: false,

});