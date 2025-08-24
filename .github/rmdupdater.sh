#!/bin/bash

# 25-08-24
# rmdupdater by Queue-ri

GREEN='\033[0;32m'
MAGENTA='\033[0;35m'
NOCOLOR='\033[0m'

output_file="recent-ps-list.txt"

echo -e "\n${MAGENTA}** RMDUPDATER by Queue-ri${NOCOLOR}"
date -u -d "+9 hours"
echo -e "${GREEN}** generating ${output_file}...${NOCOLOR}"

# 모든 /md/date 파일 내림차순 정렬 (최신순 5개)
recent_files=$(find ./md/date -type f -name "*.md" | sort -r | head -n 5)

# output 파일 초기화
> "$output_file"

# /featured/ps 에 한하여 영문 제목 추출
for file in $recent_files; do
    grep 'https://til.qriosity.dev/featured/ps/' "$file" | while read -r line; do
        # new / update 상태 추출
        if echo "$line" | grep -q '\[New!\]'; then
            status="new"
        elif echo "$line" | grep -q '\[Update\]'; then
            status="update"
        else
            continue
        fi

        # 대괄호 안 전체 라벨 추출
        label=$(echo "$line" | grep -oP '\[\K[^\]]+(?=\])')
        # 소괄호 안 eng_title 추출
        english_title=$(echo "$label" | grep -oP '\([A-Za-z0-9 ,\-!?.]+\)' | tr -d '()')

        if [ -n "$english_title" ]; then
            echo "${status}, ${english_title}" >> "$output_file"
        fi
    done
done

echo -e "${GREEN}** Successfully generated ${output_file}\n${NOCOLOR}"