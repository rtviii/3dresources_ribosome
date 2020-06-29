import fs from 'fs'
import shell from 'shelljs'
import * as tunnelpaper from './../assets/kdd-paper-table'
import * as req from './requests'
import * as utils from './utils'

// should take TARGETS parameter
export const handle_uniprot = async () => {
    var depositionDirectory = './static/uniprot/'                          //WRT PROJECT ROOT
    var targetmolecules = Object.keys(tunnelpaper.structs_kdd2019)
    console.log("Attempting to download: ", targetmolecules, " to ", depositionDirectory);

    const promiseIndexed = targetmolecules.map(async mol =>
        await req.requestUniprotProfilePromise(mol)
            .then(
                res => { return [mol, utils.restructureOnDowload(res.data)] },
                err => { return [mol, { failedWith: err }] })
    )
    const resolved_data = await Promise.all(promiseIndexed);
    if (!fs.existsSync(depositionDirectory)) {
        console.log("Creating directory: ", depositionDirectory);
        shell.mkdir('-p', depositionDirectory);
    }
    resolved_data.forEach(datum => {
        fs.writeFileSync(depositionDirectory + `${datum[0]}.json`, JSON.stringify(datum[1], null, 4), 'utf8',
            () => { console.log(`${datum[0]} saved to disk.\n`) })
    }
    )
}

