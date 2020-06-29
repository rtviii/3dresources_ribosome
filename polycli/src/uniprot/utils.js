import _ from 'lodash'
export const restructureOnDowload = (uniprotResponseObject) => {
    const restrustured = [...Object.entries(Object.values(uniprotResponseObject)[0].UniProt)].map(
        protein => {
            var [accession, info] = protein;

            var { mappings, ...etc } = info;
            return {
                accession,
                ...mappings[0],
                ...etc
            }
        }
    )
    return restrustured;

}