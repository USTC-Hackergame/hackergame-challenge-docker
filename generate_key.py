#!/usr/bin/env python3
try:
    import nacl.encoding
    import nacl.signing
except ImportError:
    print('需要安装 PyNaCl')
    print('pip install PyNaCl 或 apt install python3-nacl')
    exit(1)

k = nacl.signing.SigningKey.generate()
print('这是私钥，请放进 Hackergame 平台 conf/local_settings.py：')
print(k.encode(encoder=nacl.encoding.HexEncoder).decode())
print('这是公钥，请放进 dynamic_flag/pubkey：')
print(k.verify_key.encode(encoder=nacl.encoding.HexEncoder).decode())
