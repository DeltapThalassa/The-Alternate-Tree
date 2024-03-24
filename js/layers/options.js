addLayer("options", {
    name: "options",
    symbol: "O",
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
        tabformat.push(["raw-html", LayerButtons()])
        tabformat.push(
            ['microtabs',
                'options'])
        return tabformat
    },

    microtabs: {
        options: {
            设置: {
                content() {
                    var tabformat = []
                    tabformat.push('blank')
                    tabformat.push('blank')
                    tabformat.push('blank')
                    tabformat.push(["raw-html", `
                    <table>
                        <tr>
                            <td><button class="opt" onclick="save()"><h3>保存</button></td>
                            <td><button class="opt" onclick="toggleOpt('autosave')"><h3>自动保存: ${options.autosave ? "开" : "关"}</button></td>
                            <td><button class="opt" onclick="hardReset()"><h3>硬复位</button></td>
                            <td><button class="opt" onclick="exportSave()"><h3>导出到剪切板</button></td>
                            <td><button class="opt" onclick="importSave()"><h3>导入</button></td>
                        </tr>
                        <tr>
                            <td><button class="opt" onclick="switchTheme()"><h3>主题: ${getThemeName()}</button></td>
                            <td><button class="opt" onclick="adjustMSDisp()"><h3>显示里程碑: ${MS_DISPLAYS[MS_SETTINGS.indexOf(options.msDisplay)]}</button></td>
                            <td><button class="opt" onclick="toggleOpt('hqTree')"><h3>高质量树贴图: ${options.hqTree ? "开" : "关"}</button></td>
                            <td><button class="opt" onclick="toggleOpt('hideChallenges')">已完成的挑战: ${options.hideChallenges ? "隐藏" : "显示"}</button></td>
                            <td><button class="opt" onclick="toggleOpt('forceOneTab'); needsCanvasUpdate = true">单标签页模式: ${options.forceOneTab ? "总是" : "自动"}</button></td>
                        </tr> 
                        <tr>
                            <td><button class="opt" onclick="toggleOpt('offlineProd')">离线进度: ${options.offlineProd ? "开" : "关"}</button></td>
                        </tr>
                    </table>`])
                    return tabformat
                }
            },
            信息: {
                content() {
                    var tabformat = []
                    tabformat.push('blank')
                    tabformat.push('blank')
                    tabformat.push('blank')
                    tabformat.push(["raw-html", `
                    <div>
                    <h1><p>${modInfo.name}</h2>
                    <h2><p>${VERSION.withName}</h3>
                    <br>
                    <h2><p>—— 模组作者 ——
                    <table>
                    <tr>
                    <th><h3><p>Deltap</th>
                    <th><h3><p>Genoplex</th>
                    </tr>
                    <tr>
                    <th style='width:150px'><img src="resources/Deltap.jpg" width="100px" height="100px"></img></th>
                    <th style='width:150px'><img src="resources/Genoplex.jpg" width="100px" height="100px"></img></th>
                    </tr>
                    </table>
                    <br>
                    <br>
                    <h2><p>TMT 2.6.4.3</a> by Acamaeda
                    <br>
                    <h2><p>TPT by Jacorb and Aarex
                    <br><br>
                    <a class="link" href="http://discord.gg/wwQfgPa" target="_blank" v-bind:style="{'font-size': '16px'}">Main Prestige Tree server</a><br>
                    <br><br>
                    已游玩时间: ${formatTime(player.timePlayed)}<br><br>
                `])
                    return tabformat
                }
            },
            更新日志: {
                content(){
                    var tabformat = []
                    changelog = modInfo.changelog
                    tabformat.push(["raw-html", modInfo.changelog])
                }
            },
        },
    },
})