@echo off
del /q "C:\Medinovita\views\webcontent\*"
FOR /D %%p IN ("C:\Medinovita\views\webcontent\*.*") DO rmdir "%%p" /s /q