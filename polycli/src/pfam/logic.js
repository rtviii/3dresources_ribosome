import fs from 'fs'
import shell from 'shelljs'
import * as tunnelpaper from './../assets/kdd-paper-table'
import * as utils from './utils'
import { getMetadata } from './../processing/getMetadata'


const save_format_profile_with_pfam_matches = async (molecule_pdbid, depositionDirectory) => {

    let pdbid = molecule_pdbid.toUpperCase();
    if (!fs.existsSync(depositionDirectory)) {
        console.log("Creating directory: ", depositionDirectory);
        shell.mkdir('-p', depositionDirectory);
    }

    var profile;
    console.log(`Constructing PFAM profile ${pdbid} based on RCSB.`);

    profile = await utils.addPfamTagsToRCSBProfile(pdbid);

    const metadata = getMetadata(pdbid,profile);

    profile = {
        metadata,
        [pdbid.toUpperCase()]: profile
    }

    fs.writeFileSync(depositionDirectory + `${pdbid}.json`, JSON.stringify(profile, null, 4), 'utf8',
        () => { console.log(`${pdibd} saved to disk.\n`) })
}

export const handle_pfam = async (templates) => {
    const depositionDirectory = './static/pfam/'
    if (templates[0] === 'single') {

        console.log(`Tagging molecule [ ${templates[1]} ] with PFAM groups.`);
        try {
            await save_format_profile_with_pfam_matches(templates[1], depositionDirectory)
        } catch (e) {
            console.log("Likely misspelled something.")
            console.log(e)
        }
    } else if (templates[0] === 'batch') {

        var targetmolecules = Object.keys(tunnelpaper.structs_kdd2019)
        console.log(targetmolecules)
        targetmolecules.forEach(pdbid => save_format_profile_with_pfam_matches(pdbid, depositionDirectory))

    } else {
        console.log('Invalid template argument.');
        process.exit(1)
    }


}

