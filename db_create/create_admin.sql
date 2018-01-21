    id text NOT NULL,
    password text,
    name text,
    active integer,
    changepwd_id text,
    changepwd_status integer,
    email text,
    changepwd_date,
    lab text,
    surname,
    tel text,
    admin integer,
    admin_assign text,
    register_id text,
    disable integer,
    lang text,
    oninsuff integer,
    onfill integer,
    CONSTRAINT id_user PRIMARY KEY (id)



INSERT INTO public.vm2016_users(
    id, password, name, active, changepwd_id, changepwd_status, email, changepwd_date, lab, surname, tel, admin, admin_assign, register_id, disable, lang, oninsuff, onfill)
    VALUES ('labyoke', '$2a$10$cDbJPVVMnqVT44UNc91gYuRScnfkUx.mQNdMmBkP6V.yUFmALdWa6', 'Lab', 1, null, null, 'labyoke@gmail.com', null, 'initial', 'Yoke', null, 2, null, null, null, 'en', null, null);