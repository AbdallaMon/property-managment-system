

CREATE TABLE `UserProperty` (
    `userId` INT NOT NULL,
    `propertyId` INT NOT NULL,
    `assignedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`userId`, `propertyId`),
    CONSTRAINT `fk_user` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_property` FOREIGN KEY (`propertyId`) REFERENCES `Property`(`id`) ON DELETE CASCADE
);
