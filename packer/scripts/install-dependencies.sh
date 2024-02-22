#!/bin/bash

export DBHOST=${DBHOST}
export DBUSER=${DBUSER}
export DBPASS=${DBPASS}
export DATABASE=${DATABASE}
export PORT=${PORT}
export DBPORT=${DBPORT}

# Install MySQL server
sudo dnf install mysql-server -y
sudo systemctl start mysqld.service
sudo systemctl status mysqld
sudo systemctl enable mysqld
mysql -u root -e "CREATE DATABASE $DATABASE"

# Install Nodejs
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.3/install.sh | bash
source ~/.bashrc
nvm install v18.17.1

sudo yum install unzip

# Unzip webapp
mkdir -p /opt/application
sudo mv /tmp/webapp.zip /opt/application/webapp.zip
cd /opt/application
unzip webapp.zip -d webapp
cd /webapp
npm install

# Change ownership
sudo chown -R csye6225 application
sudo chgrp -R csye6225 application

sudo cp ./packer/webapp.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable webapp
