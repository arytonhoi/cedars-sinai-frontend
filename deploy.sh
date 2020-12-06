#!/bin/bash
if [[ $1 == "prd" ]]
  then
    react-scripts build
    rm -r ./production
    mv ./build ./production
    firebase deploy --only hosting:cedars-prd,functions:app,functions:onFolderDelete,functions:onDepartmentDelete
elif [[ $1 == "dev" ]]
  then
    sed 's/^exports.app/exports.devApp/' -i ./functions/index.js
    npm run build
    firebase deploy --only hosting:cedars-dev,functions:devApp,functions:onFolderDelete,functions:onDepartmentDelete
    sed 's/devApp/app/' -i ./functions/index.js
else
  echo "Usage: deploy.sh [TARGET] where target is either 'prd' or 'dev'."
fi
