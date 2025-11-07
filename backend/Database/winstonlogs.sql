drop database if exists winstonlogs;
CREATE DATABASE IF NOT EXISTS winstonlogs;

CREATE TABLE `winstonlogs`.`infologs` (
 `id` INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
 `level` VARCHAR(16) NOT NULL,
 `message` TEXT NOT NULL,
 `timestamp` DATETIME NOT NULL);
 
use winstonLogs;
SELECT level, message, timestamp FROM infologs ORDER BY id DESC LIMIT 1;
select * from infologs;