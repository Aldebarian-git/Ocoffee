SET
    client_encoding TO 'UTF8';

DROP TABLE IF EXISTS "coffees";
DROP TABLE IF EXISTS "admins";
DROP TABLE IF EXISTS "categories";

-- Création de la table categories
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE  
);

-- Création de la table coffees
CREATE TABLE coffees (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    reference VARCHAR(50) UNIQUE NOT NULL,
    origin VARCHAR(100) NOT NULL,
    price_per_kg DECIMAL(10, 2) NOT NULL,
    category_id INTEGER NOT NULL,  
    available BOOLEAN NOT NULL DEFAULT TRUE,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);

-- Création de la table admins
CREATE TABLE admins (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

-- Insertion des admins
INSERT INTO "admins" ("username", "password")
VALUES ('admin', 'admin');

-- Insertion des catégories
INSERT INTO "categories" ("id", "name") 
VALUES 
    (1, 'Corsé'),
    (2, 'Doux'),
    (3, 'Fruité'),
    (4, 'Acide'),
    (5, 'Chocolaté'),
    (6, 'Épicé');

-- Insertion des coffees
INSERT INTO "coffees" (
    "id",
    "name",
    "description",
    "reference",
    "origin",
    "price_per_kg",
    "category_id",
    "available"
)
VALUES
    (
        1,
        'Espresso',
        'Café fort et concentré préparé en faisant passer de l''eau chaude à travers du café finement moulu.',
        '100955890',
        'Italie',
        20.99,
        1,
        true
    ),
    (
        2,
        'Columbian',
        'Café moyennement corsé avec une acidité vive et une saveur riche.',
        '100955894',
        'Colombie',
        18.75,
        4,
        true
    ),
    (
        3,
        'Ethiopian Yirgacheffe',
        'Réputé pour son arôme floral, son acidité vive et ses notes de saveur citronnée.',
        '105589090',
        'Éthiopie',
        22.50,
        3,
        true
    ),
    (
        4,
        'Brazilian Santos',
        'Café doux et lisse avec un profil de saveur de noisette.',
        '134009550',
        'Brésil',
        17.80,
        2,
        true
    ),
    (
        5,
        'Guatemalan Antigua',
        'Café corsé avec des nuances chocolatées et une pointe d''épice.',
        '256505890',
        'Guatemala',
        21.25,
        1,
        true
    ),
    (
        6,
        'Kenyan AA',
        'Café complexe connu pour son acidité rappelant le vin et ses saveurs fruitées.',
        '295432730',
        'Kenya',
        23.70,
        4,
        true
    ),
    (
        7,
        'Sumatra Mandheling',
        'Café profond et terreux avec un corps lourd et une faible acidité.',
        '302932754',
        'Indonésie',
        19.95,
        1,
        true
    ),
    (
        8,
        'Costa Rican Tarrazu',
        'Café vif et net avec une finition propre et une acidité vive.',
        '327302954',
        'Costa Rica',
        24.50,
        4,
        true
    ),
    (
        9,
        'Vietnamese Robusta',
        'Café audacieux et fort avec une saveur robuste distinctive.',
        '549549090',
        'Vietnam',
        16.75,
        6,
        true
    ),
    (
        10,
        'Tanzanian Peaberry',
        'Acidité vive avec un profil de saveur rappelant le vin et un corps moyen.',
        '582954954',
        'Tanzanie',
        26.80,
        3,
        true
    ),
    (
        11,
        'Jamaican Blue Mountain',
        'Reconnu pour sa saveur douce, son acidité vive et son absence d''amertume.',
        '589100954',
        'Jamaïque',
        39.25,
        2,
        true
    ),
    (
        12,
        'Rwandan Bourbon',
        'Café avec des notes florales prononcées, une acidité vive et un corps moyen.',
        '650753915',
        'Rwanda',
        21.90,
        3,
        true
    ),
    (
        13,
        'Panamanian Geisha',
        'Café rare aux arômes floraux complexes, une acidité brillante et un profil de saveur distinctif.',
        '795501340',
        'Panama',
        42.00,
        3,
        true
    ),
    (
        14,
        'Peruvian Arabica',
        'Café équilibré avec des notes de chocolat, une acidité modérée et un corps velouté.',
        '954589100',
        'Pérou',
        19.40,
        5,
        false
    ),
    (
        15,
        'Hawaiian Kona',
        'Café rare au goût riche, une acidité douce et des nuances subtiles.',
        '958090105',
        'Hawaï',
        55.75,
        2,
        false
    ),
    (
        16,
        'Nicaraguan Maragogipe',
        'Café avec des notes de fruits, une acidité vive et un corps plein.',
        '691550753',
        'Nicaragua',
        28.60,
        3,
        false
    );

