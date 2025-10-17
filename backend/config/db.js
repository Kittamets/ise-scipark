import mongoose from "mongoose";
import ParkingZone from '../models/parkingZoneModel.js';
import ParkingSpot from '../models/parkingSpotModel.js';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);

    // const zones = [
    //   {
    //     zoneName: 'หน้าคณะวิทยาศาสตร์',
    //     totalSpots: 5,
    //   },
    //   {
    //     zoneName: 'หน้าตึกจุฬาภรณ์ 1',
    //     totalSpots: 5,
    //   },
    //   {
    //     zoneName: 'ข้างตึกจุฬาภรณ์ 2',
    //     totalSpots: 5,
    //   },
    //   {
    //     zoneName: 'ใต้ตึกพระจอมเกล้า',
    //     totalSpots: 5,
    //   }
    // ];

    // await ParkingSpot.deleteMany();
    // await ParkingZone.deleteMany();

    // const createdZones = await ParkingZone.insertMany(zones);

    // const spotsToCreate = [];
    // const name = ['A', 'B', 'C', 'D'];

    // createdZones.forEach((zone, index) => {
    //   for (let i = 1; i <= zone.totalSpots; i++) {
    //     spotsToCreate.push({
    //       zone: zone._id,
    //       spotNumber: `${name[index]}${i}`, // Creates A1, A2... B1, B2...
    //     });
    //   }
    // });

    // await ParkingSpot.insertMany(spotsToCreate);

  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

export default connectDB;
