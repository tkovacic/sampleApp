DROP TABLE parking_signage
DROP TABLE parking_data

CREATE TABLE parking_signage (
    id int IDENTITY(1,1) PRIMARY KEY,
    parking_deck VARCHAR(50),
    parking_deck_floor VARCHAR(50),
	parking_deck_count_type VARCHAR(50),
    parking_deck_count VARCHAR(50),
	parking_day VARCHAR(50)
);

INSERT INTO parking_signage VALUES ('300','1','standard','0','0000-00-00');
INSERT INTO parking_signage VALUES ('300','1','standard','0','2022-05-16');
INSERT INTO parking_signage VALUES ('300','1','ada','0','2022-05-16');
INSERT INTO parking_signage VALUES ('300','1','ev','0','2022-05-16');
INSERT INTO parking_signage VALUES ('300','2','standard','0','2022-05-16');
INSERT INTO parking_signage VALUES ('300','2','ada','0','2022-05-16');
INSERT INTO parking_signage VALUES ('300','2','ev','0','2022-05-16');

CREATE TABLE parking_data (
    id int IDENTITY(1,1) PRIMARY KEY,
    parking_deck VARCHAR(50),
    parking_deck_count_type VARCHAR(50),
    parking_deck_floor VARCHAR(50),
    parking_deck_diff VARCHAR(50),
	parking_timestamp VARCHAR(50)
);