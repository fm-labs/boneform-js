Backbone.Form.Control.prototype.className = 'form-control';
Backbone.Form.controls.Checkbox.prototype.className = '';
Backbone.Form.controls.Button.prototype.className = 'btn btn-default';

Backbone.Form.Field.prototype.validClass = 'has-success';
//Backbone.Form.Field.prototype.warningClass = 'has-warning';
Backbone.Form.Field.prototype.errorClass = 'has-error';

Backbone.Form.Field.prototype.template = _.template('\
        <div class="form-group">\
            <label class="col-xs-4 col-sm-5 control-label" for="<%= controlId %>">\
                <span><%= label %></span>\
                <button type="button" class="btn btn-link" data-toggle="tooltip" title="<%= help %>"><i class="fa fa-question-circle" aria-hidden="true"></i></button>\
            </label>\
            <div class="col-xs-8 col-sm-7">\
                <span data-control>&nbsp;</span>\
                <p class="help-block" data-error></p>\
            </div>\
        </div>\
    ');