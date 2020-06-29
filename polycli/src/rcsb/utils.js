import _ from 'lodash';
const extractRnasFromRcsbProfile = rcsbProfile => {
    var rnas = []
    var proteins = []
    rcsbProfile.forEach(poly => {
        poly.type == 'rna' ?
            rnas.push({ RNA: true, ...poly }) :
            proteins.push(poly)
    })
    return [proteins, rnas];
}


export const restructureOnDownload = (rcsbResponseObject) => {
    var rcsbprofile = _.flattenDeep([rcsbResponseObject.molDescription.structureId.polymer])
    var [proteins, rnas] = extractRnasFromRcsbProfile(rcsbprofile);

    // rcsb's "polymer" might posses an array of chain ids or a single chain objec
    // separate by chain:
    var singlechained_polymers = [];
    proteins.forEach(
        prot => {
            if (prot.hasOwnProperty('macroMolecule')) {
                const { chain, ...rest } = prot;
                var { macroMolecule, ...mmrest } = rest;
                var chainids = _.flattenDeep([chain]).map(chainobj => chainobj.id)
                chainids.map(chain => {
                    singlechained_polymers.push({
                        chainid: chain,
                        ...macroMolecule,
                        ...mmrest
                    })
                })
            } else {
                const { chain, ...rest } = prot;
                var chainids = _.flattenDeep([chain]).map(chainobj => chainobj.id)
                chainids.map(chain => singlechained_polymers.push({
                    chainid: chain,
                    ...rest
                }))
            }
        }
    )

    proteins = singlechained_polymers.filter(polymer => polymer.type !== 'rna')
    proteins = proteins.map(prot => {
        if (prot.hasOwnProperty('accession')) {
            var { accession, ...rest } = prot;
            return {
                ...rest,
                accession: accession.id
            }
        } else {
            return prot
        }
    })



    var singlechained_rnas = [];
    rnas = rnas.map(rna => {
        const { chain, ...rest } = rna;
        var chainids = _.flattenDeep([chain]).map(chainobj => chainobj.id)
        chainids.map(chain => {
            singlechained_rnas.push({
                chainid: chain,
                ...rest
            })
        })

    })

    return [...singlechained_rnas, ...proteins];

}