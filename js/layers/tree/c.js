addLayer('c', {
    name: 'civilization',
    symbol: '文明',
    position: 9,
    color: '#EDB3FF',
    requires: new Decimal(Infinity),
    resource: '货币',
    baseResource: '货币',
    baseAmount() { return player.points },
    type: 'normal',
    exponent: 0.5,
    gainMult() {
        mult = new Decimal(1)
        return mult
    },
    gainExp() { return new Decimal(1) },
    row: 8,
    position: 3,
    hotkeys: [],

    startData() {
        return {
            // 默认项
            unlocked: true,
            points: new Decimal(0),
            population: new Decimal(0),
            populationBar: new Decimal(0),

            // 宗教
            religionPoints: new Decimal(1),

            // 防御
            /*
            defenseEnemyTime: new Decimal(365),
            defenseEnemyStrength: new Decimal(1),
            */

            //沙漠特性
            desertRiverCount: new Decimal(0),
            desertRiver: 0,

            religionPoints: new Decimal(1),
        }
    },

    layerShown() { return true },

    tabFormat() {
        var tabformat = []
        tabformat.push(["raw-html", LayerButtons()])
        // 文明层子Tab
        tabformat.push(
            ['microtabs',
                'civilization'])
        return tabformat
    },

    update(diff) {
        // 税收
        var gain = tmp.c.finalTaxation                                              // 最终税收
        player.c.points = player.c.points.add(gain.mul(diff))                       // 增加金钱

        // 市民进度
        if (tmp.c.canGetNew.eq(1)) {
            player.c.populationBar = player.c.populationBar.add(diff)
            if (player.c.populationBar.gte(tmp.c.populationBar)) {
                player.c.populationBar = new Decimal(0)
                player.c.population = player.c.population.add(1)
            }
        }

        /*
        // 沙漠特性函数（只有当条件满足才启用）
        if (hasUpgrade('e', 11)) {                                                  // 【条件】启用了沙漠特性
            player.c.desertRiverCount = player.c.desertRiverCount.sub(diff)         // 倒计时
            if (player.c.desertRiverCount.lte(0)) {                                 // 下一时期
                player.c.desertRiver += 1
                if (player.c.desertRiver == 4) player.c.desertRiver = 0             // 周期
                switch (player.c.desertRiver) {                                     // 赋予时长
                    case 0: player.c.desertRiverCount = new Decimal(120); break     // 河流枯水期
                    case 1: player.c.desertRiverCount = new Decimal(30); break      // 河流正常期
                    case 2: player.c.desertRiverCount = new Decimal(123); break     // 河流泛滥期
                    case 3: player.c.desertRiverCount = new Decimal(92); break      // 河流灌溉期
                }
            }
        }
        */

        /*
        // 防御函数（只有满足条件才启用）
        if (hasMilestone('c', 0)) {                                                 // 【条件】完成了青铜时代里程碑
            player.c.defenseEnemyTime = player.c.defenseEnemyTime.sub(diff)         // 倒计时
        }
        */

        // 避免提前剧透
        if (!hasUpgrade('c', 12) && player.subtabs.c.civilization == '建筑') player.subtabs.c.civilization = '发展'     // 显示修正

        // 解锁层
        if (hasUpgrade('c', 1)) player.e.unlocked = true                            // 【条件】完成文明传承升级
        if (hasMilestone('c', 0)) player.i.unlocked = true                          // 【条件】完成青铜时代里程碑
    },

    microtabs: {
        civilization: {
            建筑: {
                unlocked() { return hasUpgrade('c', 12) },
                content() {
                    tabformat = []
                    tabformat.push('blank')
                    tabformat.push('blank')
                    tabformat.push('blank')
                    // 沙漠文化的河流特性
                    var desertRiverName = ''
                    var desertRiverEffect = ''
                    switch (player.c.desertRiver) {
                        case 0: {
                            desertRiverName = '<h2 style="color:orange">枯水期</font>'
                            desertRiverEffect = '食物生产×0.8'
                        }; break
                        case 1: {
                            desertRiverName = '<h2 style="color:white">正常期</font>'
                            desertRiverEffect = '无效果'
                        }; break
                        case 2: {
                            desertRiverName = '<h2 style="color:red">泛滥期</font>'
                            desertRiverEffect = '食物生产×0.25，建筑价格×1.25'
                        }; break
                        case 3: {
                            desertRiverName = '<h2 style="color:lime">灌溉期</font>'
                            desertRiverEffect = '食物生产×1.5'
                        }; break
                    }
                    if (hasUpgrade('e', 11)) {
                        tabformat.push(['display-text', `河流目前状态为 <h2>${desertRiverName}</h2>，转变至下一时期还有：<h2>${formatWhole(player.c.desertRiverCount)}天`])
                        tabformat.push(['display-text', `${desertRiverEffect}`])
                        tabformat.push('blank')
                    }

                    // 房屋
                    tabformat.push('blank')
                    tabformat.push(['display-text', '<h2>房屋'])
                    tabformat.push(['h-line', '600px'])
                    tabformat.push('blank')

                    // 设施
                    tabformat.push(
                        ['row', [
                            ['column', [
                                ['buyable', 11],
                                ['bar', 'population']], {}]
                        ]])
                    tabformat.push('blank')
                    tabformat.push(['display-text', '<h2>设施'])
                    tabformat.push(['h-line', '600px'])
                    tabformat.push('blank')
                    tabformat.push(
                        ['row', [
                            ['buyable', 21],
                            ['buyable', 22],
                            ['buyable', 23]
                        ]])
                    tabformat.push(
                        ['row', [
                            ['buyable', 31],
                            ['buyable', 32]
                        ]])
                    tabformat.push(
                        ['row', [
                            ['buyable', 41],
                            ['buyable', 42]
                        ]])
                    return tabformat
                },
            },
            发展: {
                content() {
                    tabformat = []
                    tabformat.push('blank')
                    tabformat.push('blank')
                    tabformat.push('blank')

                    // 特殊升级
                    tabformat.push(['row', [['upgrade', 1]]])
                    tabformat.push('blank')

                    // 铁器时代前科技
                    if (hasMilestone('c', 0)) tabformat.push('blank', ['milestone', 1], 'blank')

                    // 青铜科技
                    if (tmp.c.upgrades[220].unlocked || tmp.c.upgrades[218].unlocked || tmp.c.upgrades[219].unlocked) tabformat.push(
                        ['row', [
                            ['column', [['upgrade', 220]], { 'width': '120px' }],
                            ['column', [], { 'width': '120px' }],
                            ['column', [['upgrade', 218]], { 'width': '120px' }],
                            ['column', [['upgrade', 219]], { 'width': '120px' }],
                        ],])
                    if (tmp.c.upgrades[215].unlocked || tmp.c.upgrades[217].unlocked) tabformat.push(
                        ['row', [
                            ['column', [], { 'width': '120px' }],
                            ['column', [['upgrade', 215]], { 'width': '120px' }],
                            ['column', [], { 'width': '120px' }],
                            ['column', [['upgrade', 217]], { 'width': '120px' }],
                            ['column', [], { 'width': '120px' }],
                        ],])
                    if (tmp.c.upgrades[22].unlocked || tmp.c.upgrades[216].unlocked || tmp.c.upgrades[29].unlocked) tabformat.push(
                        ['row', [
                            ['column', [], { 'width': '60px' }],
                            ['column', [['upgrade', 22]], { 'width': '120px' }],
                            ['column', [], { 'width': '120px' }],
                            ['column', [['upgrade', 216]], { 'width': '120px' }],
                            ['column', [['upgrade', 29]], { 'width': '120px' }],
                            ['column', [], { 'width': '60px' }],
                        ],])
                    if (tmp.c.upgrades[210].unlocked || tmp.c.upgrades[212].unlocked || tmp.c.upgrades[24].unlocked) tabformat.push(
                        ['row', [
                            ['column', [['upgrade', 210]], { 'width': '120px' }],
                            ['column', [], { 'width': '120px' }],
                            ['column', [['upgrade', 212]], { 'width': '120px' }],
                            ['column', [], { 'width': '120px' }],
                            ['column', [['upgrade', 24]], { 'width': '120px' }],
                        ],])
                    if (tmp.c.upgrades[25].unlocked || tmp.c.upgrades[22].unlocked || tmp.c.upgrades[27].unlocked || tmp.c.upgrades[28].unlocked) tabformat.push(
                        ['row', [
                            ['column', [['upgrade', 25]], { 'width': '120px' }],
                            ['column', [], { 'width': '120px' }],
                            ['column', [['upgrade', 27]], { 'width': '120px' }],
                            ['column', [['upgrade', 28]], { 'width': '120px' }],
                            ['column', [], { 'width': '120px' }],
                        ], { 'height': '120px' }])
                    if (tmp.c.upgrades[25].unlocked || tmp.c.upgrades[26].unlocked || tmp.c.upgrades[23].unlocked || tmp.c.upgrades[23].unlocked) tabformat.push(
                        ['row', [
                            ['column', [], { 'width': '120px' }],
                            ['column', [['upgrade', 26]], { 'width': '120px' }],
                            ['column', [['upgrade', 23]], { 'width': '120px' }],
                            ['column', [['upgrade', 213]], { 'width': '120px' }],
                        ], { 'height': '120px' }])
                    if (tmp.c.upgrades[21].unlocked || tmp.c.upgrades[214].unlocked) tabformat.push(
                        ['row', [
                            ['column', [['upgrade', 214]], { 'width': '120px' }],
                            ['column', [], { 'width': '120px' }],
                            ['column', [['upgrade', 21]], { 'width': '120px' }],
                            ['column', [], { 'width': '120px' }],
                            ['column', [], { 'width': '120px' }],
                        ],])

                    // 石器时代
                    tabformat.push('blank', ['milestone', 0], 'blank')
                    if (tmp.c.upgrades[110].unlocked) tabformat.push(
                        ['row', [
                            ['column', [['upgrade', 110]], { 'width': '120px' }],
                            ['column', [], { 'width': '120px' }],
                            ['column', [], { 'width': '120px' }],
                        ],])
                    if (tmp.c.upgrades[14].unlocked || tmp.c.upgrades[17].unlocked || tmp.c.upgrades[18].unlocked || tmp.c.upgrades[19].unlocked) tabformat.push(
                        ['row', [
                            ['column', [['upgrade', 14]], { 'width': '120px' }],
                            ['column', [['upgrade', 17]], { 'width': '120px' }],
                            ['column', [], { 'width': '120px' }],
                            ['column', [['upgrade', 18]], { 'width': '120px' }],
                            ['column', [['upgrade', 19]], { 'width': '120px' }],
                        ],])
                    if (tmp.c.upgrades[13].unlocked || tmp.c.upgrades[15].unlocked || tmp.c.upgrades[13].unlocked) tabformat.push(
                        ['row', [
                            ['column', [['upgrade', 13]], { 'width': '120px' }],
                            ['column', [['upgrade', 15]], { 'width': '120px' }],
                            ['column', [['upgrade', 16]], { 'width': '120px' }],
                        ],])
                    tabformat.push(
                        ['row', [
                            ['column', [['upgrade', 11]], { 'width': '120px' }],
                            ['column', [['upgrade', 12]], { 'width': '120px' }],
                        ],])

                    tabformat.push('blank', ['milestone', 'A'])
                    tabformat.push('blank', 'blank')
                    return tabformat
                }
            },
            宗教: {
                unlocked() { return hasUpgrade('c', 210) },
                content() {
                    var tabformat = []
                    tabformat.push('blank')
                    tabformat.push('blank')
                    tabformat.push('blank')
                    tabformat.push(['display-text', '你还可以启动 <h2>' + formatWhole(player.c.religionPoints) + '</h2> 个宗教特性'])
                    tabformat.push(['display-text', '注：每一层只能启动一个特性'])
                    tabformat.push('blank')
                    tabformat.push(
                        ['row', [
                            ['upgrade', 'religion_1'],
                            ['upgrade', 'religion_2'],
                            ['upgrade', 'religion_3'],
                            ['upgrade', 'religion_4'],
                        ], {}])
                    tabformat.push(
                        ['row', [
                            ['upgrade', 'religion_5'],
                            ['upgrade', 'religion_6'],
                            ['upgrade', 'religion_7'],
                            ['upgrade', 'religion_8'],
                        ], {}])
                    return tabformat
                }
            },
            军事: {
                unlocked() { return hasMilestone('c', 0) },
                content: [
                    ['microtabs', 'military']
                ]

            },
        },
        military: {
            军营: {
                content() {
                    tabformat = []
                    tabformat.push('blank')
                    tabformat.push('blank')
                    tabformat.push('blank')
                    return tabformat
                }

            },
            防御: {
                content() {
                    tabformat = []
                    tabformat.push('blank')
                    tabformat.push('blank')
                    tabformat.push('blank')
                    tabformat.push(['display-text', `下次敌军进攻时间倒计时：<h2>${formatWhole(player.c.defenseEnemyTime)}天`])
                    tabformat.push(['display-text', `敌军强度：<h2>${formatWhole(player.c.defenseEnemyStrength)}`])
                    tabformat.push(['display-text', `您的防御强度：<h2>${formatWhole(tmp.c.defensePower)}`])
                    tabformat.push('blank')
                    tabformat.push(['buyable', 61])
                    return tabformat
                }

            },
            进攻: {
                unlocked() { return false }
            }
        }
    },

    buyables: {
        11: {
            title() { return '<h3>' + populationBuildingName() + '</h3><br>人口建筑<br>' },
            display() {
                var description = `每个${populationBuildingName()}容纳 ${tmp.c.populationPerHouse} ${resourceName.population}，需要必需品供给`
                var amount = `数量：${formatWhole(getBuyableAmount(this.layer, this.id))} ${populationBuildingName()}`
                var effect = `效果：${formatWhole(this.effect())} ${resourceName.populationCapacity}`
                var cost = `价格：${format(this.cost())} `
                if (hasUpgrade('c', 28)) cost = cost + resourceName.stonebrick
                else cost = cost + moneyName()
                var text = '<h3>' + description + '<br><br>' + amount + '<br>' + effect + '<br>' + cost
                return text
            },
            effect() { return getBuyableAmount(this.layer, this.id).mul(tmp.c.populationPerHouse) },
            cost(x = player[this.layer].buyables[this.id]) {
                var cost = new Decimal(0)
                if (getBuyableAmount(this.layer, this.id).eq(0)) var cost = new Decimal(0).mul(tmp.c.buildingPriceRevise)
                if (getBuyableAmount(this.layer, this.id).gt(0)) var cost = new Decimal(tmp.c.houseCostCreep).pow(x.sub(1)).mul(1.5).mul(tmp.c.buildingPriceRevise)
                if (hasUpgrade('c', 28)) cost = cost.mul(0.01)
                return cost
            },
            canAfford() {
                var need = player.c.points.gte(this.cost())
                if (hasUpgrade('c', 28)) need = player.i.stonebrick.gte(this.cost())
                return need
            },
            buy() {
                if (hasUpgrade('c', 28)) player.i.stonebrick = player.i.stonebrick.sub(this.cost())
                else player.c.points = player.c.points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            style() {
                var style = {}
                style['border-radius'] = '20px'
                return style
            },
        },
        21: {
            title() { return '<h3>' + foodBuildingName() + '</h3><br>必需品<br>' },
            display() {
                var supply = getBuyableAmount('c', 21).mul(tmp.c.populationPerFoodBuilding)
                var description = `每个${foodBuildingName()}可供给 ${format(tmp.c.populationPerFoodBuilding)} ${resourceName.population}`
                var amount = `数量：${formatWhole(getBuyableAmount(this.layer, this.id))} ${foodBuildingName()}`
                var supplyText = `供给：${format(supply)} ${resourceName.food}`
                var cost = `价格：${format(this.cost())} ${moneyName()}`
                var text = '<h3>' + description + '<br><br>' + amount + '<br>' + supplyText + '<br>' + cost
                return text
            },
            cost(x = player[this.layer].buyables[this.id]) {
                var cost = new Decimal(0)
                if (getBuyableAmount(this.layer, this.id).eq(0)) cost = new Decimal(0).mul(tmp.c.buildingPriceRevise)
                if (getBuyableAmount(this.layer, this.id).gt(0)) cost = new Decimal(tmp.c.foodBuildingCostCreep).pow(x.sub(1)).mul(2.5).mul(tmp.c.buildingPriceRevise)
                if (hasUpgrade('c', 17)) cost = cost.mul(0.8)
                return cost
            },
            canAfford() { return player.c.points.gte(this.cost()) },
            buy() {
                player.c.points = player.c.points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            style() {
                var style = {}
                style['height'] = '200px'
                style['width'] = '200px'
                style['border-radius'] = '20px'
                return style
            },
        },
        22: {
            title() { return '<h3>' + waterBuildingName() + '</h3><br>必需品<br>' },
            display() {
                var supply = getBuyableAmount('c', 22).mul(tmp.c.populationPerWaterBuilding)
                var description = `每个${waterBuildingName()}可供给 ${format(tmp.c.populationPerWaterBuilding)} ${resourceName.population}`
                var amount = `数量：${formatWhole(getBuyableAmount(this.layer, this.id))} ${waterBuildingName()}`
                var supplyText = `供给：${format(supply)} ${resourceName.water}`
                var cost = `价格：${format(this.cost())} ${moneyName()}`
                var text = '<h3>' + description + '<br><br>' + amount + '<br>' + supplyText + '<br>' + cost
                return text
            },
            cost(x = player[this.layer].buyables[this.id]) {
                var cost = new Decimal(0)
                if (getBuyableAmount(this.layer, this.id).eq(0)) cost = new Decimal(0).mul(tmp.c.buildingPriceRevise)
                if (getBuyableAmount(this.layer, this.id).gt(0)) cost = new Decimal(tmp.c.waterBuildingCostCreep).pow(x.sub(1)).mul(2).mul(tmp.c.buildingPriceRevise)
                return cost
            },
            canAfford() { return player.c.points.gte(this.cost()) },
            buy() {
                player.c.points = player.c.points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            style() {
                var style = {}
                style['height'] = '200px'
                style['width'] = '200px'
                style['border-radius'] = '20px'
                return style
            },
        },
        23: {
            title() { return '<h3>' + fuelBuildingName() + '</h3><br>必需品<br>' },
            display() {
                var supply = getBuyableAmount('c', 23).mul(tmp.c.populationPerFuelBuilding)
                var description = `每个${fuelBuildingName()}可供给 ${format(tmp.c.populationPerFuelBuilding)} ${resourceName.population}`
                var amount = `数量：${formatWhole(getBuyableAmount(this.layer, this.id))} ${fuelBuildingName()}`
                var supplyText = `供给：${format(supply)} ${resourceName.fuel}`
                var cost = `价格：${format(this.cost())} ${moneyName()}`
                var text = '<h3>' + description + '<br><br>' + amount + '<br>' + supplyText + '<br>' + cost
                return text
            },
            cost(x = player[this.layer].buyables[this.id]) {
                var cost = new Decimal(0)
                if (getBuyableAmount(this.layer, this.id).eq(0)) cost = new Decimal(0).mul(tmp.c.buildingPriceRevise)
                if (getBuyableAmount(this.layer, this.id).gt(0)) cost = new Decimal(tmp.c.fuelBuildingCostCreep).pow(x.sub(1)).mul(4).mul(tmp.c.buildingPriceRevise)
                return cost
            },
            canAfford() { return player.c.points.gte(this.cost()) },
            buy() {
                player.c.points = player.c.points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            style() {
                var style = {}
                style['height'] = '200px'
                style['width'] = '200px'
                style['border-radius'] = '20px'
                return style
            },
        },
        41: {
            title() { return '<h3>' + foodBuffBuildingName() + '</h3><br>必需品<br>' },
            display() {
                var description = `所有的${foodBuffBuildingName()}使${foodBuildingName()}${resourceName.food}单位总生产增加 ${format(this.effect())}`
                var amount = `数量：${formatWhole(getBuyableAmount(this.layer, this.id))} ${foodBuffBuildingName()}`
                var effect = `效果：+${format(this.effect())} ${resourceName.food}`
                var cost = `价格：${format(this.cost())} ${moneyName()}`
                var text = '<h3>' + description + '<br><br>' + amount + '<br>' + effect + '<br>' + cost
                return text
            },
            effect(x = player[this.layer].buyables[this.id]) {
                var buff = new Decimal(0.1)
                if (hasUpgrade('c', 14)) buff = buff.add(0.1)
                return x.mul(buff)
            },
            cost(x = player[this.layer].buyables[this.id]) { return new Decimal(tmp.c.foodBuffBuildingCostCreep).pow(x).mul(80).mul(tmp.c.buildingPriceRevise) },
            canAfford() { return player.c.points.gte(this.cost()) },
            buy() {
                player.c.points = player.c.points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            unlocked() { return hasUpgrade('c', 13) },
            style() {
                var style = {}
                style['height'] = '200px'
                style['width'] = '200px'
                style['border-radius'] = '20px'
                return style
            },
        },
        42: {
            title() { return '<h3>' + templeBuildingName() + '</h3><br>增益建筑<br>' },
            display() {
                var description = `每有一个${templeBuildingName()}就使${resourceName.food}，${resourceName.water}和${resourceName.fuel}生产增加 0.02`
                var amount = `数量：${formatWhole(getBuyableAmount(this.layer, this.id))} ${templeBuildingName()}`
                var effect = `效果：+${format(this.effect())}`
                var cost = `价格：${format(this.cost())} ${resourceName.stonebrick}`
                var text = '<h3>' + description + '<br><br>' + amount + '<br>' + effect + '<br>' + cost
                return text
            },
            effect(x = player[this.layer].buyables[this.id]) {
                var buff = new Decimal(0.02)
                return x.mul(buff)
            },
            cost(x = player[this.layer].buyables[this.id]) { return new Decimal(tmp.c.religionBuffBuildingCostCreep).pow(x).mul(10).mul(tmp.c.buildingPriceRevise) },
            canAfford() { return player.i.stonebrick.gte(this.cost()) },
            buy() {
                player.i.stonebrick = player.i.stonebrick.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            unlocked() { return hasUpgrade('c', 210) },
            style() {
                var style = {}
                style['height'] = '200px'
                style['width'] = '200px'
                style['border-radius'] = '20px'
                return style
            },
        },
        61: {
            title() { return '<h3>' + sentryBuildingName() + '</h3><br>地面防御建筑<br>' },
            display() {
                var description = `每个${sentryBuildingName()}提高 ${format(tmp.c.groundDefenseBuildingPower)} ${resourceName.defence}`
                var amount = `数量：${formatWhole(getBuyableAmount(this.layer, this.id))} ${sentryBuildingName()}`
                var effect = `效果：+${format(this.effect())} ${resourceName.defence}`
                var cost = `价格：${format(this.cost())} ${moneyName()}`
                var text = '<h3>' + description + '<br><br>' + amount + '<br>' + effect + '<br>' + cost
                return text
            },
            effect(x = player[this.layer].buyables[this.id]) { return getBuyableAmount('c', 61).mul(tmp.c.groundDefenseBuildingPower) },
            cost(x = player[this.layer].buyables[this.id]) { return new Decimal(tmp.c.groundDefenseBuildingCostCreep).pow(x).mul(100).mul(tmp.c.buildingPriceRevise) },
            canAfford() { return player.c.points.gte(this.cost()) },
            buy() {
                player.c.points = player.c.points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            style() {
                var style = {}
                style['height'] = '200px'
                style['width'] = '200px'
                style['border-radius'] = '20px'
                return style
            },
        },
    },

    upgrades: {
        1: {
            fullDisplay() {
                cost = this.cost()
                return `<h2>文明传承</h2><br><h3>功能</h3><br><br><h3>解锁国家层</h3><br><br>花费：${format(cost)} ${moneyName()}`
            },
            tooltip() { return '' },
            cost() { return new Decimal(500) },
            style() {
                var style = {}
                style['height'] = '120px'
                style['width'] = '120px'
                style['border-radius'] = '20px'
                return style
            },
        },

        11: {
            fullDisplay: '<h2>货币</h2><br><h3>科技</h3><br><br>花费：免费',
            tooltip() { return '解锁货币和税收功能' },
            style() {
                var style = {}
                style['height'] = '120px'
                style['width'] = '120px'
                style['border-radius'] = '20px'
                return style
            },
        },
        12: {
            fullDisplay: '<h2>火种</h2><br><h3>科技</h3><br><br>花费：免费',
            tooltip() { return '解锁建筑建造功能' },
            style() {
                var style = {}
                style['height'] = '120px'
                style['width'] = '120px'
                style['border-radius'] = '20px'
                return style
            },
        },
        13: {
            fullDisplay() {
                cost = this.cost()
                return `<h2>采集</h2><br><h3>科技</h3><br><br>花费：${format(cost)} ${moneyName()}`
            },
            tooltip() { return '解锁采集营地' },
            cost() { return new Decimal(100) },
            description: '解锁采集营地',
            unlocked() { return hasUpgrade('c', 11) && hasUpgrade('c', 12) },
            style() {
                var style = {}
                style['height'] = '120px'
                style['width'] = '120px'
                style['border-radius'] = '20px'
                return style
            },
        },
        14: {
            fullDisplay() {
                cost = this.cost()
                return `<h2>渔猎工具</h2><br><h3>科技</h3><br><br>花费：${format(cost)} ${moneyName()}`
            },
            tooltip() { return '采集营地进阶为渔猎营地<br>生产×2' },
            unlocked() { return hasUpgrade('c', 13) },
            cost() { return getBuyableAmount('c', 41).mul(new Decimal(200)) },
            style() {
                var style = {}
                style['height'] = '120px'
                style['width'] = '120px'
                style['border-radius'] = '20px'
                return style
            },
        },
        15: {
            fullDisplay() {
                cost = this.cost()
                return `<h2>完善石质工具</h2><br><h3>科技</h3><br><br>花费：${format(cost)} ${moneyName()}`
            },
            tooltip() { return `${foodBuildingName()} 生产+0.2<br>${fuelBuildingName()} 生产+0.2` },
            unlocked() { return hasUpgrade('c', 11) && hasUpgrade('c', 12) },
            cost() { return new Decimal(75) },
            style() {
                var style = {}
                style['height'] = '120px'
                style['width'] = '120px'
                style['border-radius'] = '20px'
                return style
            },
        },
        16: {
            fullDisplay() {
                cost = this.cost()
                return `<h2>陶瓦容器</h2><br><h3>科技</h3><br><br>花费：${format(cost)} ${moneyName()}`
            },
            tooltip() { return `${waterBuildingName()} 生产+1` },
            unlocked() { return hasUpgrade('c', 11) && hasUpgrade('c', 12) },
            cost() { return new Decimal(150) },
            style() {
                var style = {}
                style['height'] = '120px'
                style['width'] = '120px'
                style['border-radius'] = '20px'
                return style
            },
        },
        17: {
            fullDisplay() {
                cost = this.cost()
                return `<h2>早期农业</h2><br><h3>科技</h3><br><br>花费：${format(cost)} ${moneyName()}`
            },
            tooltip() { return `狩猎营地进阶为早期农田<br>生产×1.15<br>价格×0.8` },
            unlocked() { return hasUpgrade('c', 15) },
            cost() { return getBuyableAmount('c', 21).mul(new Decimal(50)) },
            style() {
                var style = {}
                style['height'] = '120px'
                style['width'] = '120px'
                style['border-radius'] = '20px'
                return style
            },
        },
        18: {
            fullDisplay() {
                cost = this.cost()
                return `<h2>早期畜牧业</h2><br><h3>科技</h3><br><br>花费：${format(cost)} ${moneyName()}`
            },
            tooltip() { return `${foodBuildingName()} 生产+0.4` },
            unlocked() { return hasUpgrade('c', 15) },
            cost() { return new Decimal(400) },
            style() {
                var style = {}
                style['height'] = '120px'
                style['width'] = '120px'
                style['border-radius'] = '20px'
                return style
            },
        },
        19: {
            fullDisplay() {
                cost = this.cost()
                return `<h2>早期纺织业</h2><br><h3>科技</h3><br><br>花费：${format(cost)} ${moneyName()}`
            },
            tooltip() { return `税收×1.5` },
            unlocked() { return hasUpgrade('c', 15) },
            cost() { return new Decimal(500) },
            style() {
                var style = {}
                style['height'] = '120px'
                style['width'] = '120px'
                style['border-radius'] = '20px'
                return style
            },
        },
        110: {
            fullDisplay() {
                cost = this.cost()
                return `<h2>手摇磨</h2><br><h3>科技</h3><br><br>花费：${format(cost)} ${moneyName()}`
            },
            tooltip() { return `${foodBuildingName()} 生产+0.4` },
            unlocked() { return hasUpgrade('c', 17) },
            cost() { return new Decimal(750) },
            style() {
                var style = {}
                style['height'] = '120px'
                style['width'] = '120px'
                style['border-radius'] = '20px'
                return style
            },
        },

        21: {
            fullDisplay() {
                cost = this.cost()
                return `<h2>采石场</h2><br><h3>科技</h3><br><br>花费：${format(cost)} ${moneyName()}`
            },
            tooltip() { return `工业层解锁采石场建筑` },
            unlocked() { return hasUpgrade('c', 15) && hasMilestone('c', 0) },
            cost() { return new Decimal(1200) },
            style() {
                var style = {}
                style['height'] = '120px'
                style['width'] = '120px'
                style['border-radius'] = '20px'
                return style
            },
        },
        22: {
            fullDisplay() {
                cost = this.cost()
                return `<h2>早期数学</h2><br><h3>科技</h3><br><br>花费：${format(cost)} ${moneyName()}`
            },
            tooltip() { return `WIP` },
            unlocked() { return hasUpgrade('c', 25) },
            cost() { return new Decimal(1200) },
            style() {
                var style = {}
                style['height'] = '120px'
                style['width'] = '120px'
                style['border-radius'] = '20px'
                return style
            },
        },
        23: {
            fullDisplay() {
                cost = this.cost()
                return `<h2>石工</h2><br><h3>科技</h3><br><br>花费：${format(cost)} ${resourceName.stone}`
            },
            tooltip() { return `工业层解锁${resourceName.stonebrick}铸造` },
            unlocked() { return hasUpgrade('c', 21) },
            currencyLayer: 'i',
            currencyInternalName: 'stone',
            cost() { return new Decimal(80) },
            style() {
                var style = {}
                style['height'] = '120px'
                style['width'] = '120px'
                style['border-radius'] = '20px'
                return style
            },
        },
        24: {
            fullDisplay() {
                cost = this.cost()
                return `<h2>弓箭</h2><br><h3>科技</h3><br><br>花费：${format(cost)} ${moneyName()}`
            },
            tooltip() { return `军营中解锁远程单位` },
            unlocked() { return hasUpgrade('c', 15) && hasMilestone('c', 0) },
            cost() { return new Decimal(4000) },
            style() {
                var style = {}
                style['height'] = '120px'
                style['width'] = '120px'
                style['border-radius'] = '20px'
                return style
            },
        },
        25: {
            fullDisplay() {
                cost = this.cost()
                return `<h2>文字</h2><br><h3>科技</h3><br><br>花费：${format(cost)} ${moneyName()}`
            },
            tooltip() { return `税收×1.6` },
            unlocked() { return hasUpgrade('c', 15) && hasMilestone('c', 0) },
            cost() { return new Decimal(2500) },
            style() {
                var style = {}
                style['height'] = '120px'
                style['width'] = '120px'
                style['border-radius'] = '20px'
                return style
            },
        },
        26: {
            fullDisplay() {
                cost = this.cost()
                return `<h2>金石发掘</h2><br><h3>科技</h3><br><br>花费：${format(cost)} ${resourceName.stone}`
            },
            tooltip() { return `工业层解锁针对各类矿物的矿场建筑` },
            unlocked() { return hasUpgrade('c', 21) },
            currencyLayer: 'i',
            currencyInternalName: 'stone',
            cost() { return new Decimal(200) },
            style() {
                var style = {}
                style['height'] = '120px'
                style['width'] = '120px'
                style['border-radius'] = '20px'
                return style
            },
        },
        27: {
            fullDisplay() {
                return `<h2>早期冶炼</h2><br><h3>科技</h3><br><br>花费：10.00 ${resourceName.oreCoal}，50.00 ${resourceName.stonebrick}`
            },
            tooltip() { return `工业层解锁冶炼设备建筑` },
            unlocked() { return hasUpgrade('c', 23) && hasUpgrade('c', 26) },
            canAfford() { return player.i.stonebrick.gte(50) && player.i.oreCoal.gte(10) },
            pay() {
                player.i.stonebrick = player.i.stonebrick.sub(50)
                player.i.oreCoal = player.i.oreCoal.sub(10)
            },
            style() {
                var style = {}
                style['height'] = '120px'
                style['width'] = '120px'
                style['border-radius'] = '20px'
                return style
            },
        },
        28: {
            fullDisplay() {
                cost = this.cost()
                return `<h2>灰浆</h2><br><h3>科技</h3><br><br>花费：${format(cost)} ${resourceName.stonebrick}`
            },
            tooltip() { return `木制小屋进阶为石质小屋<br>花费转为使用${resourceName.stonebrick}<br>价格×0.01<br>可容纳人口+1<br>价格蠕变-0.01` },
            unlocked() { return hasUpgrade('c', 23) },
            currencyLayer: 'i',
            currencyInternalName: 'stonebrick',
            cost() { return getBuyableAmount('c', 11).mul(3) },
            style() {
                var style = {}
                style['height'] = '120px'
                style['width'] = '120px'
                style['border-radius'] = '20px'
                return style
            },
        },
        29: {
            fullDisplay() {
                cost = this.cost()
                return `<h2>掠夺</h2><br><h3>科技</h3><br><br>花费：${format(cost)} ${moneyName()}`
            },
            tooltip() { return `解锁军事进攻` },
            unlocked() { return hasUpgrade('c', 24) },
            cost() { return new Decimal(10000) },
            style() {
                var style = {}
                style['height'] = '120px'
                style['width'] = '120px'
                style['border-radius'] = '20px'
                return style
            },
        },
        210: {
            fullDisplay() {
                cost = this.cost()
                return `<h2>宗教</h2><br><h3>科技</h3><br><br>花费：${format(cost)} ${resourceName.stonebrick}`
            },
            tooltip() { return `解锁宗教建筑<br>解锁宗教奇观<br>解锁宗教子页面` },
            unlocked() { return hasUpgrade('c', 25) },
            currencyLayer: 'i',
            currencyInternalName: 'stonebrick',
            cost() { return new Decimal(150) },
            style() {
                var style = {}
                style['height'] = '120px'
                style['width'] = '120px'
                style['border-radius'] = '20px'
                return style
            },
        },
        211: {
            fullDisplay() {
                return `<h2>冶炼</h2><br><h3>科技</h3><br><br>花费：5.00 ${resourceName.oreCoal}，1.00 ${resourceName.metalCopper}`
            },
            tooltip() { return `工业层解锁金属冶炼工具` },
            unlocked() { return hasUpgrade('c', 26) && hasUpgrade('c', 27) },
            canAfford() { return player.i.metalCopper.gte(1) && player.i.oreCoal.gte(5) },
            pay() {
                player.i.metalCopper = player.i.metalCopper.sub(1)
                player.i.oreCoal = player.i.oreCoal.sub(5)
            },
            style() {
                var style = {}
                style['height'] = '120px'
                style['width'] = '120px'
                style['border-radius'] = '20px'
                return style
            },
        },
        212: {
            fullDisplay() {
                cost = this.cost()
                return `<h2>铜质工具</h2><br><h3>科技</h3><br><br>花费：${format(cost)} ${resourceName.metalCopper}`
            },
            tooltip() { return `${fuelBuildingName()} 生产×1.08<br>${quarryBuildingName()} 石头生产×1.2<br>${quarryBuildingName()} 价格×0.75<br>所有军事单位强度×1.5` },
            unlocked() { return hasUpgrade('c', 27) },
            currencyLayer: 'i',
            currencyInternalName: 'metalCopper',
            cost() { return getBuyableAmount('c', 23).mul(0.03).add(1) },
            style() {
                var style = {}
                style['height'] = '120px'
                style['width'] = '120px'
                style['border-radius'] = '20px'
                return style
            },
        },
        213: {
            fullDisplay() {
                cost = this.cost()
                return `<h2>轮子</h2><br><h3>科技</h3><br><br>花费：${format(cost)} ${moneyName()}`
            },
            tooltip() { return `${waterBuildingName()} 生产+0.4<br>${fuelBuildingName()} 生产+0.4` },
            unlocked() { return hasUpgrade('c', 23) },
            cost() { return new Decimal(1600) },
            style() {
                var style = {}
                style['height'] = '120px'
                style['width'] = '120px'
                style['border-radius'] = '20px'
                return style
            },
        },
        214: {
            fullDisplay() {
                cost = this.cost()
                return `<h2>灌溉技术</h2><br><h3>科技</h3><br><br>花费：${format(cost)} ${moneyName()}`
            },
            tooltip() { return `WIP` },
            unlocked() { return hasUpgrade('c', 16) && hasMilestone('c', 0) },
            cost() { return new Decimal(8000) },
            style() {
                var style = {}
                style['height'] = '120px'
                style['width'] = '120px'
                style['border-radius'] = '20px'
                return style
            },
        },
        215: {
            fullDisplay() {
                cost = this.cost()
                return `<h2>早期天文学</h2><br><h3>科技</h3><br><br>花费：${format(cost)} ${moneyName()}`
            },
            tooltip() { return `WIP` },
            unlocked() { return hasUpgrade('c', 25) },
            cost() { return new Decimal(15000) },
            style() {
                var style = {}
                style['height'] = '120px'
                style['width'] = '120px'
                style['border-radius'] = '20px'
                return style
            },
        },
        216: {
            fullDisplay() {
                cost = this.cost()
                return `<h2>合金技术</h2><br><h3>科技</h3><br><br>花费：${format(cost)} ${moneyName()}`
            },
            tooltip() { return `工业层解锁合金制造<br>解锁${resourceName.alloyBronze}` },
            unlocked() { return hasUpgrade('c', 27) },
            cost() { return new Decimal(Infinity) },
            style() {
                var style = {}
                style['height'] = '120px'
                style['width'] = '120px'
                style['border-radius'] = '20px'
                return style
            },
        },
        217: {
            fullDisplay() {
                cost = this.cost()
                return `<h2>青铜工具</h2><br><h3>科技</h3><br><br>花费：${format(cost)} ${moneyName()}`
            },
            tooltip() { return `WIP` },
            unlocked() { return hasUpgrade('c', 216) },
            cost() { return new Decimal(Infinity) },
            style() {
                var style = {}
                style['height'] = '120px'
                style['width'] = '120px'
                style['border-radius'] = '20px'
                return style
            },
        },
        218: {
            fullDisplay() {
                cost = this.cost()
                return `<h2>青铜货币</h2><br><h3>科技</h3><br><br>花费：${format(cost)} ${moneyName()}`
            },
            tooltip() { return `WIP` },
            unlocked() { return hasUpgrade('c', 216) },
            cost() { return new Decimal(Infinity) },
            style() {
                var style = {}
                style['height'] = '120px'
                style['width'] = '120px'
                style['border-radius'] = '20px'
                return style
            },
        },
        219: {
            fullDisplay() {
                cost = this.cost()
                return `<h2>青铜礼器</h2><br><h3>科技</h3><br><br>花费：${format(cost)} ${moneyName()}`
            },
            tooltip() { return `WIP` },
            unlocked() { return hasUpgrade('c', 216) && hasUpgrade('c', 210) },
            cost() { return new Decimal(Infinity) },
            style() {
                var style = {}
                style['height'] = '120px'
                style['width'] = '120px'
                style['border-radius'] = '20px'
                return style
            },
        },
        220: {
            fullDisplay() {
                cost = this.cost()
                return `<h2>早期航海学</h2><br><h3>科技</h3><br><br>花费：${format(cost)} ${moneyName()}`
            },
            tooltip() { return `WIP` },
            unlocked() { return hasUpgrade('c', 215) },
            cost() { return new Decimal(Infinity) },
            style() {
                var style = {}
                style['height'] = '120px'
                style['width'] = '120px'
                style['border-radius'] = '20px'
                return style
            },
        },

        'religion_1': {
            fullDisplay() { return `<h2>` },
            tooltip() { return 'WIP' },
            canAfford() {
                return !hasUpgrade('c', 'religion_2') && !hasUpgrade('c', 'religion_3') && !hasUpgrade('c', 'religion_4')
            },
            pay() { },
            style() {
                var style = {}
                style['height'] = '120px'
                style['width'] = '120px'
                style['border-radius'] = '20px'
                return style
            },
        },
        'religion_2': {
            fullDisplay() { return `<h2>` },
            tooltip() { return 'WIP' },
            canAfford() {
                return !hasUpgrade('c', 'religion_1') && !hasUpgrade('c', 'religion_3') && !hasUpgrade('c', 'religion_4')
            },
            pay() { },
            style() {
                var style = {}
                style['height'] = '120px'
                style['width'] = '120px'
                style['border-radius'] = '20px'
                return style
            },
        },
        'religion_3': {
            fullDisplay() { return `<h2>` },
            tooltip() { return 'WIP' },
            canAfford() {
                return !hasUpgrade('c', 'religion_1') && !hasUpgrade('c', 'religion_2') && !hasUpgrade('c', 'religion_4')
            },
            pay() { },
            style() {
                var style = {}
                style['height'] = '120px'
                style['width'] = '120px'
                style['border-radius'] = '20px'
                return style
            },
        },
        'religion_4': {
            fullDisplay() { return `<h2>` },
            tooltip() { return 'WIP' },
            canAfford() {
                return !hasUpgrade('c', 'religion_1') && !hasUpgrade('c', 'religion_2') && !hasUpgrade('c', 'religion_3')
            },
            pay() { },
            style() {
                var style = {}
                style['height'] = '120px'
                style['width'] = '120px'
                style['border-radius'] = '20px'
                return style
            },
        },
        'religion_5': {
            fullDisplay() { return `<h2>` },
            tooltip() { return 'WIP' },
            unlocked() { return hasUpgrade('c', 'religion_1') || hasUpgrade('c', 'religion_2') || hasUpgrade('c', 'religion_3') || hasUpgrade('c', 'religion_4') },
            canAfford() {
                return !hasUpgrade('c', 'religion_6') && !hasUpgrade('c', 'religion_7') && !hasUpgrade('c', 'religion_8')
            },
            pay() { },
            style() {
                var style = {}
                style['height'] = '120px'
                style['width'] = '120px'
                style['border-radius'] = '20px'
                return style
            },
        },
        'religion_6': {
            fullDisplay() { return `<h2>` },
            tooltip() { return 'WIP' },
            unlocked() { return hasUpgrade('c', 'religion_1') || hasUpgrade('c', 'religion_2') || hasUpgrade('c', 'religion_3') || hasUpgrade('c', 'religion_4') },
            canAfford() {
                return !hasUpgrade('c', 'religion_5') && !hasUpgrade('c', 'religion_7') && !hasUpgrade('c', 'religion_8')
            },
            pay() { },
            style() {
                var style = {}
                style['height'] = '120px'
                style['width'] = '120px'
                style['border-radius'] = '20px'
                return style
            },
        },
        'religion_7': {
            fullDisplay() { return `<h2>` },
            tooltip() { return 'WIP' },
            unlocked() { return hasUpgrade('c', 'religion_1') || hasUpgrade('c', 'religion_2') || hasUpgrade('c', 'religion_3') || hasUpgrade('c', 'religion_4') },
            canAfford() {
                return !hasUpgrade('c', 'religion_5') && !hasUpgrade('c', 'religion_6') && !hasUpgrade('c', 'religion_8')
            },
            pay() { },
            style() {
                var style = {}
                style['height'] = '120px'
                style['width'] = '120px'
                style['border-radius'] = '20px'
                return style
            },
        },
        'religion_8': {
            fullDisplay() { return `<h2>` },
            tooltip() { return 'WIP' },
            unlocked() { return hasUpgrade('c', 'religion_1') || hasUpgrade('c', 'religion_2') || hasUpgrade('c', 'religion_3') || hasUpgrade('c', 'religion_4') },
            canAfford() {
                return !hasUpgrade('c', 'religion_5') && !hasUpgrade('c', 'religion_6') && !hasUpgrade('c', 'religion_7')
            },
            pay() { },
            style() {
                var style = {}
                style['height'] = '120px'
                style['width'] = '120px'
                style['border-radius'] = '20px'
                return style
            },
        },
    },

    milestonePopups: false,
    milestones: {
        'A': {
            requirementDescription: '<br><h3>进入石器时代',
            effectDescription() { return '默认解锁' },
            done() { return true },
            style() {
                var style = {}
                style['border-radius'] = '0px'
                style['height'] = '80px'
                style['width'] = '700px'
                return style
            },
        },
        0: {
            requirementDescription: '<br><h3>进入青铜时代',
            effectDescription() {
                if (!hasMilestone('c', 0)) return '总国家发展度达到 1 以解锁'
                return '总国家发展度达到 1 以解锁，解锁：军事，金石材料挖掘'
            },
            done() { return player.e.total.gte(1) },
            style() {
                var style = {}
                style['border-radius'] = '0px'
                style['height'] = '80px'
                style['width'] = '700px'
                return style
            },
        },
        1: {
            requirementDescription: '<br><h3>铁器时代',
            done() { return false },
            style() {
                var style = {}
                style['border-radius'] = '0px'
                style['height'] = '80px'
                style['width'] = '700px'
                return style
            },
        },
        2: {
            requirementDescription: '蒸汽时代',
            done() { return false },
            style() {
                var style = {}
                style['border-radius'] = '0px'
                style['height'] = '0px'
                style['width'] = '3000px'
                return style
            },
        },
        3: {
            requirementDescription: '电气时代',
            done() { return false },
            style() {
                var style = {}
                style['border-radius'] = '0px'
                style['height'] = '0px'
                style['width'] = '3000px'
                return style
            },
        },
        4: {
            requirementDescription: '信息时代',
            done() { return false },
            style() {
                var style = {}
                style['border-radius'] = '0px'
                style['height'] = '0px'
                style['width'] = '3000px'
                return style
            },
        }
    },

    clickables:
    {
        11:
        {

        },
    },

    bars: {
        population: {
            direction: RIGHT,
            width: 200,
            height: 24,
            progress() { return player.c.populationBar.div(tmp.c.populationBar) },
            display() { return format(player.c.populationBar) + '/' + format(tmp.c.populationBar) },
            fillStyle() {
                var style = {}
                style['background-color'] = 'darkgreen'
                return style
            }
        },
    },





    // 基础税收
    baseTaxation() {
        var baseTaxPer = new Decimal(0.2)
        if (hasUpgrade('c', 19)) baseTaxPer = baseTaxPer.mul(1.5)
        if (hasUpgrade('c', 25)) baseTaxPer = baseTaxPer.mul(1.6)
        var baseTax = baseTaxPer.mul(player.c.population)
        return baseTax
    },

    // 折算税收
    finalTaxation() {
        return tmp.c.baseTaxation
    },





    // 可以获取新市民
    canGetNew() {
        if (player.c.population.lt(tmp.c.totalPopulationCapacity) && tmp.c.baseNecessitiesPercent.gte(1)) {
            return new Decimal(1)
        }
        return new Decimal(0)
    },

    // 市民获取进度条
    populationBar() {
        return player.c.population.pow(0.5).add(4)
    },

    // 必需品的 *基础* 满足百分比
    baseNecessitiesPercent() {
        var foodSupplyPercent = getBuyableAmount('c', 21).mul(tmp.c.populationPerFoodBuilding).floor().div(player.c.population.add(1))
        var waterSupplyPercent = getBuyableAmount('c', 22).mul(tmp.c.populationPerWaterBuilding).floor().div(player.c.population.add(1))
        var fuelSupplyPercent = getBuyableAmount('c', 23).mul(tmp.c.populationPerFuelBuilding).floor().div(player.c.population.add(1))
        var min = new Decimal(1).min(foodSupplyPercent).min(waterSupplyPercent).min(fuelSupplyPercent)
        return min
    },

    // 每栋房屋可以容纳人口
    populationPerHouse() {
        var population = new Decimal(2)
        if (hasUpgrade('c', 28)) population = new Decimal(3)
        return population
    },

    // 总人口容纳量
    totalPopulationCapacity() {
        return tmp.c.buyables[11].effect
    },





    // 每个食物单元可以供给的人口数
    populationPerFoodBuilding() {
        var food = new Decimal(1)
        food = food.add(tmp.c.buyables[41].effect)
        if (hasUpgrade('c', 15)) food = food.add(0.2)
        if (hasUpgrade('c', 18)) food = food.add(0.4)
        if (hasUpgrade('c', 110)) food = food.add(0.4)
        if (hasUpgrade('c', 210)) food = food.add(getBuyableAmount('c', 42).mul(0.02))
        if (hasUpgrade('c', 17)) food = food.mul(1.15)
        /*
        if (hasUpgrade('e', 11) && player.c.desertRiver == 0) food = food.mul(0.8) // 沙漠特性枯水期
        if (hasUpgrade('e', 11) && player.c.desertRiver == 2) food = food.mul(0.25) // 沙漠特性泛滥期
        if (hasUpgrade('e', 11) && player.c.desertRiver == 3) food = food.mul(1.25) // 沙漠特性灌溉期
        */
        return food
    },

    // 每个饮水单元可以供给的人口数
    populationPerWaterBuilding() {
        var water = new Decimal(2)
        if (hasUpgrade('c', 16)) water = water.add(1)
        if (hasUpgrade('c', 213)) water = water.add(0.4)
        if (hasUpgrade('c', 210)) water = water.add(getBuyableAmount('c', 42).mul(0.02))
        return water
    },

    // 每个燃料单元可以供给的人口数
    populationPerFuelBuilding() {
        var fuel = new Decimal(3)
        if (hasUpgrade('c', 15)) fuel = fuel.add(0.2)
        if (hasUpgrade('c', 213)) fuel = fuel.add(0.4)
        if (hasUpgrade('c', 210)) fuel = fuel.add(getBuyableAmount('c', 42).mul(0.02))
        if (hasUpgrade('c', 212)) fuel = fuel.mul(1.08)
        return fuel
    },





    // 房屋价格蠕变
    houseCostCreep() {
        var Creep = new Decimal(1.3)
        if (hasUpgrade('c', 28)) Creep = Creep.sub(0.01)
        return Creep
    },

    // 食物单位价格蠕变
    foodBuildingCostCreep() {
        return new Decimal(1.5)
    },

    // 饮水单位价格蠕变
    waterBuildingCostCreep() {
        return new Decimal(1.3)
    },

    // 燃料单位价格蠕变
    fuelBuildingCostCreep() {
        return new Decimal(1.4)
    },

    // 食物增益单位价格蠕变
    foodBuffBuildingCostCreep() {
        return new Decimal(1.5)
    },

    // 宗教单位价格蠕变
    religionBuffBuildingCostCreep() {
        return new Decimal(1.25)
    },

    // 建筑价格总体修正
    buildingPriceRevise() {
        var revise = new Decimal(1)
        if (hasUpgrade('e', 11) && player.c.desertRiver == 2) revise = revise.mul(1.25) // 沙漠特性泛滥期
        return revise
    },





    // 敌军进攻百分比上限
    defenseEnemyPercentUpper() {
        return new Decimal(1.25)
    },

    // 敌军进攻百分比下限
    defenseEnemyPercentLower() {
        return new Decimal(0.5)
    },

    // 防御单位战力
    groundDefenseBuildingPower() {
        return new Decimal(1)
    },

    // 防御单位价格蠕变
    groundDefenseBuildingCostCreep() {
        return new Decimal(1.5)
    },

    // 总防御力
    defensePower() {
        tower = getBuyableAmount('c', 61)
        towerPower = tower.mul(tmp.c.groundDefenseBuildingPower)
        return towerPower
    }
})