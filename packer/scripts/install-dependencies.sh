#!/bin/bash

# export DBHOST=${DBHOST}
# export DBUSER=${DBUSER}
# export DBPASS=${DBPASS}
# export DATABASE=${DATABASE}
# export PORT=${PORT}
# export DBPORT=${DBPORT}

# sudo dnf install mysql-server -y
# sudo systemctl start mysqld
# sudo systemctl status mysqld
# sudo systemctl enable mysqld

# mysql -u root -e "CREATE DATABASE mydb"
# echo mysql -u root -e "SHOW DATABASES"
# mysql -u root -e "CREATE USER 'tanmay'@'localhost' IDENTIFIED BY 'password@123'"
# mysql -u root -e "GRANT ALL PRIVILEGES ON mydb.* TO 'tanmay'@'localhost'"
# mysql -u root -e "FLUSH PRIVILEGES"

# Install Nodejs
sudo dnf module install nodejs:20 -y

# Install Unzip
sudo yum install unzip -y

# Install OPS Agent
sudo curl -sSO https://dl.google.com/cloudagents/add-google-cloud-ops-agent-repo.sh
sudo bash add-google-cloud-ops-agent-repo.sh --also-install

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
# sudo chown csye6225:csye6225 .
sudo chown -R csye6225 .
sudo chgrp -R csye6225 .

sudo cp ./packer/webapp.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable webapp

# Move config file (config.yaml) to /etc/google-cloud-ops-agent/
sudo cp ./packer/configuration/config.yaml /etc/google-cloud-ops-agent/

# Create a directory in /var/log
sudo mkdir /var/log/webapp
sudo chown -R csye6225 /var/log/webapp
sudo chgrp -R csye6225 /var/log/webapp

sudo systemctl restart google-cloud-ops-agent
