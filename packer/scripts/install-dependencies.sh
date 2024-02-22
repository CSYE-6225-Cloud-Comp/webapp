#!/bin/bash

export DBHOST=${DBHOST}
export DBUSER=${DBUSER}
export DBPASS=${DBPASS}
export DATABASE=${DATABASE}
export PORT=${PORT}
export DBPORT=${DBPORT}

# Get the repo RPM and install it.
sudo yum install wget -y
sudo wget http://dev.mysql.com/get/mysql57-community-release-el7-7.noarch.rpm 
sudo yum -y install ./mysql57-community-release-el7-7.noarch.rpm 

# Install the server and start it
# sudo yum -y install mysql-server 
# sudo systemctl start mysqld 

# # Get the temporary password
# temp_password=$(grep password /var/log/mysqld.log | awk '{print $NF}')

# # Set up a batch file with the SQL commands
# echo "ALTER USER 'root'@'localhost' IDENTIFIED BY 'password@123'; flush privileges;" > reset_pass.sql

# # Log in to the server with the temporary password, and pass the SQL file to it.
# mysql -u root --password="$temp_password" --connect-expired-password < reset_pass.sql

# mysql -u root -p password@123 -e "CREATE DATABASE $DATABASE;"

# Install Nodejs
sudo dnf module install nodejs:20 -y

sudo yum install unzip -y

# Unzip webapp
sudo mv /tmp/webapp.zip /opt/webapp.zip
cd /opt
sudo unzip webapp.zip -d webapp
sleep 3
sudo rm -rf /opt/webapp.zip
sleep 3
cd webapp
sudo npm install
sleep 10
# Change ownership
sudo chown -R csye6225 webapp
sudo chgrp -R csye6225 webapp

sudo cp ./packer/webapp.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable webapp
