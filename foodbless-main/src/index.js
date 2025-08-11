require("dotenv").config();

const PORT = process.env.PORT || 5000;
const express = require("express");
const usersRoutes = require("./routes/users");
const middlewareLogRequest = require("./middleware/logs");
const path = require("path");
const fs = require("fs");
const cron = require('node-cron');
const moment = require('moment-timezone');
const { nanoid } = require("nanoid");
const upload = require("./middleware/multer");
const customerModel = require("./models/customers");
const userModel = require("./models/users");
// const sellerModel = require('./models/sellers');
const RoomsModel = require('./models/Ruangan');
const BookingsModel = require("./models/booking");
const MeetingsModel = require("./models/bookingrapat");
const scheduleModel = require("./models/jadwalmeeting");
const adminModel = require("./models/admins");
const foodModel = require("./models/foods");
const orderModel = require("./models/orders");
const tamuModel = require("./models/tamu");
const complaintsModel = require("./models/complaints");
const cityModel = require("./models/cities");
const provinceModel = require("./models/provincies");
const commentModel = require("./models/comments");
const respondentModel = require('./models/responden');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwtSecret = "SECRET";
const app = express();
const cors = require("cors");
const AWS = require("aws-sdk");
const { VerificationEmail} = require("./controller/mailer");
const questionsModel = require('./models/questions');
const surveyResponsesModel = require('./models/surveyResponses');
const dbPool = require('./config/database');
const {createMidtransTransaction} = require('./controller/midtrans');
const {createMidtransTransactionMeeting} = require('./controller/midtransmeeting');

const corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200,
};

AWS.config.update({
  region: process.env.REGION,
  accessId: process.env.KEY,
  secretAccessKey: process.env.SECRET_ACCESS,
});

const s3 = new AWS.S3();

const uploadToS3 = async (filePath, fileName) => {
  const fileStream = fs.createReadStream(filePath);

  const params = {
    Bucket: "photo-foodbless",
    Key: `storage_folder/${fileName}`,
    Body: fileStream,
    ContentType: "application/octet-stream",
  };

  return new Promise((resolve, reject) => {
    s3.upload(params, (err, data) => {
      if (err) {
        console.error("Error uploading file:", err);
        reject(err);
      } else {
        console.log(
          "File uploaded successfully. File location:",
          data.Location
        );
        resolve(data.Location);
      }
    });
  });
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(middlewareLogRequest);
app.use("/assets", express.static("public/images"));
app.use("/keluhan", express.static("public/keluhan"));

app.use("/users", usersRoutes);
app.post("/usersCreate", upload.single("photo"), async (req, res, next) => {
  try {
    let imagePath = null;
    if (req.file) {
      imagePath = req.file.filename;
    }
    const userData = {
      name: req.body.name,
      email: req.body.email,
      address: req.body.address,
      password: req.body.password,
      photo: imagePath, // Simpan nama file foto ke database
    };
    await userModel.createNewUser(userData);
    res.status(201).json({ message: "User berhasil ditambahkan" });
  } catch (error) {
    next(error); // Lewatkan error ke middleware error handling
  }
});

app.post("/upload", upload.single("photo"), (req, res) => {
  res.json({
    message: "Upload berhasil",
  });
});

// Foods
// Buat data makanan
app.post("/createFood", upload.single("photo"), async (req, res, next) => {
  try {
    let imagePath = null;
    if (req.file) {
      const newFileName = `${nanoid(16)}${path.extname(req.file.originalname)}`;
      const newFilePath = path.join(__dirname, "../public/images", newFileName);

      fs.renameSync(req.file.path, newFilePath);
      imagePath = await uploadToS3(newFilePath, newFileName);
      imagePath = newFileName;
    }
    const foodData = {
      seller_id: req.body.seller_id,
      seller_city_id: req.body.seller_city_id,
      name: req.body.name,
      price: req.body.price,
      stock: req.body.stock,
      description: req.body.description,
      expireDate: req.body.expireDate,
      pickUpTimeStart: req.body.pickUpTimeStart,
      pickUpTimeEnd: req.body.pickUpTimeEnd,
      photo: imagePath,
      token: req.headers.authorization,
    };
    await foodModel.createNewFood(foodData);
    res.status(201).json({
      status: 200,
      message: "Berhasil Membuat Data Makanan",
    });
  } catch (error) {
    next(error);
  }
});

// ambil semua data makanan
app.get("/foods", async (req, res, next) => {
  try {
    const [foods] = await foodModel.getAllFoods();
    res.status(201).json({
      status: 200,
      message: "Berhasil Mengambil Semua Data Makanan",
      foods: foods,
    });
  } catch (error) {
    next(error);
  }
});
// ambil semua daya makanan status ready(true)
app.get("/getReadyFoods", async (req, res, next) => {
  try {
    const [foods] = await foodModel.getReadyFoods();
    res.status(201).json({
      status: 200,
      message: "Berhasil Mengambil Semua Data Makanan Yang Ready",
      foods: foods,
    });
  } catch (error) {
    next(error);
  }
});
// ambil semua daya makanan status unready(false)
app.get("/getUnReadyFoods", async (req, res, next) => {
  try {
    const [foods] = await foodModel.getUnReadyFoods();
    res.status(201).json({
      status: 200,
      message: "Berhasil Mengambil Semua Data Makanan Yang Tidak Tersedia",
      foods: foods,
    });
  } catch (error) {
    next(error);
  }
});

// ambil data makanan berdasarkan Id
app.get("/food/:id", async (req, res, next) => {
  try {
    const foodId = req.params.id;
    const food = await foodModel.getFoodById(foodId);
    res.status(200).json({
      status: 200,
      message: "Berhasil Mendapatkan Data Makanan",
      food: food,
    });
  } catch (error) {
    next(error);
  }
});

app.get("/getFoodBySellerId/:seller_id", async (req, res, next) => {
  try {
    const getFoodBySellerId = req.params.seller_id;
    const [food] = await foodModel.getFoodBySellerId(getFoodBySellerId);
    res.status(200).json({
      status: 200,
      message: "Berhasil Mendapatkan Data Makanan Berdasarkan Seller Id",
      food: food,
    });
  } catch (error) {
    next(error);
  }
});
// hapus makanan
app.delete("/deleteFood", async (req, res, next) => {
  try {
    const foodData = {
      id: req.body.id,
      seller_id: req.body.seller_id,
      token: req.headers.authorization,
    };
    await foodModel.deleteFood(foodData);
    res.status(201).json({
      status: 200,
      message: "Berhasil Menghapus Data Makanan",
    });
  } catch (error) {
    next(error);
  }
});
// update makanan
app.put("/updateFood", upload.single("photo"), async (req, res, next) => {
  try {
    const getPhotoOld = await foodModel.getFoodByIdToUpdate(req.body.id);
    let imagePath = getPhotoOld.photo;
    if (req.file) {
      const newFileName = `${nanoid(16)}${path.extname(req.file.originalname)}`;
      const newFilePath = path.join(__dirname, "../public/images", newFileName);

      fs.renameSync(req.file.path, newFilePath);
      imagePath = await uploadToS3(newFilePath, newFileName);
      imagePath = newFileName;
    }

    const foodData = {
      id: req.body.id,
      seller_id: req.body.seller_id,
      status: req.body.status,
      description: req.body.description,
      expireDate: req.body.expireDate,
      token: req.headers.authorization,
      price: req.body.price,
      stock: req.body.stock,
      name: req.body.name,
      pickUpTimeStart: req.body.pickUpTimeStart,
      pickUpTimeEnd: req.body.pickUpTimeEnd,
      photo: imagePath,
    };

    const result = await foodModel.updateFood(foodData);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
});

// ORDER FOOD
app.post("/orders", async (req, res, next) => {
  try {
    const dataOrder = {
      food_id: req.body.food_id,
      seller_id: req.body.seller_id,
      customer_id: req.body.customer_id,
      amount: req.body.amount,
      token: req.headers.authorization,
    };

    if (
      !dataOrder.food_id ||
      !dataOrder.customer_id ||
      !dataOrder.amount ||
      !dataOrder.seller_id
    ) {
      throw new Error("Semua Kolom Wajib Di Isi!!!");
    }

    await orderModel.createNewOrder(dataOrder);
    res.status(201).json({
      status: 200,
      message: "Order Food Berhasil Sedang Menunggu Konfirmasi Toko",
    });
  } catch (error) {
    next(error);
  }
});

// ambil semua data orders
app.get("/getAllOrders", async (req, res, next) => {
  try {
    const [orders] = await orderModel.getAllOrders();
    res.status(201).json({
      status: 200,
      message: "Berhasil Mengambil Semua Data Orders",
      orders: orders,
    });
  } catch (error) {
    next(error);
  }
});
// ambil data order berdasarkan seller id
app.get(
  "/getOrdersBySellerId/:seller_id",
  express.json(),
  async (req, res, next) => {
    try {
      const seller_id = req.params.seller_id;
      const [orders] = await orderModel.getOrdersBySellerId(seller_id);
      res.status(200).json({
        status: 200,
        message: "Berhasil Mengambil Semua Data Orders Berdasarkan Seller Id",
        orders: orders,
      });
    } catch (error) {
      next(error);
    }
  }
);
// ambil data order berdasarkan customer id
app.get(
  "/getOrdersByCustomerId/:customer_id",
  express.json(),
  async (req, res, next) => {
    try {
      const customer_id = req.params.customer_id;
      const [orders] = await orderModel.getOrdersByCustomerId(customer_id);
      res.status(200).json({
        status: 200,
        message:
          "Berhasil Mengambil Semua Data Orders Berdasarkan Customer Id ",
        orders: orders,
      });
    } catch (error) {
      next(error);
    }
  }
);
// ambil data order berdasarkan food id
app.get(
  "/getOrdersByFoodId/:food_id",
  express.json(),
  async (req, res, next) => {
    try {
      const food_id = req.params.food_id;
      const [orders] = await orderModel.getOrdersByFoodId(food_id);
      res.status(200).json({
        status: 200,
        message: "Berhasil Mengambil Semua Data Orders Berdasarkan Food Id ",
        orders: orders,
      });
    } catch (error) {
      next(error);
    }
  }
);
// ambil data order berdasarkan order id
app.get(
  "/getOrdersByOrderId/:order_id",
  express.json(),
  async (req, res, next) => {
    try {
      const order_id = req.params.order_id;
      const [orders] = await orderModel.getOrdersByOrderId(order_id);
      res.status(200).json({
        status: 200,
        message: "Berhasil Mengambil Semua Data Orders Berdasarkan Order Id ",
        orders: orders,
      });
    } catch (error) {
      next(error);
    }
  }
);

app.get("/checkNewOrder/:seller_id", express.json(), async (req, res, next) => {
  try {
    const seller_id = req.params.seller_id;
    const [orders] = await orderModel.checkNewOrder(seller_id);
    res.status(200).json({
      status: 200,
      message: "Berhasil Mengambil Semua Data Order Baru masuk ",
      orders: orders,
    });
  } catch (error) {
    next(error);
  }
});

app.put("/updateOrderToDiproses", express.json(), async (req, res, next) => {
  try {
    const updateData = {
      order_id: req.body.order_id,
      seller_id: req.body.seller_id,
      token: req.headers.authorization,
    };
    const result = await orderModel.updateOrderToDiproses(updateData);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
});

app.put("/updateOrderToSelesai", express.json(), async (req, res, next) => {
  try {
    const updateData = {
      order_id: req.body.order_id,
      seller_id: req.body.seller_id,
      token: req.headers.authorization,
    };
    const result = await orderModel.updateOrderToSelesai(updateData);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
});

app.put("/updateOrderToDibatalkan", express.json(), async (req, res, next) => {
  try {
    const updateData = {
      order_id: req.body.order_id,
      seller_id: req.body.seller_id,
      token: req.headers.authorization,
    };
    const result = await orderModel.updateOrderToDibatalkan(updateData);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
});

// ambil semua data city
app.get("/cityAll", async (req, res, next) => {
  try {
    const [cities] = await cityModel.getAllCities();
    res.status(201).json({
      status: 200,
      message: "Berhasil Mengambil Semua Data Kota",
      cities: cities,
    });
  } catch (error) {
    next(error);
  }
});
// ambil data city berdasarkan id
app.get("/cityById", express.json(), async (req, res, next) => {
  try {
    const id = req.query.id;
    const city = await cityModel.getCityById(id);
    res.status(200).json({
      status: 200,
      message: "Berhasil Mengambil Semua Data Kota Berdasarkan Provinsi",
      city: city,
    });
  } catch (error) {
    next(error);
  }
});
// ambil data city berdasarkan province id
app.get("/cityByProvinceId", express.json(), async (req, res, next) => {
  try {
    const provinceId = req.query.provinceId;
    const cities = await cityModel.getCityByProvinceId(provinceId);
    res.status(200).json({
      status: 200,
      message: "Berhasil Mengambil Semua Data Kota Berdasarkan Provinsi",
      cities: cities,
    });
  } catch (error) {
    next(error);
  }
});
// ambil semua data province
app.get("/provinceAll", async (req, res, next) => {
  try {
    const [provincies] = await provinceModel.getAllProvincies();
    res.status(201).json({
      status: 200,
      message: "Berhasil Mengambil Semua Data Provinsi",
      provincies: provincies,
    });
  } catch (error) {
    next(error);
  }
});
// ambil data province berdasarkan id
app.get("/provinceById", express.json(), async (req, res, next) => {
  try {
    const id = req.query.id;
    const province = await provinceModel.getProvinceById(id);
    res.status(200).json({
      status: 200,
      message: "Berhasil Mengambil Data Provinsi Berdasarkan Id",
      province: province,
    });
  } catch (error) {
    next(error);
  }
});

// ADMIN
// Registrasi Admin
app.post("/adminRegist", async (req, res, next) => {
  try {
    const dataAdmin = {
      email: req.body.email,
      password: req.body.password,
      name: req.body.name,
      provinceId: req.body.provinceId,
      cityId: req.body.cityId,
      address: req.body.address,
      latitude: req.body.latitude,
      longitude: req.body.longitude,
    };

    if (
      !dataAdmin.email ||
      !dataAdmin.password ||
      !dataAdmin.name ||
      !dataAdmin.address ||
      !dataAdmin.latitude ||
      !dataAdmin.longitude
    ) {
      throw new Error("Semua Kolom Wajib Di Isi!!!");
    }

    await adminModel.createNewAdmin(dataAdmin);
    res
      .status(201)
      .json({ status: "200", message: "Registrasi Admin Berhasil" });
  } catch (error) {
    next(error);
  }
});

// CUSTOMER
// buat akun customer

app.post("/createCustomer", upload.single("photo"), async (req, res, next) => {
  try {
    let imagePath = null;
    let newFileName = null;
    if (req.file) {
      newFileName = `${nanoid(16)}${path.extname(req.file.originalname)}`;
      const newFilePath = path.join(__dirname, "../public/images", newFileName);

      fs.renameSync(req.file.path, newFilePath);

      imagePath = await uploadToS3(newFilePath, newFileName);
    }

    const userCustomerData = {
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
      confirmPassword: req.body.confirmPassword,
      role: req.body.role,
      photo: newFileName,

      name: req.body.name,
      nomorWA: req.body.nomorWA,
      address: req.body.address,
      city_id: req.body.city_id,
      city_province_id: req.body.city_province_id,
    };

    await customerModel.createNewCustomer(userCustomerData);
    res.status(201).json({
      status: 200,
      message: "Berhasil Membuat Akun Customer",
    });
  } catch (error) {
    next(error);
  }
});

// login akun customer
app.post("/loginCustomer", async (req, res, next) => {
  try {
    const dataMasuk = {
      email: req.body.email,
      password: req.body.password,
    };

    if (!dataMasuk.email || !dataMasuk.password) {
      throw new Error("Email dan password harus diisi");
    }
    console.log(dataMasuk);
    const token = await customerModel.authenticateCustomer(dataMasuk);
    const customerData = await customerModel.getCustomerByEmail(
      dataMasuk.email
    );

    res.status(200).json({
      message: "Login berhasil",
      token: token,
      data: {
        id_cust: customerData.id_cust,
        customer_name: customerData.customer_name,
        nomorWA: customerData.nomorWA,
        address: customerData.address,
        city_id: customerData.city_id,
        city_province_id: customerData.city_province_id,
        user_id: customerData.user_id,
        username: customerData.username,
        email: customerData.email,
        role: customerData.role,
        createdAt: customerData.createdAt,
        updatedAt: customerData.updatedAt,
        photo: customerData.photo,
      },
    });
  } catch (error) {
    next(error);
  }
});
// ambil semua data customers

// SELLER
// buat akun seller
app.post("/createSeller", upload.single("photo"), async (req, res, next) => {
  try {
    let imagePath = null;
    let newFileName = null;
    if (req.file) {
      newFileName = `${nanoid(16)}${path.extname(req.file.originalname)}`;
      const newFilePath = path.join(__dirname, "../public/images", newFileName);

      fs.renameSync(req.file.path, newFilePath);

      imagePath = await uploadToS3(newFilePath, newFileName);
    }
    const userSellerData = {
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
      confirmPassword: req.body.confirmPassword,
      role: req.body.role,
      photo: newFileName,

      name: req.body.name,
      nomorWA: req.body.nomorWA,
      desc: req.body.desc,
      address: req.body.address,
      city_id: req.body.city_id,
      city_province_id: req.body.city_province_id,
    };
    await sellerModel.createNewSeller(userSellerData);
    res.status(201).json({
      status: 200,
      message: "Berhasil Membuat Akun Seller",
    });
  } catch (error) {
    next(error);
  }
});
// Login Seller
app.post("/loginSeller", async (req, res, next) => {
  try {
    const reqDataLogin = {
      email: req.body.email,
      password: req.body.password,
    };

    if (!reqDataLogin.email || !reqDataLogin.password) {
      throw new Error("Email dan password harus diisi");
    }

    const token = await sellerModel.authenticateSeller(reqDataLogin);
    const sellerData = await sellerModel.getSellerByEmail(reqDataLogin.email);

    res.status(200).json({
      message: "Login berhasil",
      token: token,
      data: {
        id_seller: sellerData.id_seller,
        name: sellerData.name,
        desc: sellerData.desc,
        nomorWA: sellerData.nomorWA,
        address: sellerData.address,
        city_id: sellerData.city_id,
        city_province_id: sellerData.city_province_id,
        user_id: sellerData.user_id,
        username: sellerData.username,
        email: sellerData.email,
        role: sellerData.role,
        createdAt: sellerData.createdAt,
        updatedAt: sellerData.updatedAt,
        photo: sellerData.photo,
      },
    });
  } catch (error) {
    next(error);
  }
});
//  ambil semua data seller
app.get("/getAllSellers", async (req, res, next) => {
  try {
    const [seller] = await sellerModel.getAllSellers();
    res.status(201).json({
      status: 200,
      message: "Berhasil Mengambil Semua Data Seller",
      seller: seller,
    });
  } catch (error) {
    next(error);
  }
});

app.get("/getAllCustomers", async (req, res, next) => {
  try {
    const [customers] = await customerModel.getAllCustomers();
    res.status(201).json({
      status: 200,
      message: "Berhasil Mengambil Semua Data Customer",
      customers: customers,
    });
  } catch (error) {
    next(error);
  }
});

app.get("/getAllUserCustomers", async (req, res, next) => {
  try {
    const userId = req.body.user_id;
    const token = req.headers.authorization;

    const user = await userModel.getAdminDataById(userId);
    if (user.role !== "admin") {
      return res.status(403).json({
        status: 403,
        message: "Akses ditolak. Anda bukan admin.",
      });
    }

    const customers = await userModel.getAllUserCustomers();
    res.status(200).json({
      status: 200,
      message: "Berhasil Mengambil Semua Data Customer",
      customers: customers,
    });
  } catch (error) {
    next(error);
  }
});

app.get("/getAllUserSellers", async (req, res, next) => {
  try {
    const userId = req.body.user_id;
    const token = req.headers.authorization;

    const user = await userModel.getAdminDataById(userId);
    if (user.role !== "admin") {
      return res.status(403).json({
        status: 403,
        message: "Akses ditolak. Anda bukan admin.",
      });
    }

    const customers = await userModel.getAllUserSellers();
    res.status(200).json({
      status: 200,
      message: "Berhasil Mengambil Semua Data Seller",
      customers: customers,
    });
  } catch (error) {
    next(error);
  }
});

app.get("/seller/:id_seller", async (req, res, next) => {
  try {
    const id_seller = req.params.id_seller;
    const seller = await sellerModel.getSellerById(id_seller);
    res.status(200).json({
      status: 200,
      message: "Berhasil Mendapatkan Data Seller By Id Seller",
      seller: seller,
    });
  } catch (error) {
    next(error);
  }
});

// ADMIN
// buat akun admin
app.post("/createAdmin", upload.single("photo"), async (req, res, next) => {
  try {
    let imagePath = null;
    let newFileName = null;
    if (req.file) {
      newFileName = `${nanoid(16)}${path.extname(req.file.originalname)}`;
      const newFilePath = path.join(__dirname, "../public/images", newFileName);

      fs.renameSync(req.file.path, newFilePath);

      imagePath = await uploadToS3(newFilePath, newFileName);
    }
    const userDataAdmin = {
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
      confirmPassword: req.body.confirmPassword,
      role: req.body.role,
      photo: newFileName,
    };
    await adminModel.createNewAdmin(userDataAdmin);
    res.status(201).json({
      status: 200,
      message: "Berhasil Membuat Akun Admin",
    });
  } catch (error) {
    next(error);
  }
});
// Login Admin
app.post("/loginAdmin", async (req, res, next) => {
  try {
    const reqDataLogin = {
      email: req.body.email,
      password: req.body.password,
    };

    if (!reqDataLogin.email || !reqDataLogin.password) {
      throw new Error("Email dan password harus diisi");
    }

    const token = await adminModel.authenticateAdmin(reqDataLogin);
    const adminData = await adminModel.getAdminByEmail(reqDataLogin.email);

    res.status(200).json({
      message: "Login berhasil",
      token: token,
      data: {
        user_id: adminData.user_id,
        username: adminData.username,
        email: adminData.email,
        password: adminData.password,
        role: adminData.role,
        createdAt: adminData.createdAt,
        updatedAt: adminData.updatedAt,
        photo: adminData.photo,
      },
    });
  } catch (error) {
    next(error);
  }
});

app.post("/login", async (req, res, next) => {
  try {
    const reqDataLogin = {
      email: req.body.email,
      password: req.body.password,
    };

    if (!reqDataLogin.email || !reqDataLogin.password) {
      throw new Error("Email dan password harus diisi");
    }

    const token = await userModel.authenticateUser(reqDataLogin);

    let userData;
    const dataUser = await userModel.checkRoleUserByEmail(reqDataLogin.email);
    let role = dataUser.role;

    // Mengecek peran pengguna
    switch (role) {
      case "customer":
        const customerUserData = await userModel.getCustomerDataById(
          dataUser.user_id
        );
        if (!customerUserData) {
          throw new Error("Data customer tidak ditemukan");
        }
        userData = customerUserData;
        break;
      case "seller":
        const sellerUserData = await userModel.getSellerDataById(
          dataUser.user_id
        );
        if (!sellerUserData) {
          throw new Error("Data seller tidak ditemukan");
        }
        userData = sellerUserData;
        break;
      case "admin":
        const adminUserData = await userModel.getAdminDataById(
          dataUser.user_id
        );
        if (!adminUserData) {
          throw new Error("Data admin tidak ditemukan");
        }
        userData = adminUserData;
        break;
      default:
        throw new Error("Peran pengguna tidak valid");
    }

    // Mengembalikan data sesuai dengan peran pengguna
    let responseData;
    switch (role) {
      case "customer":
        responseData = {
          id_cust: userData.id_cust,
          customer_name: userData.customer_name,
          nomorWA: userData.nomorWA,
          address: userData.address,
          city_id: userData.city_id,
          city_province_id: userData.city_province_id,
          user_id: userData.user_id,
          username: userData.username,
          email: userData.email,
          role: userData.role,
          createdAt: userData.createdAt,
          updatedAt: userData.updatedAt,
          photo: userData.photo,
        };
        break;
      case "seller":
        responseData = {
          id_seller: userData.id_seller,
          name: userData.name,
          desc: userData.desc,
          nomorWA: userData.nomorWA,
          address: userData.address,
          city_id: userData.city_id,
          city_province_id: userData.city_province_id,
          user_id: userData.user_id,
          username: userData.username,
          email: userData.email,
          role: userData.role,
          createdAt: userData.createdAt,
          updatedAt: userData.updatedAt,
          photo: userData.photo,
        };
        break;
      case "admin":
        responseData = {
          user_id: userData.user_id,
          username: userData.username,
          email: userData.email,
          password: userData.password,
          role: userData.role,
          createdAt: userData.createdAt,
          updatedAt: userData.updatedAt,
          photo: userData.photo,
        };
        break;
      default:
        throw new Error("Peran pengguna tidak valid");
    }

    res.status(200).json({
      message: "Login berhasil",
      token: token,
      data: responseData,
    });
  } catch (error) {
    next(error);
  }
});

app.get("/user/:id", async (req, res, next) => {
  try {
    const userId = req.params.id;

    if (!userId) {
      throw new Error("User ID harus disertakan");
    }

    // Retrieve user data by ID
    let userData = await userModel.getUserById(userId);

    if (!userData) {
      throw new Error("User tidak ditemukan");
    }

    // Based on the role, fetch additional data
    let responseData;
    switch (userData.role) {
      case "customer":
        const customerData = await userModel.getCustomerDataById(userId);
        if (!customerData) {
          throw new Error("Data customer tidak ditemukan");
        }
        responseData = {
          id_cust: customerData.id_cust,
          customer_name: customerData.customer_name,
          nomorWA: customerData.nomorWA,
          address: customerData.address,
          city_id: customerData.city_id,
          city_province_id: customerData.city_province_id,
          user_id: customerData.user_id,
          username: customerData.username,
          email: customerData.email,
          role: customerData.role,
          createdAt: customerData.createdAt,
          updatedAt: customerData.updatedAt,
          photo: customerData.photo,
        };
        break;
      case "seller":
        const sellerData = await userModel.getSellerDataById(userId);
        if (!sellerData) {
          throw new Error("Data seller tidak ditemukan");
        }
        responseData = {
          id_seller: sellerData.id_seller,
          name: sellerData.name,
          desc: sellerData.desc,
          nomorWA: sellerData.nomorWA,
          address: sellerData.address,
          city_id: sellerData.city_id,
          city_province_id: sellerData.city_province_id,
          user_id: sellerData.user_id,
          username: sellerData.username,
          email: sellerData.email,
          role: sellerData.role,
          createdAt: sellerData.createdAt,
          updatedAt: sellerData.updatedAt,
          photo: sellerData.photo,
        };
        break;
      case "admin":
        const adminData = await userModel.getAdminDataById(userId);
        if (!adminData) {
          throw new Error("Data admin tidak ditemukan");
        }
        responseData = {
          user_id: adminData.user_id,
          username: adminData.username,
          email: adminData.email,
          role: adminData.role,
          createdAt: adminData.createdAt,
          updatedAt: adminData.updatedAt,
          photo: adminData.photo,
        };
        break;
      default:
        throw new Error("Peran pengguna tidak valid");
    }

    res.status(200).json({
      message: "Data user berhasil ditemukan",
      data: responseData,
    });
  } catch (error) {
    next(error);
  }
});

//COMMENT
app.post("/createComment", async (req, res, next) => {
  try {
    const commentData = {
      id_seller: req.body.id_seller,
      id_cust: req.body.id_cust,
      description: req.body.description,
    };
    await commentModel.createComment(commentData);
    res.status(201).json({
      status: 200,
      message: "Berhasil menambahkan komentar",
    });
  } catch (error) {
    next(error);
  }
});

app.get("/getCommentAll", async (req, res, next) => {
  try {
    const [comments] = await commentModel.getAllComments();
    res.status(201).json({
      status: 200,
      message: "Berhasil Mengambil Semua Data komentar",
      comments: comments,
    });
  } catch (error) {
    next(error);
  }
});

app.get("/getCommentByIdSeller/:id_seller", async (req, res, next) => {
  try {
    const id_seller = req.params.id_seller;

    const [comments] = await commentModel.getCommentByIdSeller(id_seller);
    res.status(201).json({
      status: 200,
      message: "Berhasil Mengambil Semua Data Komentar Berdasarkan Id Seller",
      comments: comments,
    });
  } catch (error) {
    next(error);
  }
});

app.put("/updateSeller", upload.single("photo"), async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      throw new Error("Token harus disertakan");
    }

    const decoded = jwt.verify(token, jwtSecret);
    const userIdFromToken = decoded.id;

    const existingUserData = await userModel.getSellerDataByIdForUpdate(
      req.body.user_id
    );
    if (!existingUserData) {
      throw new Error("Data seller tidak ditemukan");
    }

    let imagePath = existingUserData.photo;
    let newFileName = null;
    if (req.file) {
      newFileName = `${nanoid(16)}${path.extname(req.file.originalname)}`;
      const newFilePath = path.join(__dirname, "../public/images", newFileName);

      fs.renameSync(req.file.path, newFilePath);
      imagePath = await uploadToS3(newFilePath, newFileName);
      imagePath = newFileName;
    }

    let encryptedPassword = existingUserData.password;
    if (req.body.password) {
      encryptedPassword = await bcrypt.hash(req.body.password, saltRounds);
    }

    const sellerData = {
      user_id: req.body.user_id,
      id_seller: req.body.id_seller || existingUserData.id_seller,
      username: req.body.username || existingUserData.username,
      email: req.body.email || existingUserData.email,
      password: encryptedPassword,
      name: req.body.name || existingUserData.name,
      desc: req.body.desc || existingUserData.desc,
      nomorWA: req.body.nomorWA || existingUserData.nomorWA,
      address: req.body.address || existingUserData.address,
      city_id: req.body.city_id || existingUserData.city_id,
      city_province_id:
        req.body.city_province_id || existingUserData.city_province_id,
      photo: imagePath,
    };

    const result = await userModel.updateDataSeller(sellerData);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
});

app.put("/updateCustomer", upload.single("photo"), async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      throw new Error("Token harus disertakan");
    }

    const decoded = jwt.verify(token, jwtSecret);
    const userIdFromToken = decoded.id;

    const existingUserData = await userModel.getCustomerDataByIdForUpdate(
      req.body.user_id
    );
    if (!existingUserData) {
      throw new Error("Data customer tidak ditemukan");
    }

    let imagePath = existingUserData.photo;
    let newFileName = null;
    if (req.file) {
      newFileName = `${nanoid(16)}${path.extname(req.file.originalname)}`;
      const newFilePath = path.join(__dirname, "../public/images", newFileName);

      fs.renameSync(req.file.path, newFilePath);
      imagePath = await uploadToS3(newFilePath, newFileName);
      imagePath = newFileName;
    }

    let encryptedPassword = existingUserData.password;
    if (req.body.password) {
      encryptedPassword = await bcrypt.hash(req.body.password, saltRounds);
    }

    const customerData = {
      user_id: req.body.user_id,
      id_cust: req.body.id_cust || existingUserData.id_cust,
      username: req.body.username || existingUserData.username,
      email: req.body.email || existingUserData.email,
      password: encryptedPassword,
      name: req.body.name || existingUserData.name,
      nomorWA: req.body.nomorWA || existingUserData.nomorWA,
      address: req.body.address || existingUserData.address,
      city_id: req.body.city_id || existingUserData.city_id,
      city_province_id:
        req.body.city_province_id || existingUserData.city_province_id,
      photo: imagePath,
    };

    const result = await userModel.updateDataCustomer(customerData);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
});

app.post("/testUpload", upload.single("photo"), async (req, res, next) => {
  try {
    if (!req.file) {
      throw new Error("File not uploaded");
    }

    const newFileName = `${nanoid(16)}${path.extname(req.file.originalname)}`;
    const newFilePath = path.join(__dirname, "../public/images", newFileName);

    fs.renameSync(req.file.path, newFilePath);

    const result = await uploadToS3(newFilePath, newFileName);
    console.log("File uploaded successfully:", result);

    res.status(201).json({
      status: 200,
      message: "Berhasil Upload Photo",
      url: result,
    });
  } catch (error) {
    console.error("Error in file upload:", error);
    res.status(500).json({
      status: 500,
      message: error.message,
    });
  }
});

app.get("/tamu", async (req, res, next) => {
  try {
    const [tamu] = await tamuModel.getAllTamu();
    res.status(201).json({
      status: 200,
      message: "Berhasil Mengambil Semua Data Tamu",
      tamu: tamu,
    });
  } catch (error) {
    next(error);
  }
});
app.use((err, req, res, next) => {
  res.json({
    message: err.message,
  });
});

app.listen(PORT, () => {
  console.log(`Server berhasil di running di port ${PORT}`);
});

//TAMU FIRMAN FIRZA
app.get("/getAllTamu", async (req, res, next) => {
  try {
      const [rows] = await tamuModel.getAllTamu();
      res.status(200).json(rows);
  } catch (error) {
      next(error);
  }
});

app.put("/updateTamuStatus", async (req, res, next) => {
  try {
    const { id, status } = req.body;
    console.log("Updating status for ID:", id, "to", status); // Log for debugging
    await tamuModel.updateTamuStatus(id, status); // Panggil model untuk update status
    res.status(200).json({ message: 'Status tamu berhasil diperbarui' });
  } catch (error) {
    next(error);
  }
});

app.get("/getTamuByStatus/:status", async (req, res, next) => {
  try {
    const status = req.params.status;
    const [rows] = await tamuModel.getTamuByStatus(status); // Mendapatkan tamu berdasarkan status
    res.status(200).json(rows);
  } catch (error) {
    next(error);
  }
});

// Endpoint untuk mendapatkan data kunjungan per bulan
app.get("/getVisitData", async (req, res, next) => {
  try {
    const [rows] = await tamuModel.getVisitData(); // Buat query untuk menghitung kunjungan per bulan
    res.status(200).json(rows);
  } catch (error) {
    next(error);
  }
});

// Endpoint untuk mendapatkan 10 tamu terbaru
app.get("/getLatestVisitors", async (req, res, next) => {
  try {
    const [rows] = await tamuModel.getLatestVisitors(); // Buat query untuk mengambil 10 tamu terbaru
    res.status(200).json(rows);
  } catch (error) {
    next(error);
  }
});


app.post("/createTamu", async (req, res, next) => {
  try {
    const tamuData = {
      nama: req.body.nama,
      telepon: req.body.telepon,
      keperluan: req.body.keperluan,
      dituju: req.body.dituju,
    };
    await tamuModel.createTamu(tamuData);
    res.status(201).json({
      status: 200,
      message: "Berhasil menambahkan data",
    });
  } catch (error) {
    next(error);
  }
});

app.delete("/deleteTamu", async (req, res, next) => {
  try {
    const id = req.body.id;
    await tamuModel.deleteTamu(id);
    res.status(201).json({
      status: 200,
      message: "Berhasil Menghapus Data Tamu",
    });
  } catch (error) {
    next(error);
  }
});

app.put("/updateTamu", async (req, res, next) => {
  try {
    const tamuData = {
      id: req.body.id,
      nama: req.body.nama,
      telepon: req.body.telepon,
      keperluan: req.body.keperluan,
      dituju: req.body.dituju,
    };

    const [result] = await tamuModel.updateTamu(tamuData);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Tamu tidak ditemukan" });
    }

    res.status(200).json({
      status: 200,
      message: "Data tamu berhasil diperbarui",
    });
  } catch (error) {
    next(error);
  }
});

// FIRZA AND FIRMAN #2

app.use(express.json()); // Mengganti bodyParser.json()
app.use(express.urlencoded({ extended: true })); // Mengganti bodyParser.urlencoded()
// Endpoint untuk menyimpan jawaban survey baru
app.post("/createSurveyResponse", async (req, res) => {
  try {
      const { responden_id, questions_id, answer } = req.body;
      await surveyResponsesModel.createSurveyResponse({ responden_id, questions_id, answer });
      res.status(201).json({ message: "Jawaban survei berhasil disimpan" });
  } catch (error) {
      console.error("Error:", error.message);
      res.status(500).json({ error: error.message });
  }
});


// Endpoint mendapatkan semua pertanyaan
app.get("/getAllQuestions", async (req, res) => {
  try {
      const [rows] = await questionsModel.getAllQuestions();
      res.status(200).json(rows);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});

app.get("/getStatistik", async (req, res) => {
  try {
      const rows = await questionsModel.getStatistik();
      res.status(200).json(rows);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});

// Endpoint mendapatkan statistik jawaban untuk pertanyaan tertentu
app.get("/getSurveyResponses/:questions_id", async (req, res) => {
  try {
      const questions_id = req.params.questions_id;
      const rows = await surveyResponsesModel.getSurveyResponsesByQuestionId(questions_id);
      res.status(200).json(rows);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});

// responden firman firza


// Mendapatkan semua data responden
app.get("/respondents", async (req, res, next) => {
    try {
        const [rows] = await respondentModel.getAllRespondents();
        res.status(200).json(rows);
    } catch (error) {
        next(error);
    }
});

// Menambah responden baru
app.post("/createRespondent", async (req, res) => {
  try {
      const { nama, jenis_kelamin, umur, pendidikan } = req.body;
      
      const [result] = await respondentModel.createRespondent({ nama, jenis_kelamin, umur, pendidikan });
      
      res.status(201).json({ message: "Responden berhasil ditambahkan", insertId: result.insertId });
  } catch (error) {
      console.error("Error:", error.message);
      res.status(500).json({ error: error.message });
  }
});

app.post("/createJawaban", async (req, res) => {
  try {
    const { id_pertanyaan, jawaban } = req.body;
    await respondentModel.createJawaban({ id_pertanyaan, jawaban });
    res.status(201).json({ message: "Jawaban berhasil ditambahkan" });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: error.message });
  }
});

app.post("/submitSurvey", async (req, res) => {
  const { responden, jawaban } = req.body;

  const connection = await dbPool.getConnection(); // Mulai koneksi database
  try {
    await connection.beginTransaction();

    // Insert data responden
    const [respondentResult] = await respondentModel.createRespondent(responden);
    const responden_id = respondentResult.insertId;

    // Insert jawaban untuk setiap pertanyaan
    for (const item of jawaban) {
      await respondentModel.createJawaban({ id_pertanyaan: item.id_pertanyaan, jawaban: item.jawaban, responden_id });
    }

    await connection.commit();
    res.status(201).json({ message: "Survey berhasil disimpan" });

  } catch (error) {
    await connection.rollback();
    console.error("Error:", error.message);
    res.status(500).json({ error: error.message });
  } finally {
    connection.release(); // Tutup koneksi database
  }
});

// Mendapatkan data responden berdasarkan ID
app.get("/respondent/:id", async (req, res, next) => {
    try {
        const id = req.params.id;
        const respondent = await respondentModel.getRespondentById(id);
        res.status(200).json(respondent);
    } catch (error) {
        next(error);
    }
});

// Mengupdate data responden
app.put("/updateRespondent", async (req, res, next) => {
    try {
        const { id, nama, jenis_kelamin, umur, pendidikan } = req.body;
        await respondentModel.updateRespondent({ id, nama, jenis_kelamin, umur, pendidikan });
        res.status(200).json({ message: "Responden berhasil diperbarui" });
    } catch (error) {
        next(error);
    }
});

// Menghapus responden
app.delete("/deleteRespondent", async (req, res, next) => {
    try {
        const id = req.body.id;
        await respondentModel.deleteRespondent(id);
        res.status(200).json({ message: "Responden berhasil dihapus" });
    } catch (error) {
        next(error);
    }
});


// COMPLAINTS Septian Farhan

app.get("/complaints", async (req, res, next) => {
  try {
    const [complaints] = await complaintsModel.getAllComplaints();
    res.status(201).json({
      status: 200,
      message: "Berhasil Mengambil Semua Data Keluhan",
      complaints: complaints,
    });
  } catch (error) {
    next(error);
  }
});

app.post("/createComplaints", upload.single("image"), async (req, res, next) => {
  try {
    const imagePath = req.file ? `keluhan/${req.file.filename}` : null;
    console.log(imagePath);
    const complaintsData = {
      id: req.body.id,
      name: req.body.name,
      email: req.body.email,
      categories: req.body.categories,
      phone: req.body.phone,
      facilities: req.body.facilities,
      image: imagePath,
      isikeluhan: req.body.isikeluhan,
    };
    console.log(complaintsData);
    await complaintsModel.createComplaints(complaintsData);
    res.status(201).json({
      status: 200,
      message: "Berhasil menambahkan keluhan",
    });
    VerificationEmail(req.body.email);
  } catch (error) {
    next(error);
  }
});


app.post("/assignComplaints", async (req, res, next) => {
  try {
    const { id, assign_to } = req.body;
    await complaintsModel.assignComplaints(id, assign_to);
    res.status(201).json({
      status: 200,
      message: "Berhasil mengassign keluhan",
    });
  } catch (error) {
    next(error);
  }
});

app.post("/completeComplaints", async (req, res, next) => {
  try {
    const { id } = req.body;
    await complaintsModel.completeComplaints(id);
    res.status(201).json({
      status: 200,
      message: "Berhasil menyelesaikan keluhan",
    });
  } catch (error) {
    next(error);
  }
});

app.delete("/deleteComplaints", async (req, res, next) => {
  try {
    const id = req.body.id;
    await complaintsModel.deleteComplaints(id);
    res.status(201).json({
      status: 200,
      message: "Berhasil Menghapus Data Keluhan",
    });
  } catch (error) {
    next(error);
  }
});

app.put("/updateComplaints", async (req, res, next) => {
  try {
    const complaintsData = {
      id: req.body.id,
      name: req.body.name,
      categories: req.body.categories,
      phone: req.body.phone,
      facilities: req.body.facilities,  
      image: req.body.image,
      isikeluhan: req.body.isikeluhan,
    };

    const [result] = await complaintsModel.updateComplaints(complaintsData);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Keluhan tidak ditemukan" });
    }

    res.status(200).json({
      status: 200,
      message: "Data keluhan berhasil diperbarui",
    });
  } catch (error) {
    next(error);
  }
});

//Booking Rizki Rendy
//Booking Virtual Office
app.get("/booking", async (req, res, next) => {
  try {
    const [bookings] = await BookingsModel.getAllBooking();
    res.status(200).json({
      status: 200,
      message: "Berhasil Mengambil Semua Data Penyewaan",
      bookings: bookings,
    });
  } catch (error) {
    next(error);
  }
});

app.post('/payment', createMidtransTransaction);

app.delete("/deleteBooking/:ID_Transaksi", async (req, res, next) => {
  try {
    const ID_Transaksi = req.params.ID_Transaksi;
    console.log(`Received ID for delete: ${ID_Transaksi}`);

    // Pastikan ID_User tidak undefined
    if (ID_Transaksi === undefined || ID_Transaksi === null) {
      throw new Error("ID_Pemesanan tidak valid");
    }

    await BookingsModel.deleteBooking(ID_Transaksi);
    res.status(200).json({
      status: 200,
      message: "Berhasil Menghapus Data pesanan",
    });
  } catch (error) {
    next(error);
  }
});

app.put("/updateBooking", async (req, res, next) => {
  try {
    const BookingData = {
      Nama_Lengkap: req.body.fullname,
      Jenis_Kelamin: req.body.gender,
      Email: req.body.email,
      No_Hp: req.body.phonenumber,
      ID_Ruangan: req.body.typeruangan,
      Durasi: req.body.duration,
      ID_Pemesanan: req.body.ID_Pemesanan,
      ID_User: req.body.ID_User,
    };

    const [result] = await BookingsModel.updateBooking(BookingData);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Pesanan tidak ditemukan" });
    }

    res.status(200).json({
      status: 200,
      message: "Data Pesanan berhasil diperbarui",
    });
  } catch (error) {
    next(error);
  };
});

cron.schedule('0 */2 * * * *', async () => {
  const indonesia = moment().tz("Asia/Jakarta").format("YYYY-MM-DD HH:mm:ss");
  console.log(`Tugas Update Sewa VO berjalan pada jam ${indonesia} (WIB)`);

  try{
    await BookingsModel.updateBookingVo();
  }catch(error){
    console.log("Error saat menjalankan pembaruan status pemesanan: ", error);
  }
})

//Fungsi Untuk Mengambil Data Tipe Virtual Office Dashboard Admin
app.get('/room', async(req, res, next) => {
  try {
    const [rooms] = await RoomsModel.getAllRoom();
    res.status(200).json({
      status: 200,
      message: "Berhasil Mengambil Semua Data Ruangan",
      rooms: rooms,
    });
  } catch (error) {
      next(error);
  }
});

app.post('/createRoom', async (req, res) => {
  const { Type_Ruangan, Harga } = req.body;

  if (!Type_Ruangan || !Harga) {
      return res.status(400).json({ error: 'Masukkan Type_Ruangan dan Harga' });
  }

  const SQLCRoom = 'INSERT INTO ruangan (Type_Ruangan, Harga) VALUES (?, ?)';
  const values = [Type_Ruangan, Harga];

  try {
      const [result] = await dbPool.execute(SQLCRoom, values);
      res.status(201).json({
          message: 'Ruangan berhasil ditambahkan.',
          ID_Ruangan: result.insertId,
      });
  } catch (error) {
      console.error('Error saat menambahkan ruangan:', error);
      res.status(500).json({ error: 'Gagal menambahkan ruangan. Silakan coba lagi.' });
  }
});

app.delete("/deleteRoom/:ID_Ruangan", async (req, res, next) => {
  try{
    const ID_Ruangan = req.params.ID_Ruangan;
    console.log(`Received ID for deletion: ${ID_Ruangan}`);

    // Pastikan ID_Ruangan tidak undefined
    if (ID_Ruangan === null) {
      throw new Error("ID_Ruangan tidak valid");
    }
    await RoomsModel.deleteRoom(ID_Ruangan);
    res.status(200).json({
      status: 200,
      message: "Berhasil Menghapus Data ruangan",
    });
  }catch(error){
    next(error);
  }
});

app.put("/updateRoom", async (req, res, next) => {
  try{
    const {ID_Ruangan, Type_Ruangan, Harga} = req.body;

    if(!ID_Ruangan|| !Type_Ruangan || !Harga){
      return res.status(404).json({message: "Perlu ID_Ruangan"});
    }

    const RoomData = {
      ID_Ruangan,
      Type_Ruangan,
      Harga: Harga
    };

    const [result] = await RoomsModel.updateRoom(RoomData);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Ruangan tidak ditemukan" });
    }
    res.status(200).json({
      status: 200,
      message: "Data Ruangan berhasil diperbarui",
    });
  } catch(error){
    next(error);
  }
});

//FUNGSI Meeting Pelanggan
app.post("/paymentMeeting", createMidtransTransactionMeeting);

app.get('/durations', async (req, res, next) => {
  const { date, roomId } = req.query;

  console.log("Received Date:", date);
  console.log("Received Room ID:", roomId);

  if (!roomId || !date) {
    return res.status(400).json({ error: "Room ID dan tanggal diperlukan." });
}

  try {
    console.log("Fetching durations for room:", roomId, "and date:", date);
    const durations = await MeetingsModel.getAvailableDurations(roomId, date);
    console.log("Durations fetched:", durations);
    res.status(200).json(durations);
  } catch (error) {
    console.error("Error fetching durations:", error.message);
    res.status(500).json({ error: "Terjadi kesalahan saat mengambil durasi." });
  }
});

//Fungsi Mengambil data pelanggan rapat
app.get("/meeting", async (req, res) => {
  try{
    const [meetings] = await MeetingsModel.getallMeeting();
    res.status(200).json({
      status: 200,
      message: "Berhasil mengambil semua data sewa ruang rapat",
      meetings: meetings
    });
  }catch(error){
    res.status(500).json({status: 500, message});
  }
});

app.delete("/deleteOrderMeeting/:ID_Transaksi", async(req, res, next) => {
  try{
    const ID_Transaksi = req.params.ID_Transaksi;

    console.log(`Received ID for deletion: ${ID_Transaksi}`);
    
    if (ID_Transaksi === null) {
      throw new Error("ID_Ruangan tidak valid");
    }
    await MeetingsModel.deleteMeeting(ID_Transaksi);
    res.status(200).json({
      status: 200,
      message: "Berhasil Menghapus Data ruangan",
    });
  }catch(error){
    next(error);
  }
});

cron.schedule('0 */2 * * * *', async () => {
  const indonesia = moment().tz("Asia/Jakarta").format("YYYY-MM-DD HH:mm:ss");
  console.log(`Tugas Update Booking Rapat berjalan pada jam ${indonesia} (WIB)`);

  try{
    await MeetingsModel.updateBookingStatus();
  }catch(error){
    console.log("Error saat menjalankan pembaruan status pemesanan: ", error);
  }
});

//Fungsi Admin Meeting Ruangan
app.post("/createRoomMeeting", RoomsModel.createRoomMeeting);

app.get('/roomeeting', async (req, res, next) => {
  try {
      const [roomeetings] = await RoomsModel.getAllRoomMeeting();
      res.status(200).json({
          status: 200,
          message: "Berhasil Mengambil Data Ruang Meeting",
          roomeetings: roomeetings,
      });
  } catch (error) {
      next(error);
  }
});

app.delete("/deleteRoomMeeting/:ID_Meeting", async (req, res, next) => {
  try{
    const ID_Meeting = req.params.ID_Meeting;
    console.log(`Received ID for deletion: ${ID_Meeting}`);

    if (ID_Meeting === null) {
      throw new Error("ID_Ruangan tidak valid");
    }
    await RoomsModel.deleteRoomMeeting(ID_Meeting);
    res.status(200).json({
      status: 200,
      message: "Berhasil Menghapus Data ruangan",
    });
  }catch(error){
    next(error);
  }
});

app.put("/updateRoomMeeting", async (req, res, next) => {
  try{
    const {ID_Meeting, Nama_Ruangan, Harga} = req.body;

    if(!ID_Meeting|| !Nama_Ruangan || !Harga){
      return res.status(404).json({message: "Terdapat Data Yang Kosong"});
    }

    const RoomMeetingData = {
      ID_Meeting,
      Nama_Ruangan,
      Harga: Harga
    };

    const [result] = await RoomsModel.updateRoomMeeting(RoomMeetingData);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Ruangan tidak ditemukan" });
    }
    res.status(200).json({
      status: 200,
      message: "Data Ruangan berhasil diperbarui",
    });
  } catch(error){
    next(error);
  }
});

//Jadwal Meeting
app.get("/JadwalMeeting", async(req, res) => {
  try{
    const [jadwals] = await scheduleModel.getAllJadwal();
    res.status(200).json({
      status: 200,
      message: "Berhasil Mengambil Jam Ruang Meeting",
      jadwals: jadwals,
  });
  }catch(error){
    next(error);
  }
});

app.post("/createjadwal", scheduleModel.createJadwal);

app.delete("/deleteJadwal/:ID_Durasi", async (req, res, next)=> {
  try{
    const {ID_Durasi} = req.params;
    console.log(`Received ID for deletion: ${ID_Durasi}`);

    if(ID_Durasi === null) {
      return res.status(404).json({message: "ID Durasi tidak ditemukan"});
    }
      await scheduleModel.deleteJadwal(ID_Durasi);
      res.status(200).json({
        status: 200,
        message: "Data Jadwal berhasil dihapus",
      });
  }catch(error){
    next(error);
  }
});

app.put('/updateJadwal', scheduleModel.updateJadwal);