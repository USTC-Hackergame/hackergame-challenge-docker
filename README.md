# Hackergame nc 类题目的 Docker 容器资源限制、动态 flag、网页终端

## 快速入门

### 配置密钥

密钥用于验证用户 Token。请确保这里的公钥文件（`pubkey`）与 [Hackergame 平台](https://github.com/ustclug/hackergame) 配置的私钥相匹配，这样 Hackergame 平台为每个用户生成的 Token 才可以通过这里的用户验证。

如果你仅仅想测试一下，可以使用 [dynamic_flag/pubkey](dynamic_flag/pubkey) 自带的公钥，以及这个 Token：

`c7e810a06ac7f9c6d1a4cde75e8a04e7460dce44828267524f13095a318ada4bd97311513c00cadb5719b5f6e2be5d1e87233ca83b6f64b1f4b1cd9c6cd6ca0231`

在生产环境中，请运行 `generate_key.py` 自己生成密钥。

### 配置题目

如果你仅仅想测试一下示例题目，那么可以跳过此步骤。

本项目的目录结构设计为可以被 [Hackergame 平台的题目导入命令](https://github.com/ustclug/hackergame/blob/master/frontend/management/commands/import_data.py) 直接导入。

[dynamic_flag](dynamic_flag) 目录中包含了题目容器化、连接限制、动态 flag 相关的逻辑。

[web_netcat](web_netcat) 目录中包含了网页终端的逻辑。

如果仅仅是使用本项目，那么以上两个目录中的内容都不需要修改，它们也不会被 Hackergame 平台导入（因为没有 `README.md` 文件）。

示例题目在 [example](example) 目录中，其中的 [example/docker-compose.yml](example/docker-compose.yml) 中引用了以上两个目录中的内容。你可以把 example 目录复制多份为不同的名字，它们在被导入到 Hackergame 平台后会显示为多道题目。

题目是 Docker 化的，注意每次运行题目 Docker 时 **只启动一个题目的实例，通过标准输入输出交互，你的题目不需要监听端口，也不需要做任何资源限制。** 参见 [example/Dockerfile](example/Dockerfile) 和 [example/example.py](example/example.py)。

你需要修改 [example/.env](example/.env) 文件，针对题目的情况进行配置，包括 nc 的端口（`port`）、网页终端的端口（`web_port`）、运行时间和资源限制、flag 文件位置、动态 flag 规则、题目的容器名称等。动态 flag 的生成方法可以由你自己决定，可以使用类似 `'flag{prefix_' + sha256('secret'+token)[:10] + '}'` 的方案，示例中使用了 Python 的 f-string。对于多个 flag 的情况，`flag_path` 中路径和 `flag_rule` 中 Python 表达式都用 `,` 分隔即可。容器名称（`challenge_docker_name`）是 docker-compose 自动命名的，请设置为目录名 + "_challenge"。对于每一个连接，如果 Token 合法并且连接频率没有超过限制，那么你的题目容器会以指定的资源限制启动，动态生成的 flag 会被挂载到指定的路径，选手的 TCP 连接将会被连接到容器的标准输入输出上。如果你的题目需要获得用户 Token，直接读取 `hackergame_token` 环境变量即可。

[example/README.md](example/README.md) 是用于导入 Hackergame 平台的，里面配置的 flag 需要与 `.env` 中配置的 flag 相同，端口也需要进行相应修改。

### 运行题目

在 [example](example) 目录中运行 `docker-compose up --build` 即可，然后你可以通过 `nc 127.0.0.1 10000` 来连接，也可以使用 [http://127.0.0.1:10001/](http://127.0.0.1:10001/) 的网页终端。

## 本项目的背景

与很多 CTF 比赛类似，USTC Hackergame 需要运行选手与服务器交互的 nc 类题目。然而 CTF 比赛中常见的做法有以下问题：

- 通过求解 PoW 来做题目的连接限制，对新手不友好，也在某种程度上影响比赛的体验

- pwn 题缺少真正有效的资源限制。我调研了很多开源的 Docker 化方案，也咨询了很多比赛的出题人，结论是现有的方案都无法真正防止针对性的资源耗尽攻击（所谓“搅屎”）。很多 pwn 题的部署方案会限制选手能够使用的命令，这只是增加了资源耗尽攻击的难度而已，并没有从根本上解决问题。

- 动态 flag、监听端口很多时候是题目逻辑的一部分，而我想做到这部分逻辑对出题人是透明的，这样也可以让题目更统一、更稳定。

因为以上提到的原因，我在 Hackergame 2019 前开发了这套系统，并且在 Hackergame 2020 前进行了一些改进，但是这部分代码一直没有开源。

如今，我把这份代码以 MIT 协议开源出来，欢迎大家测试、使用和改进。

## 本项目的功能

- 对用户 Token 进行验证，只有合法的 Token 才可以运行题目

- 根据 Token 中的用户 ID 进行连接频率限制

- 根据 Token 动态生成 flag，并自动挂载进题目 Docker

- 限制题目的资源使用，包括限时、进程数限制、内存限制、不允许联网等

- 保证题目的稳定性和安全性，用户无论在题目 docker 中做什么，都不会影响其他用户做题

- 为题目提供一个网页终端，方便新手直接在网页上尝试做题，配合 Hackergame 平台可以实现 Token 的自动填充。

## 本项目的限制

本项目只适用于每个连接启动一个进程的题目，包括 pwn 题和其他的 nc 连接服务器类题目。

如果你的题目是一个一直运行的应用，例如 flask app，那么请自己进行 Token 的验证和动态 flag 生成。

Token 是一个 [libsodium 签名](https://doc.libsodium.org/public-key_cryptography/public-key_signatures#combined-mode)，每个用户确定性对应一个 Token。libsodium [在很多语言中都有库](https://doc.libsodium.org/bindings_for_other_languages)，Python 验证方法见 [dynamic_flag/front.py](dynamic_flag/front.py) 中的 `validate` 函数。由于 Token 是非对称签名，所以公钥和验证代码完全可以公开。

## 已知问题

- Windows 系统上可能无法正常使用，Linux 和 macOS 经测试没有问题
