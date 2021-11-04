#!/bin/bash

# 21-11-03
# commit_push by Queue-ri

GREEN='\033[0;32m'
NOCOLOR='\033[0m'

TODAY=`TZ=Asia/Seoul date "+%Y-%m-%d"`

echo -e "\n${GREEN}** COMMIT & PUSH by Queue-ri${NOCOLOR}"
echo -e "${GREEN}** working on git repository...${NOCOLOR}\n"

git config user.email "qriositylog@gmail.com"
git config user.name "Queue-ri"

# Root is not a .sh path
git add --all
git status
git commit -m "ci(docs): Auto commit ${TODAY}.md"
git push origin main

echo -e "${GREEN}** ALL SET ;) See you!${NOCOLOR}"