var layoutInfo = {
    startTab: "none",
    startNavTab: "tree-tab",
    showTree: true,

    treeLayout: ""


}


// A "ghost" layer which offsets other layers in the tree
addNode("blank", {
    layerShown: "ghost",
},
)


addLayer("tree-tab", {
    tabFormat: {
        "仓储": {
            buttonStyle() {
                style = []
                style['opacity'] = '0'
                return style
            },
            shouldNotify: true,
            embedLayer: "Storage"
        },
    },
    previousTab: "",
    leftTab: true,
})