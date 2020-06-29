import axios from 'axios';
export const requestUniprotProfilePromise = (pdbid) => {
    return axios.get(`https://www.ebi.ac.uk/pdbe/api/mappings/uniprot/${pdbid}`)
}
