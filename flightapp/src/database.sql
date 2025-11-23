-- phpMyAdmin SQL Dump
-- version 5.2.1-1.el7.remi
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Nov 23, 2025 at 02:08 PM
-- Server version: 8.0.44
-- PHP Version: 8.2.20

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `guox4155`
--

DELIMITER $$
--
-- Procedures
--
CREATE DEFINER=`guox4155`@`%` PROCEDURE `Get_Travelers` ()   SELECT *
FROM TRAVELERS$$

--
-- Functions
--
CREATE DEFINER=`guox4155`@`%` FUNCTION `full_name` (`first_name` LONGTEXT, `last_name` LONGTEXT) RETURNS LONGTEXT CHARSET utf8mb4 DETERMINISTIC RETURN CONCAT(first_name, " ", last_name)$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `AIRPORTS`
--

CREATE TABLE `AIRPORTS` (
  `IATA_AIRPORT_CODE` char(3) NOT NULL,
  `IACO_AIRPORT_CODE` char(4) NOT NULL,
  `AIRPORT_NAME` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `CITY` varchar(255) NOT NULL,
  `REGION` varchar(255) NOT NULL,
  `COUNTRY` varchar(255) NOT NULL,
  `DESCRIPTION` longtext NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `AIRPORTS`
--

INSERT INTO `AIRPORTS` (`IATA_AIRPORT_CODE`, `IACO_AIRPORT_CODE`, `AIRPORT_NAME`, `CITY`, `REGION`, `COUNTRY`, `DESCRIPTION`) VALUES
('CXH', 'CYHC', 'Vancouver Harbour Water Aerodrome', 'VANCOVER', 'British Columbia', 'Canada', 'A registered aerodrome located at Coal Harbour in Vancouver, British Columbia, Canada. The flight centre is within walking distance of the HeliJet heliport and Waterfront Station, a public transit hub in Downtown Vancouver.'),
('EWR', 'KEWR', 'Newark Liberty International Airport', 'NEW YORK CITY', 'NEW YORK', 'UNITED STATES', 'A major international airport serving the New York metropolitan area.'),
('HAC', 'RJTH', 'Hachijojima Airport', 'TOKYO', 'KANTO', 'JAPAN', 'A regional airport serving Hachijōjima in the southern Izu Islands, Tokyo, Japan.'),
('HND', 'RJTT', 'Tokyo International Airport', 'TOKYO', 'KANTO', 'JAPAN', 'Also called Haneda Airport '),
('JFK', 'KJFK', 'John F. Kennedy International Airport', 'NEW YORK CITY', 'NEW YORK', 'UNITED STATES', 'A major international airport serving New York City and its metropolitan area.'),
('LGA', 'KLGA', '\r\nLaGuardia Airport', 'NEW YORK CITY', 'NEW YORK', 'UNITED STATES', 'Colloquially known as LaGuardia or LGA, is a civil airport in East Elmhurst, Queens, New York City, United States, situated on the northwestern shore of Long Island, bordering Flushing Bay. '),
('NRT', 'RJJA', 'Narita International Airport', 'TOKYO', 'KANTO', 'JAPAN', 'Originally known as New Tokyo International Airport'),
('YTZ', 'CYTZ', 'Toronto/City Centre Airport', 'TORONTO', 'ONTARIO', 'CANADA', 'It is often referred to as Toronto Island Airport and was previously known as Port George VI Island Airport and Billy Bishop Toronto City Airport.'),
('YYZ', 'CYYZ', 'Toronto Pearson International Airport', 'TORONTO', 'ONTARIO', 'CANADA', 'An an international airport primarily located in Mississauga, Ontario, Canada. It is the main airport serving Toronto '),
('YZD', 'CYZD', 'Downsview Airport', 'TORONTO', 'ONTARIO', 'CANADA', 'closed and is now a a wholly owned subsidiary of the Public Sector Pension Investment Board.');

-- --------------------------------------------------------

--
-- Table structure for table `CITY`
--

CREATE TABLE `CITY` (
  `CITY` varchar(255) NOT NULL,
  `REGION` varchar(255) NOT NULL,
  `COUNTRY` varchar(255) NOT NULL,
  `POPULATION` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `CITY`
--

INSERT INTO `CITY` (`CITY`, `REGION`, `COUNTRY`, `POPULATION`) VALUES
('NEW YORK CITY', 'NEW YORK', 'UNITED STATES', 8400000),
('TOKYO', 'KANTO', 'JAPAN', 37000000),
('TORONTO', 'ONTARIO', 'CANADA', 3321565),
('VANCOVER', 'British Columbia', 'Canada', 766296);

-- --------------------------------------------------------

--
-- Table structure for table `FLIGHTS`
--

CREATE TABLE `FLIGHTS` (
  `TRIP_ID` int NOT NULL,
  `TRAVELER_ID` int NOT NULL,
  `START_PORT` char(3) NOT NULL,
  `END_PORT` char(3) NOT NULL,
  `COST` decimal(10,2) NOT NULL,
  `PURCHSE DATE` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `TRIP_DATE` date NOT NULL,
  `PAST_FLIGHT` tinyint(1) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `FLIGHTS`
--

INSERT INTO `FLIGHTS` (`TRIP_ID`, `TRAVELER_ID`, `START_PORT`, `END_PORT`, `COST`, `PURCHSE DATE`, `TRIP_DATE`, `PAST_FLIGHT`) VALUES
(1, 1, 'JFK', 'YYZ', 203.00, '2025-11-22 21:32:54', '2026-12-18', 0),
(2, 2, 'YYZ', 'NRT', 54234.00, '2025-11-22 21:34:26', '2026-05-31', 0),
(3, 3, 'NRT', 'HND', 1.00, '2025-11-22 21:35:02', '2028-03-10', 0),
(4, 4, 'HND', 'JFK', 21342.00, '2025-11-22 21:35:48', '2029-01-31', 0);

--
-- Triggers `FLIGHTS`
--
DELIMITER $$
CREATE TRIGGER `check_flight_date_before_insert` BEFORE INSERT ON `FLIGHTS` FOR EACH ROW BEGIN
    IF NEW.TRIP_DATE < CURDATE() THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'CANNOT BOOK FLIGHT BEFORE CURRENT DATE';
    END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `TERMINALS`
--

CREATE TABLE `TERMINALS` (
  `IATA_TERMINAL_CODE` char(3) NOT NULL,
  `CITY` varchar(255) NOT NULL,
  `REGION` varchar(255) NOT NULL,
  `COUNTRY` varchar(255) NOT NULL,
  `TYPE` set('RAILWAY','BUS','FERRY') NOT NULL,
  `TERMINAL_NAME` longtext NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `TERMINALS`
--

INSERT INTO `TERMINALS` (`IATA_TERMINAL_CODE`, `CITY`, `REGION`, `COUNTRY`, `TYPE`, `TERMINAL_NAME`) VALUES
('SGS', 'TOKYO', 'KANTO', 'JAPAN', 'RAILWAY', 'Shinagawa Station'),
('TYQ', 'TOKYO', 'KANTO', 'JAPAN', 'RAILWAY', 'Tokyo Station'),
('XEA', 'VANCOVER', 'British Columbia', 'Canada', 'RAILWAY', 'Pacific Central Station'),
('YBZ', 'TORONTO', 'ONTARIO', 'CANADA', 'RAILWAY', 'UNION STATION'),
('ZYP', 'NEW YORK CITY', 'NEW YORK', 'UNITED STATES', 'RAILWAY', 'New York Penn Station');

-- --------------------------------------------------------

--
-- Stand-in structure for view `TERMINAL_CITY_INFO`
-- (See below for the actual view)
--
CREATE TABLE `TERMINAL_CITY_INFO` (
`CITY` varchar(255)
,`COUNTRY` varchar(255)
,`IATA_TERMINAL_CODE` char(3)
,`POPULATION` int
,`REGION` varchar(255)
);

-- --------------------------------------------------------

--
-- Table structure for table `TRAVELERS`
--

CREATE TABLE `TRAVELERS` (
  `ID` int NOT NULL,
  `HOME_AIRPORT` char(3) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `Fname` varchar(255) NOT NULL DEFAULT 'JOHN',
  `Lname` varchar(255) NOT NULL DEFAULT 'DOE',
  `Bdate` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `TRAVELERS`
--

INSERT INTO `TRAVELERS` (`ID`, `HOME_AIRPORT`, `Fname`, `Lname`, `Bdate`) VALUES
(1, 'JFK', 'potato ', 'jack', '2015-11-24'),
(2, 'YYZ', 'GiveMeAnA+Please', 'ThankYou', '2025-11-28'),
(3, 'NRT', 'JOHN', 'DOE', '2025-11-03'),
(4, 'HND', 'BIG', 'GOOSE', '2025-11-01');

-- --------------------------------------------------------

--
-- Stand-in structure for view `TRAVELERS_CITY_INFO`
-- (See below for the actual view)
--
CREATE TABLE `TRAVELERS_CITY_INFO` (
`CITY` varchar(255)
,`COUNTRY` varchar(255)
,`ID` int
,`POPULATION` int
,`REGION` varchar(255)
);

-- --------------------------------------------------------

--
-- Table structure for table `TRAVELER_TERMINAL`
--

CREATE TABLE `TRAVELER_TERMINAL` (
  `TT_ID` int NOT NULL,
  `TRAVELER_ID` int NOT NULL,
  `TERMINAL_CODE` char(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `TRAVELER_TERMINAL`
--

INSERT INTO `TRAVELER_TERMINAL` (`TT_ID`, `TRAVELER_ID`, `TERMINAL_CODE`) VALUES
(1, 1, 'ZYP'),
(2, 2, 'TYQ'),
(3, 2, 'SGS');

-- --------------------------------------------------------

--
-- Structure for view `TERMINAL_CITY_INFO`
--
DROP TABLE IF EXISTS `TERMINAL_CITY_INFO`;

CREATE ALGORITHM=UNDEFINED DEFINER=`guox4155`@`%` SQL SECURITY DEFINER VIEW `TERMINAL_CITY_INFO`  AS SELECT `TERMINALS`.`IATA_TERMINAL_CODE` AS `IATA_TERMINAL_CODE`, `CITY`.`CITY` AS `CITY`, `CITY`.`REGION` AS `REGION`, `CITY`.`COUNTRY` AS `COUNTRY`, `CITY`.`POPULATION` AS `POPULATION` FROM (`TERMINALS` join `CITY`) WHERE ((`TERMINALS`.`CITY` = `CITY`.`CITY`) AND (`TERMINALS`.`REGION` = `CITY`.`REGION`) AND (`TERMINALS`.`COUNTRY` = `CITY`.`COUNTRY`)) ;

-- --------------------------------------------------------

--
-- Structure for view `TRAVELERS_CITY_INFO`
--
DROP TABLE IF EXISTS `TRAVELERS_CITY_INFO`;

CREATE ALGORITHM=UNDEFINED DEFINER=`guox4155`@`%` SQL SECURITY DEFINER VIEW `TRAVELERS_CITY_INFO`  AS SELECT `TRAVELERS`.`ID` AS `ID`, `CITY`.`CITY` AS `CITY`, `CITY`.`REGION` AS `REGION`, `CITY`.`COUNTRY` AS `COUNTRY`, `CITY`.`POPULATION` AS `POPULATION` FROM ((`TRAVELERS` join `AIRPORTS`) join `CITY`) WHERE ((`TRAVELERS`.`HOME_AIRPORT` = `AIRPORTS`.`IATA_AIRPORT_CODE`) AND (`AIRPORTS`.`CITY` = `CITY`.`CITY`) AND (`AIRPORTS`.`REGION` = `CITY`.`REGION`) AND (`AIRPORTS`.`COUNTRY` = `CITY`.`COUNTRY`)) ;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `AIRPORTS`
--
ALTER TABLE `AIRPORTS`
  ADD PRIMARY KEY (`IATA_AIRPORT_CODE`),
  ADD UNIQUE KEY `IACO_AIRPORT_CODE` (`IACO_AIRPORT_CODE`),
  ADD UNIQUE KEY `IACO_AIRPORT_CODE_2` (`IACO_AIRPORT_CODE`),
  ADD KEY `LOCATION` (`CITY`,`REGION`,`COUNTRY`),
  ADD KEY `AIRPORT_NAME` (`AIRPORT_NAME`);

--
-- Indexes for table `CITY`
--
ALTER TABLE `CITY`
  ADD PRIMARY KEY (`CITY`,`REGION`,`COUNTRY`);

--
-- Indexes for table `FLIGHTS`
--
ALTER TABLE `FLIGHTS`
  ADD PRIMARY KEY (`TRIP_ID`),
  ADD KEY `TRAVELER_RELATION` (`TRAVELER_ID`),
  ADD KEY `END` (`END_PORT`),
  ADD KEY `START` (`START_PORT`);

--
-- Indexes for table `TERMINALS`
--
ALTER TABLE `TERMINALS`
  ADD PRIMARY KEY (`IATA_TERMINAL_CODE`),
  ADD KEY `TERM_LOCATION` (`CITY`,`REGION`,`COUNTRY`);

--
-- Indexes for table `TRAVELERS`
--
ALTER TABLE `TRAVELERS`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `HOME_AIR` (`HOME_AIRPORT`);

--
-- Indexes for table `TRAVELER_TERMINAL`
--
ALTER TABLE `TRAVELER_TERMINAL`
  ADD PRIMARY KEY (`TT_ID`),
  ADD KEY `TRAVELER_TERMINAL_ibfk_1` (`TERMINAL_CODE`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `FLIGHTS`
--
ALTER TABLE `FLIGHTS`
  MODIFY `TRIP_ID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `TRAVELERS`
--
ALTER TABLE `TRAVELERS`
  MODIFY `ID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `TRAVELER_TERMINAL`
--
ALTER TABLE `TRAVELER_TERMINAL`
  MODIFY `TT_ID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `AIRPORTS`
--
ALTER TABLE `AIRPORTS`
  ADD CONSTRAINT `LOCATION` FOREIGN KEY (`CITY`,`REGION`,`COUNTRY`) REFERENCES `CITY` (`CITY`, `REGION`, `COUNTRY`) ON DELETE RESTRICT ON UPDATE RESTRICT;

--
-- Constraints for table `FLIGHTS`
--
ALTER TABLE `FLIGHTS`
  ADD CONSTRAINT `END` FOREIGN KEY (`END_PORT`) REFERENCES `AIRPORTS` (`IATA_AIRPORT_CODE`) ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT `START` FOREIGN KEY (`START_PORT`) REFERENCES `AIRPORTS` (`IATA_AIRPORT_CODE`) ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT `TRAVELER_RELATION` FOREIGN KEY (`TRAVELER_ID`) REFERENCES `TRAVELERS` (`ID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `TERMINALS`
--
ALTER TABLE `TERMINALS`
  ADD CONSTRAINT `TERM_LOCATION` FOREIGN KEY (`CITY`,`REGION`,`COUNTRY`) REFERENCES `CITY` (`CITY`, `REGION`, `COUNTRY`) ON DELETE RESTRICT ON UPDATE RESTRICT;

--
-- Constraints for table `TRAVELERS`
--
ALTER TABLE `TRAVELERS`
  ADD CONSTRAINT `HOME_AIR` FOREIGN KEY (`HOME_AIRPORT`) REFERENCES `AIRPORTS` (`IATA_AIRPORT_CODE`) ON DELETE RESTRICT ON UPDATE RESTRICT;

--
-- Constraints for table `TRAVELER_TERMINAL`
--
ALTER TABLE `TRAVELER_TERMINAL`
  ADD CONSTRAINT `TRAVELER_TERMINAL_ibfk_1` FOREIGN KEY (`TERMINAL_CODE`) REFERENCES `TERMINALS` (`IATA_TERMINAL_CODE`) ON DELETE CASCADE ON UPDATE CASCADE;

DELIMITER $$
--
-- Events
--
CREATE DEFINER=`guox4155`@`%` EVENT `FLIGHT_PASSED` ON SCHEDULE EVERY 1 DAY STARTS '2025-11-22 19:44:54' ON COMPLETION NOT PRESERVE ENABLE DO BEGIN
    UPDATE FLIGHTS
    SET PAST_FLIGHT = 1
    WHERE TRIP_DATE < CURDATE() AND PAST_FLIGHT != 1;
  END$$

DELIMITER ;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
