CREATE database Productsdb ;
USE Productsdb;
CREATE TABLE Products (  id INT NOT NULL AUTO_INCREMENT, 
Name VARCHAR(255) NOT NULL,
Description VARCHAR(255) NOT NULL,
Price int NOT NULL,
Quantity int NOT NULL,
Category VARCHAR(255),
PRIMARY KEY (id)
);
