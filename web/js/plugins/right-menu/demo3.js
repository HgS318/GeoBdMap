exampleMenuItemSource = function (selector) {
    if ($(selector).attr('id') == 'PNG_JPG') {
        return [
            {
                header: 'Example Dynamic'
            },
            {
                text: 'PNG',
                action: function(e, selector) { alert('PNG clicked on ' + selector.prop("tagName") + ":" + selector.attr("id")); }
            },
            {
                text: 'JPG',
                action: function(e, selector) { alert('JPG clicked on ' + selector.prop("tagName") + ":" + selector.attr("id")); }
            },
            {   divider: true   },
            {
                icon: 'glyphicon-list-alt',
                text: 'Dynamic nested',
                subMenu : [
                    {
                        text: 'More dynamic',
                        action: function(e, selector) { alert('More dynamic clicked on ' + selector.prop("tagName") + ":" + selector.attr("id")); }
                    },
                    {
                        text: 'And more...',
                        action: function(e, selector) { alert('And more... clicked on ' + selector.prop("tagName") + ":" + selector.attr("id")); }
                    }
                ]
            }
        ]
    } else {
        return [
            {
                icon: 'glyphicon-exclamation-sign',
                text: 'No image types supported!'
            }
        ]
    }
}

test_menu = {
    id: 'TEST-MENU',
    data: [
        {
            header: '地名'
        },
        {
            icon: 'glyphicon-plus',
            text: '创建地名',
            // action: function(e, selector) { alert('Create clicked on ' + selector.prop("tagName") + ":" + selector.attr("id")); }
            subMenu : [
                {
                    icon: 'glyphicon-plus',
                    text: '点状地名',
                    action: function(e, selector) {
                        // alert('Text clicked on ' + selector.prop("tagName") + ":" + selector.attr("id"));
                        window.open("html/placeEdit.html?x=" + mousePos[0] + "&y=" + mousePos[1] + "&spaType=1");
                    }
                },
                {
                    icon: 'glyphicon-plus',
                    text: '线状地名',
                    action: function(e, selector) {
                        // alert('Text clicked on ' + selector.prop("tagName") + ":" + selector.attr("id"));
                        window.open("html/placeEdit.html?x=" + mousePos[0] + "&y=" + mousePos[1] + "&spaType=3");
                    }
                }
            ]
        },
        // {
        //     icon: 'glyphicon-edit',
        //     text: '编辑地名',
        //     action: function(e, selector) { alert('Edit clicked on ' + selector.prop("tagName") + ":" + selector.attr("id")); }
        // },
        // {
        //     icon: 'glyphicon-list-alt',
        //     text: 'View Data As:',
        //     subMenu : [
        //         {
        //             text: 'Text',
        //             action: function(e, selector) { alert('Text clicked on ' + selector.prop("tagName") + ":" + selector.attr("id")); }
        //         },
        //         {
        //             text: 'Image',
        //             subMenu: [
        //                 {
        //                     menu_item_src : exampleMenuItemSource
        //                 }
        //             ]
        //         }
        //     ]
        // },
        {
            divider: true
        },
        {
            header: '行政区'
        },
        {
            icon: 'glyphicon-edit',
            text: '创建行政区',
            action: function(e, selector) {
                // alert('Delete clicked on ' + selector.prop("tagName") + ":" + selector.attr("id"));
                window.open("html/distEdit.html?x=" + mousePos[0] +"&y=" + mousePos[1]);
            }
        },
        // {
        //     divider: true
        // },
        // {
        //     header: '界线界桩'
        // },
        // {
        //     icon: 'glyphicon-edit',
        //     text: '编辑界线界桩',
        //     action: function(e, selector) { alert('Delete clicked on ' + selector.prop("tagName") + ":" + selector.attr("id")); }
        // },
    ]
};

test_menu2 = [
    {
        header: 'Example'
    },
    {
        icon: 'glyphicon-plus',
        text: 'Create',
        action: function(e, selector) { alert('Create clicked on ' + selector.prop("tagName") + ":" + selector.attr("id")); }
    },
    {
        icon: 'glyphicon-edit',
        text: 'Edit',
        action: function(e, selector) { alert('Edit clicked on ' + selector.prop("tagName") + ":" + selector.attr("id")); }
    }
];
