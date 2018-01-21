-- create <lab>_orders table for labyoke
CREATE SEQUENCE IF NOT EXISTS initial_lab_orders_id_seq;
CREATE TABLE IF NOT EXISTS public.initial_lab_orders
(
    agent text,
    vendor text,
    catalognumber text,
    email text,
    requestoremail text,
    date date,
    status text,
    lab text,
    insufficient integer,
    insuffdate date,
    quantity integer,
    id integer NOT NULL DEFAULT nextval('initial_lab_orders_id_seq'::regclass),
    CONSTRAINT initial_lab_orders_pkey PRIMARY KEY (id)
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;
-- insert department for labyoke
INSERT INTO public.departments(
    id, departmentname, status)
    VALUES (12, 'initial_department', null);
-- insert lab for labyoke
INSERT INTO public.labs(
    labname, admin, department, isvenn, lid, disable)
    VALUES ('initial_lab', 'labyoke', 'initial_department', 0, 11, null);
-- insert labyoke user
INSERT INTO public.vm2016_users(
    id, password, name, active, changepwd_id, changepwd_status, email, changepwd_date, lab, surname, tel, admin, admin_assign, register_id, disable, lang, oninsuff, onfill)
    VALUES ('labyoke', '$2a$10$cDbJPVVMnqVT44UNc91gYuRScnfkUx.mQNdMmBkP6V.yUFmALdWa6', 'Lab', 1, null, null, 'labyoke@gmail.com', null, 'initial_lab', 'Yoke', null, 2, null, null, null, 'en', null, null);