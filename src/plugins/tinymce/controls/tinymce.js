(function() {

    if (typeof ($.fn.tinymce) === "undefined") {
        console.warn("TinyMCE is not loaded. Plugin skipped.");

        // fallback to Textarea control
        Backbone.Form.controls.TinyMce = Backbone.Form.controls.Html = Backbone.Form.controls.Textarea;
        return;
    }

    Backbone.Form.controls.TinyMce = Backbone.Form.controls.Html = Backbone.Form.controls.Textarea.extend({

        //lazyLoad: true,

        initialize: function(options) {
            Backbone.Form.Control.prototype.initialize.call(this, options);

            //@see http://amsul.ca/pickadate.js/date
            this.editorOpts = _.extend({
                selector: this,
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
                ]
                //convert_urls: false, // default TRUE
                //relative_urls: false, // default TRUE
                //remove_script_host: false, // default TRUE
                //document_base_url: '/',
            }, this.editorOpts, options.editor);

            this.lazyLoad = options.lazyLoad || this.lazyLoad;

            var self = this;
            // if lazy-loading is not activated, initialize tinymce editor after the form has rendered
            if (!this.lazyLoad) {
                this.listenTo(this.form, 'afterRender', function() {
                    //console.log("[tinymce] afterRender");
                    var editorOpts = _.extend({selector: self}, self.editorOpts);
                    self.$el.tinymce(editorOpts);

                });
            // if lazy-loading is activated, show button and initialize tinymce editor on button-click
            } else {
                this.listenTo(this.form, 'afterRender', function() {
                    self.$el.parent()
                        .append($('<button>', {type: 'button', 'class': 'btn btn-default'}).html('Open in Editor'))
                        .on('click', function(ev) {
                            //console.log("[tinymce] open editor");
                            var editorOpts = _.extend({selector: self}, self.editorOpts);
                            self.$el.tinymce(editorOpts);

                            $(ev.target).hide(); // hide the button

                            ev.preventDefault();
                            return false;
                        });
                });
            }

            this.$el.html(this.data); // value has to be set before initializing tinymce
        },

        render: function() {
            Backbone.Form.Control.prototype.render.call(this);

            return this;
        },

        setValue: function(val) {

            //console.warn("[tinymce] !! setValue not supported !!", val);
            //this.$el.html(val);
            return this;
        },

        getValue: function() {
            return this.$el.val();
        }
    });

})();
