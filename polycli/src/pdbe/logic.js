import fs from 'fs'
import path from 'path'
import shell from 'shelljs'
import arg from 'arg'
import * as tunnelpaper from './../assets/kdd-paper-table'
import * as req from './requests'

export const handle_pdbe = async () => {
    console.log("In handle pdbe");
    var depositionDirectory = './static/pdbe/' //WRT PROJECT ROOT
    var targetmolecules = Object.keys(tunnelpaper.structs_kdd2019)
    console.log("Attempting to download: ", targetmolecules, " to ", depositionDirectory);
    var data = await Promise.all(targetmolecules.map(async molecule => {
        return {
            [molecule]: await req.requestPDBEProfilePromise(molecule)
                .then(res => { return res.data.response.docs },
                    error => { return { failedWith: error } })
        }
    }))
    if (!fs.existsSync(depositionDirectory)) {
        console.log("Creating directory: ", depositionDirectory);
        shell.mkdir('-p', depositionDirectory);
    }
    data.forEach(datum => fs.writeFileSync(depositionDirectory + `${Object.keys(datum)[0]}.json`, JSON.stringify(datum, null, 4), 'utf8',
        () => { console.log(`${Object.keys(datum)[0]} saved to disk.\n`) }))
}

// A metadata gate would be great

