#!/bin/bash
# Install MySQL server
sudo dnf install mysql-server -y
sudo systemctl start mysqld
sudo systemctl enable mysqld
mysql -u root -p -e \
"Select user, authentication_string, plugin, host from mysql.user;
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password';"
mysql -u root -p -e 

# Install Nodejs


# NPM install
npm install

# Set ownership of application artifacts and configuration files
# chown -R csye6225:csye6225 /path/to/application
