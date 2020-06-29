#!/bin/bash

#PBS -l walltime=10:00,select=1:ncpus=1:ngpus=2:mem=2gb
#PBS -N rtviiitest
#PBS -A ex-kdd-1-gpu
#PBS -m abe
#PBS -M rtkshnr@alumni.ubc.ca
#PBS -o output.txt
#PBS -e error.txt

################################################################################


cd ../../../scratch/ex-kdd-1/

module load gcc
module load cuda
module load python/3.7.3


cd testvenv
source bin/activate
cd working


for filename in ./cif_models/*; do
    NAME=${filename##*/}
    NAME=${NAME%.cif}
    python3 extract_coordinates.py "$NAME" csv
done

echo "dandy"