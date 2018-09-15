environ=$1

if [ -z $environ ]; then
        echo "Environ must be: dev or demo"
        exit;
fi

echo ""
echo "--- Git push..."
git push origin master

echo "--- Exp publish..."
./node_modules/.bin/exp publish --config app-${environ}.json

echo "--- Exp build:android"
./node_modules/.bin/exp ba --config app-${environ}.json

echo "--- Done"
