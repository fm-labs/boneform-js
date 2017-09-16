(function() {

    Backbone.Form.handlers.Ajax = function(form, data, options) {

        //console.log("[default handler] handling form", form, data, options);

        var ajaxSuccess = function(result) {
            console.log("Yea!", result);

            if (_.isObject(result)) {
                if (result.errors) {
                    form.invalidate(result.errors);
                }
            } else {
                console.warn("Unhandled result type");
            }

            /*
             try {
             var json = JSON.parse(result);
             if (json.errors) {
             form.invalidate(json.errors);
             }
             } catch (ex) {
             console.log("Result was not a valid JSON");
             }
             */
        };
        var ajaxError = function(xhr, textStatus) {
            console.error("Dooo!", textStatus);
        };

        var ajaxSettings = {
            url: options.action,
            method: 'POST',
            data: data,
            success: ajaxSuccess,
            error: ajaxError
        };

        // json
        if (options.ajax === 'json') {
            console.log("Submit via json post");

            ajaxSettings = _.extend(ajaxSettings, {
                data: JSON.stringify(data),
                contentType: "application/json; charset=utf-8",
                dataType: 'json',
            });
        }
        $.ajax(ajaxSettings);
    };

})();