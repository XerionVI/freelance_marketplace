CREATE DATABASE IF NOT EXISTS freelance_marketplace;

USE freelance_marketplace;

CREATE TABLE IF NOT EXISTS jobs (
    jobId INT AUTO_INCREMENT PRIMARY KEY,
    client VARCHAR(255) NOT NULL,
    freelancer VARCHAR(255) NOT NULL,
    amount DECIMAL(18, 8) NOT NULL,
    blockNumber INT NOT NULL,
    transactionHash VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS job_details (
    id INT AUTO_INCREMENT PRIMARY KEY,
    jobId INT NOT NULL,
    jobTitle VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    status VARCHAR(50) NOT NULL,
    filePath VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL
);