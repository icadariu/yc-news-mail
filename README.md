# yc-news-mail
Most rated news from https://news.ycombinator.com/ will be sent daily/weekly over email.
https://github.com/HackerNews/API
Code works with mailgun key.

Using docker-compose (> 1.7.1):
```
git clone https://github.com/icadariu/yc-news-mail.git
# make sure to move 
# credentials.js.example to credentials.js and edit de values as needed.
# if pwd will tell you that you are inside yc-news-mail, do $ cd ..

cp yc-news-mail/docker-compose.yml .
docker-compose -f docker-compose.yml up -d

```
It will create 2 containers (one mongodb and the container with the app).
