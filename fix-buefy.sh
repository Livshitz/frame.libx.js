set +e

SEDOPTION="-i"
if [[ "$OSTYPE" == "darwin"* ]]; then
  SEDOPTION="-i ''"
fi

sed $SEDOPTION 's/\"..\/..\/node_modules/\".\/node_modules/g' ./node_modules/buefy/src/scss/buefy-build.scss