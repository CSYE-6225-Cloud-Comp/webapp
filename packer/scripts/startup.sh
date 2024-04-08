#!/bin/bash
cd /opt/webapp
if [ ! -f /opt/webapp/.env ]; then
        touch /opt/webapp/.env
        echo DB_HOST=${google_sql_database_instance.webapp-db-instance.private_ip_address} >> .env
        echo DB_PORT=3306 >> .env
        echo DB_USER=${google_sql_user.webapp-db-user.name} >> .env
        echo DB_PASSWORD=${random_password.password.result} >> .env
        echo DB_SCHEMA=${google_sql_database.webapp-db.name} >> .env
        echo DB_TIMEZONE=-05:00 >> .env
        echo PORT=3000 >> .env
        echo TOPIC_NAME=${google_pubsub_topic.topic.name} >> .env
        cat .env
else 
    if [ ! -s /opt/webapp/.env ]; then
        echo DB_HOST=${google_sql_database_instance.webapp-db-instance.private_ip_address} >> .env
        echo DB_PORT=3306 >> .env
        echo DB_USER=${google_sql_user.webapp-db-user.name} >> .env
        echo DB_PASSWORD=${random_password.password.result} >> .env
        echo DB_SCHEMA=${google_sql_database.webapp-db.name} >> .env
        echo DB_TIMEZONE=-05:00 >> .env
        echo PORT=3000 >> .env
        echo TOPIC_NAME=${google_pubsub_topic.topic.name} >> .env
        cat .env
    fi
fi