-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 07, 2024 at 04:38 PM
-- Server version: 10.4.25-MariaDB
-- PHP Version: 8.1.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `foodblees`
--

-- --------------------------------------------------------

--
-- Table structure for table `city`
--

CREATE TABLE `city` (
  `id` int(11) NOT NULL,
  `provinceId` int(11) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `city`
--

INSERT INTO `city` (`id`, `provinceId`, `name`) VALUES
(1, 1, 'Banda Aceh'),
(2, 1, 'Sabang'),
(3, 1, 'Lhokseumawe'),
(4, 1, 'langsa'),
(5, 1, 'Subulussalam'),
(6, 2, 'Binjai'),
(7, 2, 'Gunungsitoli'),
(8, 2, 'Medan'),
(9, 2, 'Padangsidimpuan'),
(10, 2, 'Pematangsiantar'),
(11, 2, 'Sibolga'),
(12, 2, 'Tanjungbalai'),
(13, 2, 'Tebing Tinggi'),
(14, 3, 'Padang'),
(15, 3, 'Bukittinggi'),
(16, 3, 'Padang Panjang'),
(17, 3, 'Pariaman'),
(18, 3, 'Payakumbuh'),
(19, 3, 'Sawahlunto'),
(20, 3, 'Solok'),
(21, 4, 'Lubuklinggau'),
(22, 4, 'Pagar Alam'),
(23, 4, 'Palembang'),
(24, 4, 'Prabumulih'),
(25, 5, 'Bengkulu'),
(26, 6, 'Dumai'),
(27, 6, 'Pekanbaru'),
(28, 7, 'Batam'),
(29, 7, 'Tanjungpinang'),
(30, 8, 'Sungai Penuh'),
(31, 8, 'Jambi'),
(32, 9, 'Bandar Lampung'),
(33, 9, 'Metro'),
(34, 10, 'Pangkalpinang'),
(35, 11, 'Pontianak'),
(36, 11, 'Singkawang'),
(37, 12, 'Balikpapan'),
(38, 12, 'Bontang'),
(39, 12, 'Samarinda'),
(40, 12, 'Nusantara'),
(41, 13, 'Banjarbaru'),
(42, 13, 'Banjarmasin'),
(43, 14, 'Palangka Raya'),
(44, 15, 'Tarakan'),
(45, 16, 'Cilegon'),
(46, 16, 'Serang'),
(47, 16, 'Tangerang'),
(48, 16, 'Tangerang Selatan'),
(49, 17, 'Kota Administrasi Jakarta Barat'),
(50, 17, 'Kota Administrasi Jakarta Pusat'),
(51, 17, 'Kota Administrasi Jakarta Selatan'),
(52, 17, 'Kota Administrasi Jakarta Utara'),
(53, 18, 'Bandung'),
(54, 18, 'Bekasi'),
(55, 18, 'Bogor'),
(56, 18, 'Cimahi'),
(57, 18, 'Cirebon'),
(58, 18, 'Depok'),
(59, 18, 'Sukabumi'),
(60, 18, 'Tasikmalaya'),
(61, 18, 'Banjar'),
(62, 19, 'Magelang'),
(63, 19, 'Pekalongan'),
(64, 19, 'Salatiga'),
(65, 19, 'Semarang'),
(66, 19, 'Surakarta'),
(67, 19, 'Tegal'),
(68, 20, 'Batu'),
(69, 20, 'Blitar'),
(70, 20, 'Kediri'),
(71, 20, 'Madiun'),
(72, 20, 'Malang'),
(73, 20, 'Mojokerto'),
(74, 20, 'Pasuruan'),
(75, 20, 'Probolinggo'),
(76, 20, 'Surabaya'),
(77, 21, 'Denpasar'),
(78, 22, 'Kupang'),
(79, 23, 'Bima'),
(80, 23, 'Mataram'),
(81, 24, 'Gorontalo'),
(82, 25, 'Majene'),
(83, 26, 'Palu'),
(84, 27, 'Bitung'),
(85, 27, 'Kotamobagu'),
(86, 27, 'Manado'),
(87, 27, 'Tomohon'),
(88, 28, 'Bau-Bau'),
(89, 28, 'Kendari'),
(90, 29, 'Makassar'),
(91, 29, 'Palopo'),
(92, 29, 'Parepare'),
(93, 30, 'Ternate'),
(94, 30, 'Tidore Kepulauan'),
(95, 31, 'Ambon'),
(96, 31, 'Tual'),
(97, 32, 'Sorong'),
(98, 33, 'Jayapura'),
(99, 33, 'Wamena'),
(100, 34, 'Timika'),
(101, 35, 'Merauke'),
(102, 36, 'Fakfak');

-- --------------------------------------------------------

--
-- Table structure for table `comment`
--

CREATE TABLE `comment` (
  `id_comment` varchar(100) NOT NULL,
  `id_seller` varchar(100) NOT NULL,
  `id_cust` varchar(100) NOT NULL,
  `description` varchar(255) NOT NULL,
  `createdAt` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `comment`
--

INSERT INTO `comment` (`id_comment`, `id_seller`, `id_cust`, `description`, `createdAt`) VALUES
('aCRDNUXLfPnRx87r', 'h7tj6Qyf8UPtgafJ', 'X6Yi6FpPDUPQ7yBP', 'enak banget makanan nya', '2024-05-25 13:02:42');

-- --------------------------------------------------------

--
-- Table structure for table `customer`
--

CREATE TABLE `customer` (
  `id_cust` varchar(30) NOT NULL,
  `name` varchar(45) NOT NULL,
  `nomorWA` varchar(45) NOT NULL,
  `address` varchar(50) NOT NULL,
  `city_id` int(10) NOT NULL,
  `city_province_id` int(10) NOT NULL,
  `user_user_id` varchar(40) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `customer`
--

INSERT INTO `customer` (`id_cust`, `name`, `nomorWA`, `address`, `city_id`, `city_province_id`, `user_user_id`) VALUES
('X6Yi6FpPDUPQ7yBP', 'korkor', '082115759568', 'margaasih', 1, 1, 'Pf3Cfof-i7s03HDY'),
('Hz_ZwUmRO959iYj1', 'ferdian afza', '082127015766', 'bandung', 1, 1, 'lzxA8-2rdDWjNmhT'),
('nFDI6M9qBawpm3O1', 'ferdian afza', '082127015766', 'bandung', 1, 1, 'A2pZ2__E3UiB4UuN'),
('T9WnXW-KSfmk22yA', 'ferdian afza', '082127015766', 'bandung', 1, 1, '_8QBaL2dUsCORucP'),
('GFEiNMIwM0Dk_7S5', 'ferdian afza', '082127015766', 'bandung', 1, 1, 'Gj8Y4br9IRvvA757'),
('NQkvkXpjfXnJqE5I', 'ferdian afza', '082127015766', 'bandung', 1, 1, 'E01R913XOLQOKH3Y'),
('XAy-pSipbWNRJCD_', 'ferdian afza', '082127015766', 'bandung', 1, 1, 'p7t-_VzIpfFSwNvS'),
('_w1qYAJBLK_1VACP', 'korkor', '082115759568', 'margaasih', 1, 1, '_bLfQrdmTWwg-sjy'),
('BQSWA6MbQGAcbem9', 'ferdian afza', '082127015766', 'bandung', 1, 1, 'uq2bJd6t42Wz7YQ_');

-- --------------------------------------------------------

--
-- Table structure for table `food`
--

CREATE TABLE `food` (
  `id` varchar(100) NOT NULL,
  `seller_id` varchar(100) NOT NULL,
  `seller_city_id` int(10) NOT NULL,
  `name` varchar(150) NOT NULL,
  `price` int(25) NOT NULL,
  `stock` int(20) NOT NULL,
  `status` tinyint(1) NOT NULL,
  `photo` varchar(250) NOT NULL,
  `description` varchar(150) NOT NULL,
  `expireDate` varchar(50) NOT NULL,
  `pickUpTimeStart` time NOT NULL,
  `pickUpTimeEnd` time NOT NULL,
  `createdAt` varchar(100) NOT NULL,
  `updatedAt` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `food`
--

INSERT INTO `food` (`id`, `seller_id`, `seller_city_id`, `name`, `price`, `stock`, `status`, `photo`, `description`, `expireDate`, `pickUpTimeStart`, `pickUpTimeEnd`, `createdAt`, `updatedAt`) VALUES
('a6fWAxvBBCHOxQa1', 'ug7M7mFqhagndXeN', 1, 'kuah soto', 5000, 1, 1, '1715778679740-mcqueen.jpeg', 'kauh soto enak', '23.00 15/05/2024', '00:00:00', '00:00:00', '2024-05-15 20:11:19', '2024-05-15 20:11:19'),
('WidTuFbUUDb-jTnb', 'ug7M7mFqhagndXeN', 1, 'Donat Madu', 3000, 10, 1, '1715778734162-mcqueen.jpeg', 'kauh soto enak', '23.00 15/05/2024', '00:00:00', '00:00:00', '2024-05-15 20:12:14', '2024-05-15 20:12:14'),
('Q0zNKIjkw9ES5zsu', 'ug7M7mFqhagndXeN', 1, 'donat madu enak', 50000, 0, 0, 'Sj0e4sGpgs9Y1jge.jpeg', 'enak bos', '23.20 15/05/2024', '00:00:00', '00:00:00', '2024-05-15 20:26:39', '2024-05-15 21:39:16'),
('nJb5IudXbn72sP8n', 'ug7M7mFqhagndXeN', 1, 'Donat Madu susu', 3000, 10, 1, 'TyZ_lVxgVA-Bq8n5.png', 'kauh soto enak', '23.00 15/05/2024', '00:00:00', '00:00:00', '2024-05-15 22:33:57', '2024-05-15 22:33:57'),
('dA_MSO-9g6qlTzKd', 'lRB4146MGMwNYmUO', 1, 'Donat Madu susu', 3000, 10, 1, 'm47HjZGihAiGwNCk.png', 'kauh soto enak', '23.00 15/05/2024', '20:00:00', '23:00:00', '2024-05-17 21:39:15', '2024-05-17 21:39:15'),
('KRKfGBCd9NtsIMeI', 'lRB4146MGMwNYmUO', 1, 'Bola Bola susu', 1000, 10, 1, 'jRReEobbD_3NwFKI.png', 'bola bola susu enak', '23.00 15/05/2024', '20:00:00', '23:00:00', '2024-05-17 21:40:07', '2024-05-17 21:40:07'),
('b7J0UTwT0KSqmVMd', 'lRB4146MGMwNYmUO', 1, 'Bola Bola susu 2', 1000, 10, 1, 'l6bGduLXFngAybCq.png', 'bola bola susu enak', '23.00 15/05/2024', '20:00:00', '23:00:00', '2024-05-17 21:42:06', '2024-05-17 21:42:06'),
('8qtSUnIe5TZsBcv8', '3aNiqF5g2FnpgtQH', 1, 'aws susu teh', 50000, 10, 1, '5J0xC9fGUiXhprx9.png', 'enak bos', '23.20 15/05/2024', '21:00:00', '23:30:00', '2024-05-28 23:30:49', '2024-05-29 00:10:39');

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `order_id` varchar(20) NOT NULL,
  `food_id` varchar(100) NOT NULL,
  `seller_id` varchar(150) NOT NULL,
  `customer_id` varchar(100) NOT NULL,
  `amount` varchar(100) NOT NULL,
  `price` varchar(100) NOT NULL,
  `status` enum('diterima','diproses','selesai','dibatalkan') NOT NULL,
  `createdAt` varchar(100) NOT NULL,
  `updatedAt` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`order_id`, `food_id`, `seller_id`, `customer_id`, `amount`, `price`, `status`, `createdAt`, `updatedAt`) VALUES
('4mwDO3iEpUh5pHvi', 'nJb5IudXbn72sP8n', 'ug7M7mFqhagndXeN', 'nFDI6M9qBawpm3O1', '1', '3000', 'diproses', '2024-05-15 22:34:44', '2024-05-21 20:10:09'),
('XSkgKwbawa0UJf6I', 'a6fWAxvBBCHOxQa1', 'ug7M7mFqhagndXeN', 'X6Yi6FpPDUPQ7yBP', '1', '5000', 'diterima', '2024-06-06 11:36:26', '2024-06-06 11:36:26'),
('a8y1ihVSFmZmOLVT', 'a6fWAxvBBCHOxQa1', 'ug7M7mFqhagndXeN', 'X6Yi6FpPDUPQ7yBP', '1', '5000', 'diterima', '2024-06-06 11:37:50', '2024-06-06 11:37:50'),
('LVCsguJXaVPctOAG', 'a6fWAxvBBCHOxQa1', 'ug7M7mFqhagndXeN', 'X6Yi6FpPDUPQ7yBP', '1', '5000', 'diterima', '2024-06-06 11:41:11', '2024-06-06 11:41:11'),
('7CIyNbXePu6y1boT', 'a6fWAxvBBCHOxQa1', 'ug7M7mFqhagndXeN', 'X6Yi6FpPDUPQ7yBP', '1', '5000', 'diterima', '2024-06-07 20:35:33', '2024-06-07 20:35:33');

-- --------------------------------------------------------

--
-- Table structure for table `province`
--

CREATE TABLE `province` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `province`
--

INSERT INTO `province` (`id`, `name`) VALUES
(1, 'Aceh'),
(2, 'Sumatera Utara'),
(3, 'Sumatera Barat'),
(4, 'Sumatera Selatan'),
(5, 'Bengkulu'),
(6, 'Riau'),
(7, 'Kepulauan Riau'),
(8, 'Jambi'),
(9, 'Lampung'),
(10, 'Kepulauan Bangka Belitung'),
(11, 'Kalimantan Barat'),
(12, 'Kalimantan Timur'),
(13, 'Kalimantan Selatan'),
(14, 'Kalimantan Tengah'),
(15, 'Kalimantan Utara'),
(16, 'Banten'),
(17, 'DKI Jakarta'),
(18, 'Jawa Barat'),
(19, 'Jawa Tengah'),
(20, 'DI Yogyakarta'),
(21, 'Jawa Timur'),
(22, 'Bali'),
(23, 'Nusa Tenggara Timur'),
(24, 'Nusa Tenggara Barat'),
(25, 'Gorontalo'),
(26, 'Sulawesi Barat'),
(27, 'Sulawesi Tengah'),
(28, 'Sulawesi Utara'),
(29, 'Sulawesi Tenggara'),
(30, 'Sulawesi Selatan'),
(31, 'Maluku Utara'),
(32, 'Maluku'),
(33, 'Papua Barat'),
(34, 'Papua'),
(35, 'Papua Pegunungan'),
(36, 'Papua Selatan'),
(37, 'Papua Barat Daya');

-- --------------------------------------------------------

--
-- Table structure for table `seller`
--

CREATE TABLE `seller` (
  `id_seller` varchar(100) NOT NULL,
  `name` varchar(50) NOT NULL,
  `desc` varchar(50) NOT NULL,
  `nomorWA` varchar(50) NOT NULL,
  `address` varchar(50) NOT NULL,
  `city_id` int(10) NOT NULL,
  `city_province_id` int(10) NOT NULL,
  `user_user_id` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `seller`
--

INSERT INTO `seller` (`id_seller`, `name`, `desc`, `nomorWA`, `address`, `city_id`, `city_province_id`, `user_user_id`) VALUES
('h7tj6Qyf8UPtgafJ', 'korkor', 'yuhu ini warung kornel', '082115759568', 'margaasih', 1, 1, '1d_yWGuBE9rG9moU'),
('ug7M7mFqhagndXeN', 'kornelius', 'toko kue donat', '082115759568', 'bandung', 1, 1, 'oSHPuh8329roMfFs'),
('lRB4146MGMwNYmUO', 'kornelius', 'toko kue donat', '082115759568', 'bandung', 1, 1, '8Jof8yVwdC2zPJPD'),
('3aNiqF5g2FnpgtQH', 'awsseller', 'ini update', '082115759568', 'margaasih', 1, 1, 'KaEyeor-7C4C5OZ6');

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `user_id` varchar(50) NOT NULL,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(200) NOT NULL,
  `role` enum('customer','seller','admin') NOT NULL,
  `createdAt` varchar(100) NOT NULL,
  `updatedAt` varchar(100) NOT NULL,
  `photo` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`user_id`, `username`, `email`, `password`, `role`, `createdAt`, `updatedAt`, `photo`) VALUES
('Pf3Cfof-i7s03HDY', 'FERDIAN HIDAYAT', 'afsaafza@gmail.com', '$2b$10$tPzvXA/N8Ym93VO6hR3pGOF2XZoaV0L1vtiFajMSMjaf1Tc7uJ3BO', 'customer', '2024-05-15T07:32:57.418Z', '2024-05-25 14:15:40', 'xWYjF9cD8sXwdkY8.png'),
('lzxA8-2rdDWjNmhT', 'afsa', 'afsa2@gmail.com', '$2b$10$1kAvc0yMofbAjA328Jm.Weh0biJvCK.MWGG.D86wVvnk7rKxyrv/q', 'customer', '2024-05-15 14:42:52', '2024-05-15 14:42:52', '1715758972321-Screenshot_6.png'),
('1d_yWGuBE9rG9moU', 'Kornelius bosku', 'mamangkornel@gmail.com', '$2b$10$wjFWpXlEu78gwnRiGdrqJe9Hc9FWZ9bfMVJc/qvBxbJ5okHNjr.1i', 'seller', '2024-05-15 15:03:41', '2024-05-25 14:18:32', 'lWtGRhahYfnhPbhP.png'),
('1ZZgaip1rA4lNgjb', 'admin', 'admin@gmail.com', '$2b$10$bKyBAvlyDyztKjsvoZsSdOcDzBRVnYlX2uVyXcs5PIvuALAKC8ZCq', 'admin', '2024-05-15 15:11:11', '2024-05-15 15:11:11', '1715760670926-mcqueen.jpeg'),
('oSHPuh8329roMfFs', 'kornel', 'kornel2@gmail.com', '$2b$10$CQvjnsMPvAGUPcJcY07dUuIJn/3YDc/IABNjaUcTTSlgefs25espq', 'seller', '2024-05-15 15:47:18', '2024-05-15 15:47:18', '1715762838672-mcqueen.jpeg'),
('A2pZ2__E3UiB4UuN', 'afsa', 'afsa3@gmail.com', '$2b$10$5.K6hKtqgjuBY9bk.BDvPus5J88/uiiOnQLcW2462EWWEzOe.PbyK', 'customer', '2024-05-15 15:47:55', '2024-05-15 15:47:55', '1715762875673-Screenshot_6.png'),
('0pOCPZW6EzLThPfq', 'admin', 'admin2@gmail.com', '$2b$10$i6UVJo31T3Q7pugWFCuoMuw3Zqf2O3c6CPF5iLbT/ft1Xl6n2fety', 'admin', '2024-05-15 15:49:30', '2024-05-15 15:49:30', '1715762969951-mcqueen.jpeg'),
('_8QBaL2dUsCORucP', 'cs1', 'cs@gmail.com', '$2b$10$mRjNz04d1naY9Dm3aSJ5hO5o2TZkezYPbJzmgWehKT8KLs0Yy56c6', 'customer', '2024-05-16 15:41:01', '2024-05-16 15:41:01', 'U2_uBOoHf31IBEtJ.png'),
('H9O2l49FzCGFstW-', 'admin5', 'admin5@gmail.com', '$2b$10$HIxmTEC7WHD3v6aIRes2nu80LM6iRHVFDo/tHc8en0aaGGVtr9dD.', 'admin', '2024-05-16 15:41:46', '2024-05-16 15:41:46', 'Mg_2AWCZN3_I9XnL.jpeg'),
('8Jof8yVwdC2zPJPD', 'seller', 'seller@gmail.com', '$2b$10$cU3.6/1yJr9zV1tBnZ.dEuFnScA2aex2g9.XAxFzU1B9lBV.5akg6', 'seller', '2024-05-16 15:42:24', '2024-05-16 15:42:24', 'mEWpsZUVHgzrP_Iy.jpeg'),
('Gj8Y4br9IRvvA757', 'csaws2', 'csaws2@gmail.com', '$2b$10$bWHA48h.Yiy0FLpvT/tljOfc8FFT3EgZlaNCt1VuYYZJ/csku6u7S', 'customer', '2024-05-28 22:27:26', '2024-05-28 22:27:26', 'https://photo-foodbless.s3.ap-southeast-1.amazonaw'),
('E01R913XOLQOKH3Y', 'csaws3', 'csaws3@gmail.com', '$2b$10$awNzdymTbkawoL8n4oy0au4HR7hur6QjNK7lICBt7C0/F8BboiTYa', 'customer', '2024-05-28 22:31:54', '2024-05-28 22:31:54', 'https://photo-foodbless.s3.ap-southeast-1.amazonaws.com/storage_folder/I-tMxB0UR20w-Cax.png'),
('p7t-_VzIpfFSwNvS', 'csaws5', 'csaws5@gmail.com', '$2b$10$w9Q8LTmx1GaPOtAEP4TW1.Dbj/cCqZeTS3uaYdPSc74kNF.sg9oXC', 'customer', '2024-05-28 22:39:45', '2024-05-28 22:39:45', 'IDm3B9glyG2V0yN_.png'),
('_bLfQrdmTWwg-sjy', 'CSAWS', 'csawsbos@gmail.com', '$2b$10$QsBVTRZ9Y2JGeRY4q/kRi.32MugPCEQNskBYTpbN4QTdWGmMSuJlG', 'customer', '2024-05-28 22:41:07', '2024-05-28 23:21:46', 'e8FFyJaAteGSiwVz.png'),
('KaEyeor-7C4C5OZ6', 'AWSSELLER', 'awsseller@gmail.com', '$2b$10$HYqngd9J/W1MuiHYxzQe1.VCW3BPwRsk.I7HCrJWyJymEh2e1jFCa', 'seller', '2024-05-28 23:02:02', '2024-05-28 23:15:36', '5Cse4eBcvE57xP29.png'),
('fg2o-OOeUZyT15Ok', 'adminaws', 'adminaws@gmail.com', '$2b$10$2E7snSA0WNwcVsqXTmEEk.7hkMsm55ySEvnv4z2jIaxmwJQomKN7e', 'admin', '2024-05-28 23:02:43', '2024-05-28 23:02:43', 'AlMuWC1bsoH7caNX.jpeg'),
('uq2bJd6t42Wz7YQ_', 'csaws7', 'csaws7@gmail.com', '$2b$10$ADKqvNG2w1yzNvrR/VubhOStOgx7j9gpZe2tn8D2db1BTwF0gjm0C', 'customer', '2024-05-30 16:19:52', '2024-05-30 16:19:52', 'WlH45yhFf2UwN1IU.png');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `city`
--
ALTER TABLE `city`
  ADD PRIMARY KEY (`id`),
  ADD KEY `provinceId` (`provinceId`);

--
-- Indexes for table `province`
--
ALTER TABLE `province`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `city`
--
ALTER TABLE `city`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=103;

--
-- AUTO_INCREMENT for table `province`
--
ALTER TABLE `province`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=38;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `city`
--
ALTER TABLE `city`
  ADD CONSTRAINT `city_ibfk_1` FOREIGN KEY (`provinceId`) REFERENCES `province` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
