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

除了网页终端，你也可以通过 `nc 127.0.0.1 10000` 来连接
