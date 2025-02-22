# 假设有两个人，A和B，他们轮流从一个数组中取数，每次只能从数组的头部或者尾部取数，直到数组为空。A和B都很聪明，他们会采取最优策略。请问A和B分别能取到多少分数？
list = [0, 8, 4, 12, 2, 10, 6, 14, 1, 9, 5, 13, 3, 11, 7, 15]
list = [53, 200, 3, 3]

# 动态规划
def main1():
    dp_list = [0 for item1 in list]
    for i in range(len(list)):
        dp_list[i] = list[i]

    for left in range(len(list) - 2, -1, -1):
        for right in range(left + 1, len(list)):
            dp_list[left][right] = max(list[left] - dp_list[right], list[right] - dp_list[right - 1])


    return dp_list[-1]

print(main1())

# 动态规划
# def main1():
#     dp_list = [[0 for item in list] for item1 in list]
#     for i in range(len(list)):
#         dp_list[i][i] = list[i]

#     for left in range(len(list) - 2, -1, -1):
#         for right in range(left + 1, len(list)):
#             dp_list[left][right] = max(list[left] - dp_list[left + 1][right], list[right] - dp_list[left][right - 1])


#     return dp_list[0][-1]

# print(main1())


# 差值递归
# def get_max_score1(left, right):
#     if left == right:
#         return list[left]

#     left_sum = list[left] - get_max_score1(left + 1, right)
#     right_sum = list[right] - get_max_score1(left, right - 1)

#     return max(left_sum, right_sum)

# def main1():
#     print(get_max_score1(0, len(list) - 1))

#     return False

# print(main1())


# 求和递归
# def get_max_score(left, right):
#     if left == right:
#         return list[left]

#     if left + 1 == right:
#         return max(list[left], list[right])

#     left_sum = list[left] + min(get_max_score(left + 2, right), get_max_score(left + 1, right - 1))
#     right_sum = list[right] + min(get_max_score(left + 1, right - 1), get_max_score(left, right - 2))

#     return max(left_sum, right_sum)

# def main():
#     sum = 0

#     for item in list:
#       sum += item

#     print(sum)
#     print(get_max_score(0, len(list) - 1))

#     return False

# print(main())
