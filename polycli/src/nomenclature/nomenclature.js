import { large_subunit_map } from './../assets/large-subunit-map'
import { small_subunit_map } from './../assets/small-subunit-map'
import fs from 'fs'
import shell from 'shelljs'
import _ from 'lodash'
import { structs_kdd2019 } from './../assets/kdd-paper-table'

const loadMaps = () => {
    const LargeSubunitMap = new Map()
    const SmallSubunitMap = new Map()
    const largeentries = Object.entries(large_subunit_map);
    const smallentries = Object.entries(small_subunit_map);
    for (var luprotein of largeentries) {
        luprotein[1].pfamDomainAccession.map(accession => LargeSubunitMap.set(accession, luprotein[0]))
    }
    for (var suprotein of smallentries) {
        suprotein[1].pfamDomainAccession.map(accession => SmallSubunitMap.set(accession, suprotein[0]))
    }
    return [LargeSubunitMap, SmallSubunitMap];
}


export const save_profile_with_nomenclature = (pdbid, depositionDirectory) => {
    if (!fs.existsSync(depositionDirectory)) {
        console.log("Creating directory: ", depositionDirectory);
        shell.mkdir('-p', depositionDirectory);
    }
    const path = `./static/pfam/${pdbid}.json`
    var pfamprofile;
    try {
        pfamprofile = JSON.parse(fs.readFileSync(path))
    } catch (e) {
        console.log(`Failed to open ${path}. ( Pfam image has to be generated first. ) Exiting!`)
        process.exit(1)
    }
    var withNomenclature = addNomenclatureToProfile(pdbid, pfamprofile, true);
    var withCoverage = addNomenclatureCoverageToMetadata(withNomenclature);
    console.log("Saving to dir", depositionDirectory + `${pdbid}.json`)
    fs.writeFileSync(depositionDirectory + `${pdbid}.json`, JSON.stringify(withCoverage, null, 4), 'utf8')
    return withNomenclature;
}

export const handle_nomenclature = async (templates) => {
    console.log("In handle nom", templates);
    if (templates[0] === 'single') {
        var pdbid = templates[1].toUpperCase()
        save_profile_with_nomenclature(pdbid, './static/nomenclature/')
    } else if (templates[0] === 'batch') {
        var targets = Object.keys(structs_kdd2019)
        var promises = targets.map(async molecule => {
            await save_profile_with_nomenclature(molecule, './static/nomenclature/')
        })
        await Promise.all(promises)
    } else {
        console.log('Invalid template argument.');
        process.exit(1)
    }

}

export const addNomenclatureToProfile = (pdbid, jsonprofile, verbose = false) => {
    const [LSM, SSM] = loadMaps()

    const polymers = jsonprofile[pdbid]
    var withNomenclature = polymers.map(polymer => {
        var nomenclature = [];

        polymer.pfamGroups.map(pfamacc => {
            nomenclature.push(LSM.get(pfamacc), SSM.get(pfamacc))
            _.remove(nomenclature, (el) => { return el == null })
        })

        if (verbose) {
            console.log([polymer.chainid, _.uniq(nomenclature)])
        }
        return {
            ...polymer,
            nomenclature: _.uniq(nomenclature)
        }

    })
    return {
        metadata: jsonprofile.metadata,
        polymers: withNomenclature
    }

}
const addNomenclatureCoverageToMetadata = (jsonprofile) => {
    const { metadata, ...rest } = jsonprofile;
    var rnas = []
    var covered = []
    var ambiguous = []
    jsonprofile.polymers.map(
        pol => {
            if (pol.type === 'rna') {
                rnas.push(pol)
            }
            if (pol.type === 'protein') {
                var nnames = pol.nomenclature.length;
                if (nnames === 1) {
                    covered.push(pol)
                }
                else {
                    ambiguous.push(pol)
                }
            }
        }
    )
    if (metadata.rnacount + metadata.proteincount != [...rnas, ...covered, ...ambiguous].length) {
        console.log("Polymers don't add up. Exiting.")
        process.exit(2)
    }
    const nomenclatureCoverage = covered.length / metadata.proteincount;
    console.log(`COVEREAGE : ${nomenclatureCoverage} `)
    console.log(`AMBIGUOUS: `, ambiguous)
    return {
        metadata: {
            ...metadata,
            nomenclatureCoverage
        },
        ...rest
    }
}


// Extract a map between the subchain ids and the BanNom ids. 
export const generateSubchainMap = async (templates, save=true) => {
    let path = templates[0] 
    // const path = `./static/pfam/${pdbid}.json`
    
    let jsonprofile;
    let pdbid;
    try {
        jsonprofile = JSON.parse(fs.readFileSync(path))
        pdbid = jsonprofile['metadata']['pdbid']
        
        console.log(`Opened ${path}`)
    } catch (e) {
        console.log(`Failed to open ${path}. ( Pfam image has to be generated first. ) Exiting!`)
        process.exit(1)
    }
    
    const [LSM, SSM] = loadMaps()
    const subchainsMap = new Map();
    let subchainMapJson = {}
    const polymers = jsonprofile[pdbid]
    polymers.map(polymer => {
        let nomenclature = [];
        polymer.pfamGroups.map(pfamacc => {
            nomenclature.push(LSM.get(pfamacc), SSM.get(pfamacc))
            _.remove(nomenclature, (el) => { return el == null })
        })

        nomenclature = _.uniq(nomenclature);
        subchainsMap.set(polymer.chainid, nomenclature);
        subchainMapJson[polymer.chainid] = nomenclature;
    })
    const depositionDirectory = './static/nomenclature/subchainMaps/'
    if (save) {
        fs.writeFileSync(depositionDirectory + `${pdbid}.json`, JSON.stringify(subchainMapJson, null, 4), 'utf8')
        console.log(`Saved ${pdbid}.json to ${depositionDirectory}`)
    }
    return subchainsMap
}