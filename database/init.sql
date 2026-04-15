-- Tables de jonction
CREATE TABLE Ecole_Prof (
    ecole_id INT REFERENCES Ecole(id),
    prof_id  INT REFERENCES Prof(id),
    PRIMARY KEY (ecole_id, prof_id)
);

CREATE TABLE Prof_Eleve (
    prof_id  INT REFERENCES Prof(id),
    eleve_id INT REFERENCES Eleve(id),
    PRIMARY KEY (prof_id, eleve_id)
);

CREATE TABLE Classe_Cours (
    classe_id INT REFERENCES Classe(id),
    cours_id  INT REFERENCES Cours(id),
    PRIMARY KEY (classe_id, cours_id)
);

-- Tables principales
CREATE TABLE Ecole (
    id   SERIAL PRIMARY KEY,
    nom  VARCHAR(255) NOT NULL,
    paid BOOLEAN DEFAULT FALSE
);

CREATE TABLE Prof (
    id  SERIAL PRIMARY KEY,
    nom VARCHAR(255) NOT NULL
);

CREATE TABLE Classe (
    id  SERIAL PRIMARY KEY,
    nom VARCHAR(255) NOT NULL
);

CREATE TABLE Eleve (
    id        SERIAL PRIMARY KEY,
    nom       VARCHAR(255) NOT NULL,
    classe_id INT REFERENCES Classe(id)
);

CREATE TABLE Cours (
    id         SERIAL PRIMARY KEY,
    nom        VARCHAR(255) NOT NULL,
    created_by INT REFERENCES Prof(id),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE Lecon (
    id         SERIAL PRIMARY KEY,
    nom        VARCHAR(255) NOT NULL,
    cours_id   INT REFERENCES Cours(id),
    docs       TEXT,
    ordre      INT NOT NULL,
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE Exo_Pratique (
    id               SERIAL PRIMARY KEY,
    lecon_id         INT REFERENCES Lecon(id),
    consigne         TEXT NOT NULL,
    reponse_attendue TEXT NOT NULL
);

CREATE TABLE Quiz (
    id       SERIAL PRIMARY KEY,
    lecon_id INT REFERENCES Lecon(id)
);

CREATE TABLE Question (
    id      SERIAL PRIMARY KEY,
    quiz_id INT REFERENCES Quiz(id),
    enonce  TEXT NOT NULL,
    ordre   INT NOT NULL
);

CREATE TABLE Choix (
    id          SERIAL PRIMARY KEY,
    question_id INT REFERENCES Question(id),
    texte       VARCHAR(255) NOT NULL,
    est_correct BOOLEAN DEFAULT FALSE
);

CREATE TABLE Quiz_Resultat (
    id           SERIAL PRIMARY KEY,
    eleve_id     INT REFERENCES Eleve(id),
    quiz_id      INT REFERENCES Quiz(id),
    score        FLOAT NOT NULL,
    submitted_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE Reponse_Eleve (
    id               SERIAL PRIMARY KEY,
    quiz_resultat_id INT REFERENCES Quiz_Resultat(id),
    question_id      INT REFERENCES Question(id),
    choix_id         INT REFERENCES Choix(id)
);

CREATE TABLE Session (
    id          SERIAL PRIMARY KEY,
    eleve_id    INT REFERENCES Eleve(id),
    lecon_id    INT REFERENCES Lecon(id),
    exo_id      INT REFERENCES Exo_Pratique(id),
    contenu_exo TEXT,
    updated_at  TIMESTAMP DEFAULT NOW()
);

CREATE TABLE GenerateAI (
    id         SERIAL PRIMARY KEY,
    eleve_id   INT REFERENCES Eleve(id),
    cours_id   INT REFERENCES Cours(id),
    prompt     TEXT NOT NULL,
    output     TEXT,
    pending    BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);