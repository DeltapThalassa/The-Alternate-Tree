addLayer("e", {
    name: "empire",
    symbol: "国家",
    position: 9,
    color: "#E5DAB7",
    requires: new Decimal(50),
    resource: "国家发展度",
    baseResource: "市民",
    baseAmount() {
        return player.c.population
    },
    type: "static",
    exponent: 0.9,
    canBuyMax: true,
    gainMult() {
        mult = new Decimal(1)
        return mult
    },
    gainExp() {
        return new Decimal(1)
    },
    row: 7,
    hotkeys: [],
    branches: ["c", "i"],

    autoPrestige: true,

    startData() {
        return {
            unlocked: false,
            points: new Decimal(0),
        }
    },

    layerShown() {
        return hasUpgrade("c", 1) || player.e.unlocked
    },

    tabFormat() {
        var tabformat = []
        tabformat.push(["raw-html", LayerButtons()])
        tabformat.push('blank')
        tabformat.push('blank')
        tabformat.push('blank')
        tabformat.push("main-display")
        tabformat.push("prestige-button")
        tabformat.push("blank")
        //tabformat.push(["display-text", `你有 ${formatWhole(tmp.c.totalPopulation)} 人口`])
        tabformat.push("blank")
        tabformat.push(
            ["microtabs",
                "empire"])
        return tabformat
    },

    microtabs: {
        empire: {
            文明特性: {
                content: [
                    "blank",
                    ["row", [
                        ["upgrade", 11],
                        ["upgrade", 12],
                        ["upgrade", 13]],]
                ],
            },
            奇观: {
                content() {
                    var tabformat = []
                    tabformat.push(['buyable', 11])
                    return tabformat
                }
            },
        },
    },

    update(diff) {
    },

    automate() {

    },

    upgrades: {
        11: {
            fullDisplay() {
                cost = new Decimal(1)
                if (hasUpgrade("e", 12) || hasUpgrade("e", 13)) cost = new Decimal(1e150)
                if (hasUpgrade("e", 12) && hasUpgrade("e", 13)) cost = new Decimal(1e150)
                return `<h2>沙漠中的明珠</h2><br><h3>文明特性<br><br>需求：${cost} 国家发展度`
            },
            tooltip() { return '文明层食物生产将开始受到河流泛滥的周期性影响<br>国家层解锁早期沙漠奇观' },
            unlocked() { return hasUpgrade("c", 13) },
            canAfford() {
                if (hasUpgrade("e", 12) || hasUpgrade("e", 13)) return player.e.points.gte(1e150)
                if (hasUpgrade("e", 12) && hasUpgrade("e", 13)) return player.e.points.gte(1e150)
                return player.e.points.gte(1)
            },
            cost() { return new Decimal(0) },
            style() {
                var style = {}
                style["border-radius"] = "20px"
                style["height"] = "150px"
                style["width"] = "150px"
                return style
            },
        },
        12: {
            fullDisplay() {
                cost = new Decimal(1)
                if (hasUpgrade("e", 11) || hasUpgrade("e", 13)) cost = new Decimal(1e150)
                if (hasUpgrade("e", 11) && hasUpgrade("e", 13)) cost = new Decimal(1e150)
                return `<h2>密林之间</h2><br><h3>文明特性<br><br>需求：${cost} 国家发展度`
            },
            tooltip() { return '文明层建筑价格×0.8<br>工业层资源获取×0.8<br>国家层解锁早期雨林奇观' },
            unlocked() { return hasUpgrade("c", 13) },
            canAfford() {
                if (hasUpgrade("e", 11) || hasUpgrade("e", 13)) return player.e.points.gte(1e150)
                if (hasUpgrade("e", 11) && hasUpgrade("e", 13)) return player.e.points.gte(1e150)
                return player.e.points.gte(1)
            },
            cost() { return new Decimal(0) },
            style() {
                var style = {}
                style["border-radius"] = "20px"
                style["height"] = "150px"
                style["width"] = "150px"
                return style
            },
        },
        13: {
            fullDisplay() {
                cost = new Decimal(1)
                if (hasUpgrade("e", 11) || hasUpgrade("e", 12)) cost = new Decimal(1e150)
                if (hasUpgrade("e", 11) && hasUpgrade("e", 12)) cost = new Decimal(1e150)
                return `<h2>遥望七海</h2><br><h3>文明特性<br><br>需求：${cost} 国家发展度`
            },
            tooltip() { return '文明层的建筑价格×1.25<br>文明层提早解锁贸易和海洋军事<br>国家层解锁早期海洋奇观' },
            unlocked() { return hasUpgrade("c", 13) },
            canAfford() {
                if (hasUpgrade("e", 11) || hasUpgrade("e", 12)) return player.e.points.gte(1e150)
                if (hasUpgrade("e", 11) && hasUpgrade("e", 12)) return player.e.points.gte(1e150)
                return player.e.points.gte(1)
            },
            cost() { return new Decimal(0) },
            style() {
                var style = {}
                style["border-radius"] = "20px"
                style["height"] = "150px"
                style["width"] = "150px"
                return style
            },
        },
    },

    buyables:
    {
        11: {
            title() { return '<h3>巨石阵</h3><br>奇观<br>' },
            display() {
                if (getBuyableAmount(this.layer, this.id).eq(this.purchaseLimit)) var progress = '完工'
                else var progress = formatWhole(getBuyableAmount('e', 11)) + '%'
                var text = '<h3>' + '<h1>' + progress
                return text
            },
            purchaseLimit: new Decimal(100),
            canAfford() {
                return true
            },
            buy() {
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            style() {
                var style = {}
                style['border-radius'] = '25px'
                style['height'] = '200px'
                style['width'] = '200px'
                if (!getBuyableAmount('e', 11).eq(this.purchaseLimit)) {
                    percent = getBuyableAmount(this.layer, this.id).div(this.purchaseLimit).mul(100)
                    style['border'] = '2px dashed white'
                    style['background'] = 'linear-gradient(0deg, #77bf5f ' + percent + '%, #bf8f8f ' + percent + '%)'
                }
                return style
            },
        }
    }
})