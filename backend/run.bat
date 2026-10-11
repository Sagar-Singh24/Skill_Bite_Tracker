@echo off
SET JAVA_HOME=C:\Program Files\Java\jdk-22
SET PATH=%JAVA_HOME%\bin;%PATH%

echo Starting Skill Bite Backend...
echo Java: %JAVA_HOME%

call "%~dp0mvnw.cmd" -Dmaven.repo.local="%~dp0.m2\repository" spring-boot:run

pause
