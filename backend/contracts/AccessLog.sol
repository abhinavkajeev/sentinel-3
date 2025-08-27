// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract AccessLog {
    // Define a struct to hold the event data.
    struct Event {
        uint256 timestamp;
        string location;
        string eventType; // e.g., "Entry", "Exit", "Unusual Activity"
        string dataHash;  // A unique identifier for the person/event
    }

    // A public array to store all events. This can be read by anyone.
    Event[] public events;

    // The owner of the contract, typically the deployer.
    address public owner;

    // This modifier restricts a function to only be callable by the owner.
    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can call this function.");
        _;
    }

    // The constructor sets the contract's owner upon deployment.
    constructor() {
        owner = msg.sender;
    }

    // Function to record a new event. It's restricted to the owner for security.
    function recordEvent(
        string memory _location,
        string memory _eventType,
        string memory _dataHash
    ) public onlyOwner {
        // Create a new event struct and add it to the events array.
        events.push(Event(block.timestamp, _location, _eventType, _dataHash));
    }

    // Public function to get all recorded events. This is a "view" function, so it's gas-free.
    function getEvents() public view returns (Event[] memory) {
        return events;
    }
}
