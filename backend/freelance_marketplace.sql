-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS freelance_marketplace;

-- Use the newly created database
USE freelance_marketplace;

-- Create jobs table
CREATE TABLE IF NOT EXISTS jobs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    jobId VARCHAR(255) NOT NULL UNIQUE, -- Unique identifier for the job
    client VARCHAR(255) NOT NULL,       -- Address of the client
    freelancer VARCHAR(255) NOT NULL,   -- Address of the freelancer
    amount DECIMAL(18, 8) NOT NULL,     -- Amount in Ether (or other currency)
    blockNumber INT NOT NULL,           -- Block number of transaction
    transactionHash VARCHAR(255) NOT NULL -- Transaction hash
);

-- Create job_details table
CREATE TABLE IF NOT EXISTS job_details (
    id INT AUTO_INCREMENT PRIMARY KEY,
    jobId VARCHAR(255) NOT NULL,           -- Foreign key linking to jobs table
    jobTitle VARCHAR(255) NOT NULL,        -- Title of the job
    description TEXT NOT NULL,             -- Description of the job
    status VARCHAR(50) NOT NULL,           -- Status (e.g., "active", "completed", "pending")
    filePath VARCHAR(255),                 -- Path to uploaded file
    CONSTRAINT fk_job FOREIGN KEY (jobId) REFERENCES jobs(jobId) ON DELETE CASCADE -- Maintain referential integrity
);
