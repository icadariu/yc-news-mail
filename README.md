# yc-news-mail
Most rated news from https://news.ycombinator.com/ will be sent daily/weekly over email

Automatically start using docker:

```
cd $HOME
git clone git@github.com:icadariu/yc-news-mail.git
docker run -v "$(pwd)":/data --name mongo -d mongo mongod --smallfiles
docker run -d --name node -v "$HOME/yc-news-mail":/data --link mongo:mongo -w /data node npm start
```
