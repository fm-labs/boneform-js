(function() {

    if (typeof ($.fn.tinymce) === "undefined") {
        console.warn("TinyMCE is not loaded. Plugin skipped.");

        // fallback to Textarea control
        //Backbone.Form.controls.TinyMce = Backbone.Form.controls.HtmlEditor = Backbone.Form.controls.Textarea;
        //return;
    }

    Backbone.Form.controls.TinyMce = Backbone.Form.controls.HtmlEditor = Backbone.Form.controls.Textarea.extend({

        initialize: function(options) {
            Backbone.Form.Control.prototype.initialize.call(this, options);

            //@see http://amsul.ca/pickadate.js/date
            this.editorOpts = _.extend({
                plugins: ['image link lists code table media paste wordcount importcss wordcount'],
                height: 300,
                elementpath: true, // This option allows you to disable the element path within the status bar at the bottom of the editor.
                menubar: false,
                menu: [],
                toolbar: [
                    'formatselect | bold italic underline strikethrough | ' +
                    'alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | ' +
                    'blockquote | code',

                    'undo redo | cut copy paste | link image media | table'
                ],
                //convert_urls: false, // default TRUE
                //relative_urls: false, // default TRUE
                //remove_script_host: false, // default TRUE
                //document_base_url: '/',
            }, this.editorOpts, options.editor);
        },

        render: function() {
            Backbone.Form.Control.prototype.render.call(this);

            console.log("render htmleditor");

            this.$el.tinymce(this.editorOpts);

            return this;
        },

        /*
        getValue: function() {
            var format = this.editorOpts.formatSubmit || this.defaultFormat;
            return this.$el.pickadate('editor').get('select', format);
        },

        setValue: function(val) {
            var format = this.editorOpts.formatSubmit || this.defaultFormat;
            this.$el.pickadate('editor').set('select', val, { format: format });

            this.$el.attr('data-value', val);

            return this;
        }
        */
    });

})();
