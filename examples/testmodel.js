var TestModel = Backbone.Model.extend({

    urlRoot: false,
    url: false,

    defaults: {
        id: null,
        int: 42,
        title: "Wohooo",
        email: "magic.mike@example.org",
        publish_start_date: '2018-02-02'
        //format: "xml",
        //category_id: 2
    },


    schema: {
        id: {
            type: 'Hidden',
            required: false,
            rules: {
                numeric: {},
            }
        },
        int: {
            type: 'Number',
            required: true,
            label: "Int Number",
            help: "An integer value between 0 and 100",
            rules: {
                "range": {min: 0, max: 100}
            }
        },
        title: {
            type: 'Text',
            required: true,
            rules: {
            }
        },
        email: {
            type: 'Text',
            required: false,
            rules: {
                "notempty": {},
                "email": {}
            }
        },
        body: {
            type: 'Textarea',
            required: true,
            controlAttrs: {
                rows: 7
            }
        },
        html: {
            type: 'HtmlEditor',
            required: true,
            controlAttrs: {
            }
        },
        is_published: {
            type: 'Checkbox'
        },
        parent_id: {
            type: 'Select',
            required: true,
            control: {
                placeholder: "Ahoii!",
                options: {
                    1: "Parent 1",
                    2: "Parent 2"
                }
            }
        },
        category_id: {
            type: 'ChosenSelect',
            required: true,
            control: {
                placeholder: false,
                options: {
                    1: "Blog",
                    2: "News"
                }
            }
        },
        format: {
            type: 'ChosenSelect',
            control: {
                placeholder: "Hello",
                options: function() {
                    return {
                        "json": "JSON Format",
                        "xml": "XML Format"
                    }
                }
            },
            rules: {
                "notempty": {}
            }
        },
        publish_start_date: {
            type: 'DatePicker'
        },
        publish_end_date: {
            type: 'Date'
        }
    },

    save: false,

    validate: function() {
        if (this.get('format') !== 'xml') {
            return { 'format': 'Invalid format' }
        }
    }
});