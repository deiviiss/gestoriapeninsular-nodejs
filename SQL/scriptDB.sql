--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(16) NOT NULL,
  `password` varchar(45) NOT NULL,
  `fullname` varchar(100) NOT NULL,
  `zona` varchar(45) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=0 DEFAULT CHARSET=utf8;

--
-- Table structure for table `tramites`
--

DROP TABLE IF EXISTS `tramites`;

CREATE TABLE `tramites` (
  `idtramites` int(11) NOT NULL AUTO_INCREMENT,
  `cliente` varchar(60) NOT NULL,
  `curp` varchar(18) NOT NULL,
  `nss` bigint(11) NOT NULL,
  `afore` varchar(45) NOT NULL,
  `monto` int(11) NOT NULL,
  `scotizadas` int(11) NOT NULL,
  `sdescontadas` int(11) NOT NULL,
  `direccion` varchar(100) NOT NULL,
  `telefono` bigint(10) NOT NULL,
  `observaciones` text,
  `outsourcing` varchar(45) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `create_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`idtramites`),
  CONSTRAINT fk_user FOREIGN KEY(user_id) REFERENCES users(id)
) ENGINE=InnoDB AUTO_INCREMENT=0 DEFAULT CHARSET=utf8;