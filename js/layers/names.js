resourceName = {
    population: '人口',
    populationCapacity: '人口容量',
    food: '食物',
    water: '饮水',
    fuel: '燃料',
    stone: '石材',
    stonebrick: '石砖',
    oreCoal: '煤',
    metalCopper: '铜',
    metalTin: '锡',
    alloyBronze: '青铜',
    defence: '防御力',
}

function moneyName() {
    return '贝币'
}

function populationBuildingName() {
    if (hasUpgrade('c', 28)) return '石砖小屋'
    return '木制小屋'
}

function foodBuildingName() {
    if (hasUpgrade('c', 17)) return '早期农田'
    return '狩猎营地'
}

function waterBuildingName() {
    return '取水地'
}

function fuelBuildingName() {
    return '树枝仓储'
}

function foodBuffBuildingName() {
    if (hasUpgrade('c', 14)) return '渔猎营地'
    return '采集营地'
}

function templeBuildingName() {
    return '寺庙'
}

function quarryBuildingName() {
    return '采石场'
}

function coalMineBuildingName() {
    return '煤矿场'
}

function copperMineBuildingName() {
    return '铜矿场'
}

function TinMineBuildingName() {
    return '锡矿场'
}

function sentryBuildingName() {
    return '巡逻岗哨'
}