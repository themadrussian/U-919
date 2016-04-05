#!/bin/bash

if [ $# -gt 1 ]
then
	echo " no arguments, please! "
	exit 1
fi

for line in $(cat RUT-names.txt)
do
	fname=$(echo $line | cut -d, -f1)
  lname=$(echo $line | cut -d, -f2)
	gname=$(echo $line | cut -d, -f4)

	echo "$fname $lname => $gname"
done

exit 0