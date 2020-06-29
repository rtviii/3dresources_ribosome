import numpy as np
import json
import os
import pandas as pd
from pprint import pprint as pp
from namespaces.total import total
import matplotlib.pyplot as plt
import collections
from scipy.sparse.csgraph import laplacian
import matplotlib
matplotlib.use("TkAgg")

# TODO: accessible neigbor-matrix explorer page.


# dynamic arguments:
# - NAMESPACE to contstruct a matrix from
# - BATCH of molecules to run mean on

namespace = total


def save_as_matrix(adjmatrix=np.array):
    np.savetxt('test.csv', np.around(adjmatrix, decimals=0), fmt='%1d')


def openjson(fullpath=str):
    with open(fullpath, 'r') as infile:
        jsonprofile = json.load(infile)
        return jsonprofile


def extract_adjacency_matrix(pdbid=str, radius=float):
    pdbid = str.upper(pdbid)
    clustersdatapath = './../clusterdata/{}/'.format(pdbid)
    allavailable = os.listdir(clustersdatapath)
    clusters = openjson(clustersdatapath + allavailable[0])

    construct_adjacency_matrix(clusters, namespace)


def tree2tuplearr(nbrtree=dict):
    nbrtuples = []
    for kvpair in list(nbrtree.items()):
        for nbr in kvpair[1]:
            nbrtuples.append([kvpair[0], nbr])
    return nbrtuples


def construct_adjacency_matrix(clusters=dict, nomenclature_namespace=dict):

    nbrpairs  = tree2tuplearr(clusters['nbrtree'])
    dim       = len(nomenclature_namespace.items())
    keys      = list(nomenclature_namespace.keys())
    substrate = np.zeros((dim, dim))

    for pair in nbrpairs:
        if (pair[0] not in keys or pair[1] not in keys):
            pass
        else:
            substrate[nomenclature_namespace[pair[0]],
                      nomenclature_namespace[pair[1]]] = 1

    save_as_matrix(substrate)

    def degreeMatrix(adjmatrix):
        n = np.size(adjmatrix, 1)
        D = np.zeros((n, n))

        for row in adjmatrix:
            for col in adjmatrix:
                D[col, row] = D[col, row] + 1
        return D

    # D = degreeMatrix(np.array(data))
    plt.matshow(substrate)
    plt.show()

extract_adjacency_matrix('4v9f')
