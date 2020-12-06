import requests
import json
import socket
from bs4 import BeautifulSoup
from firebase_admin import credentials
from firebase_admin import db
from firebase_admin import initialize_app


# Read the data at the posts reference (this is a blocking operation)

def scraping():
    print('start scraping')
    cred = credentials.Certificate('./insight-challenge-firebase-adminsdk-okbb8-1f009c1ffe.json') 
    default_app = initialize_app(cred)
    ref = db.reference(path='/',url="https://insight-challenge.firebaseio.com/")
    posts_ref = ref.child('posts')   

    proxies = {
        'http': 'socks5h://127.0.0.1:9050'
    }

    data = requests.get(
        "http://nzxj65x32vh2fkhk.onion/all",proxies = proxies).text

    soup = BeautifulSoup(data, 'lxml')
    print(soup)
    titles = []
    for title in soup.find_all('h4'):
        titles.append(title.text.strip())

    authors = []
    for author in soup.find_all('div', class_="col-sm-6"):
        if(author.text.find('Language:') == -1 ):
            authors.append(author.text.strip())

    content = []
    ol = soup.find_all('ol')
    for ol_list in ol:
        post_content = []
        for div in ol_list.find_all('div'):
            post_content.append(div.text.strip())
        content.append(post_content)
    i = 0
    posts = []
    while i < len(content):
        posts.append({
            "title": titles[i],
            "author": authors[i].split("at")[0],
            "date": authors[i].split("at")[1],
            "content": content[i],
        })
        i = i + 1
    
    db_posts = posts_ref.get()
    posts_id = list(posts_ref.get())

    db_posts_arr = []
    for id in posts_id:
        db_posts_arr.append(db_posts[id])

    for post in posts:
        if post not in db_posts_arr:
            results = posts_ref.push(post)
            print(results)

    new_posts = []
    new_data = []
    with open("./posts.json", "r") as jsonfile:
        data = json.load(jsonfile)
        for post in posts:
            if post not in data:
                data.append(post)  
                new_posts.append(post)
        new_data=data
        # print(new_posts)

    with open('./posts.json','w') as jsonfile:
        json.dump(new_data, jsonfile)

    # for post in new_posts:
    #     results = posts_ref.push(post)
    #     print(results)

scraping()
    

