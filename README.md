# yc-news-mail
Most rated news from https://news.ycombinator.com/ will be sent daily/weekly over email.
Code works with mailgun key.

After cloning the repo make sure to move credentials.js.example to credentials.js and edit de values as needed.


Using docker-compose (> 1.7.1):
```
git clone https://github.com/icadariu/yc-news-mail.git
cp yc-news-mail/docker-compose.yml .
docker-compose -f docker-compose.yml up -d
```
