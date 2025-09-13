#!/bin/bash
# scripts/create_databases.sh
# Purpose: Create MySQL user + two databases (algoengine + algoengine_test)
echo "Enter MySQL root password:"
read -s ROOT_PASS

mysql -u root -p"$ROOT_PASS" <<EOSQL

set -e

MYSQL_USER="root"
MYSQL_PASSWORD="sohamrajput12" # Replace with your MySQL root password

mysql -u"$MYSQL_USER" -p"$MYSQL_PASSWORD" <<EOF
CREATE USER IF NOT EXISTS 'algo_user'@'localhost' IDENTIFIED BY 'strong_password';
GRANT ALL PRIVILEGES ON *.* TO 'algo_user'@'localhost';
CREATE DATABASE IF NOT EXISTS algoengine CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE DATABASE IF NOT EXISTS algoengine_test CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
FLUSH PRIVILEGES;
EOF
