#!/bin/bash

export DBHOST=${DBHOST}
export DBUSER=${DBUSER}
export DBPASS=${DBPASS}
export DATABASE=${DATABASE}
export PORT=${PORT}
export DBPORT=${DBPORT}


echo "DBHOST: ${DBHOST}"
echo "DBPASSWORD: ${DBPASS}"
echo "PORT: $PORT"

# sudo dnf install mysql-server -y
# sudo systemctl start mysqld
# sudo systemctl status mysqld
# sudo systemctl enable mysqld

# mysql -u root -e "CREATE DATABASE ${DATABASE}"
# echo mysql -u root -e "SHOW DATABASES"
# mysql -u root -e "CREATE USER ${DBUSER}@'localhost' IDENTIFIED BY ${DBPASS}"
# mysql -u root -e "GRANT ALL PRIVILEGES ON ${DATABASE}.* TO ${DBUSER}@'localhost'"
# mysql -u root -e "FLUSH PRIVILEGES"

# # Install Nodejs
# sudo dnf module install nodejs:20 -y

# sudo yum install unzip -y

# # Unzip webapp
# sudo mv /tmp/webapp.zip /opt/webapp.zip
# cd /opt
# sudo unzip webapp.zip -d webapp
# sleep 3
# sudo rm -rf /opt/webapp.zip
# sleep 3
# cd webapp
# sudo npm install
# sleep 10

# # Change ownership
# sudo chown -R csye6225 .
# sudo chgrp -R csye6225 .

# sudo cp ./packer/webapp.service /etc/systemd/system/
# sudo systemctl daemon-reload
# sudo systemctl enable webapp
