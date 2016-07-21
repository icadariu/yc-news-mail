# yc-news-mail
Most rated news from https://news.ycombinator.com/ will be sent daily/weekly over email
After cloning the repo make sure to move credentials.js.example to credentials.js and edit de values as needed.
git clone  git@github.com:icadariu/yc-news-mail.git

Using docker-compose (> 1.7.1):
```
cp yc-news-mail/docker-compose.yml .
docker-compose -f docker-compose.yml up -d
```
