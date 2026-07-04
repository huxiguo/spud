-- 平台账号
CREATE TABLE `account` (
    `id`         CHAR(36)     NOT NULL COMMENT '主键',
    `username`   VARCHAR(50)  NOT NULL COMMENT '用户名',
    `password`   VARCHAR(255) NOT NULL COMMENT '密码（哈希）',
    `name`       VARCHAR(50)  NOT NULL COMMENT '显示名称',
    `allowLogin` TINYINT      NOT NULL COMMENT '是否允许登录',
    `createdAt`  BIGINT       NOT NULL COMMENT '创建时间（毫秒时间戳）',
    `createdBy`  CHAR(36)     NOT NULL COMMENT '创建人 ID',
    `updatedAt`  BIGINT       NULL     COMMENT '更新时间（毫秒时间戳）',
    `updatedBy`  CHAR(36)     NULL     COMMENT '更新人 ID',
    PRIMARY KEY (`id`),
    UNIQUE KEY `account_username_key` (`username`)
) COMMENT = '平台账号';