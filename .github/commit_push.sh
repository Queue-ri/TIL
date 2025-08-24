#!/bin/bash

# 21-11-03
# commit_push by Queue-ri

GREEN='\033[0;32m'
NOCOLOR='\033[0m'

TODAY=`TZ=Asia/Seoul date "+%Y-%m-%d"`

# scope 인자 따로 안넘겨주면 기본 docs
SCOPE=${1:-docs}

echo -e "\n${GREEN}** COMMIT & PUSH by Queue-ri${NOCOLOR}"
echo -e "${GREEN}** working on git repository...${NOCOLOR}\n"

git config user.email "qriositylog@gmail.com"
git config user.name "Queue-ri"

# Root is not a .sh path
git add --all
git status
git commit -m "ci(${SCOPE}): Auto commit ${TODAY}.md"
git push origin main

echo -e "${GREEN}** ALL SET ;) See you!${NOCOLOR}"