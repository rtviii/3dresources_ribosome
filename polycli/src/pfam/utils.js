import _ from 'lodash'
import { pfam_labels } from './../assets/kdd2019_pfam_labels';
import { parseString } from 'xml2js';
import * as requests from './requests';
import { error } from 'shelljs';
const fs = require('fs')


// pdbid and chainid to look up the pfam id in the csv version of their db
// accession to request
const requestPfamMatches = async (accession) => {
    console.log(`Requesting accession ${accession}.`)
    var parserOptions = {
        trim: true,
        mergeAttrs: true,
        explicitArray: false,
        attrNameProccessors: [],
        attrValueProccessor: [],
        tagNameProcessors: [],
        valueProccessors: [],
    }
    try {

        const { data } = await requests.requestPfamMatchesPromise(accession);
        var parsed;
        parseString(data, parserOptions, (n, y) => {
            parsed = y;
            if (n) {
                parsed = error;
                console.log("Error when parsing", data)
            }
        });
        if (parsed.pfam.entry.matches) {
            return parsed.pfam.entry.matches;
        }
    } catch (e) {
        console.log("Fetch pfam matches got error", e)
        return e;

    }

}


const fetchStaticPfamMatches = (pdbid, chainid) => {
    // console.log('PROCESSING TAGS FOR ', pdbid)
    var staticMatches = [];
    var hasmolecule = pfam_labels.hasOwnProperty(pdbid)
    var hassubchain = pfam_labels[pdbid].hasOwnProperty(chainid)

    if (hasmolecule && hassubchain) {
        staticMatches = pfam_labels[pdbid][chainid]['PFAM_ID']
    }
    else {
        console.log(`No CSV entry for the chain ${chainid} of ${pdbid}\t\t\t [X]`)
    }
    return staticMatches;
}



export const addPfamTagsToRCSBProfile = async (pdbid) => {

    const rcsbpath = `./static/rcsb/${pdbid.toUpperCase()}.json`
    var rcsbprofile;
    try {
        rcsbprofile = JSON.parse(fs.readFileSync(rcsbpath))
    } catch (e) {
        console.log(`Failed to open ./static/rcsb/${pdbid.toUpperCase()}.json. Exiting.`)
        process.exit(1)
    }
    // console.log("on entering tags", rcsbprofile);
    return await Promise.all(rcsbprofile.map(async protein => {
        var staticMatches = []
        var dynamicMatches = [];
        console.log(`Processing PFAM groups for ${pdbid} : ${protein.chainid}`)
        if (!protein.RNA && protein.accession) {
            var dynamicMatches = [];
            try {
                const { match }      = await requestPfamMatches(protein.accession)
                      dynamicMatches = _.flattenDeep([match]).map(matchObject => matchObject.accession)
            } catch (e) {
                console.log(`Request failure: ${pdbid} ${protein.accession}. Likely no matches. \t\t\t [X] `)
                dynamicMatches = [];
            }
            staticMatches = _.flattenDeep([await fetchStaticPfamMatches(pdbid, protein.chainid)])
        }

        return {
            ...protein,
            pfamGroups: _.uniq([...staticMatches, ...dynamicMatches])
        };
    }
    ))



}


