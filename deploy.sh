#!/bin/bash
if [[ $1 == "prd" ]]
  then
    react-scripts build
    rm -r ./production
    mv ./build ./production
    firebase deploy --only hosting:cedars-prd,functions:cedars-prd
elif [[ $1 == "dev" ]]
  then
    react-scripts build
    firebase deploy --only hosting:cedars-dev,functions:cedars-dev
else
  echo "Usage: deploy.sh [TARGET] where target is either 'prd' or 'dev'."
fi
