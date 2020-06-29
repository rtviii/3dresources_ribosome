import fs from 'fs'
import _ from 'lodash'


export const getMetadata = (pdbid, profile) => {
    var rnas                 = profile.filter(polymer => polymer.type === 'rna')
    var protein              = profile.filter(poly => poly.type === 'protein')
    var rnanames             = rnas.map(rna => rna.chainid)
    var noaccession_proteins = protein.map(protein => !(protein.accession) ? protein.chainid : null)
    var accession_proteins   = protein.map(protein => (protein.accession) ? protein.chainid : null)
    var metadata             = {
        pdbid       : pdbid,
        rnacount    : rnanames.length,
        proteincount: protein.length,
        rnanames,
        noaccession_proteins,
        accession_proteins
    }

    return metadata

}
