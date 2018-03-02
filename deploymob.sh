echo ""
echo "--- Git push..."
git push origin master

echo "--- Exp publish..."
./node_modules/.bin/exp publish

echo "--- Exp build:android"
./node_modules/.bin/exp ba

echo "--- Done"
