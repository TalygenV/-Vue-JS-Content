﻿/**
 * .js [v4.4.0]
 *
 * http://js.com/license.txt
 */

// @see https://github.com/makeusabrew//issues/180
// @see https://github.com/makeusabrew//issues/186
(function (root, factory) {
    "use strict";
    if (typeof define === "function" && define.amd) {
      
        define(["jquery"], factory);
    } else if (typeof exports === "object") {
      
        module.exports = factory(require("jquery"));
    } else {
      
        window.talygen = factory(window.jQuery);
    }

}(this, function init($) {
    "use strict";
   
    var templates = {
        dialog:
          "<div class=' modal  my-popups' tabindex='-1' role='dialog'>" +
            "<div class='modal-dialog'>" +
              "<div class='modal-content'>" +
                "<div class='modal-body p-0 notifybox'><div class='-body alert alert-warning p-3 mb-0'></div></div>" +
              "</div>" +
            "</div>" +
          "</div>",
        header:
          "<div class='modal-header modal-confirm-header'>" +
            "<h4 class='modal-title'></h4>" +
          "</div>",
        footer:
          "<div class='modal-footer my-0 py-2 modal-confirm-footer'></div>",
        closeButton:
          "<button type='button' class='-close-button close' data-dismiss='modal' aria-hidden='true'>&times;</button>",
        form:
          "<form class='-form'></form>",
        inputs: {
            text:
              "<input class='-input -input-text form-control' autocomplete=off type=text />",
            textarea:
              "<textarea class='-input -input-textarea form-control'></textarea>",
            email:
              "<input class='-input -input-email form-control' autocomplete='off' type='email' />",
            select:
              "<select class='-input -input-select form-control'></select>",
            checkbox:
              "<div class='checkbox'><label><input class='-input -input-checkbox' type='checkbox' /></label></div>",
            date:
              "<input class='-input -input-date form-control' autocomplete=off type='date' />",
            time:
              "<input class='-input -input-time form-control' autocomplete=off type='time' />",
            number:
              "<input class='-input -input-number form-control' autocomplete=off type='number' />",
            password:
              "<input class='-input -input-password form-control' autocomplete='off' type='password' />"
        }
    };

    var defaults = {
       
        locale: 'en',
       
       
        animate: true,
       
       
        closeButton: true,
  
        show: true,
       
        container: "body"
    };

   
    var exports = {};

    /**
     * @private
     */
    function _t(key) {
        var locale = locales[""];        
        return locale ? locale[key] : locales.en[key];
    }

    function processCallback(e, dialog, callback) {
        e.stopPropagation();
        e.preventDefault();

      
        var preserveDialog = $.isFunction(callback) && callback.call(dialog, e) === false;

       
        if (!preserveDialog) {
            dialog.modal("hide");
        }
    }

    function getKeyLength(obj) {
       let t = 0;      
        for (let k in obj) {
            if (obj.hasOwnProperty(k)) {
                t++;
            }
        }
        return t;
    }

    function each(collection, iterator) {
        var index = 0;
        $.each(collection, function (key, value) {
            iterator(key, value, index++);
        });
    }

    function sanitize(options) {
        var buttons;
        var total;
        if (typeof options !== "object") {
            throw new Error("Please supply an object of options");
        }else
        if (typeof options == "object" && !options.message) {
            throw new Error("Please specify a message");
        }
        options = $.extend({}, defaults, options);
        if (!options.buttons) {
            options.buttons = {};
        }
        buttons = options.buttons;
        total = getKeyLength(buttons);
        each(buttons, function (key, button, index) {
            if($.isFunction(button)) {               
                button = buttons[key] = {
                    callback: button
                };
            }else if($.type(button) !== "object") {
                throw new Error("button with key " + key + " must be an object");
            }else if (!button.label) {                
                button.label = key;
            }else if (!button.className) {
                if (total <= 2 && index === total - 1) {                    
                    button.className = "btn-danger formbtn widthhalf";
                } else {
                    button.className = "btn-success formbtn widthhalf";
                }
                if(key =="ok") {
                    button.className = "btn-success formbtn widthhalf";
                }
            }
        });
        return options;
    }

    
    function mapArguments(args, properties) {
        var argn = args.length;
        var options = {};

        if (argn < 1 || argn > 2) {
            throw new Error("Invalid argument length");
        }

        if (argn === 2 || typeof args[0] === "string") {
            options[properties[0]] = args[0];
            options[properties[1]] = args[1];
        } else {
            options = args[0];
        }

        return options;
    }

    
    function mergeArguments(defaults, args, properties) {
        return $.extend(
        true,
        {},defaults,
         mapArguments(
            args,
            properties
          )
        );
    }

   
    function mergeDialogOptions(className, labels, properties, args) {
        
        var baseOptions = {
            className: "-" + className,
            buttons: createLabels.apply(null, labels)
        };

     
        return validateButtons(
     
          mergeArguments(
            baseOptions,
            args,
           
            properties
          ),
          labels
        );
    }


    function createLabels() {
        var buttons = {};

        for (var i = 0, j = arguments.length; i < j; i++) {
            var argument = arguments[i];
            var key = argument.toLowerCase();
            var value = argument.toUpperCase();

            buttons[key] = {
                label: _t(value)
            };
        }

        return buttons;
    }

    function validateButtons(options, buttons) {
        var allowedButtons = {};
        each(buttons, function (key, value) {
            allowedButtons[value] = true;
        });

        each(options.buttons, function (key) {
            if (allowedButtons[key] === undefined) {
                throw new Error("button key " + key + " is not allowed (options are " + buttons.join("\n") + ")");
            }
        });

        return options;
    }

    exports.alert = function () {
        var options;

        options = mergeDialogOptions("alert", ["ok"], ["message", "callback"], arguments);

        if (options.callback && !$.isFunction(options.callback)) {
            throw new Error("alert requires callback property to be a function when provided");
        }

       
        options.buttons.ok.callback = options.onEscape = function () {
            if ($.isFunction(options.callback)) {
                return options.callback.call(this);
            }
            return true;
        };

        return exports.dialog(options);
    };

    exports.confirm = function () {
        var options;

        options = mergeDialogOptions("confirm", ["confirm", "cancel"], ["message", "callback"], arguments);

       
        options.buttons.cancel.callback = options.onEscape = function () {
            return options.callback.call(this, false);
        };

        options.buttons.confirm.callback = function () {
            return options.callback.call(this, true);
        };

      
        if (!$.isFunction(options.callback)) {
            throw new Error("confirm requires a callback");
        }

        return exports.dialog(options);
    };

    exports.prompt = function () {
        var options;
        var defaults;
        var dialog;
        var form;
        var input;
        var shouldShow;
        var inputOptions;

       
        form = $(templates.form);

        
        defaults = {
            className: "-prompt",
            buttons: createLabels("cancel", "confirm"),
            value: "",
            inputType: "text"
        };

        options = validateButtons(
          mergeArguments(defaults, arguments, ["title", "callback"]),
          ["cancel", "confirm"]
        );

    
        shouldShow = (options.show === undefined) ? true : options.show;

        options.message = form;

        options.buttons.cancel.callback = options.onEscape = function () {
            return options.callback.call(this, null);
        };

        options.buttons.confirm.callback = function () {
            var value;

            switch (options.inputType) {
                case "text":
                case "textarea":
                case "email":
                case "select":
                case "date":
                case "time":
                case "number":
                case "password":
                    value = input.val();
                    break;

                case "checkbox":
                    var checkedItems = input.find("input:checked");

                  
                    value = [];

                    each(checkedItems, function (_, item) {
                        value.push($(item).val());
                    });
                    break;
            }

            return options.callback.call(this, value);
        };

        options.show = false;

   
        if (!options.title) {
            throw new Error("prompt requires a title");
        }

        if (!$.isFunction(options.callback)) {
            throw new Error("prompt requires a callback");
        }

        if (!templates.inputs[options.inputType]) {
            throw new Error("invalid prompt type");
        }

        
        input = $(templates.inputs[options.inputType]);

        switch (options.inputType) {
            case "text":
            case "textarea":
            case "email":
            case "date":
            case "time":
            case "number":
            case "password":
                input.val(options.value);
                break;

            case "select":
                var groups = {};
                inputOptions = options.inputOptions || [];

                if (!$.isArray(inputOptions)) {
                    throw new Error("Please pass an array of input options");
                }

                if (!inputOptions.length) {
                    throw new Error("prompt with select requires options");
                }

                each(inputOptions, function (_, option) {

                    
                    var elem = input;

                    if (option.value === undefined || option.text === undefined) {
                        throw new Error("given options in wrong format");
                    }

                

                    if (option.group) {
                      
                        if (!groups[option.group]) {
                            groups[option.group] = $("<optgroup/>").attr("label", option.group);
                        }

                        elem = groups[option.group];
                    }

                    elem.append("<option value='" + option.value + "'>" + option.text + "</option>");
                });

                each(groups, function (_, group) {
                    input.append(group);
                });

              
                input.val(options.value);
                break;

            case "checkbox":
                var values = $.isArray(options.value) ? options.value : [options.value];
                inputOptions = options.inputOptions || [];

                if (!inputOptions.length) {
                    throw new Error("prompt with checkbox requires options");
                }

                if (!inputOptions[0].value || !inputOptions[0].text) {
                    throw new Error("given options in wrong format");
                }

             
                input = $("<div/>");

                each(inputOptions, function (_, option) {
                    var checkbox = $(templates.inputs[options.inputType]);

                    checkbox.find("input").attr("value", option.value);
                    checkbox.find("label").append(option.text);

                    
                    each(values, function (_, value) {
                        if (value === option.value) {
                            checkbox.find("input").prop("checked", true);
                        }
                    });

                    input.append(checkbox);
                });
                break;
        }

     
        if (options.placeholder) {
            input.attr("placeholder", options.placeholder);
        }

        if (options.pattern) {
            input.attr("pattern", options.pattern);
        }

        if (options.maxlength) {
            input.attr("maxlength", options.maxlength);
        }

    
        form.append(input);

        form.on("submit", function (e) {
            e.preventDefault();
        
            e.stopPropagation();

            dialog.find(".btn-primary").click();
        });

        dialog = exports.dialog(options);

       
        dialog.off("shown.bs.modal");


        dialog.on("shown.bs.modal", function () {
         
            input.focus();
        });

        if (shouldShow === true) {
            dialog.modal("show");
        }

        return dialog;
    };

    exports.dialog = function (options) {
        options = sanitize(options);
        var dialog = $(templates.dialog);
        var innerDialog = dialog.find(".modal-dialog");
        var body = dialog.find(".modal-body");
        var buttons = options.buttons;
        var buttonStr = "";
        var callbacks = {
            onEscape: options.onEscape
        };

        if ($.fn.modal === undefined) {
            throw new Error(
              "$.fn.modal is not defined; please double check you have included " +
              "the Bootstrap JavaScript library. See http://getbootstrap.com/javascript/ " +
              "for more details."
            );
        }

        each(buttons, function (key, button) {
          var fontClass = 'fa-check';
            if (key == 'cancel') {
                fontClass = "fa-times";
            }
            buttonStr += "<button data-bb-handler='" + key + "' type='button' title=" + button.label + " class='btn " + button.className + "'><em class='fa " + fontClass + " mr-1'></em>" + button.label + "</button>";
            callbacks[key] = button.callback;
        });

        body.find(".-body").html(options.message);

        if (options.animate === true) {
            dialog.addClass("fade");
        }

        if (options.className) {
            dialog.addClass(options.className);
        }

        if (options.size === "large") {
            innerDialog.addClass("modal-lg");
        } else if (options.size === "small") {
            innerDialog.addClass("modal-sm");
        }
        else {
            innerDialog.addClass("modal-me");
        }

        if (options.title) {
            body.before(templates.header);
        }

        if (options.closeButton) {
            var closeButton = $(templates.closeButton);

            if (options.title) {
                dialog.find(".modal-header").prepend(closeButton);
            } else {
                closeButton.css("margin-top", "-10px").prependTo(body);
            }
        }

        if (options.title) {
            dialog.find(".modal-title").html(options.title);
        }

        if (buttonStr.length) {
            body.after(templates.footer);
            dialog.find(".modal-footer").html(buttonStr);
        }


      

        dialog.on("hidden.bs.modal", function (e) {
           
            if (e.target === this) {
                dialog.remove();
                $("body").removeClass("modal-open pr-17");
            }
        });

     
        dialog.on("shown.bs.modal", function () {
            dialog.find(".btn-primary:first").focus();
        });

        

        if (options.backdrop !== "static") {
        
            dialog.on("click.dismiss.bs.modal", function (e) {
               
                if (dialog.children(".modal-backdrop").length) {
                    e.currentTarget = dialog.children(".modal-backdrop").get(0);
                }

                if (e.target !== e.currentTarget) {
                    return;
                }

                dialog.trigger("escape.close.bb");
            });
        }

        dialog.on("escape.close.bb", function (e) {
            if (callbacks.onEscape) {
                processCallback(e, dialog, callbacks.onEscape);
            }
        });

     

        dialog.on("click", ".modal-footer button", function (e) {
            var callbackKey = $(this).data("bb-handler");

            processCallback(e, dialog, callbacks[callbackKey]);
        });

        dialog.on("click", ".-close-button", function (e) {
        
            processCallback(e, dialog, callbacks.onEscape);
        });

        dialog.on("keyup", function (e) {
            if (e.which === 27) {
                dialog.trigger("escape.close.bb");
            }
        });

     

        $(options.container).append(dialog);

        dialog.modal({
            backdrop: options.backdrop ? "static" : false,
            keyboard: false,
            show: false
        });

        if (options.show) {
            dialog.modal("show");
        }
        if (options.hide && options.time > 0) {
            setTimeout(function () {
                dialog.modal('hide');
            }, options.time);
        }

        
        return dialog;

    };

    exports.setDefaults = function () {
        var values = {};

        if (arguments.length === 2) {
           
            values[arguments[0]] = arguments[1];
        } else {
        
            values = arguments[0];
        }

        $.extend(defaults, values);
    };

    exports.hideAll = function () {
        $(".").modal("hide");

        return exports;
    };


  
    var locales = {
        bg_BG: {
            OK: "ÐžÐº",
            CANCEL: "ÐžÑ‚ÐºÐ°Ð·",
            CONFIRM: "ÐŸÐ¾Ñ‚Ð²ÑŠÑ€Ð¶Ð´Ð°Ð²Ð°Ð¼"
        },
        br: {
            OK: "OK",
            CANCEL: "Cancelar",
            CONFIRM: "Sim"
        },
        cs: {
            OK: "OK",
            CANCEL: "ZruÅ¡it",
            CONFIRM: "Potvrdit"
        },
        da: {
            OK: "OK",
            CANCEL: "Annuller",
            CONFIRM: "Accepter"
        },
        de: {
            OK: "OK",
            CANCEL: "Abbrechen",
            CONFIRM: "Akzeptieren"
        },
        el: {
            OK: "Î•Î½Ï„Î¬Î¾ÎµÎ¹",
            CANCEL: "Î‘ÎºÏÏÏ‰ÏƒÎ·",
            CONFIRM: "Î•Ï€Î¹Î²ÎµÎ²Î±Î¯Ï‰ÏƒÎ·"
        },
        en: {
            OK: "OK",
            CANCEL: "Cancel",
            CONFIRM: "OK"
        },
        es: {
            OK: "OK",
            CANCEL: "Cancelar",
            CONFIRM: "Aceptar"
        },
        et: {
            OK: "OK",
            CANCEL: "Katkesta",
            CONFIRM: "OK"
        },
        fa: {
            OK: "Ù‚Ø¨ÙˆÙ„",
            CANCEL: "Ù„ØºÙˆ",
            CONFIRM: "ØªØ§ÛŒÛŒØ¯"
        },
        fi: {
            OK: "OK",
            CANCEL: "Peruuta",
            CONFIRM: "OK"
        },
        fr: {
            OK: "OK",
            CANCEL: "Annuler",
            CONFIRM: "D'accord"
        },
        he: {
            OK: "××™×©×•×¨",
            CANCEL: "×‘×™×˜×•×œ",
            CONFIRM: "××™×©×•×¨"
        },
        hu: {
            OK: "OK",
            CANCEL: "MÃ©gsem",
            CONFIRM: "MegerÅ‘sÃ­t"
        },
        hr: {
            OK: "OK",
            CANCEL: "Odustani",
            CONFIRM: "Potvrdi"
        },
        id: {
            OK: "OK",
            CANCEL: "Batal",
            CONFIRM: "OK"
        },
        it: {
            OK: "OK",
            CANCEL: "Annulla",
            CONFIRM: "Conferma"
        },
        ja: {
            OK: "OK",
            CANCEL: "ã‚­ãƒ£ãƒ³ã‚»ãƒ«",
            CONFIRM: "ç¢ºèª"
        },
        lt: {
            OK: "Gerai",
            CANCEL: "AtÅ¡aukti",
            CONFIRM: "Patvirtinti"
        },
        lv: {
            OK: "Labi",
            CANCEL: "Atcelt",
            CONFIRM: "ApstiprinÄt"
        },
        nl: {
            OK: "OK",
            CANCEL: "Annuleren",
            CONFIRM: "Accepteren"
        },
        no: {
            OK: "OK",
            CANCEL: "Avbryt",
            CONFIRM: "OK"
        },
        pl: {
            OK: "OK",
            CANCEL: "Anuluj",
            CONFIRM: "PotwierdÅº"
        },
        pt: {
            OK: "OK",
            CANCEL: "Cancelar",
            CONFIRM: "Confirmar"
        },
        ru: {
            OK: "OK",
            CANCEL: "ÐžÑ‚Ð¼ÐµÐ½Ð°",
            CONFIRM: "ÐŸÑ€Ð¸Ð¼ÐµÐ½Ð¸Ñ‚ÑŒ"
        },
        sq: {
            OK: "OK",
            CANCEL: "Anulo",
            CONFIRM: "Prano"
        },
        sv: {
            OK: "OK",
            CANCEL: "Avbryt",
            CONFIRM: "OK"
        },
        th: {
            OK: "à¸•à¸à¸¥à¸‡",
            CANCEL: "à¸¢à¸à¹€à¸¥à¸´à¸",
            CONFIRM: "à¸¢à¸·à¸™à¸¢à¸±à¸™"
        },
        tr: {
            OK: "Tamam",
            CANCEL: "Ä°ptal",
            CONFIRM: "Onayla"
        },
        zh_CN: {
            OK: "OK",
            CANCEL: "å–æ¶ˆ",
            CONFIRM: "ç¡®è®¤"
        },
        zh_TW: {
            OK: "OK",
            CANCEL: "å–æ¶ˆ",
            CONFIRM: "ç¢ºèª"
        }
    };

    exports.addLocale = function (name, values) {
        $.each(["OK", "CANCEL", "CONFIRM"], function (_, v) {
            if (!values[v]) {
                throw new Error("Please supply a translation for '" + v + "'");
            }
        });

        locales[name] = {
            OK: values.OK,
            CANCEL: values.CANCEL,
            CONFIRM: values.CONFIRM
        };

        return exports;
    };

    exports.removeLocale = function (name) {
        delete locales[name];

        return exports;
    };

    exports.setLocale = function (name) {
        return exports.setDefaults("locale", name);
    };

    exports.init = function (_$) {
        return init(_$ || $);
    };

    return exports;
}));
