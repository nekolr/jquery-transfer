/**
 * jQuery transfer
 */
(function($) {

    // The total number of selected items
    var selected_total_num = 0;
    // Id
    var id = (new Date()).getTime() + parseInt(10000 * Math.random());
    // transfer id
    var transferId = "#transfer_double_" + id;
    // tab text
    var tabNameText = "items";
    // group tab text
    var groupTabNameText = "grouping items";
    // right tab text
    var rightTabNameText = "selected items";
    // search placeholder text
    var searchPlaceholderText = "search";
    // default total number text tempalte
    var default_total_num_text_template = "total: {total_num}";
    // default zero item
    var default_right_item_total_num_text = getTotalNumTextByTemplate(default_total_num_text_template, 0);

    // class selector for the tab
    var tabClass = ".tab-item-name-" + id;
    // class selector for the transfer-double-list
    var transferDoubleListClass = ".transfer-double-list-" + id;

    // id selector for the item searcher
    var itemSearcherId = "#listSearch_" + id;
    // id selector for the group item searcher
    var groupItemSearcherId = "#groupListSearch_" + id;
    // id selector for the right searcher
    var selectedItemSearcherId = "#selectedListSearch_" + id;

    // class selector for the first tab content
    var firstTabContentClass = ".tab-content-first-" + id;
    // class selector for the transfer-double-list-ul
    var transferDoubleListUlClass = ".transfer-double-list-ul-" + id;
    // class selector for the transfer-double-list-li
    var transferDoubleListLiClass = ".transfer-double-list-li-" + id;
    // class selector for the left checkbox item
    var checkboxItemClass = ".checkbox-item-" + id;
    // class selector for the left checkbox item label
    var checkboxItemLabelClass = ".checkbox-name-" + id;
    // class selector for the left item total number label
    var totalNumLabelClass = ".total_num_" + id;
    // id selector for the left item select all
    var leftItemSelectAllId = "#leftItemSelectAll_" + id;

    // class selector for the transfer-double-group-list-ul
    var transferDoubleGroupListUlClass = ".transfer-double-group-list-ul-" + id;
    // class selector for the transfer-double-group-list-li
    var transferDoubleGroupListLiClass = ".transfer-double-group-list-li-" + id;
    // class selector for the group select all
    var groupSelectAllClass = ".group-select-all-" + id;
    // class selector for the group name label
    var groupNameLabelClass = ".group-name-" + id;
    // class selector fro the transfer-double-group-list-li-ul-li
    var transferDoubleGroupListLiUlLiClass = ".transfer-double-group-list-li-ul-li-" + id;
    // class selector for the group-checkbox-item
    var groupCheckboxItemClass = ".group-checkbox-item-" + id;
    // class selector for the group-checkbox-name
    var groupCheckboxNameLabelClass = ".group-checkbox-name-" + id;
    // class selector for the left group item total number label
    var groupTotalNumLabelClass = ".group_total_num_" + id;
    // id selector for the left group item select all
    var groupItemSelectAllId = "#groupItemSelectAll_" + id;

    // class selector for the transfer-double-selected-list-ul
    var transferDoubleSelectedListUlClass = ".transfer-double-selected-list-ul-" + id;
    // class selector for the transfer-double-selected-list-li
    var transferDoubleSelectedListLiClass = ".transfer-double-selected-list-li-" + id;
    // class selector for the right select checkbox item
    var checkboxSelectedItemClass = ".checkbox-selected-item-" + id;
    // class selector for the right select checkbox item label
    var checkboxSelectedNameLabelClass = ".checkbox-selected-name-" + id;
    // id selector for the right item select all
    var rightItemSelectAllId = "#rightItemSelectAll_" + id;
    // class selector for the 
    var selectedTotalNumLabelClass = ".selected_total_num_" + id;
    // id selector for the add button
    var addSelectedButtonId = "#add_selected_" + id;
    // id selector for the delete button
    var deleteSelectedButtonId = "#delete_selected_" + id;
    // When the selected item moves to the right, the total item number on the left
    var new_item_total_num = 0;
    // When the selected item moves to the right, the total group item number on the left
    var new_group_item_total_num = 0;

    $.fn.transfer = function(options) {
        // default options
        var defaults = {
            // data item name
            itemName: "item",
            // group data item name
            groupItemName: "groupItem",
            // group data array name
            groupArrayName: "groupArray",
            // data value name
            valueName: "value",
            // items data array
            dataArray: [],
            // group data array
            groupDataArray: []
        };

        var settings = $.extend(defaults, options);

        // item total number
        var item_total_num = settings.dataArray.length;
        // item total number text
        var item_total_num_text = getTotalNumTextByTemplate(default_total_num_text_template, item_total_num);
        // group item total number
        var group_item_total_num = getGroupItemsNum(settings.groupDataArray, settings.groupArrayName);
        // group item total number text
        var group_item_total_num_text = getTotalNumTextByTemplate(default_total_num_text_template, group_item_total_num);

        // render transfer
        this.append(generateTransfer(id));

        // fill data
        this.find(transferDoubleListUlClass).empty();
        this.find(transferDoubleListUlClass).append(renderLeftItems(id, settings.dataArray, settings.itemName, settings.valueName));
        this.find(totalNumLabelClass).empty();
        this.find(totalNumLabelClass).append(item_total_num_text);
        // fill group data
        this.find(transferDoubleGroupListUlClass).empty();
        this.find(transferDoubleGroupListUlClass).append(renderLeftGroupItems(id, settings.groupDataArray, settings.groupArrayName, settings.groupItemName, settings.itemName, settings.valueName));
        this.find(groupTotalNumLabelClass).empty();
        this.find(groupTotalNumLabelClass).append(group_item_total_num_text);

        // tab change handler
        tabChangeHandler(settings.itemName, settings.valueName, settings.callable);
        // left checkbox item click handler
        leftCheckboxItemClickHandler();
        // left group checkbox item click handler
        leftGroupCheckboxItemClickHandler();
        // right checkbox item click handler
        rightCheckboxItemClickHandler();
        // group select all handler
        groupSelectAllHandler();
        // left item select all handler
        leftItemSelectAllHandler();
        // group item select all handelr
        groupItemSelectAllHandler();
        // move the selected item to the right handler
        moveSelectedItemsToRightHandler(settings.itemName, settings.valueName, item_total_num, group_item_total_num, settings.callable);
        // move the selected item to the left handler
        moveSelectedItemsToLeftHandler(settings.itemName, settings.valueName, settings.callable);
        // left items search handler
        leftItemsSearchHandler();
        // left group items search handler
        leftGroupItemsSearchHandler();
        // right items search handler
        rightItemsSearchHandler();

    }

    /**
     * Generate transfer html
     * @param id id
     * @returns {string}
     */
    function generateTransfer(id) {
        var htmlStr =
            '<div class="transfer-double" id="transfer_double_' + id + '">'
            + '<div class="transfer-double-header"></div>'
            + '<div class="transfer-double-content clearfix">'
            + '<div class="transfer-double-content-left">'
            + '<div class="transfer-double-content-tabs">'
            + '<div class="tab-item-name tab-item-name-' + id + ' tab-active">' + groupTabNameText + '</div>'
            + '<div class="tab-item-name tab-item-name-' + id + '">' + tabNameText + '</div>'
            + '</div>'

            + '<div class="transfer-double-list transfer-double-list-' + id + ' tab-content-first-' + id + ' tab-content-active">'
            + '<div class="transfer-double-list-header">'
            + '<div class="transfer-double-list-search">'
            + '<input class="transfer-double-list-search-input" type="text" id="groupListSearch_' + id + '" placeholder="' + searchPlaceholderText + '" value="" />'
            + '</div>'
            + '</div>'
            + '<div class="transfer-double-list-content">'
            + '<div class="transfer-double-list-main">'
            + '<ul class="transfer-double-group-list-ul transfer-double-group-list-ul-' + id + '">'
            + '</ul>'
            + '</div>'
            + '</div>'
            + '<div class="transfer-double-list-footer">'
            + '<div class="checkbox-group">'
            + '<input type="checkbox" class="checkbox-normal" id="groupItemSelectAll_' + id + '"><label for="groupItemSelectAll_' + id + '" class="group_total_num_' + id + '"></label>'
            + '</div>'
            + '</div>'
            + '</div>'

            + '<div class="transfer-double-list transfer-double-list-' + id + '">'
            + '<div class="transfer-double-list-header">'
            + '<div class="transfer-double-list-search">'
            + '<input class="transfer-double-list-search-input" type="text" id="listSearch_' + id + '" placeholder="' + searchPlaceholderText + '" value="" />'
            + '</div>'
            + '</div>'
            + '<div class="transfer-double-list-content">'
            + '<div class="transfer-double-list-main">'
            + '<ul class="transfer-double-list-ul transfer-double-list-ul-' + id + '">'
            + '</ul>'
            + '</div>'
            + '</div>'
            + '<div class="transfer-double-list-footer">'
            + '<div class="checkbox-group">'
            + '<input type="checkbox" class="checkbox-normal" id="leftItemSelectAll_' + id + '"><label for="leftItemSelectAll_' + id + '" class="total_num_' + id + '"></label>'
            + '</div>'
            + '</div>'
            + '</div>'
            + '</div>'

            + '<div class="transfer-double-content-middle">'
            + '<div class="btn-select-arrow" id="add_selected_' + id + '"><i class="iconfont icon-forward"></i></div>'
            + '<div class="btn-select-arrow" id="delete_selected_' + id + '"><i class="iconfont icon-back"></i></div>'
            + '</div>'
            + '<div class="transfer-double-content-right">'
            + '<div class="transfer-double-content-param">'
            + '<div class="param-item">' + rightTabNameText + '</div>'
            + '</div>'
            + '<div class="transfer-double-selected-list">'
            + '<div class="transfer-double-selected-list-header">'
            + '<div class="transfer-double-selected-list-search">'
            + '<input class="transfer-double-selected-list-search-input" type="text" id="selectedListSearch_' + id + '" placeholder="' + searchPlaceholderText + '" value="" />'
            + '</div>'
            + '</div>'
            + '<div class="transfer-double-selected-list-content">'
            + '<div class="transfer-double-selected-list-main">'
            + '<ul class="transfer-double-selected-list-ul transfer-double-selected-list-ul-' + id + '">'
            + '</ul>'
            + '</div>'
            + '</div>'
            + '<div class="transfer-double-list-footer">'
            + '<label class="selected_total_num_' + id + '">' + default_right_item_total_num_text + '</label>'
            + '</div>'
            + '</div>'
            + '</div>'
            + '</div>'
            + '<div class="transfer-double-footer">'
            + '</div>'
            + '</div>';
        return htmlStr;
    }

    /**
     * Render left items
     * @param id
     * @param dataArray
     * @returns {string}
     */
    function renderLeftItems(id, dataArray, itemName, valueName) {
        var listHtmlStr = "";
        for (var i = 0; i < dataArray.length; i++) {
            listHtmlStr = listHtmlStr +
                '<li class="transfer-double-list-li transfer-double-list-li-' + id + '">' +
                '<div class="checkbox-group">' +
                '<input type="checkbox" value="' + dataArray[i][valueName] + '" class="checkbox-normal checkbox-item-' + id + '" id="itemCheckbox_' + i + '_' + id + '">' +
                '<label class="checkbox-name-' + id + '" for="itemCheckbox_' + i + '_' + id + '">' + dataArray[i][itemName] + '</label>' +
                '</div>' +
                '</li>'
        }
        return listHtmlStr;
    }

    /**
     * Render left group items
     * @param id
     * @param groupDataArray
     * @returns {string}
     */
    function renderLeftGroupItems(id, groupDataArray, groupArrayName, groupItemName, itemName, valueName) {
        var listHtmlStr = "";
        for (var i = 0; i < groupDataArray.length; i++) {
            listHtmlStr = listHtmlStr +
                '<li class="transfer-double-group-list-li transfer-double-group-list-li-' + id + '">'
                + '<div class="checkbox-group">' +
                '<input type="checkbox" class="checkbox-normal group-select-all-' + id + '" id="group_' + i + '_' + id + '">' +
                '<label for="group_' + i + '_' + id + '" class="group-name-' + id + '">' + groupDataArray[i][groupItemName] + '</label>' +
                '</div>';
            if (groupDataArray[i][groupArrayName].length > 0) {
                listHtmlStr = listHtmlStr + '<ul class="transfer-double-group-list-li-ul transfer-double-group-list-li-ul-' + id + '">'
                for (var j = 0; j < groupDataArray[i][groupArrayName].length; j++) {
                    listHtmlStr = listHtmlStr + '<li class="transfer-double-group-list-li-ul-li transfer-double-group-list-li-ul-li-' + id + '">' +
                        '<div class="checkbox-group">' +
                        '<input type="checkbox" value="' + groupDataArray[i][groupArrayName][j][valueName] + '" class="checkbox-normal group-checkbox-item-' + id + ' belongs-group-' + i + '-' + id + '" id="group_' + i + '_checkbox_' + j + '_' + id + '">' +
                        '<label for="group_' + i + '_checkbox_' + j + '_' + id + '" class="group-checkbox-name-' + id + '">' + groupDataArray[i][groupArrayName][j][itemName] + '</label>' +
                        '</div>' +
                        '</li>';
                }
                listHtmlStr = listHtmlStr + '</ul>'
            } else {
                listHtmlStr = listHtmlStr + '</li>';
            }
            listHtmlStr = listHtmlStr + '</li>';
        }
        return listHtmlStr;
    }

    /**
     * get group item number
     * @param {Array} groupDataArray 
     * @param {string}  groupArrayName 
     */
    function getGroupItemsNum(groupDataArray, groupArrayName) {
        var group_item_total_num = 0;
        for (var i = 0; i < groupDataArray.length; i++) {
            var groupItemData = groupDataArray[i][groupArrayName];
            if (groupItemData.length > 0) {
                group_item_total_num = group_item_total_num + groupItemData.length;
            }
        }
        return group_item_total_num;
    }


    /**
     * get selected items
     * @param {string} itemName 
     * @param {string} vlaueName 
     */
    function getSelectedItems(itemName, vlaueName) {
        var selected = [];
        var transferDoubleSelectedListLiArray = $(transferId).find(transferDoubleSelectedListLiClass);
        for (var i = 0; i < transferDoubleSelectedListLiArray.length; i++) {
            var checkboxGroup = transferDoubleSelectedListLiArray.eq(i).find(".checkbox-group");
            var name = checkboxGroup.find("label").text();
            var value = checkboxGroup.find("input").val();
            var item = {};
            item[itemName] = name;
            item[vlaueName] = value;
            selected.push(item);
        }
        return selected;
    }

    /**
     * get the total number by replacing the template
     * @param {*} template 
     * @param {*} total_num 
     */
    function getTotalNumTextByTemplate(template, total_num) {
        var _template = template;
        return _template.replace(/{total_num}/g, total_num);
    }

    /**
     * tab change handler
     * @param {string} itemName 
     * @param {string} valueName 
     * @param {function} callable 
     */
    function tabChangeHandler(itemName, valueName, callable) {
        $(transferId).find(tabClass).on("click", function () {
            $(leftItemSelectAllId).prop("checked", false);
            if (!$(this).is(".tab-active")) {
                $(this).addClass("tab-active").siblings().removeClass("tab-active");
                $(transferDoubleListClass).eq($(transferId).find(tabClass).index(this)).addClass("tab-content-active").siblings().removeClass("tab-content-active");
                $(transferId).find(".checkbox-normal").each(function () {
                    $(this).prop("checked", false);
                });
                
                $(transferId).find(transferDoubleSelectedListUlClass).empty();
                // reset right label text
                $(transferId).find(selectedTotalNumLabelClass).text(default_right_item_total_num_text);
                // unselected
                if ($(transferId).find(firstTabContentClass).css("display") != "none") {
                    var transferDoubleGroupListLiUlLiArray = $(transferId).find(transferDoubleGroupListLiUlLiClass);
                    transferDoubleGroupListLiUlLiArray.each(function () {
                        $(this).css('display', 'block');
                    });
                    $(transferId).find(groupCheckboxItemClass).each(function () {
                        $(this).prop("checked", false);
                    });

                    $(transferId).find(leftItemSelectAllId).prop("disabled", "");

                    $(transferId).find(groupTotalNumLabelClass).empty();
                    $(transferId).find(groupTotalNumLabelClass).append(getTotalNumTextByTemplate(default_total_num_text_template, transferDoubleGroupListLiUlLiArray.length));
                } else {// group

                    var transferDoubleListLiArray = $(transferId).find(transferDoubleListLiClass);

                    // empty disabled
                    for (var j = 0; j < $(transferId).find(groupSelectAllClass).length; j++) {
                        $(transferId).find(groupSelectAllClass).eq(j).prop("disabled", "");
                    }
                    $(transferId).find(groupItemSelectAllId).prop("disabled", "");

                    transferDoubleListLiArray.each(function () {
                        $(this).css('display', 'block');
                    });
                    $(transferId).find(checkboxItemClass).each(function () {
                        $(this).prop("checked", false);
                    });
                    $(transferId).find(totalNumLabelClass).empty();
                    $(transferId).find(totalNumLabelClass).append(getTotalNumTextByTemplate(default_total_num_text_template, transferDoubleListLiArray.length));
                }

                // callable
                if (Object.prototype.toString.call(callable) === "[object Function]") {
                    callable.call(this, getSelectedItems(itemName, valueName));
                }

                $(addSelectedButtonId).removeClass("btn-arrow-active");
                $(deleteSelectedButtonId).removeClass("btn-arrow-active");
            }
        });
    }

    /**
     * left checkbox item click handler
     */
    function leftCheckboxItemClickHandler() {
        $(transferId).on("click", checkboxItemClass, function () {
            var selected_num = 0;
            for (var i = 0; i < $(transferId).find(checkboxItemClass).length; i++) {
                if ($(transferId).find(transferDoubleListLiClass).eq(i).css('display') != "none" && $(transferId).find(checkboxItemClass).eq(i).is(':checked')) {
                    selected_num++;
                }
            }
            if (selected_num > 0) {
                $(addSelectedButtonId).addClass("btn-arrow-active");
            } else {
                $(addSelectedButtonId).removeClass("btn-arrow-active");
            }
        });
    }

    /**
     * left group checkbox item click handler
     */
    function leftGroupCheckboxItemClickHandler() {
        $(transferId).on("click", groupCheckboxItemClass, function () {
            var selected_num = 0;
            for (var i = 0; i < $(transferId).find(groupCheckboxItemClass).length; i++) {
                var groupCheckboxItems = $(transferId).find(groupCheckboxItemClass);
                if ($(transferId).find(transferDoubleGroupListLiUlLiClass).eq(i).css('display') != "none" && groupCheckboxItems.eq(i).is(':checked')) {
                    var id = groupCheckboxItems.eq(i).prop("id");
                    var groupCheckboxItemSplitArray = id.split("_");
                    var groupIndex = groupCheckboxItemSplitArray[1];
                    $(groupSelectAllClass).eq(groupIndex)
                    // TODO: 
                    selected_num++;
                }
            }
            if (selected_num > 0) {
                $(addSelectedButtonId).addClass("btn-arrow-active");
            } else {
                $(addSelectedButtonId).removeClass("btn-arrow-active");
            }
        });
    }

    /**
     * right checkbox item click handler
     */
    function rightCheckboxItemClickHandler() {
        $(transferId).on("click", checkboxSelectedItemClass, function () {
            var deleted_num = 0;
            for (var i = 0; i < $(transferId).find(checkboxSelectedItemClass).length; i++) {
                if ($(transferId).find(checkboxSelectedItemClass).eq(i).is(':checked')) {
                    deleted_num++;
                }
            }
            if (deleted_num > 0) {
                $(deleteSelectedButtonId).addClass("btn-arrow-active");
            } else {
                $(deleteSelectedButtonId).removeClass("btn-arrow-active");
            }
        });
    }

    /**
     * group select all handler
     */
    function groupSelectAllHandler() {
        $(groupSelectAllClass).on("click", function () {
            // group index
            var groupIndex = ($(this).attr("id")).split("_")[1];
            // a group is checked
            if ($(this).is(':checked')) {
                // active button
                $(addSelectedButtonId).addClass("btn-arrow-active");
                for (var i = 0; i < $(transferId).find(".belongs-group-" + groupIndex + "-" + id).length; i++) {
                    if (!$(transferId).find(".belongs-group-" + groupIndex + "-" + id).eq(i).is(':checked') && $(transferId).find(".belongs-group-" + groupIndex + "-" + id).eq(i).parent().parent().css("display") != "none") {
                        $(transferId).find(".belongs-group-" + groupIndex + "-" + id).eq(i).prop("checked", true);
                    }
                }
                var groupCheckedNum = 0;
                $(transferId).find(groupSelectAllClass).each(function () {
                    if ($(this).is(":checked")) {
                        groupCheckedNum = groupCheckedNum + 1;
                    }
                });
                if (groupCheckedNum == $(transferId).find(groupSelectAllClass).length) {
                    $(groupItemSelectAllId).prop("checked", true);
                }
            } else {
                for (var j = 0; j < $(transferId).find(".belongs-group-" + groupIndex + "-" + id).length; j++) {
                    if ($(transferId).find(".belongs-group-" + groupIndex + "-" + id).eq(j).is(':checked') && $(transferId).find(".belongs-group-" + groupIndex + "-" + id).eq(i).parent().parent().css("display") != "none") {
                        $(transferId).find(".belongs-group-" + groupIndex + "-" + id).eq(j).prop("checked", false);
                    }
                }
                var groupCheckedNum = 0;
                $(transferId).find(groupSelectAllClass).each(function () {
                    if ($(this).is(":checked")) {
                        groupCheckedNum = groupCheckedNum + 1;
                    }
                });
                if (groupCheckedNum != $(transferId).find(groupSelectAllClass).length) {
                    $(groupItemSelectAllId).prop("checked", false);
                }
                if (groupCheckedNum == 0) {
                    $(addSelectedButtonId).removeClass("btn-arrow-active");
                }
            }
        });
    }

    /**
     * left item select all handler
     */
    function leftItemSelectAllHandler() {
        $(leftItemSelectAllId).on("click", function () {
            if ($(this).is(':checked')) {
                for (var i = 0; i < $(transferId).find(checkboxItemClass).length; i++) {
                    if ($(transferId).find(transferDoubleListLiClass).eq(i).css('display') != "none" && !$(transferId).find(checkboxItemClass).eq(i).is(':checked')) {
                        $(transferId).find(checkboxItemClass).eq(i).prop("checked", true);
                    }
                }
                $(addSelectedButtonId).addClass("btn-arrow-active");
            } else {
                for (var i = 0; i < $(transferId).find(checkboxItemClass).length; i++) {
                    if ($(transferId).find(transferDoubleListLiClass).eq(i).css('display') != "none" && $(transferId).find(checkboxItemClass).eq(i).is(':checked')) {
                        $(transferId).find(checkboxItemClass).eq(i).prop("checked", false);
                    }
                }
                $(addSelectedButtonId).removeClass("btn-arrow-active");
            }
        });
    }

    /**
     * group item select all handelr
     */
    function groupItemSelectAllHandler() {
        $(groupItemSelectAllId).on("click", function () {
            if ($(this).is(':checked')) {
                for (var i = 0; i < $(transferId).find(groupCheckboxItemClass).length; i++) {
                    if ($(transferId).find(transferDoubleGroupListLiUlLiClass).eq(i).css('display') != "none" && !$(transferId).find(groupCheckboxItemClass).eq(i).is(':checked')) {
                        $(transferId).find(groupCheckboxItemClass).eq(i).prop("checked", true);
                    }
                    if (!$(transferId).find(groupSelectAllClass).eq(i).is(':checked')) {
                        $(transferId).find(groupSelectAllClass).eq(i).prop("checked", true);
                    }
                }
                $(addSelectedButtonId).addClass("btn-arrow-active");
            } else {
                for (var i = 0; i < $(transferId).find(groupCheckboxItemClass).length; i++) {
                    if ($(transferId).find(transferDoubleGroupListLiUlLiClass).eq(i).css('display') != "none" && $(transferId).find(groupCheckboxItemClass).eq(i).is(':checked')) {
                        $(transferId).find(groupCheckboxItemClass).eq(i).prop("checked", false);
                    }
                    if ($(transferId).find(groupSelectAllClass).eq(i).is(':checked')) {
                        $(transferId).find(groupSelectAllClass).eq(i).prop("checked", false);
                    }
                }
                $(addSelectedButtonId).removeClass("btn-arrow-active");
            }
        });
    }

    /**
     * move the selected item to the right handler
     * @param {string} itemName 
     * @param {string} valueName 
     * @param {number} item_total_num 
     * @param {number} group_item_total_num 
     * @param {function} callable 
     */
    function moveSelectedItemsToRightHandler(itemName, valueName, item_total_num, group_item_total_num, callable) {
        $(addSelectedButtonId).on("click", function () {
            var listHtmlStr = "";
            var selectedItemNum = 0;
            if ($(transferId).find(firstTabContentClass).css("display") != "none") {
                var groupCheckboxItems = $(transferId).find(groupCheckboxItemClass);
                for (var i = 0; i < groupCheckboxItems.length; i++) {
                    if (groupCheckboxItems.eq(i).is(':checked')) {
                        var checkboxItemId = groupCheckboxItems.eq(i).attr("id");
                        var checkboxItemArray = checkboxItemId.split("_");
                        var groupIndex = checkboxItemArray[1];
                        var itemIndex = checkboxItemArray[3];
                        var labelText = $(transferId).find(groupCheckboxNameLabelClass).eq(i).text();
                        var value = groupCheckboxItems.eq(i).val();
                        $(transferId).find(transferDoubleGroupListLiUlLiClass).eq(i).css('display', 'none');
                        listHtmlStr = listHtmlStr + generateGroupItem(id, groupIndex, itemIndex, value, labelText);
                        selectedItemNum = selectedItemNum + 1;
                    }
                }
                var groupSelectAllArray = $(transferId).find(groupSelectAllClass);
                for (var j = 0; j < groupSelectAllArray.length; j++) {
                    if (groupSelectAllArray.eq(j).is(":checked")) {
                        groupSelectAllArray.eq(j).prop("disabled", "disabled");
                    }
                }
                var groupTotalNumLabel = $(transferId).find(groupTotalNumLabelClass);
                groupTotalNumLabel.empty();
                // calculate left group items number
                new_group_item_total_num = group_item_total_num - selectedItemNum;
                // calculate selected items number
                selected_total_num = selectedItemNum;
                var new_group_item_total_num_text = getTotalNumTextByTemplate(default_total_num_text_template, new_group_item_total_num);
                groupTotalNumLabel.append(new_group_item_total_num_text);
                $(transferId).find(selectedTotalNumLabelClass).text(getTotalNumTextByTemplate(default_total_num_text_template, selected_total_num));
                if (new_group_item_total_num == 0) {
                    $(groupItemSelectAllId).prop("checked", true);
                    $(groupItemSelectAllId).prop("disabled", "disabled");
                }
            } else {
                var checkboxItems = $(transferId).find(checkboxItemClass);
                for (var i = 0; i < checkboxItems.length; i++) {
                    if (checkboxItems.eq(i).is(':checked')) {
                        var checkboxItemId = checkboxItems.eq(i).attr("id");
                        // checkbox item index
                        var index = checkboxItemId.split("_")[1];
                        var labelText = $(transferId).find(checkboxItemLabelClass).eq(i).text();
                        var value = checkboxItems.eq(i).val();
                        $(transferId).find(transferDoubleListLiClass).eq(i).css('display', 'none');
                        listHtmlStr = listHtmlStr + generateItem(id, index, value, labelText);
                        selectedItemNum = selectedItemNum + 1;
                    }
                }
                var totalNumLabel = $(transferId).find(totalNumLabelClass); 
                totalNumLabel.empty();
                // calculate left items number
                new_item_total_num = item_total_num - selectedItemNum;
                // calculate selected items number
                selected_total_num = selectedItemNum;
                var new_item_total_num_text = getTotalNumTextByTemplate(default_total_num_text_template, new_item_total_num);
                totalNumLabel.append(new_item_total_num_text);
                $(transferId).find(selectedTotalNumLabelClass).text(getTotalNumTextByTemplate(default_total_num_text_template, selected_total_num));
                if (new_item_total_num == 0) {
                    $(leftItemSelectAllId).prop("checked", true);
                    $(leftItemSelectAllId).prop("disabled", "disabled");
                }
            }

            $(addSelectedButtonId).removeClass("btn-arrow-active");
            var transferDoubleSelectedListUl = $(transferId).find(transferDoubleSelectedListUlClass);
            transferDoubleSelectedListUl.empty();
            transferDoubleSelectedListUl.append(listHtmlStr);

            // callable
            if (Object.prototype.toString.call(callable) === "[object Function]") {
                callable.call(this, getSelectedItems(itemName, valueName));
            }
        });
    }

    /**
     * generate item
     * @param {string} id 
     * @param {number} index checkbox item index
     * @param {string} value 
     * @param {string} labelText 
     */
    function generateItem(id, index, value, labelText) {
        return '<li class="transfer-double-selected-list-li  transfer-double-selected-list-li-' + id + ' .clearfix">' +
                            '<div class="checkbox-group">' +
                            '<input type="checkbox" value="' + value + '" class="checkbox-normal checkbox-selected-item-' + id + '" id="selectedCheckbox_' + index + '_' + id + '">' +
                            '<label class="checkbox-selected-name-' + id + '" for="selectedCheckbox_' + index + '_' + id + '">' + labelText + '</label>' +
                            '</div>' +
                            '</li>';
    }

    /**
     * generate group item
     * @param {string} id 
     * @param {number} groupIndex group checkbox item index
     * @param {number} itemIndex checkbox item index
     * @param {string} value 
     * @param {string} labelText 
     */
    function generateGroupItem(id, groupIndex, itemIndex, value, labelText) {
        return '<li class="transfer-double-selected-list-li transfer-double-selected-list-li-' + id + ' .clearfix">' +
        '<div class="checkbox-group">' +
        '<input type="checkbox" value="' + value + '" class="checkbox-normal checkbox-selected-item-' + id + '" id="group_' + groupIndex + '_selectedCheckbox_' + itemIndex + '_' + id + '">' +
        '<label class="checkbox-selected-name-' + id + '" for="group_' + groupIndex + '_selectedCheckbox_' + itemIndex + '_' + id + '">' + labelText + '</label>' +
        '</div>' +
        '</li>'
    }

    /**
     * move the selected item to the left handler
     * @param {string} itemName 
     * @param {string} valueName 
     * @param {function} callable 
     */
    function moveSelectedItemsToLeftHandler(itemName, valueName, callable) {
        $(deleteSelectedButtonId).on("click", function () {
            var deleteItemNum = 0;
            if ($(transferId).find(firstTabContentClass).css("display") != "none") {
                for (var i = 0; i < $(transferId).find(checkboxSelectedItemClass).length;) {
                    var checkboxSelectedItems = $(transferId).find(checkboxSelectedItemClass);
                    if (checkboxSelectedItems.eq(i).is(':checked')) {
                        var checkboxSelectedItemId = checkboxSelectedItems.eq(i).attr("id");
                        var groupItemIdArray = checkboxSelectedItemId.split("_");
                        var groupId = groupItemIdArray[1];
                        var idIndex = groupItemIdArray[3];
                        $(transferId).find(transferDoubleSelectedListLiClass).eq(i).remove();
                        $(transferId).find("#group_" + groupId + "_" + id).prop("checked", false);
                        $(transferId).find("#group_" + groupId + "_" + id).removeAttr("disabled");
                        $(transferId).find("#group_" + groupId + "_checkbox_" + idIndex + "_" + id).prop("checked", false);
                        $(transferId).find("#group_" + groupId + "_checkbox_" + idIndex + "_" + id).parent().parent().css('display', 'block');
                        deleteItemNum = deleteItemNum + 1;
                    } else {
                        i++;
                    }
                }
                $(transferId).find(groupTotalNumLabelClass).empty();
                // calculate left items number
                new_group_item_total_num = new_group_item_total_num + deleteItemNum;
                // calculate selected items number
                selected_total_num -= deleteItemNum;
                var new_group_item_total_num_text = getTotalNumTextByTemplate(default_total_num_text_template, new_group_item_total_num);
                $(transferId).find(groupTotalNumLabelClass).append(new_group_item_total_num_text);
                $(transferId).find(selectedTotalNumLabelClass).text(getTotalNumTextByTemplate(default_total_num_text_template, selected_total_num));
                if ($(groupItemSelectAllId).is(':checked')) {
                    $(groupItemSelectAllId).prop("checked", false);
                    $(groupItemSelectAllId).removeAttr("disabled");
                }
            } else {
                for (var i = 0; i < $(transferId).find(checkboxSelectedItemClass).length;) {
                    var checkboxSelectedItems = $(transferId).find(checkboxSelectedItemClass);
                    if (checkboxSelectedItems.eq(i).is(':checked')) {
                        var checkboxSelectedItemId = checkboxSelectedItems.eq(i).attr("id");
                        var idIndex = checkboxSelectedItemId.split("_")[1];
                        var val = $(transferId).find(checkboxSelectedNameLabelClass).eq(i).text();
                        $(transferId).find(transferDoubleSelectedListLiClass).eq(i).remove();
                        $(transferId).find(checkboxItemClass).eq(idIndex).prop("checked", false);
                        $(transferId).find(transferDoubleListLiClass).eq(idIndex).css('display', 'block');
                        deleteItemNum = deleteItemNum + 1;
                    } else {
                        i++;
                    }
                }
                $(transferId).find(totalNumLabelClass).empty();
                // calculate left items number
                new_item_total_num = new_item_total_num + deleteItemNum;
                // calculate selected items number
                selected_total_num -= deleteItemNum;
                var new_item_total_num_text = getTotalNumTextByTemplate(default_total_num_text_template, new_item_total_num);
                $(transferId).find(totalNumLabelClass).append(new_item_total_num_text);
                $(transferId).find(selectedTotalNumLabelClass).text(getTotalNumTextByTemplate(default_total_num_text_template, selected_total_num));
                if ($(leftItemSelectAllId).is(':checked')) {
                    $(leftItemSelectAllId).prop("checked", false);
                    $(leftItemSelectAllId).removeAttr("disabled");
                }
            }
            $(deleteSelectedButtonId).removeClass("btn-arrow-active");
            // callable
            if (Object.prototype.toString.call(callable) === "[object Function]") {
                callable.call(this, getSelectedItems(itemName, valueName));
            }
        });
    }

    /**
     * left items search handler
     */
    function leftItemsSearchHandler() {
        $(itemSearcherId).on("keyup", function () {
            $(transferId).find(transferDoubleListUlClass).css('display', 'block');
            if ($(itemSearcherId).val() == "") {
                for (var i = 0; i < $(transferId).find(checkboxItemClass).length; i++) {
                    if (!$(transferId).find(checkboxItemClass).eq(i).is(':checked')) {
                        $(transferId).find(transferDoubleListLiClass).eq(i).css('display', 'block');
                    }
                }
                return;
            }

            $(transferId).find(transferDoubleListLiClass).css('display', 'none');

            for (var j = 0; j < $(transferId).find(transferDoubleListLiClass).length; j++) {
                if (!$(transferId).find(checkboxItemClass).eq(j).is(':checked') 
                    && $(transferId).find(transferDoubleListLiClass).eq(j).text()
                        .substr(0, $(itemSearcherId).val().length).toLowerCase() == $(itemSearcherId).val().toLowerCase()) {
                    $(transferId).find(transferDoubleListLiClass).eq(j).css('display', 'block');
                }
            }
        });
    }

    /**
     * left group items search handler
     */
    function leftGroupItemsSearchHandler() {
        $(groupItemSearcherId).on("keyup", function () {
            $(transferId).find(transferDoubleGroupListUlClass).css('display', 'block');
            if ($(groupItemSearcherId).val() == "") {
                for (var i = 0; i < $(transferId).find(groupCheckboxItemClass).length; i++) {
                    if (!$(transferId).find(checkboxItemClass).eq(i).is(':checked')) {
                        $(transferId).find(transferDoubleGroupListLiUlLiClass).eq(i).parent().parent().css('display', 'block');
                        $(transferId).find(transferDoubleGroupListLiUlLiClass).eq(i).css('display', 'block');
                    }
                }
                return;
            }

            $(transferId).find(transferDoubleGroupListLiClass).css('display', 'none');
            $(transferId).find(transferDoubleGroupListLiUlLiClass).css('display', 'none');

            for (var j = 0; j < $(transferId).find(transferDoubleGroupListLiUlLiClass).length; j++) {
                if (!$(transferId).find(groupCheckboxItemClass).eq(j).is(':checked') 
                    && $(transferId).find(transferDoubleGroupListLiUlLiClass).eq(j).text()
                        .substr(0, $(groupItemSearcherId).val().length).toLowerCase() == $(groupItemSearcherId).val().toLowerCase()) {
                    $(transferId).find(transferDoubleGroupListLiUlLiClass).eq(j).parent().parent().css('display', 'block');
                    $(transferId).find(transferDoubleGroupListLiUlLiClass).eq(j).css('display', 'block');
                }
            }
        });
    }

    /**
     * right items search handler
     */
    function rightItemsSearchHandler() {
        $(selectedItemSearcherId).keyup(function () {
            $(transferId).find(transferDoubleSelectedListUlClass).css('display', 'block');

            if ($(selectedItemSearcherId).val() == "") {
                $(transferId).find(transferDoubleSelectedListLiClass).css('display', 'block');
                return;
            }
            $(transferId).find(transferDoubleSelectedListLiClass).css('display', 'none');

            for (var i = 0; i < $(transferId).find(transferDoubleSelectedListLiClass).length; i++) {
                if ($(transferId).find(transferDoubleSelectedListLiClass).eq(i).text()
                        .substr(0, $(selectedItemSearcherId).val().length).toLowerCase() == $(selectedItemSearcherId).val().toLowerCase()) {
                    $(transferId).find(transferDoubleSelectedListLiClass).eq(i).css('display', 'block');
                }
            }
        });
    }

}(jQuery));