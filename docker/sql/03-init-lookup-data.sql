INSERT INTO `thairodregdb`.`user` (`id`,`email`,`password`,`firstName`,`lastName`,`contactNumber`,`role`,`isActive`) VALUES ('1', 'admin@admin.com', '$2b$10$Go/Kfd9B6HeZLDtXG3RHGuf1pi83psdqIg5K5KhM7y4E0JC1bcs9.', 'admin', 'thairod', '0123456789', 'admin', '1');

INSERT INTO `thairodregdb`.`department` (`label`,`isTrainingRequired`) VALUES ('แอดมินตอบ LINE', 1);
INSERT INTO `thairodregdb`.`department` (`label`,`isTrainingRequired`) VALUES ('คัดกรอง', 1);
INSERT INTO `thairodregdb`.`department` (`label`,`isTrainingRequired`) VALUES ('ส่งต่อประสานงาน', 0);
INSERT INTO `thairodregdb`.`department` (`label`,`isTrainingRequired`) VALUES ('พูดคุยกับผู้ป่วย', 1);
INSERT INTO `thairodregdb`.`department` (`label`,`isTrainingRequired`) VALUES ('IT Support', 0);
INSERT INTO `thairodregdb`.`department` (`label`,`isTrainingRequired`) VALUES ('จัดซื้อ/หาของ', 0);
INSERT INTO `thairodregdb`.`department` (`label`,`isTrainingRequired`) VALUES ('ประสานงานและเอกสาร', 0);
INSERT INTO `thairodregdb`.`department` (`label`,`isTrainingRequired`) VALUES ('แพทย์อาสา', 1);
INSERT INTO `thairodregdb`.`department` (`label`,`isTrainingRequired`) VALUES ('แพคและคลัง', 0);
INSERT INTO `thairodregdb`.`department` (`label`,`isTrainingRequired`) VALUES ('อบรมอาสาสมัคร', 1);
INSERT INTO `thairodregdb`.`department` (`label`,`isTrainingRequired`) VALUES ('เฝ้าระวัง', 1);

INSERT INTO `thairodregdb`.`specialized_field` (`label`) VALUES ('เวชปฏิบัติทั่วไป');
INSERT INTO `thairodregdb`.`specialized_field` (`label`) VALUES ('สูตินรีเวช');
INSERT INTO `thairodregdb`.`specialized_field` (`label`) VALUES ('อายุรกรรม');
INSERT INTO `thairodregdb`.`specialized_field` (`label`) VALUES ('ศัลยกรรม');
INSERT INTO `thairodregdb`.`specialized_field` (`label`) VALUES ('กุมารเวช');
INSERT INTO `thairodregdb`.`specialized_field` (`label`) VALUES ('อื่นๆ');