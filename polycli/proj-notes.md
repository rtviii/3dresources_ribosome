#### Added the following molecules: 

- 6R6G Oryctolagus cuniculus
- 6SGB Trypanosoma brucei brucei
- 6RXU Chaetomium thermophilum
- 6V3D Acinetobacter baumannii AB0057
- 6SPB Pseudomonas aeruginosa
- 6UZ7 Kluyveromyces lactis
- 6HIV Trypanosoma brucei brucei MITOCHONDRION



# TODOS: 


- [] Test on 4UG0
- [] Eliminate the dependency on the csv pfam database.
- [] Clean up tag-fetching, make synchronous to ease the debugging/tracing.




----
RCSB: 
    changing "../rest/.." to json returns json with no tags(?)
    RNA chain elements in xml
    type="rna"


PFAM INCONSISTENCIES: 
    -pfam csv doesn't have entry for chain 1 for 5x8t for ex.
    -interpro provides certain family labels refering to pfam's data
        EVEN THOUGH pfam itself does not provide data on a molecule.
        
    -ex. pfam_pdb_chains csv does not contain 5nrg's chain I, while pfam api 
        provides one match for it.
    -ex. P46899 (chain h of 5njt) does not "fit" in either ul18 or el18
        given its pfam PF00861 and bacterial origin(family explicitly
        specifies absence of metazoan proteins in it).