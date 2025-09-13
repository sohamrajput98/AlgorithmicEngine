#!/bin/bash
# Script to create development and test databases in MySQL

DB_USER="algo_user"
DB_PASS="password"
DB_NAME="algoengine"
DB_TEST="algoengine_test"

echo "[INFO] Creating databases..."
mysql -u$DB_USER -p$DB_PASS -e "CREATE DATABASE IF NOT EXISTS $DB_NAME;"
mysql -u$DB_USER -p$DB_PASS -e "CREATE DATABASE IF NOT EXISTS $DB_TEST;"

echo "[INFO] Databases created: $DB_NAME, $DB_TEST"
