function StorageTable() {
    var storageTable = `
    <table width='500px'>
        <thead>
            <tr>
                <th style='width:100px; border-bottom:2px solid white'><h3>资源</th>
                <th style='width:200px; border-bottom:2px solid white'><h3>变化量/s</th>
                <th style='width:200px; border-bottom:2px solid white'><h3>储存</th>
            </tr>
            <tr>
                <th style='height:15px'><h3></th>
            </tr>
        </thead>`
    storageTable += `
        <tr>
            <th><h3>${moneyName()}</th>
            <th><h3>${format(tmp.c.finalTaxation)}</th>
            <th><h3>${format(player.c.points)}</th>
        </tr>
        <tr>
            <th style='height:15px'><h3></th>
        </tr>`
    if (player.Storage.stoneUnlock == 1) {
        var stoneText = `
        <tr>
            <th><h3>${resourceName.stone}</th>
            <th><h3`+ (tmp.i.stoneChange.lt(0) ? ` style="color:orange"` : ``) + `>${format(tmp.i.stoneChange)}</th>
            <th><h3>${format(player.i.stone)}</th>
        </tr>`
        storageTable += stoneText
    }
    if (player.Storage.oreCoalUnlock == 1) {
        var stoneText = `
        <tr>
            <th><h3>${resourceName.oreCoal}</th>
            <th><h3`+ (tmp.i.oreCoalChange.lt(0) ? ` style="color:orange"` : ``) + `>${format(tmp.i.oreCoalChange)}</th>
            <th><h3>${format(player.i.oreCoal)}</th>
        </tr>`
        storageTable += stoneText
    }
    if (player.Storage.metalCopperUnlock == 1) {
        var stoneText = `
        <tr>
            <th><h3>${resourceName.metalCopper}</th>
            <th><h3`+ (tmp.i.metalCopperChange.lt(0) ? ` style="color:orange"` : ``) + `>${format(tmp.i.metalCopperChange)}</th>
            <th><h3>${format(player.i.metalCopper)}</th>
        </tr>`
        storageTable += stoneText
    }
    if (player.Storage.metalTinUnlock == 1) {
        var stoneText = `
        <tr>
            <th><h3>${resourceName.metalTin}</th>
            <th><h3`+ (tmp.i.metalTinChange.lt(0) ? ` style="color:orange"` : ``) + `>${format(tmp.i.metalTinChange)}</th>
            <th><h3>${format(player.i.metalTin)}</th>
        </tr>`
        storageTable += stoneText
    }
    storageTable += `
        <tr>
            <th style='height:15px'><h3></th>
        </tr>`
    if (player.Storage.stonebrickUnlock == 1) {
        var stoneText = `
        <tr>
            <th><h3>${resourceName.stonebrick}</th>
            <th><h3`+ (tmp.i.stonebrickChange.lt(0) ? ` style="color:orange"` : ``) + `>${format(tmp.i.stonebrickChange)}</th>
            <th><h3>${format(player.i.stonebrick)}</th>
        </tr>`
        storageTable += stoneText
    }
    storageTable += `
        <tr>
            <th style='height:15px'><h3></th>
        </tr>`
    if (player.Storage.alloyBronzeUnlock == 1) {
        var stoneText = `
        <tr>
            <th><h3>${resourceName.alloyBronze}</th>
            <th><h3`+ (tmp.i.alloyBronzeChange.lt(0) ? ` style="color:orange"` : ``) + `>${format(tmp.i.alloyBronzeChange)}</th>
            <th><h3>${format(player.i.alloyBronze)}</th>
        </tr>`
        storageTable += stoneText
    }
    storageTable += `</table>`
    return storageTable
}

function LayerButtons() {
    var layerButtons = `
    <table>
    <tr>`
    if (player.c.unlocked) layerButtons += `<button class="tabButton" onclick="player.tab='c'">文明</button>`
    if (player.e.unlocked) layerButtons += `<button class="tabButton" onclick="player.tab='e'">国家特性</button>`
    if (player.i.unlocked) layerButtons += `<button class="tabButton" onclick="player.tab='i'">工业</button>`
    layerButtons += `<button class="tabButton" onclick="player.tab='options'">设置</button>`
    layerButtons += `</tr>
    </table>
    `
    return layerButtons
}