## Design choices: 


- parametrize the protein-space by all Ban proteins at once 
or split into two subunits or otherwise? (*worth to pass an array which would parametrize the adj. matrix, not hardcode perhaps*)



##### Notes:

- both subunits combined yield very sparse matrces(does it matter if the graphs are aligned though?)
- a lot of information collapses when the protein-index space is hardcoded: no possibility of alignment. Perhaps the indexing
should be predicated on the functional properties of proteins such that the resulting graphs can be permuted and aligned optimally.







# Implementation map :

1. Adjacency matrix for each molecule in the space of [all avaialable] proteins. (__extend later__)

        Matrix A has entry (row,col) ij=0 if protein at index i is in the same cluster as protein j. 0s on the diagonal.

2. Alignment kernel:

        k: Ga X Ga -> R, max of inner products of matrices X and Y from equivalence 
        classes X and Y of all possible ordering of nodes of graph-representations of two molecules's(X, Y) clusters.



