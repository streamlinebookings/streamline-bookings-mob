echo ""
echo "--- Git push..."
git push origin master

echo "--- Exp publish..."
./node_modules/.bin/exp publish

echo "--- Done"
