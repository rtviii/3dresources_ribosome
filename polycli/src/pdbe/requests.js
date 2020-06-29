const axios = require('axios');
const requestPDBEProfilePromise = pdbid => {
    const pdbeSearchSelect = "https://www.ebi.ac.uk/pdbe/search/pdb/select?";
    const params = {
        q: `${pdbid.toLowerCase()}`,
        fl: "molecule_name, molecule_synonym, uniprot_id, uniprot_accession, struct_asym_id, entity_id",
        rows: "200"
    };

    return axios.get(pdbeSearchSelect, { params })
};


module.exports = { requestPDBEProfilePromise }
