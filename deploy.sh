#!/bin/bash
if [[ $1 == "prd" ]]
  then
    sed 's/^const production = "";/const production = "prd_";/' -i ./functions/util/admin.js
    sed 's/^exports.devApp/exports.app/' -i ./functions/index.js
    react-scripts build
    rm -r ./production
    mv ./build ./production
    firebase deploy --only hosting:cedars-prd,functions:app,functions:onProdFolderDelete,functions:onProdDepartmentDelete
    sed 's/^const production = "prd_";/const production = "";/' -i ./functions/util/admin.js

elif [[ $1 == "dev" ]]
  then
    sed 's/^const production = "prd_";/const production = "";/' -i ./functions/util/admin.js
    sed 's/^exports.app/exports.devApp/' -i ./functions/index.js
    npm run build
    firebase deploy --only hosting:cedars-dev,functions:devApp,functions:onFolderDelete,functions:onDepartmentDelete
    sed 's/^exports.devApp/exports.app/' -i ./functions/index.js
else
  echo "Usage: deploy.sh [TARGET] where target is either 'prd' or 'dev'."
fi
