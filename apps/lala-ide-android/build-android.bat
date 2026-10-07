@echo off
echo [LALA IDE] Copying web IDE to build folder...
xcopy /E /I /Y ..\..\website\client ..\lala-web-build\

echo [LALA IDE] Syncing Capacitor...
call npx cap sync android

echo [LALA IDE] Opening Android Studio...
call npx cap open android
echo.
echo In Android Studio: Build ^> Generate Signed Bundle/APK ^> APK
pause
