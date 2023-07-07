-- CreateTable
CREATE TABLE `adjustsalary` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `eid` INTEGER NULL,
    `asDate` DATE NULL,
    `beforeSalary` INTEGER NULL,
    `afterSalary` INTEGER NULL,
    `reason` VARCHAR(255) NULL,
    `remark` VARCHAR(255) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `appraise` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `eid` INTEGER NULL,
    `appDate` DATE NULL,
    `appResult` VARCHAR(32) NULL,
    `appContent` VARCHAR(255) NULL,
    `remark` VARCHAR(255) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `department` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(32) NULL,
    `parentId` INTEGER NULL,
    `depPath` VARCHAR(255) NULL,
    `enabled` BOOLEAN NULL DEFAULT true,
    `isParent` BOOLEAN NULL DEFAULT false,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `employee` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(10) NULL,
    `gender` CHAR(4) NULL,
    `birthday` DATE NULL,
    `idCard` CHAR(18) NULL,
    `wedlock` VARCHAR(191) NULL,
    `nationId` INTEGER NULL,
    `nativePlace` VARCHAR(20) NULL,
    `politicId` INTEGER NULL,
    `email` VARCHAR(20) NULL,
    `phone` VARCHAR(11) NULL,
    `address` VARCHAR(64) NULL,
    `departmentId` INTEGER NULL,
    `jobLevelId` INTEGER NULL,
    `posId` INTEGER NULL,
    `engageForm` VARCHAR(8) NULL,
    `tiptopDegree` VARCHAR(191) NULL,
    `specialty` VARCHAR(32) NULL,
    `school` VARCHAR(32) NULL,
    `beginDate` DATE NULL,
    `workState` VARCHAR(191) NULL DEFAULT 在职,
    `workID` CHAR(8) NULL,
    `contractTerm` DOUBLE NULL,
    `conversionTime` DATE NULL,
    `notWorkDate` DATE NULL,
    `beginContract` DATE NULL,
    `endContract` DATE NULL,
    `workAge` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `employeeec` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `eid` INTEGER NULL,
    `ecDate` DATE NULL,
    `ecReason` VARCHAR(255) NULL,
    `ecPoint` INTEGER NULL,
    `ecType` INTEGER NULL,
    `remark` VARCHAR(255) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `employeeremove` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `eid` INTEGER NULL,
    `afterDepId` INTEGER NULL,
    `afterJobId` INTEGER NULL,
    `removeDate` DATE NULL,
    `reason` VARCHAR(255) NULL,
    `remark` VARCHAR(255) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `employeetrain` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `eid` INTEGER NULL,
    `trainDate` DATE NULL,
    `trainContent` VARCHAR(255) NULL,
    `remark` VARCHAR(255) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `empsalary` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `eid` INTEGER NULL,
    `sid` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `hr` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(32) NULL,
    `phone` CHAR(11) NULL,
    `telephone` VARCHAR(16) NULL,
    `address` VARCHAR(64) NULL,
    `enabled` BOOLEAN NULL DEFAULT true,
    `username` VARCHAR(255) NULL,
    `password` VARCHAR(255) NULL,
    `userface` VARCHAR(255) NULL,
    `remark` VARCHAR(255) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `hr_role` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `hrid` INTEGER NULL,
    `rid` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `joblevel` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(32) NULL,
    `titleLevel` ENUM('zhenggaoji', 'fugaoji', 'zhongji', 'chuji', 'yuanji') NULL,
    `createDate` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `enabled` BOOLEAN NULL DEFAULT true,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `mail_send_log` (
    `msgId` VARCHAR(255) NULL,
    `empId` INTEGER NULL,
    `status` INTEGER NULL DEFAULT 0,
    `routeKey` VARCHAR(255) NULL,
    `exchange` VARCHAR(255) NULL,
    `count` INTEGER NULL,
    `tryTime` DATE NULL,
    `createTime` DATE NULL,
    `updateTime` DATE NULL
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `menu` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `url` VARCHAR(64) NULL,
    `path` VARCHAR(64) NULL,
    `component` VARCHAR(64) NULL,
    `name` VARCHAR(64) NULL,
    `iconCls` VARCHAR(64) NULL,
    `keepAlive` BOOLEAN NULL,
    `requireAuth` BOOLEAN NULL,
    `parentId` INTEGER NULL,
    `enabled` BOOLEAN NULL DEFAULT true,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `menu_role` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `mid` INTEGER NULL,
    `rid` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `msgcontent` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(64) NULL,
    `message` VARCHAR(255) NULL,
    `createDate` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `nation` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(32) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `oplog` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `addDate` DATE NULL,
    `operate` VARCHAR(255) NULL,
    `hrid` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `politicsstatus` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(32) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `position` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(32) NULL,
    `createDate` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `enabled` BOOLEAN NULL DEFAULT true,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `role` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(64) NULL,
    `nameZh` VARCHAR(64) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `salary` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `basicSalary` INTEGER NULL,
    `bonus` INTEGER NULL,
    `lunchSalary` INTEGER NULL,
    `trafficSalary` INTEGER NULL,
    `allSalary` INTEGER NULL,
    `pensionBase` INTEGER NULL,
    `pensionPer` FLOAT NULL,
    `createDate` TIMESTAMP(0) NULL,
    `medicalBase` INTEGER NULL,
    `medicalPer` FLOAT NULL,
    `accumulationFundBase` INTEGER NULL,
    `accumulationFundPer` FLOAT NULL,
    `name` VARCHAR(32) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sysmsg` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `mid` INTEGER NULL,
    `type` INTEGER NULL DEFAULT 0,
    `hrid` INTEGER NULL,
    `state` INTEGER NULL DEFAULT 0,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
