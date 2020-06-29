import numpy as np

res1 = np.array([1, 3, 9])
res2 = np.array([2, 1, 6])

abso  = np.sqrt(np.sum(res1 * res1))
prod  = res1 * res1
sqrt = np.sqrt(prod)
npsum = np.sum(prod)

print("abos: {}\n sqrt :{}\nprod: {}\n npsum:{}".format(abso,sqrt, prod, npsum))

print(res1, res2)