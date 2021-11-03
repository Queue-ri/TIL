#!/bin/bash

# 21-11-03
# mdupdater by Queue-ri

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NOCOLOR='\033[0m'

TODAY=`date "+%Y-%m-%d"`
YEAR=`date +'%Y'`
MONTH=`date +'%m'`
FILE="../../md/date/${YEAR}/${MONTH}/${TODAY}.md"
FOLDER="../../md/date/${YEAR}/${MONTH}"

echo -e "\n${GREEN}** MDUPDATER by Queue-ri"
echo -e "** configuring ${TODAY}.md...${NOCOLOR}"

find ../../docs -name "*.md" > filepath_prelist # all md path
touch filepath_list

while read filepath; do
    filedate=`grep "created_date" $filepath | cut -f2 -d " " | head -1` # should be a single space, not ":".
    fileupdate=`grep "updated_date" $filepath | cut -f2 -d " " | head -1`

    if [[ "$filedate" == "$TODAY" || "$fileupdate" == "$TODAY" ]]; then
        echo $filepath >> filepath_list
    fi
done < filepath_prelist

if [[ -s filepath_list ]]; then
    mkdir -p $FOLDER
    echo "# 📚 ${TODAY}" > $FILE
else
    echo -e "${YELLOW}** skip mdupdater: no docs have been written today.\n${NOCOLOR}"
    rm filepath_prelist
    rm filepath_list
    exit 0
fi

while read filepath; do
    pagepath=`echo ${filepath%.*} | sed 's/docs/featured/'`
    filedate=`grep "created_date" $filepath | cut -f2 -d " " | head -1` # should be a single space, not ":".
    fileupdate=`grep "updated_date" $filepath | cut -f2 -d " " | head -1`
    filetitle=`grep "title" $filepath | cut -f2 -d " " | head -1 | sed -e "s/^'//" -e "s/'$//"`

    if [[ "$filedate" == "$TODAY" ]]; then
        echo "- [New!] 📗 [$filetitle]($pagepath)" >> $FILE
    elif [[ "$fileupdate" == "$TODAY" ]]; then
        echo "- [Update] 📙 [$filetitle]($pagepath) (📜 [view history](https://github.com/Queue-ri/TIL/commits/main/.github/workflows/${filepath}?since=${TODAY}T00:00:00Z&until=${TODAY}T23:59:59Z) )" >> $FILE
    fi
done < filepath_list

rm filepath_prelist
rm filepath_list
echo -e "${GREEN}** configuration done successfully!\n"