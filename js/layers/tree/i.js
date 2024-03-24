addLayer('i', {
    name: 'industry',
    symbol: '工业',
    position: 9,
    color: '#BFBFBF',
    requires: new Decimal(Infinity),
    resource: '无',
    baseResource: '无',
    baseAmount() {
        return player.points
    },
    type: 'normal',
    exponent: 0.5,
    gainMult() {
        mult = new Decimal(1)
        return mult
    },
    gainExp() {
        return new Decimal(1)
    },
    row: 8,
    position: 2,
    hotkeys: [],

    autoPrestige: true,

    startData() {
        return {
            unlocked: false,
            points: new Decimal(0),
            pointsName: '贝币',

            stone: new Decimal(0),
            stonebrick: new Decimal(0),
            oreCoal: new Decimal(0),
            metalCopper: new Decimal(0),
            metalTin: new Decimal(0),
            alloyBronze: new Decimal(0),

            cutterOn: new Decimal(0),

            smelterOn: new Decimal(0),
            smeltBronzeOn: new Decimal(0)

        }
    },

    layerShown() {
        return hasMilestone('c', 0) || player.i.unlocked
    },

    tooltip() { return '' },

    tabFormat() {
        var tabformat = []
        tabformat.push(["raw-html", LayerButtons()])
        tabformat.push('blank')
        tabformat.push('blank')
        tabformat.push('blank')
        tabformat.push(['display-text', `<h3>您有</h3> <h1>${format(player.c.points)}</h1> <h3>${moneyName()}`])
        tabformat.push('blank')
        tabformat.push(
            ['microtabs',
                'storage'])
        return tabformat
    },

    microtabs: {
        storage: {
            采掘: {
                content() {
                    var tabformat = []
                    tabformat.push('blank')
                    var tabformat1Title = [
                        'blank', 'blank',
                        ['display-text', '<h2>采集'],
                        ['h-line', '700px'],
                        'blank']
                    if (hasUpgrade('c', 21)) { tabformat1Title.push(['buyable', 11]) }
                    var tabformat2Title = [
                        'blank', 'blank',
                        ['display-text', '<h2>矿石'],
                        ['h-line', '700px'],
                        'blank']
                    if (hasUpgrade('c', 26)) {
                        tabformat2Title.push(
                            ['column', [
                                ['row', [['buyable', 12], ['buyable', 13], ['buyable', 14]], {}]
                            ], {}])
                    }
                    if (tabformat1Title.length > 5) tabformat = tabformat.concat(tabformat1Title)
                    if (tabformat2Title.length > 5) tabformat = tabformat.concat(tabformat2Title)
                    return tabformat
                }
            },
            工艺: {
                content() {
                    var tabformat = []
                    tabformat.push('blank')
                    var tabformat1 = [
                        ['display-text', '<h2>工艺品'],
                        ['h-line', '700px'],
                        'blank']
                    if (tmp.i.buyables[21].unlocked) {
                        tabformat1.push(
                            ['column', [
                                ['buyable', 21],
                                ['row', [
                                    ['clickable', 'cutterAdd'],
                                    ['column', [['display-text', player.i.cutterOn + '/' + getBuyableAmount('i', 21)]], { 'width': '100px' }],
                                    ['clickable', 'cutterSub'],
                                ], {}]], {}])
                    }
                    var tabformat2Title = [
                        'blank', 'blank',
                        ['display-text', '<h2>工业'],
                        ['h-line', '700px'],
                        'blank']
                    var tabformat2Upper = [
                    ]
                    if (tmp.i.buyables[31].unlocked) tabformat2Upper.push(['buyable', 31])
                    if (tabformat2Upper.length > 0) tabformat2Title.push(['row', tabformat2Upper, {}], 'blank')
                    var tabformat2Lower = [
                        ['h-line', '700px'],
                        ['row', [
                            ['column', [['display-text', '<h3>产品']], { 'width': '100px' }],
                            ['column', [['display-text', '<h3>原料']], { 'width': '100px' }],
                            ['column', [['display-text', '<h3>消耗(/s)']], { 'width': '175px' }],
                            ['column', [['display-text', '<h3>生产']], { 'width': '175px' }],
                            ['column', [['display-text', '<h3>启用']], { 'width': '150px' }],
                        ], { 'width': '700px', 'height': '30px' }],
                        ['h-line', '700px'],
                    ]
                    if (hasUpgrade('c', 216)) tabformat2Lower.push(
                        ['row', [
                            ['column', [['display-text', `<h3>${resourceName.alloyBronze}`]], { 'width': '100px' }],
                            ['column', [
                                ['display-text', `<h3>${resourceName.metalCopper}`],
                                ['display-text', `<h3>${resourceName.metalTin}`],
                            ], { 'width': '100px' }],
                            ['column', [
                                ['display-text', `<h3>${format(tmp.i.metalCopperUsed[1])}`],
                                ['display-text', `<h3>${format(tmp.i.metalTinUsed[1])}`],
                            ], { 'width': '175px' }],
                            ['column', [['display-text', `<h3>${format(tmp.i.alloyBronzeGain[1])}`]], { 'width': '175px' }],
                            ['row', [
                                ['clickable', 'smeltBronzeAdd'],
                                ['row', [['display-text', formatWhole(player.i.smeltBronzeOn) + '/' + formatWhole(tmp.i.smeltBronzeLimit)]], { 'width': '90px' }],
                                ['clickable', 'smeltBronzeSub'],
                            ], { 'width': '150px' }],
                        ], { 'width': '700px', 'height': '60px' }],
                        ['h-line', '700px'],
                    )

                    if (tabformat1.length > 3) tabformat = tabformat.concat(tabformat1)
                    if (tabformat2Title.length > 5) tabformat = tabformat.concat(tabformat2Title)
                    if (tabformat2Lower.length > 3) tabformat = tabformat.concat(tabformat2Lower)
                    tabformat.push('blank', 'blank')
                    return tabformat
                }
            },
        },
    },

    update(diff) {
        player.i.stone = player.i.stone.add(tmp.i.stoneChange.mul(diff))
        if (player.i.stone.lte(0)) player.i.stone = new Decimal(0)
        player.i.stonebrick = player.i.stonebrick.add(tmp.i.stonebrickChange.mul(diff))
        if (player.i.stonebrick.lte(0)) player.i.stonebrick = new Decimal(0)
        player.i.oreCoal = player.i.oreCoal.add(tmp.i.oreCoalChange.mul(diff))
        if (player.i.oreCoal.lte(0)) player.i.oreCoal = new Decimal(0)
        player.i.metalCopper = player.i.metalCopper.add(tmp.i.metalCopperChange.mul(diff))
        if (player.i.metalCopper.lte(0)) player.i.metalCopper = new Decimal(0)
        player.i.metalTin = player.i.metalTin.add(tmp.i.metalTinChange.mul(diff))
        if (player.i.metalTin.lte(0)) player.i.metalTin = new Decimal(0)
        player.i.alloyBronze = player.i.alloyBronze.add(tmp.i.alloyBronzeChange.mul(diff))
        if (player.i.alloyBronze.lte(0)) player.i.alloyBronze = new Decimal(0)
    },

    automate() { },

    upgrades: {},

    buyables: {
        11: {
            title() { return '<h3>' + quarryBuildingName() + '</h3><br>矿产建筑<br>' },
            display() {
                var description = `每个${quarryBuildingName()}生产 ${formatWhole(tmp.i.stoneByPerQuarry)} ${resourceName.stone}`
                var amount = `数量：${formatWhole(getBuyableAmount(this.layer, this.id))} ${quarryBuildingName()}`
                var cost = `价格：${format(this.cost())} ${moneyName()}`
                var effect = `效果：${format(this.effect())} ${resourceName.stone}`
                var text = '<h3>' + description + '<br><br>' + amount + '<br>' + effect + '<br>' + cost
                return text
            },
            effect() { return getBuyableAmount(this.layer, this.id).mul(tmp.i.stoneByPerQuarry) },
            canAfford() { return player.c.points.gte(this.cost()) },
            cost(x = player[this.layer].buyables[this.id]) {
                var cost = new Decimal(tmp.i.quarryCostCreep).pow(x).mul(80).mul(tmp.i.buildingPriceRevise)
                if (hasUpgrade('c', 212)) cost = cost.mul(0.75)
                return cost
            },
            unlocked() { return hasUpgrade('c', 21) },
            buy() {
                player.c.points = player.c.points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            style() {
                var style = {}
                style['border-radius'] = '25px'
                style['height'] = '200px'
                style['width'] = '200px'
                return style
            },
        },
        12: {
            title() { return '<h3>' + coalMineBuildingName() + '</h3><br>矿产建筑<br>' },
            display() {
                var description = `每个${coalMineBuildingName()}生产 ${formatWhole(tmp.i.metalCopperByPerMine)} ${resourceName.oreCoal}`
                var amount = `数量：${formatWhole(getBuyableAmount(this.layer, this.id))} ${coalMineBuildingName()}`
                var cost = `价格：${format(this.cost())} ${moneyName()}`
                var effect = `效果：${format(this.effect())} ${resourceName.metalCopper}`
                var text = '<h3>' + description + '<br><br>' + amount + '<br>' + effect + '<br>' + cost
                return text
            },
            effect() { return getBuyableAmount(this.layer, this.id).mul(tmp.i.metalCopperByPerMine) },
            canAfford() { return player.c.points.gte(this.cost()) },
            cost(x = player[this.layer].buyables[this.id]) {
                var cost = new Decimal(tmp.i.quarryCostCreep).pow(x).mul(80).mul(tmp.i.buildingPriceRevise)
                if (hasUpgrade('c', 212)) cost = cost.mul(0.75)
                return cost
            },
            unlocked() { return hasUpgrade('c', 26) },
            buy() {
                player.c.points = player.c.points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            style() {
                var style = {}
                style['border-radius'] = '25px'
                style['height'] = '200px'
                style['width'] = '200px'
                return style
            },
        },
        13: {
            title() { return '<h3>' + copperMineBuildingName() + '</h3><br>矿产建筑<br>' },
            display() {
                var description = `每个${copperMineBuildingName()}生产 ${formatWhole(tmp.i.metalCopperByPerMine)} ${resourceName.metalCopper}`
                var amount = `数量：${formatWhole(getBuyableAmount(this.layer, this.id))} ${copperMineBuildingName()}`
                var cost = `价格：${format(this.cost())} ${moneyName()}`
                var effect = `效果：${format(this.effect())} ${resourceName.metalCopper}`
                var text = '<h3>' + description + '<br><br>' + amount + '<br>' + effect + '<br>' + cost
                return text
            },
            effect() { return getBuyableAmount(this.layer, this.id).mul(tmp.i.metalCopperByPerMine) },
            canAfford() { return player.c.points.gte(this.cost()) },
            cost(x = player[this.layer].buyables[this.id]) {
                var cost = new Decimal(tmp.i.quarryCostCreep).pow(x).mul(80).mul(tmp.i.buildingPriceRevise)
                if (hasUpgrade('c', 212)) cost = cost.mul(0.75)
                return cost
            },
            unlocked() { return hasUpgrade('c', 26) },
            buy() {
                player.c.points = player.c.points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            style() {
                var style = {}
                style['border-radius'] = '25px'
                style['height'] = '200px'
                style['width'] = '200px'
                return style
            },
        },
        14: {
            title() { return '<h3>' + TinMineBuildingName() + '</h3><br>矿产建筑<br>' },
            display() {
                var description = `每个${TinMineBuildingName()}生产 ${formatWhole(tmp.i.metalTinByPerMine)} ${resourceName.metalTin}`
                var amount = `数量：${formatWhole(getBuyableAmount(this.layer, this.id))} ${TinMineBuildingName()}`
                var cost = `价格：${format(this.cost())} ${moneyName()}`
                var effect = `效果：${format(this.effect())} ${resourceName.metalTin}`
                var text = '<h3>' + description + '<br><br>' + amount + '<br>' + effect + '<br>' + cost
                return text
            },
            effect() { return getBuyableAmount(this.layer, this.id).mul(tmp.i.metalTinByPerMine) },
            canAfford() { return player.c.points.gte(this.cost()) },
            cost(x = player[this.layer].buyables[this.id]) {
                var cost = new Decimal(tmp.i.quarryCostCreep).pow(x).mul(80).mul(tmp.i.buildingPriceRevise)
                if (hasUpgrade('c', 212)) cost = cost.mul(0.75)
                return cost
            },
            unlocked() { return hasUpgrade('c', 26) },
            buy() {
                player.c.points = player.c.points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            style() {
                var style = {}
                style['border-radius'] = '25px'
                style['height'] = '200px'
                style['width'] = '200px'
                return style
            },
        },
        21: {
            title() { return '<h3>切石工坊<br></h3>资源加工<br>' },
            display() {
                var name = tmp.i.buyables[21].title.substring(4, tmp.i.buyables[11].title.length - 16)
                var description = `每个${name}消耗 ${formatWhole(tmp.i.stoneUsedByPerCutter)} 石材制造 ${formatWhole(tmp.i.stonebrickByPerCutter)} 石砖`
                var amount = `数量：${formatWhole(getBuyableAmount(this.layer, this.id))} ${name}`
                var consume = `消耗：${format(player.i.cutterOn.mul(tmp.i.stoneUsedByPerCutter))} 石材`
                var effect = `制造：${format(player.i.cutterOn.mul(tmp.i.stonebrickByPerCutter))} 石砖`
                var cost = `价格：${format(this.cost())} 石材`
                var text = '<h3>' + description + '<br><br>' + amount + '<br>' + consume + '<br>' + effect + '<br>' + cost
                return text
            },
            canAfford() {
                return player.i.stone.gte(this.cost())
            },
            cost(x = player[this.layer].buyables[this.id]) {
                return new Decimal(tmp.i.cutterCostCreep).pow(x).mul(20).mul(tmp.i.buildingPriceRevise)
            },
            unlocked() {
                return hasUpgrade('c', 23)
            },
            buy() {
                player.i.stone = player.i.stone.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            style() {
                var style = {}
                style['border-radius'] = '25px 25px 0px 0px'
                return style
            },
        },
        31: {
            title() { return '<h3>冶炼窑<br></h3>资源加工<br>' },
            display() {
                var name = tmp.i.buyables[31].title.substring(4, tmp.i.buyables[11].title.length - 17)
                var description = `每个${name}提供 1 冶炼工位<br>仅能完成最基础的金属冶炼和合金工作`
                var amount = `数量：${formatWhole(getBuyableAmount(this.layer, this.id))} ${name}`
                var cost = `价格：${format(this.cost())} 石砖`
                var text = '<h3>' + description + '<br><br>' + amount + '<br>' + cost
                return text
            },
            unlocked() {
                return hasUpgrade('c', 27)
            },
            canAfford() {
                return player.i.stonebrick.gte(this.cost())
            },
            cost(x = player[this.layer].buyables[this.id]) {
                return new Decimal(tmp.i.smeltCostCreep).pow(x).mul(50).mul(tmp.i.buildingPriceRevise)
            },
            buy() {
                player.i.stonebrick = player.i.stonebrick.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            style() {
                var style = {}
                style['border-radius'] = '25px'
                return style
            },
        }
    },

    clickables: {
        'cutterAdd': {
            display: '<h1 style="font-weight: bold;">+',
            canClick: function () { return player.i.cutterOn.lt(getBuyableAmount('i', 21)) },
            onClick: function () { player.i.cutterOn = player.i.cutterOn.add(1) },
            style() {
                var style = {}
                style['height'] = '50px'
                style['width'] = '50px'
                style['border-radius'] = '0'
                return style
            }
        },
        'cutterSub': {
            display: '<h1 style="font-weight: bold;">-',
            canClick: function () { return player.i.cutterOn.gt(0) },
            onClick: function () { player.i.cutterOn = player.i.cutterOn.sub(1) },
            style() {
                var style = {}
                style['height'] = '50px'
                style['width'] = '50px'
                style['border-radius'] = '0'
                return style
            }
        },
        'smeltBronzeAdd': {
            display: '<h1 style="font-weight: bold;">+',
            canClick: function () { return player.i.smelterOn.lt(getBuyableAmount('i', 31)) },
            onClick: function () {
                player.i.smeltBronzeOn = player.i.smeltBronzeOn.add(1)
                player.i.smelterOn = player.i.smelterOn.add(1)
            },
            style() {
                var style = {}
                style['height'] = '30px'
                style['width'] = '30px'
                style['border-radius'] = '0'
                return style
            }
        },
        'smeltBronzeSub': {
            display: '<h1 style="font-weight: bold;">-',
            canClick: function () { return player.i.smelterOn.gt(0) },
            onClick: function () {
                player.i.smeltBronzeOn = player.i.smeltBronzeOn.sub(1)
                player.i.smelterOn = player.i.smelterOn.sub(1)
            },
            style() {
                var style = {}
                style['height'] = '30px'
                style['width'] = '30px'
                style['border-radius'] = '0'
                return style
            }
        },
    },

    smeltBronzeLimit() {
        var max = getBuyableAmount('i', 31)
        return max
    },



    stoneByPerQuarry() {// 采石场采石单位
        var stone = new Decimal(0.2)
        if (hasUpgrade('c', 212)) stone = stone.mul(1.2)
        return stone
    },
    stoneUsedByPerCutter() {// 切石机使用石材单位
        return new Decimal(1)
    },
    stoneGain() {// 石材总获得量
        var byQuarry = tmp.i.stoneByPerQuarry.mul(getBuyableAmount('i', 11))
        var total = byQuarry
        return [total, byQuarry]
    },
    stoneUsed() {// 石材总消耗量
        var byCutter = tmp.i.stoneUsedByPerCutter.mul(player.i.cutterOn)
        var total = byCutter
        return [total, byCutter]
    },
    stoneUsedActual() {// 石材总消耗量折扣
        var byCutter = tmp.i.stoneUsedByPerCutter.mul(player.i.cutterOn).mul(tmp.i.cutterEffciency)
        var total = byCutter
        return [total, byCutter]
    },
    stoneChange() {// 石材变化量
        return tmp.i.stoneGain[0].sub(tmp.i.stoneUsedActual[0])
    },



    stonebrickByPerCutter() {// 切石机石砖单元
        return new Decimal(0.1)
    },
    stonebrickGain() {// 石砖获得量
        var byCutter = player.i.cutterOn.mul(tmp.i.stonebrickByPerCutter).mul(tmp.i.cutterEffciency)
        var total = byCutter
        return [total, byCutter]
    },
    stonebrickUsed() {// 石砖总消耗量
        var byCutter = new Decimal(0)
        var total = byCutter
        return [total, byCutter]
    },
    stonebrickUsedActual() {// 石砖总消耗量折扣
        var byCutter = new Decimal(0)
        var total = byCutter
        return [total, byCutter]
    },
    stonebrickChange() {// 石砖变化量
        return tmp.i.stonebrickGain[0].sub(tmp.i.stonebrickUsedActual[0])
    },



    oreCoalByPerMine() {// 煤矿采石单位
        return new Decimal(0.005)
    },
    oreCoalByPerWorkshop() {// 冶炼使用煤炭单位
        return new Decimal(0.1)
    },
    oreCoalGain() {// 煤炭获取
        var byMine = getBuyableAmount('i', 12).mul(tmp.i.oreCoalByPerMine)
        var total = byMine
        return [total, byMine]
    },
    oreCoalUsed() {// 煤炭总消耗量
        var bySmelterOn = tmp.i.oreCoalByPerWorkshop.mul(player.i.smelterOn)
        var total = bySmelterOn
        return [total, bySmelterOn]
    },
    oreCoalUsedActual() {// 煤炭总消耗量折扣
        var bySmelterOn = tmp.i.oreCoalByPerWorkshop.mul(player.i.smelterOn).mul(tmp.i.smeltEffciency)
        var total = bySmelterOn
        return [total, bySmelterOn]
    },
    oreCoalChange() {// 煤炭变化
        return tmp.i.oreCoalGain[0].sub(tmp.i.oreCoalUsedActual[0])
    },



    metalCopperByPerMine() {// 铜矿石采石单位
        return new Decimal(0.001)
    },
    metalCopperByPerSmeltBronze() {// 烧铜使用铜矿石单位
        return new Decimal(0.3)
    },
    metalCopperGain() {// 铜矿石获取
        var byMine = getBuyableAmount('i', 13).mul(tmp.i.metalCopperByPerMine)
        var total = byMine
        return [total, byMine]
    },
    metalCopperUsed() {// 铜矿石总消耗量
        var bySmeltBronze = tmp.i.metalCopperByPerSmeltBronze.mul(player.i.smeltBronzeOn)
        var total = bySmeltBronze
        return [total, bySmeltBronze]
    },
    metalCopperUsedActual() {// 铜矿石总消耗量折扣
        var bySmeltBronze = tmp.i.metalCopperByPerSmeltBronze.mul(player.i.smeltBronzeOn).mul(tmp.i.smeltBronzeEffciency)
        var total = bySmeltBronze
        return [total, bySmeltBronze]
    },
    metalCopperChange() {// 铜矿石变化
        return tmp.i.metalCopperGain[0].sub(tmp.i.metalCopperUsedActual[0])
    },



    metalTinByPerMine() {// 锡矿石采石单位
        return new Decimal(0.001)
    },
    metalTinByPerSmeltBronze() {// 烧青铜使用锡矿石单位
        return new Decimal(0.1)
    },
    metalTinGain() {// 锡矿石获取
        var byMine = getBuyableAmount('i', 14).mul(tmp.i.metalTinByPerMine)
        var total = byMine
        return [total, byMine]
    },
    metalTinUsed() {// 锡矿石总消耗量
        var bySmeltBronze = tmp.i.metalTinByPerSmeltBronze.mul(player.i.smeltBronzeOn)
        var total = bySmeltBronze
        return [total, bySmeltBronze]
    },
    metalTinUsedActual() {// 锡矿石总消耗量折扣
        var bySmeltBronze = tmp.i.metalTinByPerSmeltBronze.mul(player.i.smeltBronzeOn).mul(tmp.i.smeltBronzeEffciency)
        var total = bySmeltBronze
        return [total, bySmeltBronze]
    },
    metalTinChange() {// 铜矿石变化
        return tmp.i.metalTinGain[0].sub(tmp.i.metalTinUsedActual[0])
    },



    alloyBronzeByPerSmeltBronze() {// 烧青铜单位
        return new Decimal(0.4)
    },
    alloyBronzeGain() {// 青铜获取
        var bySmeltBronze = player.i.smeltBronzeOn.mul(tmp.i.alloyBronzeByPerSmeltBronze)
        var total = bySmeltBronze
        return [total, bySmeltBronze]
    },
    alloyBronzeUsed() {// 青铜总消耗量
        var total = new Decimal(0)
        return [total]
    },
    alloyBronzeUsedActual() {// 锡矿石总消耗量折扣
        var total = new Decimal(0)
        return [total]
    },
    alloyBronzeChange() {// 铜矿石变化
        return tmp.i.alloyBronzeGain[0].sub(tmp.i.alloyBronzeUsedActual[0])
    },



    cutterEffciency() {// 切石效率
        var Effciency = new Decimal(1)
        stonePercent = new Decimal(1)
        if (player.i.stone.lte(0)) {
            if (tmp.i.stoneGain[0].eq(0) || tmp.i.stoneUsed[1].eq(0)) stonePercent = new Decimal(0)
            else stonePercent = tmp.i.stoneGain[0].mul(tmp.i.stoneUsed[1].div(tmp.i.stoneUsed[0])).div(tmp.i.stoneUsed[1]).min(1)
            player.i.stone = new Decimal(0)
        }
        Effciency = Effciency.min(stonePercent)
        return Effciency
    },

    smeltEffciency() {// 冶炼效率
        var Effciency = new Decimal(1)
        var oreCoalPercent = new Decimal(1)
        if (player.i.oreCoal.lte(0)) {
            if (tmp.i.oreCoalGain[0].eq(0) || tmp.i.oreCoalUsed[1].eq(0)) oreCoalPercent = new Decimal(0)
            else oreCoalPercent = tmp.i.oreCoalGain[0].mul(tmp.i.oreCoalUsed[1].div(tmp.i.oreCoalUsed[0])).div(tmp.i.oreCoalUsed[1]).min(1)
            player.i.oreCoal = new Decimal(0)
        }
        Effciency = Effciency.min(oreCoalPercent)
        return Effciency
    },

    smeltBronzeEffciency() {// 烧青铜效率
        var Effciency = new Decimal(1)
        var metalCopperPercent = new Decimal(1)
        var metalTinPercent = new Decimal(1)
        if (player.i.metalTin.lte(0)) {
            if (tmp.i.metalTinGain[0].eq(0) || tmp.i.metalTinUsed[1].eq(0)) metalTinPercent = new Decimal(0)
            else metalTinPercent = tmp.i.metalTinGain[0].mul(tmp.i.metalTinUsed[1].div(tmp.i.metalTinUsed[0])).div(tmp.i.metalTinUsed[1]).min(1)
            player.i.metalTin = new Decimal(0)
        }
        if (player.i.metalCopper.lte(0)) {
            if (tmp.i.metalCopperGain[0].eq(0) || tmp.i.metalCopperUsed[1].eq(0)) metalCopperPercent = new Decimal(0)
            else metalCopperPercent = tmp.i.metalCopperGain[0].mul(tmp.i.metalCopperUsed[1].div(tmp.i.metalCopperUsed[0])).div(tmp.i.metalCopperUsed[1]).min(1)
            player.i.metalCopper = new Decimal(0)
        }
        Effciency = Effciency.min(metalTinPercent).min(metalCopperPercent)
        Effciency = Effciency.mul(tmp.i.smeltEffciency)
        return Effciency
    },



    quarryCostCreep() {
        return new Decimal(1.25)
    },

    cutterCostCreep() {
        return new Decimal(1.5)
    },

    smeltCostCreep() {
        return new Decimal(1.5)
    },

    buildingPriceRevise() {
        return new Decimal(1)
    },

})