# 有n个物品，第i个物品的价值为vi，重量为wi，背包的容量为C。现在要求用这n个物品填满容量为C的背包，使得背包中的物品价值最大。

vi_list = [60, 100, 120]
wi_list = [10, 20, 30]

c = 30

def get_max(index, last_c):

    if index < len(vi_list) - 1 and last_c >= wi_list[index]:
        # print(index, len(vi_list), last_c, wi_list[index])
        return max(get_max(index + 1, c), get_max(index + 1, c - wi_list[index]) + vi_list[index])
    elif index == len(vi_list) - 1 and last_c >= wi_list[index]:
        print(index, len(vi_list), last_c, wi_list[index])
        return vi_list[index]
    else:
        return 0
    
start = 0
print(get_max(start, c))