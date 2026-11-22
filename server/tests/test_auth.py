import requests
URL = "http://localhost:3000/api"
s = requests.Session() # keeps cookies, like a browser
new_book = {"title": "Yellow", "authors": ["Coldplay"]}
r = s.post(f"{URL}/books", json=new_book)
print(r.status_code, r.json())
s.post(f"{URL}/register", json={"username": "ada", "password": "correct horse"})
r = s.post(f"{URL}/login", json={"username": "ada", "password": "correct horse"})
print(r.status_code, r.json())
r = s.post(f"{URL}/books", json=new_book)
print(r.status_code, r.json())