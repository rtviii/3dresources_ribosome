import numpy as np
import matplotlib.pyplot as plt
from matplotlib.pyplot import figure
import matplotlib
import json
import os
from scipy.sparse import csr_matrix
from total import total, totalArr
import functools
import seaborn as sns
import scipy.sparse as ssp


matplotlib.use("TkAgg")

namespace = total
namespaceArr = totalArr



def construct_adjacency_matrix(clusters=dict, nomenclature_namespace=dict, verbose=False):

    nbrpairs = tree2tuplearr(clusters['nbrtree'])
    dim = len(nomenclature_namespace.items())
    keys = list(nomenclature_namespace.keys())
    substrate = np.zeros((dim, dim))

    for pair in nbrpairs:
        if (pair[0] not in keys or pair[1] not in keys):
            pass
        else:
            substrate[nomenclature_namespace[pair[0]],
                      nomenclature_namespace[pair[1]]] = 1

    if(verbose):
        plt.matshow(substrate)
        plt.show()
    return substrate


def openjson(fullpath=str):
    with open(fullpath, 'r') as infile:
        jsonprofile = json.load(infile)
        return jsonprofile

def tree2tuplearr(nbrtree=dict):
    nbrtuples = []
    for kvpair in list(nbrtree.items()):
        for nbr in kvpair[1]:
            nbrtuples.append([kvpair[0], nbr])
    return nbrtuples


def get_laplacian_ndarray(nparray):
    csr = csr_matrix(nparray)
    L = ssp.csgraph.laplacian(csr)
    return L.toarray()

def get_cuthill_mckee_ndarray(nparray, names):
    csr = csr_matrix(nparray)
    perm = ssp.csgraph.reverse_cuthill_mckee(csr)
    bfs = nparray[perm[:, None], perm]

    permutednames = [names[i] for i in perm]

    return bfs, permutednames
