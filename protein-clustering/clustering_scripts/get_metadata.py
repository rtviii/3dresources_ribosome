def get_metadata(nbrclusters=list, allchains=list, rnas=list, radius=float):
    singularChains = []
    mergedClusters = set([])
    # Merge everything
    for cluster in nbrclusters:
        mergedClusters.update(cluster)
    for chain in allchains:
        if chain not in mergedClusters and chain not in rnas:
            singularChains.append(chain)

    def countClustersChains(clusters=list):
        # returns the number of [chains, clusters]
        chaincount = 0
        clustercount = 0
        for cluster in clusters:
            clustercount += 1
            for chain in cluster:
                chaincount += 1
        return [chaincount, clustercount]

    totalcount = countClustersChains(nbrclusters)
    return {
        "radius"         : radius,
        "n_clusters"     : totalcount[1],
        "n_clustered"    : totalcount[0],
        "n_singular"     : len(singularChains),
        "n_rnas"         : len(rnas),
        "n_total"        : len(allchains),
        "singular_chains": singularChains,
        "rnas"           : rnas,
        "allchains"      : allchains
    }

