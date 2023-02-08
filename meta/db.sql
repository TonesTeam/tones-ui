
CREATE TABLE IF NOT EXISTS protocol_type (
  id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  type_name varchar(255) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS protocol (
  id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  protocol_name varchar(255) not NULL,
  creation_date DATETIME NOT NULL,
  comment TEXT,
  creator_id int NOT NULL,
  standard_temp int NOT NULL,
  protocol_type_id int NOT NULL,
  FOREIGN KEY (creator_id) REFERENCES user (id),
  FOREIGN KEY (protocol_type_id) REFERENCES protocol_type (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS protocol_xml (
  id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  xml BLOB NOT NULL,
  protocol_id int NOT NULL,
  FOREIGN KEY (protocol_id) REFERENCES protocol (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS step (
  id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  protocol_id int NOT NULL,
  sequence_order int NOT NULL,
  step_type varchar(255) CHECK(step_type in ('liquid_application', 'temperature_change','waiting')),
  FOREIGN KEY (protocol_id) REFERENCES protocol (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS liquid_application (
  id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  step_id int NOT NULL,
  liquid_id int NOT NULL,
  FOREIGN KEY (liquid_id) REFERENCES liquid (id),
  FOREIGN KEY (step_id) REFERENCES step (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS waiting (
  id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  waiting_time int NOT NULL,
  step_id int NOT NULL,
  FOREIGN KEY (step_id) REFERENCES step (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS temperature_change (
  id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  step_id int NOT NULL,
  target_temperature int NOT NULL,
  blocking BOOLEAN NOT NULL CHECK (blocking IN (0, 1)),
  FOREIGN KEY (step_id) REFERENCES step (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS user (
  id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  name varchar(255) not NULL,
  surname varchar(255) not NULL,
  role varchar(255)
);

CREATE table IF NOT EXISTS user_setting (
  id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  user_id int not NULL,
  setting varchar(255) not NULL,
  FOREIGN KEY (user_id) REFERENCES user (id)
);

CREATE TABLE IF NOT EXISTS protocol_deployment (
  id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  protocol_id int NOT NULL,
  user_id INT NOT NULL,
  start_time datetime NOT NULL,
  end_time DATETIME,
  number_of_slots int NOT NULL,
  FOREIGN KEY (protocol_id) REFERENCES protocol (id),
  FOREIGN KEY (user_id) REFERENCES user (id)
);

CREATE TABLE IF NOT EXISTS executed_step (
  id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  protocol_deployment_id int NOT NULL,
  step_id int NOT NULL,
  execution_datetime DATETIME NOT NULL,
  FOREIGN KEY (protocol_deployment_id) REFERENCES protocol_deployment (id),
  FOREIGN KEY (step_id) REFERENCES step (id)
);

CREATE TABLE IF NOT EXISTS liquid_type (
  id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  type_name varchar(255) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS liquid_sub_type (
  id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  sub_type_name varchar(255) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS liquid (
  id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  liquid_name VARCHAR(255) NOT NULL UNIQUE,
  liquid_type_id int NOT NULL,
  liquid_sub_type_id int NULL,
  FOREIGN KEY (liquid_type_id) REFERENCES liquid_type (id),
  FOREIGN KEY (liquid_sub_type_id) REFERENCES liquid_sub_type (id)
);

CREATE TABLE IF NOT EXISTS deployment_error (
  id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  error_id INT NOT NULL,
  deployment_id INT NOT NULL,
  FOREIGN KEY (error_id) REFERENCES error (id),
  FOREIGN KEY (deployment_id) REFERENCES protocol_deployment (id)
);

CREATE TABLE IF NOT EXISTS error (
  id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  code INT NOT NULL,
  error_type VARCHAR(255) NOT NULL CHECK(error_type in ('hardware', 'software','pebkac')),
  error_message TEXT
);

CREATE TABLE IF NOT EXISTS deployment_liquid_configuration (
  id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  protocol_deployment_id INT NOT NULL,
  liquid_slot_number INT NOT NULL,
  liquid_id INT NOT NULL,  
  liquid_amount INT NOT NULL,  
  FOREIGN KEY (protocol_deployment_id) REFERENCES protocol_deployment (id),
  FOREIGN KEY (liquid_id) REFERENCES liquid (id)
);


------ TEST DATA ------

INSERT INTO user (name, surname, role) VALUES ('John', 'Smith', 'Administrator');
INSERT INTO protocol_type (type_name) VALUES ("protocol type 1");
-- INSERT INTO protocol (protocol_name, creation_date, creator_id, standard_temp, protocol_type_id) VALUES ("alpha", date(), 1, 22, 1);
INSERT INTO liquid_type (type_name) VALUES ("Washing"), ("Deparafinization"), ("Reagent"), ("Blocking"), ("Antigen retrieval");
INSERT INTO liquid_sub_type (sub_type_name) VALUES ("black subtype"), ("red subtype"), ("Cat-A");
INSERT INTO liquid (liquid_name, liquid_type_id, liquid_sub_type_id) VALUES 
  ("Hematoxylin", (select id from liquid_type where type_name="Reagent"), (select id from liquid_sub_type where sub_type_name="Cat-A")),
  ("D-Water", (select id from liquid_type where type_name="Reagent"), (select id from liquid_sub_type where sub_type_name="Cat-A")),
  ("Eosin", (select id from liquid_type where type_name="Reagent"), (select id from liquid_sub_type where sub_type_name="Cat-A")),
  ("Tap-Water", (select id from liquid_type where type_name="Reagent"), (select id from liquid_sub_type where sub_type_name="Cat-A")),
  ("Ethanol 100%", (select id from liquid_type where type_name="Reagent"), (select id from liquid_sub_type where sub_type_name="Cat-A")),
  ("Ethanol 95%", (select id from liquid_type where type_name="Reagent"), (select id from liquid_sub_type where sub_type_name="Cat-A")),
  ("Xylene", (select id from liquid_type where type_name="Reagent"), (select id from liquid_sub_type where sub_type_name="Cat-A")),
  ("Tap Water", (select id from liquid_type where type_name="Washing"), NULL),
  ("Alcohol", (select id from liquid_type where type_name="Washing"), NULL),
  ("Formalin", (select id from liquid_type where type_name="Deparafinization"), NULL),
  ("Bovine serum albumin", (select id from liquid_type where type_name="Blocking"), NULL),
  ("Fish Gelatin", (select id from liquid_type where type_name="Blocking"), NULL),
  ("HistoReveal", (select id from liquid_type where type_name="Antigen retrieval"), NULL),
  ("Trypsin", (select id from liquid_type where type_name="Antigen retrieval"), NULL);

--- Temporary Data (sorta) ---
INSERT INTO protocol VALUES(2,'test_protocol','2022-06-06 10:17:17.387',NULL,1,12,1);
INSERT INTO step VALUES(1,2,1,'temperature_change');
INSERT INTO step VALUES(2,2,2,'liquid_application');
INSERT INTO step VALUES(3,2,3,'waiting');
INSERT INTO step VALUES(4,2,4,'liquid_application');
INSERT INTO step VALUES(5,2,5,'waiting');
INSERT INTO step VALUES(6,2,6,'liquid_application');
INSERT INTO step VALUES(7,2,7,'waiting');
INSERT INTO liquid_application VALUES(1,2,3);
INSERT INTO liquid_application VALUES(2,4,10);
INSERT INTO liquid_application VALUES(3,6,6);
INSERT INTO waiting VALUES(1,0,3);
INSERT INTO waiting VALUES(2,0,5);
INSERT INTO waiting VALUES(3,0,7);
INSERT INTO temperature_change VALUES(1,1,0,1);
INSERT INTO "protocol_xml"("id", "protocol_id", "xml") VALUES (NULL, 2, '<block xmlns="https://developers.google.com/blockly/xml" type="begin_protocol" id="2wwy![(Yq|u3jSBlzk3]" x="240" y="30"></block>');

--- Protocol 3 ---
INSERT INTO "protocol"("id", "protocol_name", "creation_date", "comment", "standard_temp", "creator_id", "protocol_type_id") VALUES (3, "new test", "2022-06-19 09:58:48.568", NULL, 12, 1, 1);
INSERT INTO "step"("id", "sequence_order", "step_type", "protocol_id") VALUES (NULL, 1, "liquid_application", 3);
INSERT INTO "step"("id", "sequence_order", "step_type", "protocol_id") VALUES (NULL, 2, "temperature_change", 3);
INSERT INTO "step"("id", "sequence_order", "step_type", "protocol_id") VALUES (NULL, 3, "liquid_application", 3);
INSERT INTO "step"("id", "sequence_order", "step_type", "protocol_id") VALUES (NULL, 4, "temperature_change", 3);
INSERT INTO "step"("id", "sequence_order", "step_type", "protocol_id") VALUES (NULL, 5, "waiting", 3);
INSERT INTO "step"("id", "sequence_order", "step_type", "protocol_id") VALUES (NULL, 6, "liquid_application",3);
INSERT INTO "step"("id", "sequence_order", "step_type", "protocol_id") VALUES (NULL, 7, "waiting", 3);
INSERT INTO "step"("id", "sequence_order", "step_type", "protocol_id") VALUES (NULL, 8, "liquid_application", 3);
INSERT INTO "step"("id", "sequence_order", "step_type", "protocol_id") VALUES (NULL, 9, "waiting", 3);
INSERT INTO "waiting"("id", "waiting_time", "step_id") VALUES (NULL, 180,12);
INSERT INTO "waiting"("id", "waiting_time", "step_id") VALUES (NULL, 180,14);
INSERT INTO "waiting"("id", "waiting_time", "step_id") VALUES (NULL, 120,16);
INSERT INTO "temperature_change"("id", "target_temperature", "blocking", "step_id") VALUES (NULL, 20,1,9);
INSERT INTO "temperature_change"("id", "target_temperature", "blocking", "step_id") VALUES (NULL, 20,1,11);
INSERT INTO "liquid_application"("id", "liquid_id", "step_id") VALUES (NULL, 1,8);
INSERT INTO "liquid_application"("id", "liquid_id", "step_id") VALUES (NULL, 1,10);
INSERT INTO "liquid_application"("id", "liquid_id", "step_id") VALUES (NULL, 11,13);
INSERT INTO "liquid_application"("id", "liquid_id", "step_id") VALUES (NULL, 5,15);
INSERT INTO "protocol_xml"("id", "protocol_id", "xml") VALUES (NULL, 3, '<block xmlns="https://developers.google.com/blockly/xml" type="begin_protocol" id="2wwy![(Yq|u3jSBlzk3]" x="240" y="30"><field name="protocol_name">new test</field><field name="type_1">type_1</field><field name="temp">12</field><statement name="protocol_content"><block type="apply_reagent" id="16Al#FGI:*D?JH-pqs|S"><field name="reagent_type">black subtype</field><field name="reagent">Schwartz reagent</field><field name="time">3</field><field name="times">2</field><field name="degrees">20</field><next><block type="apply_antigen_liquid" id="3n[Z_r1$IVkp=]q*y1|H"><field name="liquid">Trypsin</field><field name="time">3</field><next><block type="apply_washing_liquid" id="5pV=.gzKZ@_Fp?dJi`tj"><field name="liquid">Distilled Water</field><field name="time">2</field><field name="times">3</field></block></next></block></next></block></statement></block>');
--UPDATE "protocol_xml" SET "protocol_id" = 3 WHERE "id" IN (1);
