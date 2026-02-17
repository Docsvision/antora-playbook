#!/bin/bash

adoc_file=/tmp/assembler.pipe
sed -n "w ${adoc_file}"
output_file="${@: -2:1}"
keep=$(( $# - 1 ))
set -- "${@:1:$keep}" "$adoc_file"
bundle exec asciidoctor -b docbook "$@"
pandoc -f docbook -t docx -o "$output_file" "$output_file"
rm -f "$adoc_file"