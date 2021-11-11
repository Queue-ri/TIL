#!/bin/bash
GREEN='\033[0;32m'
NOCOLOR='\033[0m'

echo -e "${GREEN}** ALGOLIA DOCSEARCH SCRAPER${NOCOLOR}"

APPLICATION_ID=$1
API_KEY=$2
CONFIG_PATH=$3

git clone https://github.com/algolia/docsearch-scraper.git
cd docsearch-scraper

pip install --no-cache-dir pipenv
pipenv install
pipenv shell

echo "APPLICATION_ID=${APPLICATION_ID}
API_KEY=${API_KEY}
" > .env

python docsearch run $GITHUB_WORKSPACE/$CONFIG_PATH

echo -e "${GREEN}** Successfully scraped the docs! Please check your updated docsearch index.${NOCOLOR}"