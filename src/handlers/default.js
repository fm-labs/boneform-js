(function() {

    Backbone.Form.handlers.Default = function(form, data, options) {

        //console.log("[default handler] handling form", form, data, options);

        // a) submit directly via multipart form
        if (options.action && !options.ajax) {
            console.log("Submit via http post");
            return true;
        }

        // b) submit via xhr request (jqXHR)
        else if (options.action && options.ajax) {
            console.log("Submit via xhr post");

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
        }

        // c) submit via model sync (jqXHR)
        else if (form.model && _.isFunction(form.model.save)) {
            try {
                form.model.save({}, {
                    success: function() {
                        console.log("Saving was successful")
                    },
                    error: function() {
                        console.log("Saving failed")
                    }
                });
            } catch (ex) {
                console.error(ex);
            }
        } else {
            alert("No suitable submit handler found");
            console.error("No suitable submit handler found");
        }
    };

})();