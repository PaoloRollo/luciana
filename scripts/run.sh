#!/bin/bash
docker build -t luciana .. && docker run -it --rm -p 3000:3000 -d luciana