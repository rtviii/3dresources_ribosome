import numpy as np


dim4 = np.random.rand(4,4,2,2)

dim4[2,3] = np.array([ [1,1],[1,1] ],dtype=float)


for i in dim4[:,0,:,:]:
    print("\n", i)
