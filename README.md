# yc-news-mail
Most rated news from https://news.ycombinator.com/ will be sent daily/weekly over email

After cloning the repo you need to move credentials.js.example to credentials.js and edit de values as needed.

Using docker:

```
cd $HOME
mkdir mongo
git clone git@github.com:icadariu/yc-news-mail.git
cd yc-news-mail
docker run -v "$(pwd)/mongo":/data --name mongo -d mongo mongod --smallfiles
docker run -d --name node -v "$HOME/yc-news-mail":/data --link mongo:mongo -w /data node npm start
```
