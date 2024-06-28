#!/bin/bash

DIFF=604800
CURRNENT_DATE=$(date +%s)

get_data () {
    # Download all stops data
    echo -e "\\n>>> Downloading all stops from https://www.transitchicago.com/downloads/sch_data/ <<<\\n"
    curl -o data.zip https://www.transitchicago.com/downloads/sch_data/google_transit.zip
    unzip data.zip -d data
    cd data
    # find . \! -name 'stops.txt' -delete
    mv stops.txt stops.csv
    mv shapes.txt shapes.csv
    mv trips.txt trips.csv
    cd ..
    rm -rf data.zip
    
    # Download train stops data
    echo -e "\\n>>> Downloading train stops from https://data.cityofchicago.org/Transportation/CTA-System-Information-List-of-L-Stops/8pix-ypme <<<\\n"
    curl -o data/train-stops.json https://data.cityofchicago.org/resource/8pix-ypme.json
    
    echo -e "\\n>>> Updating download datetime <<<\\n"
    echo $(date +%s) > data/last_download.txt
}

if [ -d data ]
then
    if [ -f data/last_download.txt ]
    then
        LAST_DOWNLAOD_TIME=$(cat "data/last_download.txt")
        CURRENT_DIFF=$(($CURRNENT_DATE - $LAST_DOWNLAOD_TIME))
        
        if [ $CURRENT_DIFF -ge $DIFF ]
        then
            echo -e "\\nLocal data updated more than a week ago. Downloading...\\n"
            get_data
        else
            echo -e "\\nLocal data updated less than a week ago. Skipping download..\\n"
        fi
    else
        echo -e "\\nLast download time not found. Downloading...."
        get_data
    fi
    
else
    echo "Data directory not found. Downloading..."
    get_data
fi

