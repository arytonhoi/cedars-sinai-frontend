if [[ ${1:0:4} == "prod" ]]
  then
    npm run build
    rm -r ./production
    mv ./build ./production
    firebase-deploy --only hosting:cedars-prd,functions:cedars-prd
elif [[ ${1:0:4} == "test" ]]
  then
    npm run build
    firebase-deploy --only hosting:cedars-dev,functions:cedars-dev
else
  echo "Usage: deploy.sh [TARGET] where target is either 'prod' or 'test'."
fi
