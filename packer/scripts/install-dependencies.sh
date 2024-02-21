#!/bin/bash

export DBHOST=${DBHOST}
export DBUSER=${DBUSER}
export DBPASS=${DBPASS}
export DATABASE=${DATABASE}
export PORT=${PORT}
export DBPORT=${DBPORT}

# Install MySQL server
sudo dnf install mysql-server -y
sudo systemctl start mysqld
sudo systemctl enable mysqld
mysql -u ${DBUSER} -p -e \
"Select user, authentication_string, plugin, host from mysql.user;
ALTER USER ${DBUSER}@${DBHOST} IDENTIFIED WITH mysql_native_password BY ${DBPASS};"
echo -ne '\n'

# Install Nodejs
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.3/install.sh | bash
source ~/.bashrc
nvm install v18.17.1

# Unzip webapp
sudo mv /tmp/webapp.zip /opt/

cd opt
unzip webapp.zip -d webapp

cd webapp

# NPM install
npm install

# Change ownership
sudo chown -R csye6225:csye6225 webapp

sudo cp ./packer/webapp.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable webapp
