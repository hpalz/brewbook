@setlocal enableextensions enabledelayedexpansion
@echo off
for /r %%i in (*.html) do (
    
    echo %%i
    echo %%A|findstr /N "<tbody>" "%%i">nul
    if  errorlevel 1 (
         echo found
       rem for /F "skip=%lineNum% usebackq tokens=*" %%A in (%%i) do (
       rem echo %%A
    )
    )
    

)
endlocal