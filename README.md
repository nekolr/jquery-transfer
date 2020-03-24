# Introduction
A jQuery plugin that is a shuttle box.

# Preview
![snapshot01](https://github.com/nekolr/jquery-transfer/blob/master/snapshot/snapshot01.png)

![snapshot02](https://github.com/nekolr/jquery-transfer/blob/master/snapshot/snapshot02.png)

![snapshot03](https://github.com/nekolr/jquery-transfer/blob/master/snapshot/snapshot03.png)

![snapshot04](https://github.com/nekolr/jquery-transfer/blob/master/snapshot/snapshot04.png)

![snapshot05](https://github.com/nekolr/jquery-transfer/blob/master/snapshot/snapshot05.png)

![snapshot06](https://github.com/nekolr/jquery-transfer/blob/master/snapshot/snapshot06.png)

![snapshot07](https://github.com/nekolr/jquery-transfer/blob/master/snapshot/snapshot07.png)

# options
| option | description | type | default |
| ------------ | ------------ | ------------ | ------------ |
| itemName | The name of each item in the data | string | item |
| groupItemName | The name of each group in the data | string | groupItem |
| groupArrayName | The name of the data array for each group | string | groupArray |
| valueName | The value name of each item in the data | string | value |
| tabNameText | The left tab text | string | items |
| rightTabNameText | The right tab text | string | selected items |
| searchPlaceholderText | The searcher's placeholder text | string | search |
| dataArray | items data array | array |  |
| groupDataArray | grouping item data array | array |  |

# Usage

## grouping
```js
var groupDataArray = [
    {
        groupItem: "China", 
        groupArray: [
            {
                item: "Beijing", 
                value: 1
            },
            {
                item: "Shanghai", 
                value: 2
            }
        ]
    },
    {
        groupItem: "Japan",
        groupArray: [
            {
                item: "Tokyo", 
                value: 6
            }
        ]
    }
];
var settings = {
    groupDataArray: groupDataArray,
    callable: function (items) {
        // your code
    }
};

var transfer = $(".transfer").transfer(settings);
// get selected items
transfer.getSelectedItems();
```

## no grouping
```js
var dataArray = [
    {
        item: "Beijing", 
        value: 1
    },
    {
        item: "Shanghai", 
        value: 2
    },
    {
        item: "Tokyo", 
        value: 6
    }
];
var settings = {
    dataArray: dataArray,
    callable: function (items) {
        // your code
    }
};

var transfer = $(".transfer").transfer(settings);
// get selected items
transfer.getSelectedItems();
```

## selected data

```js
var dataArray = [
    {
        item: "Beijing", 
        value: 1,
        selected: true
    },
    {
        item: "Shanghai", 
        value: 2
    },
    {
        item: "Tokyo", 
        value: 6
    }
];
```

## disabled data
```js
var dataArray = [
    {
        item: "Beijing", 
        value: 1,
        disabled: true
    },
    {
        item: "Shanghai", 
        value: 2
    },
    {
        item: "Tokyo", 
        value: 6
    }
];
```