import requests
import json
import socket

proxies = {
    'http': 'socks5h://127.0.0.1:9050'
}

data = requests.get(
    "http://nzxj65x32vh2fkhk.onion/all",proxies = proxies).text
print(data)