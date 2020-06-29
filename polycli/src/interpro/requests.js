import axios from 'axios';

export const requestEntryByAccession = async (uniprotacc) => {

    return axios.get(`https://www.ebi.ac.uk/interpro/api/protein/uniprot/${uniprotacc}`)

}

// can get id from accession-request's metadata
export const requestEntryById = async (interproid) =>{
    
}