#!/bin/bash


FILE_LOCATION=~/deviant/images/
BACKUP_LOCATION=~/deviant/backups/
FILES=${FILE_LOCATION}*


function exit_fn
{
	status=$?
	[ -n "${2}" ] && status=$2

	[ -n "${1}" ] && echo ${1}
	exit $status
}


pushd ${FILE_LOCATION} || exit_fn "Failed to change directories to ${FILE_LOCATION}"


# Backup and remove existing files
TARFILE="${BACKUP_LOCATION}$(date +"%m%d%Y-%H%M%S").tgz"
tar cvzf ${TARFILE} *.png *.jpg 2> /dev/null
rm *.png *.jpg aa.* aa 2> /dev/null


# Pipe the xml returned from the fetch through grep to get the urls of files,
# parse out the files via sed and then call wget on the filename to get it
wget -U 'SomeUserAgent/1.0' -O- 'http://backend.deviantart.com/rss.xml?q=special:dd' 2> /dev/null |
grep -oP "(?<=<media:content)[^<]+" |
sed s/'url="'//g |
cut -d " " -f2 |
sed s/'"'//g |
wget -U 'SomeUserAgent/1.0' -i-


let count=0
for f in $FILES; do
{
	let count=$count+1
	echo ""
	echo "Checking file $count"

	case $(file $f) in
		*JPEG*)
			echo "mv ${f} ${count%.*}.jpg"
			mv ${f} ${count%.*}.jpg
			;;
		*PNG*)
			echo "mv ${f} ${count%.*}.png"
			mv ${f} ${count%.*}.png
			;;
		*directory*)
			echo "Skipping directory: $f"
			;;
		*)
			echo "rm $f"
			rm $f
			;;
	esac
}
done


popd
