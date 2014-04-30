CREATE TABLE `users` (
  `id` int(5) NOT NULL AUTO_INCREMENT,
  `firstName` varchar(100) NOT NULL,
  `lastName` varchar(100) NOT NULL,
  `email` varchar(255) NOT NULL,
  `age` int(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `id` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

INSERT INTO `users` (`firstName`, `lastName`, `email`, `age`) VALUES ('Mitchell', 'Simoens', 'mitch@sencha.com', '30');
INSERT INTO `users` (`firstName`, `lastName`, `email`, `age`) VALUES ('John', 'Doe', 'john@gmail.com', '43');
