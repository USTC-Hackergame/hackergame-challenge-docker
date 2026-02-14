---
enabled: true
name: 示例题目
category: general
url: http://127.0.0.1:10001/?token={token}
prompt: flag{...}
index: 0
flags:
- name: flag1
  score: 100
  type: expr
  flag: f"flag{{this_is_an_example_{sha256('example1'+token)[:10]}}}"
- name: flag2
  score: 200
  type: expr
  flag: f"flag{{this_is_the_second_flag_{sha256('example2'+token)[:10]}}}"
---

你可以通过 `nc 127.0.0.1 10000` 来连接题目，或者点击下面的「打开/下载题目」按钮通过网页终端与远程交互。

> 如果你不知道 `nc` 是什么，或者在使用上面的命令时遇到了困难，可以参考我们编写的 [萌新入门手册：如何使用 nc/ncat？](https://lug.ustc.edu.cn/planet/2019/09/how-to-use-nc/)
