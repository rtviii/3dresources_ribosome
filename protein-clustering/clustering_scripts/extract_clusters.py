from Bio import PDB
from clustering_scripts.nbrtree_to_nbrclusters import nbrtree_to_nbrclusters
from clustering_scripts.nbrtuples_to_nbrtree import nbrtuples_to_nbrtree
from clustering_scripts.get_metadata import get_metadata
import os
import numpy as np
import json


def extract_clusters(pdbid=str, rnas=list, radius=float, nomenclatureMap=dict, verbose=False):
    filepath        = os.path.realpath("./../cif_models/{}.cif".format(pdbid))
    requestedstruct = pdbid
    requestedradius = float(radius)
    rnas_to_exclude = rnas

    print("Got [ {} ]. Parsing... \n".format(filepath))
    try:
        with open(filepath) as f:
            parser    = PDB.FastMMCIFParser(QUIET=True)
            structure = parser.get_structure(requestedstruct, f)
    except:
        print("Failed to open {}. Exiting.\n".format(filepath))

    allchains       = [chain.get_id() for chain in structure.get_chains()]
    newnomallchains = list(map(lambda chainid: nomenclatureMap[chainid], allchains))
    atomwise_struct = PDB.Selection.unfold_entities(structure, "A")
    if (verbose):
        for atom in atomwise_struct:
            print("Atom : " , atom.get_coord(), "\n")
    structwide_ns   = PDB.NeighborSearch(atomwise_struct, bucket_size=5)
    all_nbr_pairs   = structwide_ns.search_all(requestedradius, "C")

    idpairs         = list(map(lambda tuple: (tuple[0].get_id(), tuple[1].get_id()), all_nbr_pairs) )
    newnompairs     = list(map(lambda tuple: (nomenclatureMap[tuple[0]], nomenclatureMap[tuple[1]]), idpairs ));

    # applying the nomenclature to the neighbor pairs

    i = 0
    # Pre-nomenclature version

    while i < len(newnompairs):
        # print(newnompairs[i])
        if newnompairs[i][0] in rnas_to_exclude or newnompairs[i][1] in rnas_to_exclude:
            newnompairs.pop(i)
            pass
        else:
            i += 1

    # so, the neighbor tree is needed to provide a basis for clusters
    nbrtree = nbrtuples_to_nbrtree(newnompairs)
    verify_no_rna(nbrtree, newnomallchains, rnas_to_exclude)
    # print("tree in clust ", nbrtree)
    # Extract clusters from the neighbortree
    nbrclusters = [list(c)
                   for c in nbrtree_to_nbrclusters(nbrtree, rnas_to_exclude)]
    metadata = get_metadata(nbrclusters, newnomallchains, rnas_to_exclude, requestedradius)

    return {
        "metadata": metadata,
        "clusters": nbrclusters,
        "nbrtree": nbrtree
    }


def verify_no_rna(nbrtree=dict, allchains=list, rnas=list):
    for key in nbrtree.keys():
        for polymer in rnas:
            if polymer in nbrtree[key]:
                print("RNA {} in protein-only neighbor tree!".format(polymer))
                raise ValueError
        if key not in allchains:
            print("Key {} is not struct's chains: {}!".format(key, allchains))
            raise ValueError


# >>>>>Past tries, emailed Thomas Hamelryck, the author of NeighborSearch among other things.
# >>>> Still not sure if chain neighbors given a CHAIN could be gotten.
# >>>> center in search has to be np.shape = (3,)
# atomwise_K                               = PDB.Selection.unfold_entities(subchain_dict['K'], 'A')
# np_atomwise_K                            = np.array([atom.get_coord() for atom in list(atomwise_K)])
# struct_ns                                = PDB.NeighborSearch(atomwise_struct, 10)
# print(np.shape(np_atomwise_K))                                   # (1451,3)
# chain_nbrs_single = struct_ns.search(np_atomwise_K[43], 10, "C") # works well, yields neighbors in 10 of 43'rd atom
# chain_nbrs = struct_ns.search(np_atomwise_K, 10, "C")            # Exepected a 3-dimensional Numpy array.
