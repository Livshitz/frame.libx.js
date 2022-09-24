if [[ "$OSTYPE" == "darwin"* ]]; then
	sed -i '' 's/\"..\/..\/node_modules/\".\/node_modules/g' ./node_modules/buefy/src/scss/buefy-build.scss
else
	sed -i 's/\"..\/..\/node_modules/\".\/node_modules/g' ./node_modules/buefy/src/scss/buefy-build.scss
fi