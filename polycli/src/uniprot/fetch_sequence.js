import axios from 'axios'
import fs from 'fs'
import path from 'path'
import shell from 'shelljs'
import { parseString } from 'xml2js';



const fetchseq = (accession)=>{
    return axios.get(
        `https://www.uniprot.org/uniprot/${accession}.xml`
    )
    .then(
        res => {                var Options = {
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
                return parsed.uniprot.entry
            },
            err=>{
                console.log("Connection error", err)
                process.exit(1)
            }
    )
}



export const _augment_structurewseq = async (pdbid)=>
{
    var appDir = path.dirname(require.main.filename);
    const filepath=  path.join( process.cwd() + "/"+ pdbid )
    var molecularprofile;
    try{
        molecularprofile = JSON.parse(fs.readFileSync(filepath))
    }
    catch (e){
        console.log(`Error opening file at path ${filepath}`)
        process.exit(1)
    }

    var augmented_profile = {
        ...molecularprofile.metadata,
        polymers: []
    }

    for ( var polymer of molecularprofile.polymers ){
        var aug_polymer;
        if ( polymer.accession ){
            console.log(`Processing ${accession}`)
            const uniprot_entry = await fetchseq(polymer.accession) 
            aug_polymer = {
                seq : uniprot_entry.sequence,
                dbReference: uniprot_entry.dbReference,
                ...polymer,
            }
        }else{
            console.log(`Processing RNA`)
            aug_polymer = polymer;
        }
        augmented_profile.polymers.push(aug_polymer)
    }
    var depositionDirectory = './static/seqaugment/'

    if (!fs.existsSync(depositionDirectory)){
        console.log("Creating directory: ", depositionDirectory);
        shell.mkdir('-p', depositionDirectory);
    }
    try{
        fs.writeFileSync(depositionDirectory + `${molecularprofile.metadata.pdbid}.json`, JSON.stringify(augmented_profile,null, 4), 'utf8',
        ()=>{
            console.log(`${molecularprofile.metadata.pdbid}.json saved to ${depositionDirectory}`)
        })

    }
    catch (e){
        console.log(' failed to save', error)
    }
}