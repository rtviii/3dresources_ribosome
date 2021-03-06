import arg from 'arg';
// import inquirer from 'inquirer';
// import * as pdbe from './pdbe/logic'
import * as uniprot from './uniprot/logic'
import * as rcsb from './rcsb/logic'
import * as pfam from './pfam/logic'
import * as nom from './nomenclature/nomenclature'
import * as utils from './utils/pfam_csv2json'
import * as fetchseq from  './uniprot/fetch_sequence'



export async function cli(argv) {
    let commands = parseArgumentsIntoOptions(argv);
    // console.log("Got commands: ", commands)
    executeCommands(commands)
}

const executeCommands = (argv) => {
    // if (argv.pdbe) {
    //     pdbe.handle_pdbe(argv.templates)
    // }
    if (argv.uniprot) {
        uniprot.handle_uniprot(argv.templates)
    }
    if (argv.rcsb) {
        rcsb.handle_rcsb(argv.templates);
    }
    if (argv.test) {

    }
    if (argv.pfam) {
        pfam.handle_pfam(argv.templates);
    }
    if (argv.meta) {
        // compare metadata of rcsb file and its pfam image
    }
    if (argv.nomenclature) {
        nom.handle_nomenclature(argv.templates)
    }
    if (argv.mapgen) {
        nom.generateSubchainMap(argv.templates, true)
    }
    if (argv.fetchseq){
       fetchseq._augment_structurewseq(argv.templates)
    }
    // -----------------------------
    if (argv.help) {
        menuAnnounce()
    }
    if (argv.utils) {
        utils.utilities(argv.templates)
    }



}

function parseArgumentsIntoOptions(rawArgs) {
    const args = arg(
        {
            // '--pdbe'   : Boolean,
            '--uniprot' : Boolean,
            '--pfam'    : Boolean,
            '--rcsb'    : Boolean,
            '--test'    : Boolean,
            '--meta'    : Boolean,
            '--nom'     : Boolean,
            '--mapgen'  : Boolean,
            '--help'    : Boolean,
            '--utils'   : Boolean,
            '--fetchseq': Boolean,

        },
        {
            argv: rawArgs.slice(2),
        }
    );
    return {
        // pdbe        : args['--pdbe']    || false,
        pfam        : args['--pfam'] || false,
        rcsb        : args['--rcsb'] || false,
        uniprot     : args['--uniprot'] || false,
        meta        : args['--meta'] || false,
        test        : args['--test'] || false,
        nomenclature: args['--nom'] || false,
        mapgen      : args['--mapgen'] || false,
        help        : args['--help'] || false,
        utils       : args['--utils'] || false,
        fetchseq    : args['--fetchseq'] || false,
        templates   : args._,
    };
}



const menuAnnounce = () => {

    const options = {
        "--pdbe"    : "[batch| single [pdbid]] ",
        "--uniprot" : "[batch| single [pdbid]] ",
        "--rcsb"    : "[batch| single [pdbid]] ",
        "--pfam"    : "[batch| single [pdbid]] ",
        "--nom"     : "[batch| single [pdbid]] ",
        "--mapgen"  : "[filename]",
        "--utils"   : "db",
        "--fetchseq": "accession"

    }

    console.log(`
    The \"batch\" options refers to the keys of the kdd-paper-table.js fil found in ./src/assets/.
    Add pdbids to that file for them to be included in the batch processing.`)
    console.log(`
    USAGE: sequentially geenerate pfam-template and the nomnclature template from the rcsb template.
    (Each depends on the rcsb profile being present and parsed.)

    Ex.
    $seed --rcsb single 3j7z  
    $seed --pfam single 3j7z  
    $seed --nom single 3j7z`)
    console.log(`
    --mapgen functions in the same way and generates nomenclature maps used to convert old chain names to Ban nomenclature.
    Needed for the python backend.`)

    console.log('========================================================================');
    console.log('Avalailable methods:');
    console.table(options)
    console.log('========================================================================');
}