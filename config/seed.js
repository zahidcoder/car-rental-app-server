const mongoose = require('mongoose');
const User = require('../app/v1/models/User');
const { Privacy, Terms, AboutUs, Contact } = require('../app/v1/models/Setting');
 // Update the path to where your models are located
require('dotenv').config();

// Sample user data
const usersData = [
  {
    name: "Imrane",
    email: "imran@gmail.com",
    phoneNumber: "01735566789",
    password: "$2a$10$dgwflQ4jc/aUtXeKBzMuxewCVGJnHWPWE0PxEyGAj1AKoIIo3BWyy",
    role: "admin",
    status: "active",
    oneTimeCode: null,
    isVerified: true,
    isAdmin: true,
    isDeleted: false,
  },
  {
    name: "Testing Admin",
    email: "admin@gmail.com",
    phoneNumber: "01735566789",
    password: "$2a$10$dgwflQ4jc/aUtXeKBzMuxewCVGJnHWPWE0PxEyGAj1AKoIIo3BWyy",
    role: "admin",
    status: "active",
    isVerified: true,
    oneTimeCode: null,
    isAdmin: true,
    isDeleted: false,
  },
];

// Sample privacy, terms, about us, and contact data
const privacyData = {
  privacyText: "This is the privacy policy for the platform. It explains how user data is handled and protected.",
};

const termsData = {
  termsText: "These are the terms and conditions for the platform, outlining the rules and obligations of the users.",
};

const aboutUsData = {
  aboutUsText: "This platform was created to help people find jobs and improve their career opportunities.",
};

const contactData = {
  email: "contact@example.com",
};

// Function to drop the entire database
const dropDatabase = async () => {
  try {
    await mongoose.connection.dropDatabase(); 
    console.log("------------> Database dropped successfully! <------------");
  } catch (err) {
    console.error("Error dropping database:", err);
  }
};

// Function to seed users
const seedUsers = async () => {
  try {
    await User.deleteMany();
    await User.insertMany(usersData);  
    console.log("Users seeded successfully!");
  } catch (err) {
    console.error("Error seeding users:", err);
  }
};

// Function to seed privacy policy
const seedPrivacy = async () => {
  try {
    await Privacy.deleteMany();
    await Privacy.create(privacyData);
    console.log("Privacy policy seeded successfully!");
  } catch (err) {
    console.error("Error seeding privacy policy:", err);
  }
};

// Function to seed terms and conditions
const seedTerms = async () => {
  try {
    await Terms.deleteMany();
    await Terms.create(termsData);
    console.log("Terms and conditions seeded successfully!");
  } catch (err) {
    console.error("Error seeding terms and conditions:", err);
  }
};

// Function to seed about us information
const seedAboutUs = async () => {
  try {
    await AboutUs.deleteMany();
    await AboutUs.create(aboutUsData);
    console.log("About Us information seeded successfully!");
  } catch (err) {
    console.error("Error seeding About Us information:", err);
  }
};

// Function to seed contact information
const seedContact = async () => {
  try {
    await Contact.deleteMany();
    await Contact.create(contactData);
    console.log("Contact information seeded successfully!");
  } catch (err) {
    console.error("Error seeding contact information:", err);
  }
};

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_CONNECTION)
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("Could not connect to MongoDB:", err));

// Call seeding functions
const seedDatabase = async () => {
  try {
    await dropDatabase();
    await seedUsers();
    await seedPrivacy();  // Seeding privacy
    await seedTerms();    // Seeding terms and conditions
    await seedAboutUs();  // Seeding About Us
    await seedContact();  // Seeding contact information

    console.log("--------------> Database seeding completed <--------------");
  } catch (err) {
    console.error("Error seeding database:", err);
  } finally {
    mongoose.disconnect();
  }
};

// Execute seeding
seedDatabase();
