
CREATE DATABASE customerappdb;

USE customerappdb;

CREATE TABLE customers (
    customer_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    customer_name VARCHAR(255),
    email_id VARCHAR(255) UNIQUE,
    password VARCHAR(255) NOT NULL,
    age INT,
    gender ENUM('Male', 'Female', 'Other'),
    pneumonia_confidence FLOAT,
    fracture_confidence FLOAT,
    eye_cataract_confidence FLOAT,
    skin_disease_confidence FLOAT,
    type VARCHAR(255)
);

DESC customers;
