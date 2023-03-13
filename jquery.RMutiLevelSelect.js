(function ($) {
    $.fn.RMultiLevelSelect = function (options) {
        var opts = $.extend({}, $.fn.RMultiLevelSelect.defaults, options);
        var $appendTo = $(opts.chartElement);
        $this = $(this);
        ShowTree(options.data, $appendTo, opts);
    };

    $.fn.RMultiLevelSelect.defaults = {
        chartElement: '#divOutlookTree',
        chartClass: "treeheight",
        wrap: true,
        multiple: false,
        selectAllText: "Select All",
        noneSelectedText: "Select"
    };
    function ShowTree(data, appendTo, opts) { 
        BulidTreeView(data, appendTo, opts);
        $("ul").each(function () {
            if ($.trim($(this).html()) == "") {
                $(this).remove();
            }
        });
        if ($("#hdn" + opts.id).val() != "" && $("#hdn" + opts.id).val() != "0") {
            var htmlres = $("div." + opts.id + "dd-container").find("ul").find("li[data-val=" + $("#hdn" + opts.id).val() + "]").find("a").attr("data-text");
            $("." + opts.id + "dd-container").find("span." + opts.id + "selected").removeAttr('style').html(htmlres);
        }
        $(opts.chartElement).addClass("locationddl_designfix");
    }
    function BulidTreeView(data, $appendTo, opts) {

        $appendTo.empty();
      var $mainul = $("<ul>").attr("id", opts.id).addClass("dropdown-menu");
        var returnedData = $.grep(data, function (element, index) {
            return element.parentValue <= 0;
        });
        var $mainulliin = $("<li>").addClass("mainelevel");
        var $mainulliinput = $("<input>").addClass(opts.id + "resourceMagicBox form-control").attr({ "placeholder": "Search..", "type": "text", "autocomplete": "off" });
        $mainulliinput.keyup(function () {
            $(this).parent("ul").find("span.noresult").css("display", "none");
            var searchtext = $(this).val();
            searchtext = String(searchtext.toUpperCase());
            $mainul.find("ol li").each(function () {
              
                if (String($(this).find("a.data-item").attr("data-text")).toUpperCase().includes(searchtext)) {
                    $(this).css("display", "");
                    if ($(this).find("ul.child").length > 0) {

                        $(this).closest("ul.child").closest("li.parentli").css("display", "");
                    }
                }
                else {
                    $(this).css("display", "none");
                }

            });
            $mainul.find("ol li").each(function () {
                if ($(this).find("ul.child").length > 0) {
                   
                    $(this).find("ul.child").each(function () {
                        $(this).find("a.data-item").each(function () {
                            if (String($(this).attr("data-text")).toUpperCase().includes(searchtext)) {
                                $(this).closest("li").parent().parent().css("display", "");
                                $(this).closest("li").parent().parent().parent().parent().css("display", "");
                                $(this).closest("ul li.parentli").closest("ul li.parentli ul li").css("display", "");

                                $(this).closest("li").css("display", "");

                            }
                        });
                    });
                }
            });
            if ($mainul.find("ol li:visible:not(.norecord)").length == 0) {
                $mainul.find("ol li.norecord").show();
                $mainul.find("ol li.norecord").css("height", "36px");
            }
            else {
                $mainul.find("ol li.norecord").hide();
                $mainul.find("ol li.norecord").height($mainul.find("ol").height());
            }

        });
        $mainulliin.append($mainulliinput);
        $mainul.append($mainulliin);
        if (opts.multiple) {
            var $mainulliselectall = $("<li>").addClass("p-1");
            var $mainulliinputs = $("<input>").addClass("float-left m-1 mr-2 multilevelall").attr({ "type": "checkbox", "value": "" });
            $mainulliinputs.click(function (e) {
                if ($(e.target).prop("checked")) {
                    $appendTo.find("input:checkbox:not(.multilevelall)").prop("checked", true);
                    $appendTo.find("input:checkbox:not(.multilevelall)").attr("checked", "checked");
                }
                else {
                    $appendTo.find("input:checkbox:not(.multilevelall)").prop("checked", false);
                    $appendTo.find("input:checkbox:not(.multilevelall)").removeAttr("checked");
                }
                GetCheckedValue(opts);
            });
            $mainulliselectall.append($mainulliinputs).append('<small class="d-block">' + opts.selectAllText + '</small>');
            $mainul.append($mainulliselectall);
        }
        var $mainulliOl = $("<li>");
        var $mainolList = $("<ol>").addClass("scrollbar");
        var $mainlinorecord = $("<li>").addClass("parentli norecord text-center text-danger align-middle p-2").height($mainolList.height()).html("<span>" + "NoRecordfound" + "</span>").hide();
        $mainolList.append($mainlinorecord);
        $.each(returnedData, function (index, val) {
            if (val.parentValue <= 0) {
                var $mainli = $("<li>").attr("data-val", val.value).addClass("parentli");
                var $mainlianc = $("<a>").addClass("dropdown-item float-left " + opts.id + "dd-option data-item").attr("data-text", val.text);
                if (val.secondAttribute == 0) {
                    $mainlianc.addClass("disabled");
                }
                $mainlianc.click(function (e) {
                    if (!$(e.target).is(":checkbox")) {
                        $("span." + opts.id + "selected").html($(this).attr("data-text"));
                        $("a." + opts.id + "dd-selected").find("label.dd-option-count").remove();
                        $("div." + opts.id + "dd-options").toggleClass("display_block");
                        if ($("div." + opts.id + "dd-options").hasClass("display_block") && (typeof (opts.open) == "function")) {
                            opts.open.call(this);
                        }
                        $("#" + opts.id).val($(this).find("input[type='hidden']").val()).trigger('change');
                        $("#hdn" + opts.id).val($(this).find("input[type='hidden']").val());
                        if (typeof (opts.close) == "function") {
                            opts.close.call(this);
                        }
                        $("div." + opts.id + "dd-container").closest(".card").find('a.tab-Search-btn').show();
                    }
                    $("div." + opts.id + "dd-container").find("div.btn").removeClass("is-invalid");
                });
                var getTotal = $.grep(data, function (element, index) {
                    return element.parentValue == val.value;
                });
                if (opts.multiple) {
                    var chkbox = $("<input>").attr({ "type": "checkbox", "value": val.value }).addClass("float-left mt-1 multilevel");
                    $mainlianc.click(function (e) {
                        if ($(e.target).prop("checked")) {
                            $(e.target).attr("checked", "checked");
                            var ctrl = $(this).closest("li").find("ul");
                            if (ctrl.length > 0) {
                                ctrl.find("input:checkbox").prop("checked", true);
                                ctrl.find("input:checkbox").attr("checked", "checked");
                            }
                        }
                        else {
                            $(e.target).removeAttr("checked");
                                ctrl = $(this).closest("li").find("ul");
                            if (ctrl.length > 0) {
                                ctrl.find("input:checkbox").prop("checked", false);
                                ctrl.find("input:checkbox").removeAttr("checked");
                            }
                        }
                        GetCheckedValue(opts);
                    });
                    $mainlianc.append(chkbox);
                }
                if (opts.multiple) {
                    $mainlianc.append('<span class="float-left pl-2 textvalue">' + val.text + '</span><label>' + getTotal.length + '</label><input class="' + opts.id + 'dd-option-value" value="' + val.value + '" type="hidden">');
                }
                else {
                    $mainlianc.append('<span class="float-left textvalue">' + val.text + '</span><label>' + getTotal.length + '</label><input class="' + opts.id + 'dd-option-value" value="' + val.value + '" type="hidden">');
                }
                debugger;
                $mainli.append($mainlianc);
               BuilChildlist(data, $mainli, opts, val.Value);               
                $mainolList.append($mainli);
            }
        });
        $mainulliOl.append($mainolList);
        var $divMain = $("<div>").addClass(opts.id + "dd-container dropdown custom-drop-down");
        var $divMainbutton = $("<div>").addClass("btn form-control").attr({ "type": "button", "data-toggle": "dropdown", "aria-expanded": "false" });
        var $divMainbuttonSpan = $("<span>").html(opts.noneSelectedText);
        $divMainbuttonSpan.addClass(opts.id + "selected float-left text-truncate w-80");
        $divMainbutton.append($divMainbuttonSpan);
        var $selectclearspan = $("<span>").addClass("float-right");
        $selectclearspan.append('<em class="dropdown-toggle float-left mr-2">');
        var $selectclearspanRefresh = $("<em>").addClass("fa fa-undo float-left py-1 text-danger").attr("title", "Clear");
        $selectclearspanRefresh.click(function (event) {
            event.stopImmediatePropagation();
            $("." + opts.id + "dd-container").find("span." + opts.id + "selected").removeAttr('style').html("Select");
            if (opts.multiple) {
                $("." + opts.id + "dd-container").find("input:checkbox").prop("checked", false);
                $("." + opts.id + "dd-container").find("input:checkbox").removeAttr("checked");
            }
            $("#hdn" + opts.id).val('');
            $mainulliinput.val('');
            $mainul.find("ol li").css("display", "");
            $mainul.find("ol li.norecord").hide();
        });
        $selectclearspan.append($selectclearspanRefresh);
        $divMainbutton.append($selectclearspan);
        $divMain.append($divMainbutton);
        $mainul.append($mainulliOl);

        $divMain.append($mainul);
        $appendTo.append($divMain);
    }

    function BuilChildlist(data, $appendTo, opts, parentId) {
        var $mainul = $("<ul>").addClass("child");
        var returnedData = $.grep(data, function (element, index) {
            return element.parentValue == parentId;
        });
        $.each(returnedData, function (index, val) {
            var $mainli = $("<li>").addClass("float-left").attr({ "data-val": val.value, "data-parentid": parentId });
            var $mainlianc = $("<a>").addClass("d-block bg-lights pl-0 " + opts.id + "dd-option data-item").attr("data-text", val.text);
            $mainlianc.click(function (e) {
                if (!$(e.target).is(":checkbox")) {
                    $("span." + opts.id + "selected").html($(this).attr("data-text"));
                    $("a." + opts.id + "dd-selected").find("label.dd-option-count").remove();
                    $("div." + opts.id + "dd-options").toggleClass("display_block");
                    if ($("div." + opts.id + "dd-options").hasClass("display_block") && (typeof (opts.open) == "function")) {
                        opts.open.call(this);
                    }
                    $("#" + opts.id).val($(this).find("input[type='hidden']").val()).trigger('change');
                    $("#hdn" + opts.id).val($(this).find("input[type='hidden']").val());
                    if (typeof (opts.close) == "function") {
                        opts.close.call(this);
                    }
                    $("div." + opts.id + "dd-container").closest('.card').find('a.tab-Search-btn').show();
                }
                $("div." + opts.id + "dd-container").find("div.btn").removeClass("is-invalid");
            });
            var getTotal = $.grep(data, function (element, index) {
                return element.parentValue == val.Value;
            });
            $mainlianc.append('<em class="fa fa-caret-right float-left"></em>');
            if (opts.multiple) {
                var chkbox = $("<input>").attr({ "type": "checkbox", "value": val.value }).addClass("float-left mt-1 ml-1 multilevel");
                $mainlianc.click(function (e) {
                    if ($(e.target).prop("checked")) {
                        $(e.target).attr("checked", "checked");
                        var ctrl = $(this).closest("li").find("ul");
                        if (ctrl.length > 0) {
                            ctrl.find("input:checkbox").prop("checked", true);
                            ctrl.find("input:checkbox").attr("checked", "checked");
                        }
                    }
                    else {
                        $(e.target).removeAttr("checked");
                            ctrl = $(this).closest("li").find("ul");
                        if (ctrl.length > 0) {
                            ctrl.find("input:checkbox").prop("checked", false);
                            ctrl.find("input:checkbox").removeAttr("checked");
                        }
                    }
                    GetCheckedValue(opts);
                });
                $mainlianc.append(chkbox);
            }
            $mainlianc.append('<div class="d-inline-block ml-2">' + val.text + '</div><label>' + getTotal.length + '</label><input class="' + opts.id + 'dd-option-value" value="' + val.value + '" type="hidden"/>');
            $mainli.append($mainlianc);
            BuilChildlist(data, $mainli, opts, val.value);           
            $mainul.append($mainli);
        });
        if (returnedData.length > 0) {
            $appendTo.append($mainul);
        }
    }
    function GetCheckedValue(opts) {
        var val = "";
        var text = "";
        $(opts.chartElement).find("input:checkbox:not(.multilevelall):checked").each(function () {
            if ($(this).val() > 0) {
                if (val.length > 0)
                    val += ",";

                if (text.length > 0)
                    text += ", ";

                val += $(this).val();
                text += $(this).closest("a").attr("data-text");
            }
        });
        $("#hdn" + opts.id).val(val);
        var total = $(opts.chartElement).find("input:checkbox:not(.multilevelall)").length;
        if (val.split(',').length > 2) {
            $("span." + opts.id + "selected").html(opts.selectedText.replace('#', val.split(',').length).replace('#', total));
        }
        else {
            $("span." + opts.id + "selected").html(text);
        }
        if (val.length == 0) {
            $("span." + opts.id + "selected").html(opts.noneSelectedText);
        }
    }
 
})(jQuery);