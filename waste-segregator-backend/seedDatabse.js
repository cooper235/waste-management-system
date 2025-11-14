// seedDatabase.js
require('dotenv').config();
const mongoose = require('mongoose');
const Bin = require('./src/models/Bin');

const sampleBins = [
  {
    binId: 'BIN-001',
    category: 'metal',
    location: {
      latitude: 40.7128,
      longitude: -74.0060,
      address: '123 Main St, New York, NY'
    },
    status: 'active',
    fillLevel: 75,
    capacity: 100,
    lastEmptied: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    installationDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    maintenanceSchedule: {
      frequency: 'monthly',
      lastMaintenanceDate: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000),
      nextMaintenanceDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)
    }
  },
  {
    binId: 'BIN-002',
    category: 'biodegradable',
    location: {
      latitude: 40.7128,
      longitude: -74.0060,
      address: '456 Oak Ave, New York, NY'
    },
    status: 'active',
    fillLevel: 45,
    capacity: 100,
    lastEmptied: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    installationDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
    maintenanceSchedule: {
      frequency: 'weekly',
      lastMaintenanceDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      nextMaintenanceDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)
    }
  },
  {
    binId: 'BIN-003',
    category: 'non-biodegradable',
    location: {
      latitude: 40.7128,
      longitude: -74.0060,
      address: '789 Pine St, New York, NY'
    },
    status: 'active',
    fillLevel: 85,
    capacity: 100,
    lastEmptied: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    installationDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
    maintenanceSchedule: {
      frequency: 'biweekly',
      lastMaintenanceDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      nextMaintenanceDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000)
    }
  }
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    await Bin.deleteMany({});
    console.log('🧹 Cleared existing bins');

    const createdBins = await Bin.insertMany(sampleBins);
    console.log(`🌱 Seeded ${createdBins.length} bins successfully`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
