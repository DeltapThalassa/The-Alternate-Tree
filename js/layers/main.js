addLayer("Main", {
    name: "Main",
    symbol: "M",
    layerShown() { return true },
    position: 0,
    row: 0,
    color: "#FFFFFF",
    type: "normal",
    exponent: 0.5,
    requires: new Decimal(Infinity),
    resource: "None",
    baseResource: "None",
    baseAmount() { return player.points },
    gainMult() { return new Decimal(0) },
    gainExp() { return new Decimal(0) },

    startData() {
        return {
            unlocked: true,
            points: new Decimal(0),
        }
    },

    tabFormat() {
        var tabformat = []
        tabformat.push(
            ['tree', [
                ['e'],
                ['i', 'c']
            ]])
        return tabformat
    },
})