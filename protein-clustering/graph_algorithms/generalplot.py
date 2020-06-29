import numpy as np
import matplotlib.pyplot as plt
from matplotlib.pyplot import figure
import matplotlib
import json
import os
from scipy.sparse import csr_matrix
from total import total, totalArr
from helpers import openjson, construct_adjacency_matrix, tree2tuplearr, get_cuthill_mckee_ndarray, get_laplacian_ndarray
import functools
import seaborn as sns
import scipy.sparse as ssp


matplotlib.use("TkAgg")

namespace = total
namespaceArr = totalArr


# TARGET GROUPS:


# bacteria = ['5NJT', "5AFI", "5JVG", "5MYJ",
#             "5O60", "5V7Q", "5NRG", "4Y4P", "3J7Z", "5VP2"]
# eukarya = ["6EK0", "5T2A", "3J79", "5GAK",
#            "4V7E", "5T5H", "5XXB", "5XY3", "4UGO"]
# tight: 6eko, 5t5h
# large: 4v7e(e),



def plot_simplemean(targetbatch=str, cmkee=bool):
    targetspath = './../clusterdata/targetgroups/{}/'.format(targetbatch)
    batch = os.listdir(targetspath)
    # print("BATCH >>>>", batch)
    adjmats = [construct_adjacency_matrix(
        openjson(targetspath+x), namespace, False) for x in batch]
    reduced = functools.reduce(lambda x, y: np.add(x, y), adjmats)
    reduced = np.divide(reduced, len(adjmats))


    fig, ax = plt.subplots()
    if cmkee == True:
        bfs, permnames = get_cuthill_mckee_ndarray(reduced, namespaceArr)

        im = ax.imshow(bfs)
        ax.set_xticks(np.arange(len(permnames)))
        ax.set_yticks(np.arange(len(permnames)))
        ax.set_yticklabels(permnames)
        ax.set_xticklabels(permnames)
    else:
        im = ax.imshow(reduced)
        ax.set_xticks(np.arange(len(namespaceArr)))
        ax.set_yticks(np.arange(len(namespaceArr)))
        ax.set_yticklabels(namespaceArr)
        ax.set_xticklabels(namespaceArr)

    plt.setp(ax.get_xticklabels(), rotation=90, ha="right",
             rotation_mode="anchor", fontsize=4)

    plt.setp(ax.get_yticklabels(),  ha="right",
             rotation_mode="anchor", fontsize=4)
    ax.set_title("Protein correlations")
    fig.tight_layout()
    # figure(figsize=(6,8))


    plt.show()
    return

def plot_covmat(targetbatch):
    targetspath = './../clusterdata/targetgroups/{}/'.format(targetbatch)
    batch = os.listdir(targetspath)
    adjmats = [construct_adjacency_matrix(
        openjson(targetspath+x), namespace, False) for x in batch]
    reduced = functools.reduce(lambda x, y: np.add(x, y), adjmats)
    reduced = np.divide(reduced, len(adjmats))
    covmat = np.cov(reduced)

    fig, ax = plt.subplots()
    im = ax.imshow(covmat)
    ax.set_xticks(np.arange(len(namespaceArr)))
    ax.set_yticks(np.arange(len(namespaceArr)))
    ax.set_yticklabels(namespaceArr)
    ax.set_xticklabels(namespaceArr)
    plt.setp(ax.get_xticklabels(), rotation=90, ha="right",
             rotation_mode="anchor", fontsize=4)

    plt.setp(ax.get_yticklabels(),  ha="right",
             rotation_mode="anchor", fontsize=4)
    ax.set_title("Protein correlations")
    fig.tight_layout()

    plt.show()
    return


plot_covmat('bacteria')

