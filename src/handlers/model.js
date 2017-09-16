(function() {

    Backbone.Form.handlers.Model = function(form, data, options) {

        if (form.model && _.isFunction(form.model.save)) {
            //try {
                form.model.save({}, {
                    success: function() {
                        console.log("Saving was successful")
                    },
                    error: function() {
                        console.log("Saving failed")
                    }
                });
            //} catch (ex) {
                console.error(ex);
            //}
        } else {
            alert("No suitable submit handler found");
            throw new Error("No suitable submit handler found");
        }
    };

})();