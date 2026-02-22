npm install -global expo-cli
expo --version

npm run start
npx expo start

npx create-expo-app my-app
cd my-app
npm run android

npx expo doctor




npm install -g eas-cli

npm install

#APK
eas build -p android --profile preview

#AAB for play store
eas build -p android --profile production

eas build:list
