def nbrtuples_to_nbrtree(nbrtuples=list):
    nbrtree = {}
    # Create keys
    for seedpair in nbrtuples:
        if not(seedpair[0] in nbrtree.keys()):
            nbrtree[seedpair[0]] = []
        if not(seedpair[1] in nbrtree.keys()):
            nbrtree[seedpair[1]] = []

    for pair in nbrtuples:
        # if second chain of the two is not in the cluster of the first,
        # add it to the cluster (they are neigbor, after all)
        if pair[1] not in nbrtree[pair[0]]:
            nbrtree[pair[0]].append(pair[1])
        if pair[0] not in nbrtree[pair[1]]:
            nbrtree[pair[1]].append(pair[0])
    return nbrtree


