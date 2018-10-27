#!/bin/bash

# Move built project files to server
rsync -r --delete-after --quiet $TRAVIS_BUILD_DIR/ travis-deployment@emmental.fuelrats.com:/var/www/beta.fuelrats.com/

# Rebuild native dependencies in new environment
ssh travis-deployment@emmental.fuelrats.com "cd /var/www/beta.fuelrats.com; npm rebuild"
