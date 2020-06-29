import numpy as np
import matplotlib.pyplot as plt
from matplotlib.pyplot import figure
import matplotlib
import json
import os
from scipy.sparse import csr_matrix
from total import total, totalArr
import subunits_namespace as namespaces
from helpers import openjson, construct_adjacency_matrix, tree2tuplearr, get_cuthill_mckee_ndarray, get_laplacian_ndarray
import functools
import seaborn as sns
import argparse
import scipy.sparse as ssp


matplotlib.style.use('default')


def ajdmat(nbrpairs, namespace):
    dim = len(namespace)
    substrate = np.zeros((dim, dim))

    for pair in nbrpairs:
        if (pair[0] not in namespace or pair[1] not in namespace):
            pass
        else:
            indexself = namespace.index(pair[0])
            indexnbr = namespace.index(pair[1])
            substrate[indexself, indexnbr] = 1
    return substrate


# Plot adjacency matrix or covarinace matrix for the instance of a radius
# by SUBUNIT : largesmall = ['l', 's']
def plt_subunit(filename=str, clusterdatum=dict, largesmall=str, covariance=False):
    nbrpairs = tree2tuplearr(clusterdatum['nbrtree'])
    namesArr = names.largeSubunitArr if (
        largesmall == 'l') else names.smallSubunitArr

    substrate = ajdmat(nbrpairs, namesArr)

    fig, ax = plt.subplots()
    if covariance:
        substrate = np.cov(substrate)
    im = ax.imshow(substrate)
    ax.set_xticks(np.arange(len(namesArr)))
    ax.set_yticks(np.arange(len(namesArr)))
    ax.set_yticklabels(namesArr)
    ax.set_xticklabels(namesArr)

    plt.setp(ax.get_yticklabels(),  ha="right",
             rotation_mode="anchor", fontsize=6)

    ax.xaxis.tick_top()
    plt.setp(ax.get_xticklabels(), rotation=90, ha="left",
             rotation_mode="anchor", fontsize=6)

    ax.set_title("Small Subunit")
    plt.suptitle(filename, fontsize=6)
    fig.tight_layout()
    plt.show()


def pltall_batch(directory, namespace):
    batch = os.listdir(directory)
    nbrtrees = [tree2tuplearr(openjson(directory + x)['nbrtree'])
                for x in batch]
    adjmats = [ajdmat(tree, namespace) for tree in nbrtrees]
    reduced = functools.reduce(lambda x, y: np.add(x, y), adjmats)
    reduced = np.divide(reduced, len(adjmats))

    cmk, perm = get_cuthill_mckee_ndarray(reduced, namespace)

    fig, (ax1, ax2, ax3) = plt.subplots(1, 3)
    fig.patch.set_facecolor('xkcd:black')

    ax1.imshow(reduced)
    ax2.imshow(np.cov(reduced))
    ax3.imshow(cmk)

    ax1.set_xticks(np.arange(len(namespace)))
    ax1.set_yticks(np.arange(len(namespace)))
    ax1.set_yticklabels(namespace)
    ax1.set_xticklabels(namespace)
    plt.setp(ax1.get_yticklabels(),  ha="right",
             rotation_mode="anchor", fontsize=6, c='white')
    ax1.xaxis.tick_top()
    plt.setp(ax1.get_xticklabels(), rotation=90, ha="left",
             rotation_mode="anchor", fontsize=6, c='white')

    ax2.set_xticks(np.arange(len(namespace)))
    ax2.set_yticks(np.arange(len(namespace)))
    ax2.set_yticklabels(namespace)
    ax2.set_xticklabels(namespace)
    plt.setp(ax2.get_yticklabels(),  ha="right",
             rotation_mode="anchor", fontsize=6, c='white')
    ax2.xaxis.tick_top()
    plt.setp(ax2.get_xticklabels(), rotation=90, ha="left",
             rotation_mode="anchor", fontsize=6, c='white')

    ax3.set_xticks(np.arange(len(perm)))
    ax3.set_yticks(np.arange(len(perm)))
    ax3.set_yticklabels(perm)
    ax3.set_xticklabels(perm)
    plt.setp(ax3.get_yticklabels(),  ha="right",
             rotation_mode="anchor", fontsize=6, c='white')
    ax3.xaxis.tick_top()
    plt.setp(ax3.get_xticklabels(), rotation=90, ha="left",
             rotation_mode="anchor", fontsize=6, c='white')

    # title= "Eukarya & Bacteria | Large Subunit"
    ax1.set_title('Adjacency', c='white')
    ax2.set_title('Covariance', c='white')
    ax3.set_title('Reverse Cuthill-McKee', c='white')

    fig.suptitle('Eukarya | Complete Namesace', fontsize=12, c="white")
    fig.tight_layout()

    plt.savefig('eukarya triplot', bbox_inches='tight',
                facecolor=fig.get_facecolor())
    plt.show()




# Plot adjacency, covariance, reverse cuthill-mckee decomp for an instance of a radius
# by SUBUNIT : largesmall = ['l', 's']
def pltall_single(filename=str, clusterdatum=dict, largesmall=str):

    nbrpairs = tree2tuplearr(clusterdatum['nbrtree'])
    namesArr = names.largeSubunitArr if (
        largesmall == 'l') else names.smallSubunitArr

    substrate = ajdmat(nbrpairs, namesArr)
    covmat = np.cov(substrate)
    ckm, perm = get_cuthill_mckee_ndarray(substrate, namesArr)

    fig, (ax1, ax2, ax3) = plt.subplots(1, 3)
    fig.patch.set_facecolor('xkcd:black')

    ax1.imshow(substrate)
    ax2.imshow(covmat)
    ax3.imshow(ckm)

    ax1.set_xticks(np.arange(len(namesArr)))
    ax1.set_yticks(np.arange(len(namesArr)))
    ax1.set_yticklabels(namesArr)
    ax1.set_xticklabels(namesArr)

    ax2.set_xticks(np.arange(len(namesArr)))
    ax2.set_yticks(np.arange(len(namesArr)))
    ax2.set_yticklabels(namesArr)
    ax2.set_xticklabels(namesArr)

    ax3.set_xticks(np.arange(len(perm)))
    ax3.set_yticks(np.arange(len(perm)))
    ax3.set_yticklabels(perm)
    ax3.set_xticklabels(perm)

    plt.setp(ax1.get_yticklabels(),  ha="right",
             rotation_mode="anchor", fontsize=6, c='white')
    plt.setp(ax2.get_yticklabels(),  ha="right",
             rotation_mode="anchor", fontsize=6, c='white')
    plt.setp(ax3.get_yticklabels(),  ha="right",
             rotation_mode="anchor", fontsize=6, c='white')

    ax1.xaxis.tick_top()
    ax2.xaxis.tick_top()
    ax3.xaxis.tick_top()
    plt.setp(ax1.get_xticklabels(), rotation=90, ha="left",
             rotation_mode="anchor", fontsize=5, c='white')
    plt.setp(ax2.get_xticklabels(), rotation=90, ha="left",
             rotation_mode="anchor", fontsize=5, c='white')
    plt.setp(ax3.get_xticklabels(), rotation=90, ha="left",
             rotation_mode="anchor", fontsize=5, c='white')

    # ax1.set_title("Small Subunit", c='white')
    plt.suptitle(filename, fontsize=6)
    fig.tight_layout()
    plt.show()


# plot covariance matrix of adjacency averages inside a given namespace
targetsdirectory = './../clusterdata/targetgroups/'
def plt_batch(targets, subunitNamespace, covcor):
    directory =  targetsdirectory + '{}/'.format(targets)
    #NAMESPACE = 'large', 'small', 'total'
    #COVCOR = 'covariance', 'correlation'
    #DIRECTORY = path to targets

    if subunitNamespace == 'small':
        namespace = namespaces.smallSubunitArr
    elif subunitNamespace == 'large':
        namespace = namespaces.largeSubunitArr
    elif subunitNamespace == 'total':
        namespace = namespaces.totalArr
    # print("Got namesapces {}".format(namespace))

    batch = os.listdir(directory)
    nbrtrees = [tree2tuplearr(openjson(directory + x)['nbrtree'])
                for x in batch]

    adjmats = [ajdmat(tree, namespace) for tree in nbrtrees]
    reduced = functools.reduce(lambda x, y: np.add(x, y), adjmats)
    adjacency = np.divide(reduced, len(adjmats))


    fig, ax = plt.subplots()
    fig.patch.set_facecolor('xkcd:black')


    
    covariance= np.cov(adjacency)
    def correlation_from_covariance(covariance):
        v = np.sqrt(np.diag(covariance))
        outer_v = np.outer(v, v)
        correlation = covariance / outer_v
        correlation[covariance == 0] = 0
        return correlation

    correlation = correlation_from_covariance(covariance)
    # im = ax.imshow(correlation)

    if covcor =='covariance':
        im = ax.imshow(covariance)
    elif covcor =='correlation':
        im = ax.imshow(correlation)
    elif covcor == 'adjacency':
        im = ax.imshow(adjacency) 

    ax.set_xticks(np.arange(len(namespace)))
    ax.set_yticks(np.arange(len(namespace)))
    ax.set_yticklabels(namespace)
    ax.set_xticklabels(namespace)

    plt.setp(ax.get_yticklabels(),  ha="right",
             rotation_mode="anchor", fontsize=3, c='white')

    ax.xaxis.tick_top()
    plt.setp(ax.get_xticklabels(), rotation=90, ha="left",
             rotation_mode="anchor", fontsize=3, c='white')

    title = "{}_for_{}_in_{}".format(covcor, subunitNamespace, targets)
    ax.set_title(title, c='white')
    fig.tight_layout()
    # plt.show()
    plt.savefig(title, dpi=400, bbox_inches='tight',facecolor=fig.get_facecolor())

plt_batch('eukarya', 'total', 'covariance')



# plot the chains within the namespace of subchains present in the molecule
def plt_inner_namespace(pathtodatum=str, covariance=False, pdbid=str):
    clusterdatum = openjson(pathtodatum)

    radius = round(clusterdatum['metadata']['radius'], 2)
    nbrpairs = tree2tuplearr(clusterdatum['nbrtree'])
    namesArr = clusterdatum['metadata']['allchains']
    substrate = ajdmat(nbrpairs, namesArr)

    fig, ax = plt.subplots()
    fig.patch.set_facecolor('xkcd:black')
    if covariance:
        substrate = np.cov(substrate)
    im = ax.imshow(substrate)
    ax.set_xticks(np.arange(len(namesArr)))
    ax.set_yticks(np.arange(len(namesArr)))
    ax.set_yticklabels(namesArr)
    ax.set_xticklabels(namesArr)

    plt.setp(ax.get_yticklabels(),  ha="right",
             rotation_mode="anchor", fontsize=8, c='white')

    ax.xaxis.tick_top()
    plt.setp(ax.get_xticklabels(), rotation=90, ha="left",
             rotation_mode="anchor", fontsize=8, c='white')

    ax.set_title('{} | Neighbor radius : {} Å'.format(
        pdbid, radius), color='white')
    # plt.suptitle(filename, fontsize=4)
    fig.tight_layout()
    filename = ' {}_r{}_covmat.png'.format(pdbid, radius)
    plt.savefig(filename, bbox_inches='tight', facecolor=fig.get_facecolor())
    # plt.show()

