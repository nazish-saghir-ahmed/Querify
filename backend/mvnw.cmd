@echo off
rem Maven Wrapper script for Querify Backend
set "MAVEN_OPTS=-Djavax.net.ssl.trustStoreType=WINDOWS-ROOT %MAVEN_OPTS%"
set MAVEN_CMD=C:\Users\Nazish\maven\apache-maven-3.9.9\bin\mvn.cmd
if exist "%MAVEN_CMD%" (
    "%MAVEN_CMD%" %*
) else (
    mvn %*
)
