import csv from 'csv-parser'
import fs from 'fs'
import { async } from 'rxjs/internal/scheduler/async'



const help = () => {

    options = {
        "db": "[pfamdb/..] for now just to convert pfam's database to json"
    }
    console.log("USAGE: \n")
    console.table(options)

}

export const utilities = (templateargs) => {
    console.log("got template args", templateargs)
    if (templateargs[0] == 'db') {
        pfam_db_to_json(templateargs[1])
    }
    else {
        console.log('Unrecognized template args.')
        help()

    }
}

const pfam_db_to_json = async (path) => {

    var results = []

    const process_csv = (path) => {
        return new Promise((resolve, reject) => {
            const csv_presets = {
                skipLines: 1
            }
            fs.createReadStream(path).pipe(csv(csv_presets))
                .on('data', data => results.push(data))
                .on('end', () => {
                    console.log("Parsed .csv sucessfully.")
                    resolve()
                }).on('error', error => reject(error))
        })

    }


    await process_csv(path)

    console.log(`Attempting to convert ${path} to .json...`)
    const structReducer = (accumulator, pfamrow) => {

        // If the struct is in keys of already, just add a chain to it
        if (Object.keys(accumulator).includes(pfamrow.PDB)) {
            // IF the chain is already present in struct, merge pfam ids if so.
            var currStruct = accumulator[pfamrow.PDB]
            var currChain = pfamrow.CHAIN

            if (Object.keys(currStruct).includes(currChain)) {
                accumulator[pfamrow.PDB][pfamrow.CHAIN] =
                    [...currStruct[currChain], pfamrow.PFAM_ID]
            }
            // Else just add the pfam id
            else {
                accumulator[pfamrow.PDB] = {
                    ...accumulator[pfamrow.PDB],
                    [pfamrow.CHAIN]: [pfamrow.PFAM_ID]
                }
            }
        }
        // Else, add the struct AND the first chain
        else {
            accumulator[pfamrow.PDB] = {
                [pfamrow.CHAIN]: [pfamrow.PFAM_ID]
            }
        }

        return accumulator

    }
    try {
        var mergedStructs = results.reduce(structReducer, {})
    } catch (error) {
        console.log(`Failed with ${error}. Exiting..`)
    }
    const savefile = path.match(/(.*)\.(.*)/)[1].concat('.json')
    fs.writeFileSync(savefile, JSON.stringify(mergedStructs))

    console.log(`Saved to ${savefile}.`)




}