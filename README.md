# Introduction
A jQuery plugin that is a shuttle box.

# Preview

![grouping](https://github.com/nekolr/jquery-transfer/blob/master/snapshot/20180815211719.png)

![grouping](https://github.com/nekolr/jquery-transfer/blob/master/snapshot/20180815211740.png)

![no grouping](https://github.com/nekolr/jquery-transfer/blob/master/snapshot/20180815211809.png)

![fast search](https://github.com/nekolr/jquery-transfer/blob/master/snapshot/20180815211846.png)

# options
| option | description | type | default |
| ------------ | ------------ | ------------ | ------------ |
| itemName | The name of each item in the data | string | item |
| groupItemName | The name of each group in the data | string | groupItem |
| groupArrayName | The name of the data array for each group | string | groupArray |
| valueName | The value name of each item in the data | string | value |
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

$(".transfer").transfer(settings);
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

$(".transfer").transfer(settings);
```
