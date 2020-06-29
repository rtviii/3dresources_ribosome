import axios from 'axios'

export const requestPfamMatchesPromise = (uniprotAccession) => {
    return axios.get(`https://pfam.xfam.org/protein/${uniprotAccession}?output=xml`)
}
