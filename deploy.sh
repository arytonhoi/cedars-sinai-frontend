#!/bin/bash
if [[ $1 == "prd" ]]
  then
    react-scripts build
    rm -r ./production
    mv ./build ./production
    firebase deploy --only hosting:cedars-prd,functions:cedars-prd
elif [[ $1 == "dev" ]]
  then
    npm run build
    firebase deploy --only hosting:cedars-dev,functions
else
  echo "Usage: deploy.sh [TARGET] where target is either 'prd' or 'dev'."
fi
