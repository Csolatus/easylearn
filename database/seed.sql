-- ============================================================
-- EasyLearn — Seed data for testing
-- Comptes demo + 2 cours publics avec leçons, quiz et exercices
-- Mots de passe :
--   super_admin  →  super@easylearn.dev  /  super123
--   school_admin →  admin@easylearn.dev  /  admin123
--   teacher      →  teacher@easylearn.dev / teacher123
--   student      →  student@easylearn.dev / student123
-- ============================================================

-- ============================================================
-- UTILISATEURS DEMO
-- ============================================================

INSERT INTO users (id, first_name, last_name, email, password, role) VALUES
  ('00000000-0000-0000-0000-000000000001', 'Super', 'Admin',   'super@easylearn.dev',   '$2b$12$Fs2as2PUzuPvObo7MT1o.O5jdffBpwPe0PENrlwcbJXLEQrZDRyNO', 'super_admin'),
  ('00000000-0000-0000-0000-000000000002', 'Alice', 'Martin',  'admin@easylearn.dev',   '$2b$12$aDLVybuV/hqLuHMKejcmwuLmoV7MiJj7EaKzkglr3gB6UCaWucF2q', 'school_admin'),
  ('00000000-0000-0000-0000-000000000003', 'Marc',  'Dupont',  'teacher@easylearn.dev', '$2b$12$pjyi1N44AVQJhNuJMzPg9uxp4yP4vayLCqOWmT4A9RUnNSWYTQCEW', 'teacher'),
  ('00000000-0000-0000-0000-000000000004', 'Emma',  'Bernard', 'student@easylearn.dev', '$2b$12$In/AqSyVQFsPCeWilG9Y3uDLBCZSou021QqbKGIPa3zkYWDMQO.1i', 'student');

-- ============================================================
-- ÉCOLE DEMO
-- ============================================================

INSERT INTO schools (id, name, email, website, address, is_active) VALUES
  ('00000000-0000-0000-0000-000000000010', 'École Demo EasyLearn', 'contact@demo-easylearn.fr', 'https://demo-easylearn.fr', '12 rue de la Paix, 75001 Paris', true);

-- Lier school_admin à l'école via une classroom (school_admin gère l'école via X-School-ID)
-- Lier le teacher à l'école
INSERT INTO school_teachers (id, school_id, teacher_id, status, joined_at) VALUES
  ('00000000-0000-0000-0000-000000000020', '00000000-0000-0000-0000-000000000010', '00000000-0000-0000-0000-000000000003', 'active', NOW());

-- ============================================================
-- COURS 1 : Introduction à Python (public)
-- ============================================================

INSERT INTO courses (id, title, created_by, visibility) VALUES
  ('00000000-0000-0000-0000-000000000100', 'Introduction à Python', '00000000-0000-0000-0000-000000000003', 'public');

-- Leçon 1 — Variables et types
INSERT INTO lessons (id, course_id, title, docs, ordre) VALUES
  ('00000000-0000-0000-0000-000000000101', '00000000-0000-0000-0000-000000000100',
   'Variables et types de données',
   '# Variables et types de données

## Qu''est-ce qu''une variable ?

Une variable est un espace de stockage en mémoire associé à un nom. En Python, il n''est pas nécessaire de déclarer le type — Python le déduit automatiquement.

```python
nom = "Alice"       # str
age = 25            # int
taille = 1.68       # float
est_etudiant = True # bool
```

## Les types principaux

| Type    | Exemple         | Description               |
|---------|-----------------|---------------------------|
| `int`   | `42`            | Nombre entier             |
| `float` | `3.14`          | Nombre décimal            |
| `str`   | `"bonjour"`     | Chaîne de caractères      |
| `bool`  | `True / False`  | Valeur booléenne          |
| `list`  | `[1, 2, 3]`     | Liste ordonnée            |
| `dict`  | `{"clé": val}`  | Dictionnaire clé-valeur   |

## La fonction `type()`

```python
x = 42
print(type(x))  # <class ''int''>
```

## Conversion de types

```python
age_str = "25"
age_int = int(age_str)   # 25
prix = float("9.99")     # 9.99
texte = str(100)         # "100"
```

## Bonnes pratiques

- Nommer ses variables en **snake_case** : `mon_age`, `premier_nom`
- Choisir des noms **explicites** : `prix_unitaire` plutôt que `p`
- Éviter les mots réservés Python : `list`, `type`, `id`, `print`…
',
   1);

-- Quiz leçon 1
INSERT INTO quizzes (id, lesson_id) VALUES
  ('00000000-0000-0000-0000-000000000111', '00000000-0000-0000-0000-000000000101');

INSERT INTO questions (id, quiz_id, statement, ordre) VALUES
  ('00000000-0000-0000-0000-000000000112', '00000000-0000-0000-0000-000000000111', 'Quel type Python représente le nombre 3.14 ?', 1),
  ('00000000-0000-0000-0000-000000000113', '00000000-0000-0000-0000-000000000111', 'Quelle convention de nommage est recommandée en Python ?', 2),
  ('00000000-0000-0000-0000-000000000114', '00000000-0000-0000-0000-000000000111', 'Que retourne type("hello") ?', 3);

INSERT INTO choices (id, question_id, text, is_correct) VALUES
  -- Q1
  ('00000000-0000-0000-0001-000000000001', '00000000-0000-0000-0000-000000000112', 'int', false),
  ('00000000-0000-0000-0001-000000000002', '00000000-0000-0000-0000-000000000112', 'float', true),
  ('00000000-0000-0000-0001-000000000003', '00000000-0000-0000-0000-000000000112', 'str', false),
  ('00000000-0000-0000-0001-000000000004', '00000000-0000-0000-0000-000000000112', 'double', false),
  -- Q2
  ('00000000-0000-0000-0001-000000000005', '00000000-0000-0000-0000-000000000113', 'camelCase', false),
  ('00000000-0000-0000-0001-000000000006', '00000000-0000-0000-0000-000000000113', 'PascalCase', false),
  ('00000000-0000-0000-0001-000000000007', '00000000-0000-0000-0000-000000000113', 'snake_case', true),
  ('00000000-0000-0000-0001-000000000008', '00000000-0000-0000-0000-000000000113', 'UPPER_CASE', false),
  -- Q3
  ('00000000-0000-0000-0001-000000000009', '00000000-0000-0000-0000-000000000114', '<class ''int''>', false),
  ('00000000-0000-0000-0001-000000000010', '00000000-0000-0000-0000-000000000114', '<class ''bool''>', false),
  ('00000000-0000-0000-0001-000000000011', '00000000-0000-0000-0000-000000000114', '<class ''str''>', true),
  ('00000000-0000-0000-0001-000000000012', '00000000-0000-0000-0000-000000000114', '<type string>', false);

-- Exercice pratique leçon 1
INSERT INTO practical_exercises (id, lesson_id, instructions, expected_output) VALUES
  ('00000000-0000-0000-0000-000000000115', '00000000-0000-0000-0000-000000000101',
   'Crée une variable `prenom` avec la valeur "Alice", une variable `age` avec la valeur 25, puis affiche : "Alice a 25 ans"',
   'Alice a 25 ans');


-- Leçon 2 — Conditions et boucles
INSERT INTO lessons (id, course_id, title, docs, ordre) VALUES
  ('00000000-0000-0000-0000-000000000102', '00000000-0000-0000-0000-000000000100',
   'Conditions et boucles',
   '# Conditions et boucles

## Les conditions : `if / elif / else`

```python
age = 18

if age >= 18:
    print("Majeur")
elif age >= 13:
    print("Adolescent")
else:
    print("Enfant")
```

Les opérateurs de comparaison : `==`, `!=`, `<`, `>`, `<=`, `>=`

Les opérateurs logiques : `and`, `or`, `not`

```python
if age >= 18 and age < 65:
    print("Adulte actif")
```

## La boucle `for`

```python
fruits = ["pomme", "banane", "cerise"]

for fruit in fruits:
    print(fruit)

# Avec range()
for i in range(5):   # 0, 1, 2, 3, 4
    print(i)
```

## La boucle `while`

```python
compteur = 0

while compteur < 5:
    print(compteur)
    compteur += 1
```

## `break` et `continue`

```python
for i in range(10):
    if i == 3:
        continue   # saute l''itération
    if i == 7:
        break      # arrête la boucle
    print(i)
```

## Astuce : `enumerate()`

```python
for index, valeur in enumerate(fruits):
    print(f"{index}: {valeur}")
# 0: pomme
# 1: banane
# 2: cerise
```
',
   2);

-- Quiz leçon 2
INSERT INTO quizzes (id, lesson_id) VALUES
  ('00000000-0000-0000-0000-000000000121', '00000000-0000-0000-0000-000000000102');

INSERT INTO questions (id, quiz_id, statement, ordre) VALUES
  ('00000000-0000-0000-0000-000000000122', '00000000-0000-0000-0000-000000000121', 'Que produit range(3) ?', 1),
  ('00000000-0000-0000-0000-000000000123', '00000000-0000-0000-0000-000000000121', 'Quel mot-clé permet de passer à l''itération suivante sans arrêter la boucle ?', 2);

INSERT INTO choices (id, question_id, text, is_correct) VALUES
  -- Q1
  ('00000000-0000-0000-0002-000000000001', '00000000-0000-0000-0000-000000000122', '1, 2, 3', false),
  ('00000000-0000-0000-0002-000000000002', '00000000-0000-0000-0000-000000000122', '0, 1, 2', true),
  ('00000000-0000-0000-0002-000000000003', '00000000-0000-0000-0000-000000000122', '0, 1, 2, 3', false),
  ('00000000-0000-0000-0002-000000000004', '00000000-0000-0000-0000-000000000122', '1, 2', false),
  -- Q2
  ('00000000-0000-0000-0002-000000000005', '00000000-0000-0000-0000-000000000123', 'break', false),
  ('00000000-0000-0000-0002-000000000006', '00000000-0000-0000-0000-000000000123', 'skip', false),
  ('00000000-0000-0000-0002-000000000007', '00000000-0000-0000-0000-000000000123', 'continue', true),
  ('00000000-0000-0000-0002-000000000008', '00000000-0000-0000-0000-000000000123', 'pass', false);

-- Exercice pratique leçon 2
INSERT INTO practical_exercises (id, lesson_id, instructions, expected_output) VALUES
  ('00000000-0000-0000-0000-000000000124', '00000000-0000-0000-0000-000000000102',
   'Écris une boucle for qui affiche les nombres de 1 à 5 (inclus), un par ligne.',
   '1
2
3
4
5');


-- Leçon 3 — Fonctions
INSERT INTO lessons (id, course_id, title, docs, ordre) VALUES
  ('00000000-0000-0000-0000-000000000103', '00000000-0000-0000-0000-000000000100',
   'Fonctions',
   '# Fonctions

## Définir une fonction

```python
def saluer(prenom):
    print(f"Bonjour, {prenom} !")

saluer("Alice")  # Bonjour, Alice !
```

## Valeur de retour

```python
def addition(a, b):
    return a + b

resultat = addition(3, 4)  # 7
```

## Valeurs par défaut

```python
def saluer(prenom, message="Bonjour"):
    print(f"{message}, {prenom} !")

saluer("Bob")              # Bonjour, Bob !
saluer("Bob", "Bonsoir")   # Bonsoir, Bob !
```

## Arguments nommés (kwargs)

```python
def creer_profil(nom, age, ville="Paris"):
    return f"{nom}, {age} ans, {ville}"

print(creer_profil(age=30, nom="Alice"))
# Alice, 30 ans, Paris
```

## Fonctions lambda

```python
carre = lambda x: x ** 2
print(carre(5))  # 25

# Utile avec map/filter
nombres = [1, 2, 3, 4, 5]
carres = list(map(lambda x: x**2, nombres))
# [1, 4, 9, 16, 25]
```

## Portée des variables (scope)

```python
x = 10  # variable globale

def ma_fonction():
    x = 20  # variable locale (différente)
    print(x)  # 20

ma_fonction()
print(x)  # 10
```
',
   3);

-- Quiz leçon 3
INSERT INTO quizzes (id, lesson_id) VALUES
  ('00000000-0000-0000-0000-000000000131', '00000000-0000-0000-0000-000000000103');

INSERT INTO questions (id, quiz_id, statement, ordre) VALUES
  ('00000000-0000-0000-0000-000000000132', '00000000-0000-0000-0000-000000000131', 'Quel mot-clé définit une fonction en Python ?', 1),
  ('00000000-0000-0000-0000-000000000133', '00000000-0000-0000-0000-000000000131', 'Que vaut addition(3, 4) si la fonction retourne a + b ?', 2),
  ('00000000-0000-0000-0000-000000000134', '00000000-0000-0000-0000-000000000131', 'Quelle syntaxe définit une fonction anonyme en Python ?', 3);

INSERT INTO choices (id, question_id, text, is_correct) VALUES
  -- Q1
  ('00000000-0000-0000-0003-000000000001', '00000000-0000-0000-0000-000000000132', 'function', false),
  ('00000000-0000-0000-0003-000000000002', '00000000-0000-0000-0000-000000000132', 'func', false),
  ('00000000-0000-0000-0003-000000000003', '00000000-0000-0000-0000-000000000132', 'def', true),
  ('00000000-0000-0000-0003-000000000004', '00000000-0000-0000-0000-000000000132', 'fn', false),
  -- Q2
  ('00000000-0000-0000-0003-000000000005', '00000000-0000-0000-0000-000000000133', '12', false),
  ('00000000-0000-0000-0003-000000000006', '00000000-0000-0000-0000-000000000133', '34', false),
  ('00000000-0000-0000-0003-000000000007', '00000000-0000-0000-0000-000000000133', '7', true),
  ('00000000-0000-0000-0003-000000000008', '00000000-0000-0000-0000-000000000133', '1', false),
  -- Q3
  ('00000000-0000-0000-0003-000000000009', '00000000-0000-0000-0000-000000000134', 'arrow x => x**2', false),
  ('00000000-0000-0000-0003-000000000010', '00000000-0000-0000-0000-000000000134', 'lambda x: x**2', true),
  ('00000000-0000-0000-0003-000000000011', '00000000-0000-0000-0000-000000000134', 'anon(x): x**2', false),
  ('00000000-0000-0000-0003-000000000012', '00000000-0000-0000-0000-000000000134', 'func x: x**2', false);

-- Exercice pratique leçon 3
INSERT INTO practical_exercises (id, lesson_id, instructions, expected_output) VALUES
  ('00000000-0000-0000-0000-000000000135', '00000000-0000-0000-0000-000000000103',
   'Écris une fonction `carre(n)` qui retourne le carré d''un nombre, puis affiche le résultat de carre(7).',
   '49');


-- ============================================================
-- COURS 2 : Les bases du JavaScript (public)
-- ============================================================

INSERT INTO courses (id, title, created_by, visibility) VALUES
  ('00000000-0000-0000-0000-000000000200', 'Les bases du JavaScript', '00000000-0000-0000-0000-000000000003', 'public');

-- Leçon 1 — Variables et const/let
INSERT INTO lessons (id, course_id, title, docs, ordre) VALUES
  ('00000000-0000-0000-0000-000000000201', '00000000-0000-0000-0000-000000000200',
   'Variables : var, let et const',
   '# Variables : var, let et const

## Les trois façons de déclarer une variable

### `var` (ancienne syntaxe, à éviter)
```javascript
var nom = "Alice";
```
Problème : portée fonction, peut être redéclaré, hoisting confus.

### `let` (valeur modifiable)
```javascript
let age = 25;
age = 26; // OK
```
Portée bloc `{}`, ne peut pas être redéclaré dans le même scope.

### `const` (valeur constante)
```javascript
const PI = 3.14;
// PI = 3.15; ❌ TypeError
```
La référence est constante, mais les objets/tableaux restent mutables :
```javascript
const fruits = ["pomme", "banane"];
fruits.push("cerise"); // OK !
// fruits = []; ❌ TypeError
```

## Types de données

```javascript
let texte   = "Bonjour";        // string
let nombre  = 42;               // number
let decimal = 3.14;             // number
let vrai    = true;             // boolean
let vide    = null;             // null
let inconnu = undefined;        // undefined
let obj     = { nom: "Alice" }; // object
let tab     = [1, 2, 3];        // object (Array)
```

## Template literals

```javascript
const prenom = "Alice";
const age = 25;
console.log(`${prenom} a ${age} ans`);
// Alice a 25 ans
```

## Vérifier le type

```javascript
typeof "hello"    // "string"
typeof 42         // "number"
typeof true       // "boolean"
typeof undefined  // "undefined"
typeof null       // "object" (particularité JS !)
typeof []         // "object"
```
',
   1);

-- Quiz leçon 1 JS
INSERT INTO quizzes (id, lesson_id) VALUES
  ('00000000-0000-0000-0000-000000000211', '00000000-0000-0000-0000-000000000201');

INSERT INTO questions (id, quiz_id, statement, ordre) VALUES
  ('00000000-0000-0000-0000-000000000212', '00000000-0000-0000-0000-000000000211', 'Quelle déclaration est recommandée pour une variable qui ne changera pas ?', 1),
  ('00000000-0000-0000-0000-000000000213', '00000000-0000-0000-0000-000000000211', 'Que retourne typeof null en JavaScript ?', 2),
  ('00000000-0000-0000-0000-000000000214', '00000000-0000-0000-0000-000000000211', 'Peut-on faire push() sur un tableau déclaré avec const ?', 3);

INSERT INTO choices (id, question_id, text, is_correct) VALUES
  -- Q1
  ('00000000-0000-0000-0004-000000000001', '00000000-0000-0000-0000-000000000212', 'var', false),
  ('00000000-0000-0000-0004-000000000002', '00000000-0000-0000-0000-000000000212', 'let', false),
  ('00000000-0000-0000-0004-000000000003', '00000000-0000-0000-0000-000000000212', 'const', true),
  ('00000000-0000-0000-0004-000000000004', '00000000-0000-0000-0000-000000000212', 'static', false),
  -- Q2
  ('00000000-0000-0000-0004-000000000005', '00000000-0000-0000-0000-000000000213', '"null"', false),
  ('00000000-0000-0000-0004-000000000006', '00000000-0000-0000-0000-000000000213', '"undefined"', false),
  ('00000000-0000-0000-0004-000000000007', '00000000-0000-0000-0000-000000000213', '"object"', true),
  ('00000000-0000-0000-0004-000000000008', '00000000-0000-0000-0000-000000000213', '"boolean"', false),
  -- Q3
  ('00000000-0000-0000-0004-000000000009', '00000000-0000-0000-0000-000000000214', 'Non, const interdit toute modification', false),
  ('00000000-0000-0000-0004-000000000010', '00000000-0000-0000-0000-000000000214', 'Oui, const fixe la référence pas le contenu', true),
  ('00000000-0000-0000-0004-000000000011', '00000000-0000-0000-0000-000000000214', 'Oui, mais seulement une fois', false),
  ('00000000-0000-0000-0004-000000000012', '00000000-0000-0000-0000-000000000214', 'Non, il faut utiliser let pour les tableaux', false);

-- Exercice pratique leçon 1 JS
INSERT INTO practical_exercises (id, lesson_id, instructions, expected_output) VALUES
  ('00000000-0000-0000-0000-000000000215', '00000000-0000-0000-0000-000000000201',
   'Déclare une constante `prenom` avec la valeur "Alice" et une variable `age` avec la valeur 30, puis affiche avec console.log : "Alice a 30 ans"',
   'Alice a 30 ans');


-- Leçon 2 — Fonctions et arrow functions
INSERT INTO lessons (id, course_id, title, docs, ordre) VALUES
  ('00000000-0000-0000-0000-000000000202', '00000000-0000-0000-0000-000000000200',
   'Fonctions et arrow functions',
   '# Fonctions et arrow functions

## Déclaration classique

```javascript
function addition(a, b) {
    return a + b;
}
console.log(addition(3, 4)); // 7
```

## Expression de fonction

```javascript
const multiplier = function(a, b) {
    return a * b;
};
```

## Arrow function (ES6)

```javascript
const addition = (a, b) => a + b;

// Corps sur plusieurs lignes
const saluer = (prenom) => {
    const message = `Bonjour, ${prenom} !`;
    return message;
};
```

Raccourcis :
- Un seul paramètre → parenthèses optionnelles : `x => x * 2`
- Retour direct → accolades et `return` optionnels : `(a, b) => a + b`

## Paramètres par défaut

```javascript
function saluer(prenom = "monde") {
    return `Bonjour, ${prenom} !`;
}
saluer();        // "Bonjour, monde !"
saluer("Alice"); // "Bonjour, Alice !"
```

## Fonctions d''ordre supérieur

```javascript
const nombres = [1, 2, 3, 4, 5];

// map — transforme chaque élément
const carres = nombres.map(n => n ** 2);
// [1, 4, 9, 16, 25]

// filter — garde les éléments qui passent le test
const pairs = nombres.filter(n => n % 2 === 0);
// [2, 4]

// reduce — accumule en une seule valeur
const somme = nombres.reduce((acc, n) => acc + n, 0);
// 15
```

## Différence arrow vs function classique

La principale différence concerne `this` :
- `function` : `this` dépend du contexte d''appel
- Arrow function : `this` hérite du contexte parent (lexical)
',
   2);

-- Quiz leçon 2 JS
INSERT INTO quizzes (id, lesson_id) VALUES
  ('00000000-0000-0000-0000-000000000221', '00000000-0000-0000-0000-000000000202');

INSERT INTO questions (id, quiz_id, statement, ordre) VALUES
  ('00000000-0000-0000-0000-000000000222', '00000000-0000-0000-0000-000000000221', 'Quelle syntaxe est une arrow function valide ?', 1),
  ('00000000-0000-0000-0000-000000000223', '00000000-0000-0000-0000-000000000221', 'Que fait la méthode .filter() sur un tableau ?', 2);

INSERT INTO choices (id, question_id, text, is_correct) VALUES
  -- Q1
  ('00000000-0000-0000-0005-000000000001', '00000000-0000-0000-0000-000000000222', 'function(x) => x * 2', false),
  ('00000000-0000-0000-0005-000000000002', '00000000-0000-0000-0000-000000000222', 'x => x * 2', true),
  ('00000000-0000-0000-0005-000000000003', '00000000-0000-0000-0000-000000000222', 'fn x: x * 2', false),
  ('00000000-0000-0000-0005-000000000004', '00000000-0000-0000-0000-000000000222', 'lambda x: x * 2', false),
  -- Q2
  ('00000000-0000-0000-0005-000000000005', '00000000-0000-0000-0000-000000000223', 'Elle transforme chaque élément', false),
  ('00000000-0000-0000-0005-000000000006', '00000000-0000-0000-0000-000000000223', 'Elle accumule les éléments en une valeur', false),
  ('00000000-0000-0000-0005-000000000007', '00000000-0000-0000-0000-000000000223', 'Elle retourne les éléments qui passent un test', true),
  ('00000000-0000-0000-0005-000000000008', '00000000-0000-0000-0000-000000000223', 'Elle trie le tableau', false);

-- Exercice pratique leçon 2 JS
INSERT INTO practical_exercises (id, lesson_id, instructions, expected_output) VALUES
  ('00000000-0000-0000-0000-000000000224', '00000000-0000-0000-0000-000000000202',
   'Utilise .filter() pour ne garder que les nombres pairs du tableau [1, 2, 3, 4, 5, 6], puis affiche le résultat avec console.log.',
   '[ 2, 4, 6 ]');


-- ============================================================
-- CLASSROOM DEMO + INSCRIPTION ÉTUDIANT
-- ============================================================

INSERT INTO classrooms (id, school_id, name, invite_code) VALUES
  ('00000000-0000-0000-0000-000000000300', '00000000-0000-0000-0000-000000000010', 'Classe Demo B2', 'DEMO2024');

INSERT INTO student_classrooms (student_id, classroom_id) VALUES
  ('00000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000300');

-- Assigner les 2 cours à la classe demo
INSERT INTO classroom_courses (classroom_id, course_id) VALUES
  ('00000000-0000-0000-0000-000000000300', '00000000-0000-0000-0000-000000000100'),
  ('00000000-0000-0000-0000-000000000300', '00000000-0000-0000-0000-000000000200');
