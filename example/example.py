print("Your first flag:", open("flag1").read())
print("Answer the question to get your second flag")
if input("1+1=").strip() == "2":
    print(open("flag2").read())
else:
    print("Wrong!")
