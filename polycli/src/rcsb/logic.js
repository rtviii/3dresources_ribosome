import fs from 'fs'
import shell from 'shelljs'
import * as tunnelpaper from './../assets/kdd-paper-table'
import * as req from './requests'
import { parseString } from 'xml2js';
import * as utils from './utils'



export const save_format_rcsb_profile = async (pdbid, depositionDirectory) => {
    if (!fs.existsSync(depositionDirectory)) {
        console.log("Creating directory: ", depositionDirectory);
        shell.mkdir('-p', depositionDirectory);
    }
    try {
        console.log(`Downloading ${pdbid} from RCSB`)
        var rcsbProfile = await req.requestSanDiegoRNA(pdbid)
            .then(res => {
                var Options = {
                    trim: true,
                    mergeAttrs: true,
                    explicitArray: false,
                    attrNameProccessors: [],
                    attrValueProccessor: [],
                    tagNameProcessors: [],
                    valueProccessors: [],
                }
                var parsed;
                parseString(res.data, Options, (err, result) => {
                    parsed = result;
                    if (err) {
                        console.log("Failed to parse rcsb's xml. Exiting  ", error)
                        process.exit(2)
                    }
                })
                return [pdbid, utils.restructureOnDownload(parsed)];
            }, err => { return [pdbid, { failedWith: err }] })

        fs.writeFileSync(depositionDirectory + `${rcsbProfile[0]}.json`, JSON.stringify(rcsbProfile[1], null, 4), 'utf8',
            () => { console.log(`${rcsbProfile[0]} saved to disk.\n`) })
    } catch (error) {
        console.log('Error fetching / No matches ', error)
    }
}




export const handle_rcsb = async (templates) => {

    console.log(`RCSB got templates ${templates}`)
    var depositionDirectory = './static/rcsb/'
    

    // SINGLE PROCESSING
    if (templates[0] === 'single') {
        try {
            save_format_rcsb_profile( templates[1].toUpperCase() , depositionDirectory)
        } catch (error) {
            console.log('Error fetching a single rcsb profie.', error)
        }
    }

    // BATCH PROCESSING
    else if (templates[0] === 'batch') {
        var targetmolecules = Object.keys(tunnelpaper.structs_kdd2019)
        console.log("Attempting to download: ", targetmolecules, " to ", depositionDirectory);
        const promiseIndexed = targetmolecules.map(async mol => {
            return await save_format_rcsb_profile(mol, depositionDirectory)
        }
        )
        await Promise.all(promiseIndexed);
        return 0
    }


}