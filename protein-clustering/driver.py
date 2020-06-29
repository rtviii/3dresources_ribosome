from os import listdir
from os.path import isfile, join
from pathlib import Path
import os
import numpy as np
from Bio import PDB
import argparse
# import seaborn as sns
from clustering_scripts.save_clusters import save_clusters
# from graph_algorithms.generalplot import plot_covmat, plot_simplemean
import json


# DEFINE THE BATCH FOR NOW


def openjson(fullpath=str):
    with open(fullpath, 'r') as infile:
        jsonprofile = json.load(infile)
        return jsonprofile



def cli():
    parser = argparse.ArgumentParser(description='A tool for parsig and clustering PDB structures. Ribosomes primarily.')
    # parser.add_argument('-h','--help')

    # parser.add_argument('-m', '--mode', help='[g, all], clustering or matrix operations')
    # parser.add_argument('-b', '--batch', help='process batch of structures insteead of a single one')

    # # parser.add_argument('-a', '-all', help='run batch')
    # parser.add_argument('-tgt', '--targets', help='batch of targets(clustererfiles) to plot')

    # parser.add_argument('-plt', '--plottype', help='covariance matrix/ cuthillmcgee/ adjacency/ laplacians/ ')
    # # parser.add_argument('-t','--thread', help='single thread to process clusters for one id')
    # To parse a single molecule
    parser.add_argument('-p','--path',help="Path to file(Relative?)")
    parser.add_argument('-r','--radius', help='clustering radius', type=float)
    parser.add_argument('--verbose', help='To enable atomwise logging. Not useful in any way.')

    args = parser.parse_args()

    save_clusters(args.path, args.radius, args.verbose)


def cluster_all():
    batch = []
    with open('./../assets/kddtable.json', 'r') as infile:
        data = json.load(infile)
        batch = data.keys()
    keys = list(batch)
    defective = ['5X8T', '3J9M', '5XXB', '4V7E', ]

    for molecule in defective:
        keys.remove(molecule)


cli()
