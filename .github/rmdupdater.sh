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

# 모든 /md/date 파일 내림차순 정렬
all_files=$(find ./md/date -type f -name "*.md" | sort -r)

# output 파일 초기화
> "$output_file"

# 추출 카운터
count=0
max_count=5

# /featured/ps 에 한하여 영문 제목 추출
for file in $all_files; do
    while read -r line; do
        # PS 문서 없으면 skip
        echo "$line" | grep -q 'https://til.qriosity.dev/featured/ps/' || continue

        # new / update 상태 추출
        if echo "$line" | grep -q '\[New!\]'; then
            status="new"
        elif echo "$line" | grep -q '\[Update\]'; then
            status="update"
        else
            continue
        fi

        # 소괄호 안 eng_title 추출 (한글, 특문 포함될 수도 있음)
        ## \[.*\( : 대괄호 안의 ( 까지 스킵
        ## ([^)]*) : ) 나오기 전까지 전부 캡처 -> eng_title
        ## \)\].* : 닫는 괄호와 ] 이후는 무시
        ## \1 : 캡처된 부분만 출력
        english_title=$(echo "$line" | sed -nE 's/.*\[.*\(([^)]*)\)\].*/\1/p')


        if [ -n "$english_title" ]; then
            echo "${status}, ${english_title}" >> "$output_file"
            count=$((count + 1)) # 추출 시 카운터 증가
        fi

        # 5개 추출 끝
        if [ "$count" -ge "$max_count" ]; then
            break 2 # while & for 모두 종료
        fi
    done < "$file"
done

echo -e "${GREEN}** Successfully generated ${output_file}\n${NOCOLOR}"