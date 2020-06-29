#!/bin/bash

# PBS -l walltime=4:00:00, select=1:ncpus=20:mem=48gb
# PBS -N rtviii-pdb_subchain_clustering
# PBS -A ex-kdd-1
# PBS -m ab
# PBS -M rtkushner@alumni.ubc.ca
# PBS -o output.txt
# PBS -e error.txt

################################################################################
declare -a exclude=(
    "3J9M"
    "5X8T"
    "4UGO"
)

for structpath in ./struct_profiles/*; do
    defective=false
    for defect in "${exclude[@]}":; do
        if [[ "$structpath" == *"$defect"* ]]; then
            defective=true
            break
        fi
    done

    if [[ "$defective" == true ]]; then
        echo "Skiping $defect."
        continue
    fi

    for ((r = 1; r <= 10; r++)); do
        echo "$structpath with rad $r"
        python3 driver.py --path "$structpath" -r "$r"
    done
done
