#!/bin/bash
cd /home/kavia/workspace/code-generation/litexplorer-105405-5f69c0c6/frontend_react
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

