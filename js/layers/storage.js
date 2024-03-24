addLayer("Storage", {
    name: "Storage",
    symbol: "S",
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

            stoneUnlock: 0,
            stonebrickUnlock: 0,
            oreCoalUnlock: 0,
            metalCopperUnlock: 0,
            metalTinUnlock: 0,
            alloyBronzeUnlock: 0,
        }
    },

    tabFormat() {
        var tabformat = []
        tabformat.push(["raw-html", StorageTable()])
        return tabformat
    },



    stoneUnlock() {// 石材显示
        if (player.i.stone.gt(0) || !tmp.i.stoneChange.eq(0))
            player.Storage.stoneUnlock = 1
    },
    stonebrickUnlock() {// 石砖显示
        if (player.i.stonebrick.gt(0) || !tmp.i.stonebrickChange.eq(0))
            player.Storage.stonebrickUnlock = 1
    },
    oreCoalUnlock() {// 煤显示
        if (player.i.oreCoal.gt(0) || !tmp.i.oreCoalChange.eq(0))
            player.Storage.oreCoalUnlock = 1
    },
    metalCopperUnlock() {// 铜显示
        if (player.i.metalCopper.gt(0) || !tmp.i.metalCopperChange.eq(0))
            player.Storage.metalCopperUnlock = 1
    },
    metalTinUnlock() {// 锡显示
        if (player.i.metalTin.gt(0) || !tmp.i.metalTinChange.eq(0))
            player.Storage.metalTinUnlock = 1
    },
    alloyBronzeUnlock() {// 锡显示
        if (player.i.alloyBronze.gt(0) || !tmp.i.alloyBronzeChange.eq(0))
            player.Storage.alloyBronzeUnlock = 1
    },
})