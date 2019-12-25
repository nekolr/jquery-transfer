/**
 * jQuery transfer
 */
;(function($) {

    let Transfer = function(element, options) {
        this.$element = element;
        // default options
        this.defaults = {
            // data item name
            itemName: "item",
            // group data item name
            groupItemName: "groupItem",
            // group data array name
            groupArrayName: "groupArray",
            // data value name
            valueName: "value",
            // tab text
            tabNameText: "items",
            // right tab text
            rightTabNameText: "selected items",
            // search placeholder text
            searchPlaceholderText: "search",
            // total text
            totalText: "total",
            // items data array
            dataArray: [],
            // group data array
            groupDataArray: []
        };
        // merge options
        this.settings = $.extend(this.defaults, options);

        // tab text
        this.tabNameText = this.settings.tabNameText;
        // right tab text
        this.rightTabNameText = this.settings.rightTabNameText;
        // search placeholder text
        this.searchPlaceholderText = this.settings.searchPlaceholderText;
        // default total number text template
        this.default_total_num_text_template = this.settings.totalText + ": {total_num}";
        // default zero item
        this.default_right_item_total_num_text = get_total_num_text(this.default_total_num_text_template, 0);
        // item total number
        this.item_total_num = this.settings.dataArray.length;
        // group item total number
        this.group_item_total_num = get_group_items_num(this.settings.groupDataArray, this.settings.groupArrayName);
        // use group
        this.isGroup = this.group_item_total_num > 0;
        // inner data
        this._data = new InnerMap();

        // Id
        this.id = (getId())();
        // id selector for the item searcher
        this.itemSearcherId = "#listSearch_" + this.id;
        // id selector for the group item searcher
        this.groupItemSearcherId = "#groupListSearch_" + this.id;
        // id selector for the right searcher
        this.selectedItemSearcherId = "#selectedListSearch_" + this.id;

        // class selector for the transfer-double-list-ul
        this.transferDoubleListUlClass = ".transfer-double-list-ul-" + this.id;
        // class selector for the transfer-double-list-li
        this.transferDoubleListLiClass = ".transfer-double-list-li-" + this.id;
        // class selector for the left checkbox item
        this.checkboxItemClass = ".checkbox-item-" + this.id;
        // class selector for the left checkbox item label
        this.checkboxItemLabelClass = ".checkbox-name-" + this.id;
        // class selector for the left item total number label
        this.totalNumLabelClass = ".total_num_" + this.id;
        // id selector for the left item select all
        this.leftItemSelectAllId = "#leftItemSelectAll_" + this.id;

        // class selector for the transfer-double-group-list-ul
        this.transferDoubleGroupListUlClass = ".transfer-double-group-list-ul-" + this.id;
        // class selector for the transfer-double-group-list-li
        this.transferDoubleGroupListLiClass = ".transfer-double-group-list-li-" + this.id;
        // class selector for the group select all
        this.groupSelectAllClass = ".group-select-all-" + this.id;
        // class selector fro the transfer-double-group-list-li-ul-li
        this.transferDoubleGroupListLiUlLiClass = ".transfer-double-group-list-li-ul-li-" + this.id;
        // class selector for the group-checkbox-item
        this.groupCheckboxItemClass = ".group-checkbox-item-" + this.id;
        // class selector for the group-checkbox-name
        this.groupCheckboxNameLabelClass = ".group-checkbox-name-" + this.id;
        // class selector for the left group item total number label
        this.groupTotalNumLabelClass = ".group_total_num_" + this.id;
        // id selector for the left group item select all
        this.groupItemSelectAllId = "#groupItemSelectAll_" + this.id;

        // class selector for the transfer-double-selected-list-ul
        this.transferDoubleSelectedListUlClass = ".transfer-double-selected-list-ul-" + this.id;
        // class selector for the transfer-double-selected-list-li
        this.transferDoubleSelectedListLiClass = ".transfer-double-selected-list-li-" + this.id;
        // class selector for the right select checkbox item
        this.checkboxSelectedItemClass = ".checkbox-selected-item-" + this.id;
        // id selector for the right item select all
        this.rightItemSelectAllId = "#rightItemSelectAll_" + this.id;
        // class selector for the
        this.selectedTotalNumLabelClass = ".selected_total_num_" + this.id;
        // id selector for the add button
        this.addSelectedButtonId = "#add_selected_" + this.id;
        // id selector for the delete button
        this.deleteSelectedButtonId = "#delete_selected_" + this.id;
    }

    $.fn.transfer = function(options) {
        // new Transfer
        let transfer = new Transfer(this, options);
        // init
        transfer.init();

        return {
            // get selected items
            getSelectedItems: function() {
                return get_selected_items(transfer)
            }
        }
    }

    /**
     * init
     */
    Transfer.prototype.init = function() {
        // generate transfer
        this.$element.append(this.generate_transfer());

        if (this.isGroup) {
            // fill group data
            this.fill_group_data();

            // left group checkbox item click handler
            this.left_group_checkbox_item_click_handler();
            // group select all handler
            this.group_select_all_handler();
            // group item select all handler
            this.group_item_select_all_handler();
            // left group items search handler
            this.left_group_items_search_handler();

        } else {
            // fill data
            this.fill_data();

            // left checkbox item click handler
            this.left_checkbox_item_click_handler();
            // left item select all handler
            this.left_item_select_all_handler();
            // left items search handler
            this.left_items_search_handler();
        }

        // right checkbox item click handler
        this.right_checkbox_item_click_handler();
        // move the pre-selection items to the right handler
        this.move_pre_selection_items_handler();
        // move the selected item to the left handler
        this.move_selected_items_handler();
        // right items search handler
        this.right_items_search_handler();
        // right item select all handler
        this.right_item_select_all_handler();
    }

    /**
     * generate transfer
     */
    Transfer.prototype.generate_transfer = function() {
        let html =
            '<div class="transfer-double" id="transfer_double_' + this.id + '">'
            + '<div class="transfer-double-header"></div>'
            + '<div class="transfer-double-content clearfix">'
            + this.generate_left_part()
            + '<div class="transfer-double-content-middle">'
            + '<div class="btn-select-arrow" id="add_selected_' + this.id + '"><i class="iconfont icon-forward"></i></div>'
            + '<div class="btn-select-arrow" id="delete_selected_' + this.id + '"><i class="iconfont icon-back"></i></div>'
            + '</div>'
            + this.generate_right_part()
            + '</div>'
            + '<div class="transfer-double-footer"></div>'
            + '</div>';
        return html;
    }

    /**
     * generate transfer's left part
     */
    Transfer.prototype.generate_left_part = function() {
        return '<div class="transfer-double-content-left">'
        + '<div class="transfer-double-content-param">'
        + '<div class="param-item">' + (this.isGroup ? this.tabNameText : this.tabNameText) + '</div>'
        + '</div>'
        + (this.isGroup ? this.generate_group_items_container() : this.generate_items_container())
        + '</div>'
    }

    /**
     * generate group items container
     */
    Transfer.prototype.generate_group_items_container = function() {
        return '<div class="transfer-double-list transfer-double-list-' + this.id + '">'
        + '<div class="transfer-double-list-header">'
        + '<div class="transfer-double-list-search">'
        + '<input class="transfer-double-list-search-input" type="text" id="groupListSearch_' + this.id + '" placeholder="' + this.searchPlaceholderText + '" value="" />'
        + '</div>'
        + '</div>'
        + '<div class="transfer-double-list-content">'
        + '<div class="transfer-double-list-main">'
        + '<ul class="transfer-double-group-list-ul transfer-double-group-list-ul-' + this.id + '">'
        + '</ul>'
        + '</div>'
        + '</div>'
        + '<div class="transfer-double-list-footer">'
        + '<div class="checkbox-group">'
        + '<input type="checkbox" class="checkbox-normal" id="groupItemSelectAll_' + this.id + '"><label for="groupItemSelectAll_' + this.id + '" class="group_total_num_' + this.id + '"></label>'
        + '</div>'
        + '</div>'
        + '</div>'
    }

    /**
     * generate items container
     */
    Transfer.prototype.generate_items_container = function() {
        return '<div class="transfer-double-list transfer-double-list-' + this.id + '">'
        + '<div class="transfer-double-list-header">'
        + '<div class="transfer-double-list-search">'
        + '<input class="transfer-double-list-search-input" type="text" id="listSearch_' + this.id + '" placeholder="' + this.searchPlaceholderText + '" value="" />'
        + '</div>'
        + '</div>'
        + '<div class="transfer-double-list-content">'
        + '<div class="transfer-double-list-main">'
        + '<ul class="transfer-double-list-ul transfer-double-list-ul-' + this.id + '">'
        + '</ul>'
        + '</div>'
        + '</div>'
        + '<div class="transfer-double-list-footer">'
        + '<div class="checkbox-group">'
        + '<input type="checkbox" class="checkbox-normal" id="leftItemSelectAll_' + this.id + '"><label for="leftItemSelectAll_' + this.id + '" class="total_num_' + this.id + '"></label>'
        + '</div>'
        + '</div>'
        + '</div>'
    }

    /**
     * generate transfer's right part
     */
    Transfer.prototype.generate_right_part = function() {
        return '<div class="transfer-double-content-right">'
        + '<div class="transfer-double-content-param">'
        + '<div class="param-item">' + this.rightTabNameText + '</div>'
        + '</div>'
        + '<div class="transfer-double-selected-list">'
        + '<div class="transfer-double-selected-list-header">'
        + '<div class="transfer-double-selected-list-search">'
        + '<input class="transfer-double-selected-list-search-input" type="text" id="selectedListSearch_' + this.id + '" placeholder="' + this.searchPlaceholderText + '" value="" />'
        + '</div>'
        + '</div>'
        + '<div class="transfer-double-selected-list-content">'
        + '<div class="transfer-double-selected-list-main">'
        + '<ul class="transfer-double-selected-list-ul transfer-double-selected-list-ul-' + this.id + '">'
        + '</ul>'
        + '</div>'
        + '</div>'
        + '<div class="transfer-double-list-footer">'
        + '<div class="checkbox-group">'
        + '<input type="checkbox" class="checkbox-normal" id="rightItemSelectAll_' + this.id + '">'
        + '<label for="rightItemSelectAll_' + this.id + '" class="selected_total_num_' +  this.id + '"></label>'
        + '</div>'
        + '</div>'
        + '</div>'
        + '</div>'
    }

    /**
     * fill data
     */
    Transfer.prototype.fill_data = function() {
        this.$element.find(this.transferDoubleListUlClass).empty();
        this.$element.find(this.transferDoubleListUlClass).append(this.generate_left_items());

        this.$element.find(this.transferDoubleSelectedListUlClass).empty();
        this.$element.find(this.transferDoubleSelectedListUlClass).append(this.generate_right_items());

        // render total num
        this.$element.find(this.totalNumLabelClass).empty();
        this.$element.find(this.totalNumLabelClass).append(get_total_num_text(this.default_total_num_text_template, this._data.get("left_total_count")));

        // render right total num
        this.$element.find(this.selectedTotalNumLabelClass).empty();
        this.$element.find(this.selectedTotalNumLabelClass).append(get_total_num_text(this.default_total_num_text_template, this._data.get("right_total_count")));

        // callable
        applyCallable(this);
    }

    /**
     * fill group data
     */
    Transfer.prototype.fill_group_data = function() {
        this.$element.find(this.transferDoubleGroupListUlClass).empty();
        this.$element.find(this.transferDoubleGroupListUlClass).append(this.generate_left_group_items());

        this.$element.find(this.transferDoubleSelectedListUlClass).empty();
        this.$element.find(this.transferDoubleSelectedListUlClass).append(this.generate_right_group_items());

        let self = this;
        let left_total_count = 0;
        this._data.forEach(function(key, value) {
            if (Object.prototype.toString.call(value) === '[object Object]') {
                left_total_count += value["left_total_count"]
            }
            value["left_total_count"] == 0 ? self.$element.find("#" + key).prop("disabled", true).prop("checked", true) : void(0)
        })

        // render total num
        this.$element.find(this.groupTotalNumLabelClass).empty();
        this.$element.find(this.groupTotalNumLabelClass).append(get_total_num_text(this.default_total_num_text_template, left_total_count));

        // render right total num
        this.$element.find(this.selectedTotalNumLabelClass).empty();
        this.$element.find(this.selectedTotalNumLabelClass).append(get_total_num_text(this.default_total_num_text_template, this._data.get("right_total_count")));

        // callable
        applyCallable(this);
    }

    /**
     * generate left items
     */
    Transfer.prototype.generate_left_items = function() {
        let html = "";
        let dataArray = this.settings.dataArray;
        let itemName = this.settings.itemName;
        let valueName = this.settings.valueName;

        for (let i = 0; i < dataArray.length; i++) {

            let selected = dataArray[i].selected || false;
            let right_total_count = this._data.get("right_total_count") || 0;
            this._data.get("right_total_count") == undefined ? this._data.put("right_total_count", right_total_count) : void(0)
            selected ? this._data.put("right_total_count", ++right_total_count) : void(0)

            html +=
            '<li class="transfer-double-list-li transfer-double-list-li-' + this.id + ' ' + (selected ? 'selected-hidden' : '') + '">' +
            '<div class="checkbox-group">' +
            '<input type="checkbox" value="' + dataArray[i][valueName] + '" class="checkbox-normal checkbox-item-'
            + this.id + '" id="itemCheckbox_' + i + '_' + this.id + '">' +
            '<label class="checkbox-name-' + this.id + '" for="itemCheckbox_' + i + '_' + this.id + '">' + dataArray[i][itemName] + '</label>' +
            '</div>' +
            '</li>'
        }

        this._data.put("left_pre_selection_count", 0);
        this._data.put("left_total_count", dataArray.length - this._data.get("right_total_count"));

        return html;
    }

    /**
     * render left group items
     */
    Transfer.prototype.generate_left_group_items = function() {
        let html = "";
        let id = this.id;
        let groupDataArray = this.settings.groupDataArray;
        let groupItemName = this.settings.groupItemName;
        let groupArrayName = this.settings.groupArrayName;
        let itemName = this.settings.itemName;
        let valueName = this.settings.valueName;


        for (let i = 0; i < groupDataArray.length; i++) {
            if (groupDataArray[i][groupArrayName] && groupDataArray[i][groupArrayName].length > 0) {

                let _value = {};
                _value["left_pre_selection_count"] = 0
                _value["left_total_count"] = groupDataArray[i][groupArrayName].length
                this._data.put('group_' + i + '_' + this.id, _value);

                html +=
                '<li class="transfer-double-group-list-li transfer-double-group-list-li-' + id + '">'
                + '<div class="checkbox-group">' +
                '<input type="checkbox" class="checkbox-normal group-select-all-' + id + '" id="group_' + i + '_' + id + '">' +
                '<label for="group_' + i + '_' + id + '" class="group-name-' + id + '">' + groupDataArray[i][groupItemName] + '</label>' +
                '</div>';

                html += '<ul class="transfer-double-group-list-li-ul transfer-double-group-list-li-ul-' + id + '">'
                for (let j = 0; j < groupDataArray[i][groupArrayName].length; j++) {

                    let selected = groupDataArray[i][groupArrayName][j].selected || false;
                    let right_total_count = this._data.get("right_total_count") || 0;
                    this._data.get("right_total_count") == undefined ? this._data.put("right_total_count", right_total_count) : void(0)
                    selected ? this._data.put("right_total_count", ++right_total_count) : void(0)

                    let groupItem = this._data.get('group_' + i + '_' + this.id);
                    selected ? groupItem["left_total_count"] -= 1 : void(0)

                    html += '<li class="transfer-double-group-list-li-ul-li transfer-double-group-list-li-ul-li-' + id + ' ' + (selected ? 'selected-hidden' : '') + '">' +
                        '<div class="checkbox-group">' +
                        '<input type="checkbox" value="' + groupDataArray[i][groupArrayName][j][valueName] + '" class="checkbox-normal group-checkbox-item-' + id + ' belongs-group-' + i + '-' + id + '" id="group_' + i + '_checkbox_' + j + '_' + id + '">' +
                        '<label for="group_' + i + '_checkbox_' + j + '_' + id + '" class="group-checkbox-name-' + id + '">' + groupDataArray[i][groupArrayName][j][itemName] + '</label>' +
                        '</div>' +
                        '</li>';
                }
                html += '</ul></li>'
            }
        }

        return html;
    }

    /**
     * generate right items
     */
    Transfer.prototype.generate_right_items = function() {
        let html = "";
        let dataArray = this.settings.dataArray;
        let itemName = this.settings.itemName;
        let valueName = this.settings.valueName;
        let selected_count = 0;

        this._data.put("right_pre_selection_count", selected_count);
        this._data.put("right_total_count", selected_count);

        for (let i = 0; i < dataArray.length; i++) {
            if (dataArray[i].selected || false) {
                this._data.put("right_total_count", ++selected_count);
                html += this.generate_item(this.id, i, dataArray[i][valueName], dataArray[i][itemName]);
            }
        }

        if (this._data.get("right_total_count") == 0) {
            $(this.rightItemSelectAllId).prop("checked", true).prop("disabled", "disabled");
        }

        return html;
    }

    /**
     * generate right group items
     */
    Transfer.prototype.generate_right_group_items = function() {
        let html = "";
        let groupDataArray = this.settings.groupDataArray;
        let groupArrayName = this.settings.groupArrayName;
        let itemName = this.settings.itemName;
        let valueName = this.settings.valueName;
        let selected_count = 0;

        this._data.put("right_pre_selection_count", selected_count);
        this._data.put("right_total_count", selected_count);

        for (let i = 0; i < groupDataArray.length; i++) {
            if (groupDataArray[i][groupArrayName] && groupDataArray[i][groupArrayName].length > 0) {
                for (let j = 0; j < groupDataArray[i][groupArrayName].length; j++) {
                    if (groupDataArray[i][groupArrayName][j].selected || false) {
                        this._data.put("right_total_count", ++selected_count);
                        html += this.generate_group_item(this.id, i, j, groupDataArray[i][groupArrayName][j][valueName], groupDataArray[i][groupArrayName][j][itemName]);
                    }
                }
            }
        }

        if (this._data.get("right_total_count") == 0) {
            $(this.rightItemSelectAllId).prop("checked", true).prop("disabled", "disabled");
        }

        return html;
    }

    /**
     * left checkbox item click handler
     */
    Transfer.prototype.left_checkbox_item_click_handler = function() {
        let self = this;
        self.$element.on("click", self.checkboxItemClass, function () {
            let pre_selection_num = 0;
            $(this).is(":checked") ? pre_selection_num++ : pre_selection_num--

            let left_pre_selection_count = self._data.get("left_pre_selection_count");
            self._data.put("left_pre_selection_count", left_pre_selection_count + pre_selection_num);

            if (self._data.get("left_pre_selection_count") > 0) {
                $(self.addSelectedButtonId).addClass("btn-arrow-active");
            } else {
                $(self.addSelectedButtonId).removeClass("btn-arrow-active");
            }

            if (self._data.get("left_pre_selection_count") < self._data.get("left_total_count")) {
                $(self.leftItemSelectAllId).prop("checked", false);
            } else if (self._data.get("left_pre_selection_count") == self._data.get("left_total_count")) {
                $(self.leftItemSelectAllId).prop("checked", true);
            }
        });
    }

    /**
     * left group checkbox item click handler
     */
    Transfer.prototype.left_group_checkbox_item_click_handler = function() {
        let self = this;
        self.$element.on("click", self.groupCheckboxItemClass, function () {
            let pre_selection_num = 0;
            let total_pre_selection_num = 0;
            let remain_left_total_count = 0

            $(this).is(":checked") ? pre_selection_num++ : pre_selection_num--

            let groupIndex = $(this).prop("id").split("_")[1];
            let groupItem =  self._data.get('group_' + groupIndex + '_' + self.id);
            let left_pre_selection_count = groupItem["left_pre_selection_count"];
            groupItem["left_pre_selection_count"] = left_pre_selection_count + pre_selection_num

            self._data.forEach(function(key, value) {
                if (Object.prototype.toString.call(value) === '[object Object]') {
                    total_pre_selection_num += value["left_pre_selection_count"]
                    remain_left_total_count += value["left_total_count"]
                }
            });

            if (total_pre_selection_num > 0) {
                $(self.addSelectedButtonId).addClass("btn-arrow-active");
            } else {
                $(self.addSelectedButtonId).removeClass("btn-arrow-active");
            }

            if (groupItem["left_pre_selection_count"] < groupItem["left_total_count"]) {
                self.$element.find("#group_" + groupIndex + "_" + self.id).prop("checked", false);
            } else if (groupItem["left_pre_selection_count"] == groupItem["left_total_count"]) {
                self.$element.find("#group_" + groupIndex + "_" + self.id).prop("checked", true);
            }

            if (total_pre_selection_num == remain_left_total_count) {
                $(self.groupItemSelectAllId).prop("checked", true);
            } else {
                $(self.groupItemSelectAllId).prop("checked", false);
            }
        });
    }

    /**
     * group select all handler
     */
    Transfer.prototype.group_select_all_handler = function() {
        let self = this;
        $(self.groupSelectAllClass).on("click", function () {
            // group index
            let groupIndex = ($(this).attr("id")).split("_")[1];
            let groups =  self.$element.find(".belongs-group-" + groupIndex + "-" + self.id);
            let left_pre_selection_count = 0;
            let left_total_count = 0;

            // a group is checked
            if ($(this).is(':checked')) {
                // active button
                $(self.addSelectedButtonId).addClass("btn-arrow-active");
                for (let i = 0; i < groups.length; i++) {
                    if (!groups.eq(i).is(':checked') && groups.eq(i).parent("div").parent("li").css("display") != "none") {
                        groups.eq(i).prop("checked", true);
                    }
                }

                let groupItem = self._data.get($(this).prop("id"));
                groupItem["left_pre_selection_count"] = groupItem["left_total_count"];

                self._data.forEach(function(key, value) {
                    if (Object.prototype.toString.call(value) === '[object Object]') {
                        left_pre_selection_count += value["left_pre_selection_count"];
                        left_total_count += value["left_total_count"];
                    }
                })

                if (left_pre_selection_count == left_total_count) {
                    $(self.groupItemSelectAllId).prop("checked", true);
                }
            } else {
                for (let j = 0; j < groups.length; j++) {
                    if (groups.eq(j).is(':checked') && groups.eq(j).parent("div").parent("li").css("display") != "none") {
                        groups.eq(j).prop("checked", false);
                    }
                }

                self._data.get($(this).prop("id"))["left_pre_selection_count"] = 0;

                self._data.forEach(function(key, value) {
                    if (Object.prototype.toString.call(value) === '[object Object]') {
                        left_pre_selection_count += value["left_pre_selection_count"];
                        left_total_count += value["left_total_count"];
                    }
                })

                if (left_pre_selection_count != left_total_count) {
                    $(self.groupItemSelectAllId).prop("checked", false);
                }

                if (left_pre_selection_count == 0) {
                    $(self.addSelectedButtonId).removeClass("btn-arrow-active");
                }
            }
        });
    }

    /**
     * group item select all handler
     */
    Transfer.prototype.group_item_select_all_handler = function() {
        let self = this;
        $(self.groupItemSelectAllId).on("click", function () {
            let groupCheckboxItems = self.$element.find(self.groupCheckboxItemClass);
            if ($(this).is(':checked')) {
                for (let i = 0; i < groupCheckboxItems.length; i++) {
                    if (groupCheckboxItems.parent("div").parent("li").eq(i).css('display') != "none" && !groupCheckboxItems.eq(i).is(':checked')) {
                        groupCheckboxItems.eq(i).prop("checked", true);
                        let groupIndex = groupCheckboxItems.eq(i).prop("id").split("_")[1];
                        if (!self.$element.find(self.groupSelectAllClass).eq(groupIndex).is(':checked')) {
                            self.$element.find(self.groupSelectAllClass).eq(groupIndex).prop("checked", true);
                        }
                    }
                }

                self._data.forEach(function (key, value) {
                    if (Object.prototype.toString.call(value) === '[object Object]') {
                        value["left_pre_selection_count"] = value["left_total_count"];
                    }
                })

                $(self.addSelectedButtonId).addClass("btn-arrow-active");
            } else {
                for (let i = 0; i < groupCheckboxItems.length; i++) {
                    if (groupCheckboxItems.parent("div").parent("li").eq(i).css('display') != "none" && groupCheckboxItems.eq(i).is(':checked')) {
                        groupCheckboxItems.eq(i).prop("checked", false);
                        let groupIndex = groupCheckboxItems.eq(i).prop("id").split("_")[1];
                        if (self.$element.find(self.groupSelectAllClass).eq(groupIndex).is(':checked')) {
                            self.$element.find(self.groupSelectAllClass).eq(groupIndex).prop("checked", false);
                        }
                    }
                }

                self._data.forEach(function (key, value) {
                    if (Object.prototype.toString.call(value) === '[object Object]') {
                        value["left_pre_selection_count"] = 0;
                    }
                })

                $(self.addSelectedButtonId).removeClass("btn-arrow-active");
            }
        });
    }

    /**
     * left group items search handler
     */
    Transfer.prototype.left_group_items_search_handler = function() {
        let self = this;
        $(self.groupItemSearcherId).on("keyup", function () {
            self.$element.find(self.transferDoubleGroupListUlClass).css('display', 'block');
            let transferDoubleGroupListLiUlLis = self.$element.find(self.transferDoubleGroupListLiUlLiClass);
            if ($(self.groupItemSearcherId).val() == "") {
                for (let i = 0; i < transferDoubleGroupListLiUlLis.length; i++) {
                    if (!transferDoubleGroupListLiUlLis.eq(i).hasClass("selected-hidden")) {
                        transferDoubleGroupListLiUlLis.eq(i).parent("ul").parent("li").css('display', 'block');
                        transferDoubleGroupListLiUlLis.eq(i).css('display', 'block');
                    } else {
                        transferDoubleGroupListLiUlLis.eq(i).parent("ul").parent("li").css('display', 'block');
                    }
                }
                return;
            }

            // Mismatch
            self.$element.find(self.transferDoubleGroupListLiClass).css('display', 'none');
            transferDoubleGroupListLiUlLis.css('display', 'none');

            for (let j = 0; j < transferDoubleGroupListLiUlLis.length; j++) {
                if (!transferDoubleGroupListLiUlLis.eq(j).hasClass("selected-hidden")
                    && transferDoubleGroupListLiUlLis.eq(j).text().trim()
                        .substr(0, $(self.groupItemSearcherId).val().length).toLowerCase() == $(self.groupItemSearcherId).val().toLowerCase()) {
                            transferDoubleGroupListLiUlLis.eq(j).parent("ul").parent("li").css('display', 'block');
                            transferDoubleGroupListLiUlLis.eq(j).css('display', 'block');
                }
            }
        });
    }

    /**
     * left item select all handler
     */
    Transfer.prototype.left_item_select_all_handler = function() {
        let self = this;
        $(self.leftItemSelectAllId).on("click", function () {
            let checkboxItems = self.$element.find(self.checkboxItemClass);
            if ($(this).is(':checked')) {
                for (let i = 0; i < checkboxItems.length; i++) {
                    if (checkboxItems.eq(i).parent("div").parent("li").css('display') != "none" && !checkboxItems.eq(i).is(':checked')) {
                        checkboxItems.eq(i).prop("checked", true);
                    }
                }
                self._data.put("left_pre_selection_count", self._data.get("left_total_count"));
                $(self.addSelectedButtonId).addClass("btn-arrow-active");
            } else {
                for (let i = 0; i < checkboxItems.length; i++) {
                    if (checkboxItems.eq(i).parent("div").parent("li").css('display') != "none" && checkboxItems.eq(i).is(':checked')) {
                        checkboxItems.eq(i).prop("checked", false);
                    }
                }
                $(self.addSelectedButtonId).removeClass("btn-arrow-active");
                self._data.put("left_pre_selection_count", 0);
            }
        });
    }

    /**
     * right item select all handler
     */
    Transfer.prototype.right_item_select_all_handler = function() {
        let self = this;
        $(self.rightItemSelectAllId).on("click", function () {
            let checkboxSelectedItems = self.$element.find(self.checkboxSelectedItemClass);
            if ($(this).is(':checked')) {
                self._data.put("right_pre_selection_count", 0);
                let right_pre_selection_count = self._data.get("right_pre_selection_count");
                for (let i = 0; i < checkboxSelectedItems.length; i++) {
                    checkboxSelectedItems.eq(i).prop("checked", true);
                    self._data.put("right_pre_selection_count", ++right_pre_selection_count);
                }

                $(self.deleteSelectedButtonId).addClass("btn-arrow-active");
    
                if (self._data.get("right_pre_selection_count") < self._data.get("right_total_count")) {
                    $(self.rightItemSelectAllId).prop("checked", false);
                } else if (self._data.get("right_pre_selection_count") == self._data.get("right_total_count")) {
                    $(self.rightItemSelectAllId).prop("checked", true);
                }

            } else {
                for (let i = 0; i < checkboxSelectedItems.length; i++) {
                    for (let i = 0; i < checkboxSelectedItems.length; i++) {
                        checkboxSelectedItems.eq(i).prop("checked", false);
                    }
                }
                $(self.deleteSelectedButtonId).removeClass("btn-arrow-active");
                self._data.put("right_pre_selection_count", 0);
            }

        });
    }

    /**
     * left items search handler
     */
    Transfer.prototype.left_items_search_handler = function() {
        let self = this;
        $(self.itemSearcherId).on("keyup", function () {
            let transferDoubleListLis = self.$element.find(self.transferDoubleListLiClass);
            self.$element.find(self.transferDoubleListUlClass).css('display', 'block');
            if ($(self.itemSearcherId).val() == "") {
                for (let i = 0; i < transferDoubleListLis.length; i++) {
                    if (!transferDoubleListLis.eq(i).hasClass("selected-hidden")) {
                        self.$element.find(self.transferDoubleListLiClass).eq(i).css('display', 'block');
                    }
                }
                return;
            }

            transferDoubleListLis.css('display', 'none');

            for (let j = 0; j < transferDoubleListLis.length; j++) {
                if (!transferDoubleListLis.eq(j).hasClass("selected-hidden")
                    && transferDoubleListLis.eq(j).text().trim()
                        .substr(0, $(self.itemSearcherId).val().length).toLowerCase() == $(self.itemSearcherId).val().toLowerCase()) {
                            transferDoubleListLis.eq(j).css('display', 'block');
                }
            }
        });
    }

    /**
     * right checkbox item click handler
     */
    Transfer.prototype.right_checkbox_item_click_handler = function() {
        let self = this;
        self.$element.on("click", self.checkboxSelectedItemClass, function () {
            let pre_selection_num = 0;
            $(this).is(":checked") ? pre_selection_num++ : pre_selection_num--

            let right_pre_selection_count = self._data.get("right_pre_selection_count");
            self._data.put("right_pre_selection_count", right_pre_selection_count + pre_selection_num);

            if (self._data.get("right_pre_selection_count") > 0) {
                $(self.deleteSelectedButtonId).addClass("btn-arrow-active");
            } else {
                $(self.deleteSelectedButtonId).removeClass("btn-arrow-active");
            }

            if (self._data.get("right_pre_selection_count") < self._data.get("right_total_count")) {
                $(self.rightItemSelectAllId).prop("checked", false);
            } else if (self._data.get("right_pre_selection_count") == self._data.get("right_total_count")) {
                $(self.rightItemSelectAllId).prop("checked", true);
            }

        });
    }

    /**
     * move the pre-selection items to the right handler
     */
    Transfer.prototype.move_pre_selection_items_handler = function() {
        let self = this;
        $(self.addSelectedButtonId).on("click", function () {
            self.isGroup ? self.move_pre_selection_group_items() : self.move_pre_selection_items()
            // callable
            applyCallable(self);
        });
    }

    /**
     * move the pre-selection group items to the right
     */
    Transfer.prototype.move_pre_selection_group_items = function() {
        let pre_selection_num = 0;
        let html = "";
        let groupCheckboxItems = this.$element.find(this.groupCheckboxItemClass);
        for (let i = 0; i < groupCheckboxItems.length; i++) {
            if (!groupCheckboxItems.eq(i).parent("div").parent("li").hasClass("selected-hidden") && groupCheckboxItems.eq(i).is(':checked')) {
                let checkboxItemId = groupCheckboxItems.eq(i).attr("id");
                let groupIndex = checkboxItemId.split("_")[1];
                let itemIndex = checkboxItemId.split("_")[3];
                let labelText = this.$element.find(this.groupCheckboxNameLabelClass).eq(i).text();
                let value = groupCheckboxItems.eq(i).val();

                html += this.generate_group_item(this.id, groupIndex, itemIndex, value, labelText);
                groupCheckboxItems.parent("div").parent("li").eq(i).css("display", "").addClass("selected-hidden");
                pre_selection_num++;

                let groupItem = this._data.get('group_' + groupIndex + '_' + this.id);
                let left_total_count = groupItem["left_total_count"];
                let left_pre_selection_count = groupItem["left_pre_selection_count"];
                let right_total_count = this._data.get("right_total_count");
                groupItem["left_total_count"] = --left_total_count;
                groupItem["left_pre_selection_count"] = --left_pre_selection_count;
                this._data.put("right_total_count", ++right_total_count);
            }
        }

        if (pre_selection_num > 0) {
            let groupSelectAllArray = this.$element.find(this.groupSelectAllClass);
            for (let j = 0; j < groupSelectAllArray.length; j++) {
                if (groupSelectAllArray.eq(j).is(":checked")) {
                    groupSelectAllArray.eq(j).prop("disabled", "disabled");
                }
            }

            let remain_left_total_count = 0;
            this._data.forEach(function(key, value) {
                if (Object.prototype.toString.call(value) === '[object Object]') {
                    remain_left_total_count += value["left_total_count"];
                }
            })

            let groupTotalNumLabel = this.$element.find(this.groupTotalNumLabelClass);
            groupTotalNumLabel.empty();
            groupTotalNumLabel.append(get_total_num_text(this.default_total_num_text_template, remain_left_total_count));
            this.$element.find(this.selectedTotalNumLabelClass).text(get_total_num_text(this.default_total_num_text_template, this._data.get("right_total_count")));

            if (remain_left_total_count == 0) {
                $(this.groupItemSelectAllId).prop("checked", true).prop("disabled", "disabled");
            }

            if (this._data.get("right_total_count") > 0) {
                $(this.rightItemSelectAllId).prop("checked", false).removeAttr("disabled");
            }

            $(this.addSelectedButtonId).removeClass("btn-arrow-active");
            let transferDoubleSelectedListUl = this.$element.find(this.transferDoubleSelectedListUlClass);
            transferDoubleSelectedListUl.append(html);
        }
    }

    /**
     * move the pre-selection items to the right
     */
    Transfer.prototype.move_pre_selection_items = function() {
        let pre_selection_num = 0;
        let html = "";
        let self = this;
        let checkboxItems = self.$element.find(self.checkboxItemClass);
        for (let i = 0; i < checkboxItems.length; i++) {
            if (checkboxItems.eq(i).parent("div").parent("li").css("display") != "none" && checkboxItems.eq(i).is(':checked')) {
                let checkboxItemId = checkboxItems.eq(i).attr("id");
                // checkbox item index
                let index = checkboxItemId.split("_")[1];
                let labelText = self.$element.find(self.checkboxItemLabelClass).eq(i).text();
                let value = checkboxItems.eq(i).val();
                self.$element.find(self.transferDoubleListLiClass).eq(i).css("display", "").addClass("selected-hidden");
                html += self.generate_item(self.id, index, value, labelText);
                pre_selection_num++;

                let left_pre_selection_count = self._data.get("left_pre_selection_count");
                let left_total_count = self._data.get("left_total_count");
                let right_total_count = self._data.get("right_total_count");
                self._data.put("left_pre_selection_count", --left_pre_selection_count);
                self._data.put("left_total_count", --left_total_count);
                self._data.put("right_total_count", ++right_total_count);
            }
        }

        if (self._data.get("right_total_count") > 0) {
            $(self.rightItemSelectAllId).prop("checked", false).removeAttr("disabled");
        }

        if (pre_selection_num > 0) {
            let totalNumLabel = self.$element.find(self.totalNumLabelClass);
            totalNumLabel.empty();
            totalNumLabel.append(get_total_num_text(self.default_total_num_text_template, self._data.get("left_total_count")));
            self.$element.find(self.selectedTotalNumLabelClass).text(get_total_num_text(self.default_total_num_text_template, self._data.get("right_total_count")));
            if (self._data.get("left_total_count") == 0) {
                $(self.leftItemSelectAllId).prop("checked", true).prop("disabled", "disabled");
            }

            $(self.addSelectedButtonId).removeClass("btn-arrow-active");
            self.$element.find(self.transferDoubleSelectedListUlClass).append(html);
        }
    }

    /**
     * move the selected item to the left handler
     */
    Transfer.prototype.move_selected_items_handler = function() {
        let self = this;
        $(self.deleteSelectedButtonId).on("click", function () {
            self.isGroup ? self.move_selected_group_items() : self.move_selected_items()
            $(self.deleteSelectedButtonId).removeClass("btn-arrow-active");
            // callable
            applyCallable(self);
        });
    }

    /**
     * move the selected group item to the left
     */
    Transfer.prototype.move_selected_group_items = function() {
        let pre_selection_num = 0;
        let checkboxSelectedItems = this.$element.find(this.checkboxSelectedItemClass);
        for (let i = 0; i < checkboxSelectedItems.length;) {
            let another_checkboxSelectedItems = this.$element.find(this.checkboxSelectedItemClass);
            if (another_checkboxSelectedItems.eq(i).is(':checked')) {
                let checkboxSelectedItemId = another_checkboxSelectedItems.eq(i).attr("id");
                let groupIndex = checkboxSelectedItemId.split("_")[1];
                let index = checkboxSelectedItemId.split("_")[3];

                another_checkboxSelectedItems.parent("div").parent("li").eq(i).remove();
                this.$element.find("#group_" + groupIndex + "_" + this.id).prop("checked", false).removeAttr("disabled");
                this.$element.find("#group_" + groupIndex + "_checkbox_" + index + "_" + this.id)
                    .prop("checked", false).parent("div").parent("li").css("display", "").removeClass("selected-hidden");

                pre_selection_num++;

                let groupItem = this._data.get('group_' + groupIndex + '_' + this.id);
                let left_total_count = groupItem["left_total_count"];
                let right_pre_selection_count = this._data.get("right_pre_selection_count");
                let right_total_count = this._data.get("right_total_count");
                groupItem["left_total_count"] = ++left_total_count;
                this._data.put("right_total_count", --right_total_count);
                this._data.put("right_pre_selection_count", --right_pre_selection_count);

            } else {
                i++;
            }
        }
        if (pre_selection_num > 0) {
            this.$element.find(this.groupTotalNumLabelClass).empty();

            let remain_left_total_count = 0;
            this._data.forEach(function(key, value) {
                if (Object.prototype.toString.call(value) === '[object Object]') {
                    remain_left_total_count += value["left_total_count"];
                }
            })

            if (this._data.get("right_total_count") == 0) {
                $(this.rightItemSelectAllId).prop("checked", true).prop("disabled", "disabled");
            }

            this.$element.find(this.groupTotalNumLabelClass).append(get_total_num_text(this.default_total_num_text_template, remain_left_total_count));
            this.$element.find(this.selectedTotalNumLabelClass).text(get_total_num_text(this.default_total_num_text_template, this._data.get("right_total_count")));
            if ($(this.groupItemSelectAllId).is(':checked')) {
                $(this.groupItemSelectAllId).prop("checked", false).removeAttr("disabled");
            }
        }
    }

    /**
     * move the selected item to the left
     */
    Transfer.prototype.move_selected_items = function() {
        let pre_selection_num = 0;
        let self = this;

        for (let i = 0; i < self.$element.find(self.checkboxSelectedItemClass).length;) {
            let checkboxSelectedItems = self.$element.find(self.checkboxSelectedItemClass);
            if (checkboxSelectedItems.eq(i).is(':checked')) {
                let index = checkboxSelectedItems.eq(i).attr("id").split("_")[1];
                checkboxSelectedItems.parent("div").parent("li").eq(i).remove();
                self.$element.find(self.checkboxItemClass).eq(index).prop("checked", false);
                self.$element.find(self.transferDoubleListLiClass).eq(index).css("display", "").removeClass("selected-hidden");

                pre_selection_num++;

                let right_total_count = self._data.get("right_total_count");
                let right_pre_selection_count = self._data.get("right_pre_selection_count");
                self._data.put("right_total_count", --right_total_count);
                self._data.put("right_pre_selection_count", --right_pre_selection_count);

                let left_total_count = self._data.get("left_total_count");
                self._data.put("left_total_count", ++left_total_count);


            } else {
                i++;
            }
        }

        if (self._data.get("right_total_count") == 0) {
            $(self.rightItemSelectAllId).prop("checked", true).prop("disabled", "disabled");
        }


        if (pre_selection_num > 0) {
            self.$element.find(self.totalNumLabelClass).empty();
            self.$element.find(self.totalNumLabelClass).append(get_total_num_text(self.default_total_num_text_template, self._data.get("left_total_count")));
            self.$element.find(self.selectedTotalNumLabelClass).text(get_total_num_text(self.default_total_num_text_template, self._data.get("right_total_count")));
            if ($(self.leftItemSelectAllId).is(':checked')) {
                $(self.leftItemSelectAllId).prop("checked", false).removeAttr("disabled");
            }
        }
    }

    /**
     * right items search handler
     */
    Transfer.prototype.right_items_search_handler = function() {
        let self = this;
        $(self.selectedItemSearcherId).keyup(function () {
            let transferDoubleSelectedListLis = self.$element.find(self.transferDoubleSelectedListLiClass);
            self.$element.find(self.transferDoubleSelectedListUlClass).css('display', 'block');

            if ($(self.selectedItemSearcherId).val() == "") {
                transferDoubleSelectedListLis.css('display', 'block');
                return;
            }

            transferDoubleSelectedListLis.css('display', 'none');

            for (let i = 0; i < transferDoubleSelectedListLis.length; i++) {
                if (transferDoubleSelectedListLis.eq(i).text().trim()
                        .substr(0, $(self.selectedItemSearcherId).val().length).toLowerCase() == $(self.selectedItemSearcherId).val().toLowerCase()) {
                            transferDoubleSelectedListLis.eq(i).css('display', 'block');
                }
            }
        });
    }

    /**
     * generate item
     */
    Transfer.prototype.generate_item = function(id, index, value, labelText) {
        return '<li class="transfer-double-selected-list-li  transfer-double-selected-list-li-' + id + ' .clearfix">' +
        '<div class="checkbox-group">' +
        '<input type="checkbox" value="' + value + '" class="checkbox-normal checkbox-selected-item-' + id + '" id="selectedCheckbox_' + index + '_' + id + '">' +
        '<label class="checkbox-selected-name-' + id + '" for="selectedCheckbox_' + index + '_' + id + '">' + labelText + '</label>' +
        '</div>' +
        '</li>';
    }

    /**
     * generate group item
     */
    Transfer.prototype.generate_group_item = function(id, groupIndex, itemIndex, value, labelText) {
        return '<li class="transfer-double-selected-list-li transfer-double-selected-list-li-' + id + ' .clearfix">' +
        '<div class="checkbox-group">' +
        '<input type="checkbox" value="' + value + '" class="checkbox-normal checkbox-selected-item-' + id + '" id="group_' + groupIndex + '_selectedCheckbox_' + itemIndex + '_' + id + '">' +
        '<label class="checkbox-selected-name-' + id + '" for="group_' + groupIndex + '_selectedCheckbox_' + itemIndex + '_' + id + '">' + labelText + '</label>' +
        '</div>' +
        '</li>'
    }

    /**
     * apply callable
     */
    function applyCallable(transfer) {
        if (Object.prototype.toString.call(transfer.settings.callable) === "[object Function]") {
          let selected_items = get_selected_items(transfer);

            // send reply in case of empty array
            //if (selected_items.length > 0) {
              transfer.settings.callable.call(transfer, selected_items);
            //}
        }
    }

    /**
     * get selected items
     */
    function get_selected_items(transfer) {
        let selected = [];
        let transferDoubleSelectedListLiArray = transfer.$element.find(transfer.transferDoubleSelectedListLiClass);
        for (let i = 0; i < transferDoubleSelectedListLiArray.length; i++) {
            let checkboxGroup = transferDoubleSelectedListLiArray.eq(i).find(".checkbox-group");

            let item = {};
            item[transfer.settings.itemName] = checkboxGroup.find("label").text();
            item[transfer.settings.valueName] = checkboxGroup.find("input").val();
            selected.push(item);
        }
        return selected;
    }

    /**
     * get group items number
     * @param {Array} groupDataArray
     * @param {string}  groupArrayName
     */
    function get_group_items_num(groupDataArray, groupArrayName) {
        let group_item_total_num = 0;
        for (let i = 0; i < groupDataArray.length; i++) {
            let groupItemData = groupDataArray[i][groupArrayName];
            if (groupItemData && groupItemData.length > 0) {
                group_item_total_num = group_item_total_num + groupItemData.length;
            }
        }
        return group_item_total_num;
    }

    /**
     * get the total number by replacing the template
     * @param {*} template
     * @param {*} total_num
     */
    function get_total_num_text(template, total_num) {
        let _template = template;
        return _template.replace(/{total_num}/g, total_num);
    }

    /**
     * Inner Map
     */
    function InnerMap() {
        this.keys = new Array();
        this.values = new Object();

        this.put = function(key, value) {
            if (this.values[key] == null) {
                this.keys.push(key);
            }
            this.values[key] = value;
        }
        this.get = function(key) {
            return this.values[key];
        }
        this.remove = function(key) {
            for (let i = 0; i < this.keys.length; i++) {
                if (this.keys[i] === key) {
                    this.keys.splice(i, 1);
                }
            }
            delete this.values[key];
        }
        this.forEach = function(fn) {
            for (let i = 0; i < this.keys.length; i++) {
                let key = this.keys[i];
                let value = this.values[key];
                fn(key, value);
            }
        }
        this.isEmpty = function() {
            return this.keys.length == 0;
        }
        this.size = function() {
            return this.keys.length;
        }
    }

    /**
     * get id
     */
    function getId() {
        let counter = 0;
        return function(prefix) {
            let id = (+new Date()).toString(32), i = 0;
            for (; i < 5; i++) {
                id += Math.floor(Math.random() * 65535).toString(32);
            }
            return (prefix || '') + id + (counter++).toString(32);
        }
    }

}(jQuery));
