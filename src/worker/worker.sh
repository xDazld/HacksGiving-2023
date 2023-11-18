#!/bin/bash

#SBATCH --partition=teaching

#SBATCH --nodes=1

#SBATCH --gpus=4

#SBATCH --cpus-per-gpu=8

. /usr/local/anaconda3/bin/activate HacksGiving

python3 worker.py

conda deactivate