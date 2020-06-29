import axios from 'axios'

export const requestSanDiegoRNA = async (pdbid) => {
    return axios.get(`https://www.rcsb.org/pdb/rest/describeMol?structureId=${pdbid}`)
}