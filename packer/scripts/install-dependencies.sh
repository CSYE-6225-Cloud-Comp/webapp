#!/bin/bash

export DBHOST=${DBHOST}
export DBUSER=${DBUSER}
export DBPASS=${DBPASS}
export DATABASE=${DATABASE}
export PORT=${PORT}
export DBPORT=${DBPORT}

# Get the repo RPM and install it.
wget http://dev.mysql.com/get/mysql57-community-release-el7-7.noarch.rpm 
yum -y install ./mysql57-community-release-el7-7.noarch.rpm 

# Install the server and start it
yum -y install mysql-community-server 
systemctl start mysqld 

# Get the temporary password
temp_password=$(grep password /var/log/mysqld.log | awk '{print $NF}')

# Set up a batch file with the SQL commands
echo "ALTER USER 'root'@'localhost' IDENTIFIED BY 'password@123'; flush privileges;" > reset_pass.sql

# Log in to the server with the temporary password, and pass the SQL file to it.
mysql -u root --password="$temp_password" --connect-expired-password < reset_pass.sql

mysql -u root -p password@123 -e "CREATE DATABASE $DATABASE;"

# Install Nodejs
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.3/install.sh | bash
source ~/.bashrc
nvm install v18.17.1

sudo yum install unzip

# Unzip webapp
unzip webapp.zip -d webapp
sudo mv /tmp/webapp /opt/webapp
cd /opt/webapp
npm install
# Change ownership
sudo chown -R csye6225 webapp
sudo chgrp -R csye6225 webapp

sudo cp ./packer/webapp.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable webapp
