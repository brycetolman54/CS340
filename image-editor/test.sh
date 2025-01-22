#!/bin/bash

# get the file names of the images to test
paths=(ImageEditorFiles/source_images/*)
files=()
for path in ${paths[@]}; do
    files+=$(basename $path)
    files+=" "
done

# set up the tests that we are going to run
tests=("grayscale" "invert" "emboss" "motionblur")

# build the program
npm run build >/dev/null

# run each test for each file
for test in ${tests[@]}; do
    for file in ${files[@]}; do

        # compute the output
        if [[ $test == "motionblur" ]]; then
            npm start "ImageEditorFiles/source_images/"$file mine.ppm $test 10 >/dev/null
        else
            npm start "ImageEditorFiles/source_images/"$file mine.ppm $test >/dev/null
        fi

        # see if there are differences
        diff "ImageEditorFiles/key_images/"$test"-"$file mine.ppm 2>&1 > test.txt

        # print out to let me know which is different
        value=""
        if [ ${#test} -lt 8 ]; then
            value="   "
        fi
        if [ $(wc -l < test.txt) -gt 0 ]; then
            echo -e "[\u001b[38;5;160mfailed\u001b[38;5;15m]  test: " $test $value "\twith file:" $file
        else
            echo -e "[\u001b[38;5;46mpassed\u001b[38;5;15m]  test: " $test $value "\twith file:" $file
        fi

        # clean up
        rm test.txt mine.ppm
    done
    echo ""
done

