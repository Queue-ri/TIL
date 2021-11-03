#!/bin/bash

# 21-11-03
# mdupdater by Queue-ri

GREEN='\033[0;32m'
NOCOLOR='\033[0m'

TODAY=`date "+%Y-%m-%d"`
FILE="../../md/date/${TODAY}.md"

echo -e "\n${GREEN}** MDUPDATER by Queue-ri"
echo -e "** configuring ${TODAY}.md...${NOCOLOR}"

find ../../docs -name "*.md" > filepath_list # all md path

echo "# 📚 ${TODAY}" > $FILE

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

rm filepath_list
echo -e "${GREEN}** configuration done successfully!${NOCOLOR}"