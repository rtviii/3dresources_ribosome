import json
from pathlib import Path
import numpy as np
import os
from clustering_scripts.extract_clusters import extract_clusters
from nomenclature.nomenclature_map import nom_map_from_profile


def openjson(fullpath=str):
    with open(fullpath, 'r') as infile:
        jsonprofile = json.load(infile)
        return jsonprofile

def save_clusters(filepath=str, targetradius=float, verbose=False):

    profile = openjson(filepath)
    pdbid   = str.upper(profile['metadata']['pdbid'])
    rnas    = profile['metadata']['rnanames']

    # Extract nomenclature map
    nommap = nom_map_from_profile(profile)
    # Extract clusters of proteins
    subchainclusters = extract_clusters(pdbid, rnas, targetradius, nommap, verbose)

    filename = "./clusterdata/{}/{}_withR={}___{}+{}__in{}___.json".format(
        pdbid,
        pdbid,
        f'{ targetradius :.3f}',
        subchainclusters['metadata']['n_clustered'],
        subchainclusters['metadata']['n_singular'],
        subchainclusters['metadata']['n_clusters'],
    )

    # Create directories if don't exist already
    if not (os.path.isdir('./clusterdata/{}/'.format(str.upper(pdbid)))):
        Path('./clusterdata/{}/'.format(pdbid)).mkdir(parents=True, exist_ok=True)

    # Write and dump json
    with open(filename, 'w') as out:
        json.dump(subchainclusters, out)
        print('Saved successfully at \t [{}]'.format(filename))

    return subchainclusters
