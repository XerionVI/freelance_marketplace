import React, { useEffect, useState } from "react";
import { Card, ListGroup } from "react-bootstrap";
import { ethers } from "ethers";
import { getFreelanceEscrowContract } from "../utils/getFreelanceEscrow";

const JobList = ({ account }) => {
  const [jobs, setJobs] = useState([]);
  const [freelanceEscrow, setFreelanceEscrow] = useState(null);

  useEffect(() => {
    const loadContract = async () => {
      const contract = getFreelanceEscrowContract();
      setFreelanceEscrow(contract);
    };

    loadContract();
  }, []);

  useEffect(() => {
    const fetchJobs = async () => {
        if (freelanceEscrow) {
          try {
            // Retrieve jobCount as a BigNumber (Ethers.js default for Solidity uint256)
            const jobCount = await freelanceEscrow.jobCount();
            const jobsArray = [];
            for (let i = 0; i < jobCount; i++) {
              const job = await freelanceEscrow.jobs(i);
              jobsArray.push(job);
            }
            setJobs(jobsArray);
          } catch (error) {
            console.error("Error fetching jobs:", error);
          }
        }
      };
      
  
    fetchJobs();
  }, [freelanceEscrow]);
  

  return (
    <Card>
      <Card.Header>Job List</Card.Header>
      <ListGroup variant="flush">
        {jobs.length === 0 ? (
          <ListGroup.Item>No jobs found.</ListGroup.Item>
        ) : (
          jobs.map((job, index) => (
            <ListGroup.Item key={index}>
              <strong>Job ID:</strong> {index}
              <br />
              <strong>Client:</strong> {job.client}
              <br />
              <strong>Freelancer:</strong> {job.freelancer}
              <br />
              <strong>Amount:</strong> {ethers.utils.formatEther(job.amount)} ETH
            </ListGroup.Item>
          ))
        )}
      </ListGroup>
    </Card>
  );
};

export default JobList;