-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : dim. 28 déc. 2025 à 15:40
-- Version du serveur : 10.4.32-MariaDB
-- Version de PHP : 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `ecole_plus`
--

-- --------------------------------------------------------

--
-- Structure de la table `bulletins`
--

CREATE TABLE `bulletins` (
  `id` int(11) NOT NULL,
  `eleve_id` int(11) NOT NULL,
  `annee_scolaire` varchar(255) NOT NULL,
  `moyenne` decimal(5,2) DEFAULT NULL,
  `date_creation` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `classes`
--

CREATE TABLE `classes` (
  `id` int(11) NOT NULL,
  `nom` varchar(255) NOT NULL,
  `annee_scolaire` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `classes`
--

INSERT INTO `classes` (`id`, `nom`, `annee_scolaire`) VALUES
(1, '6ème', '2025-2026'),
(3, '5ème', '2025-2026'),
(5, '4ème', '2025-2026'),
(7, '3ème', '2025-2026'),
(9, '2nde A', 'undefined'),
(10, '2nde C', 'undefined'),
(11, '1ère A', '2025-2026'),
(12, '1ère D', '2025-2026'),
(13, 'Tle A', '2025-2026'),
(14, 'Tle D', '2025-2026'),
(15, '2nde D', '2023-2024'),
(16, '2nde B', '2023-2024'),
(17, '1ère B', '2023-2024'),
(18, '1ère C', '2023-2024'),
(19, 'Tle B', '2023-2024'),
(20, 'Tle C', '2023-2024');

-- --------------------------------------------------------

--
-- Structure de la table `classe_matiere_coeff`
--

CREATE TABLE `classe_matiere_coeff` (
  `classe_id` int(11) NOT NULL,
  `matiere_id` int(11) NOT NULL,
  `coefficient` decimal(4,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `classe_matiere_coeff`
--

INSERT INTO `classe_matiere_coeff` (`classe_id`, `matiere_id`, `coefficient`) VALUES
(1, 1, 2.00),
(1, 2, 3.00),
(1, 3, 2.00),
(1, 4, 2.00),
(1, 5, 2.00),
(1, 6, 4.00),
(1, 7, 2.00),
(1, 8, 1.00),
(3, 1, 2.00),
(3, 2, 3.00),
(3, 3, 2.00),
(3, 4, 2.00),
(3, 5, 2.00),
(3, 6, 4.00),
(3, 7, 2.00),
(3, 8, 1.00),
(3, 9, 2.00),
(3, 10, 4.00),
(3, 11, 2.00),
(3, 12, 3.00),
(3, 13, 2.00),
(5, 1, 2.00),
(5, 2, 3.00),
(5, 3, 2.00),
(5, 4, 2.00),
(5, 5, 2.00),
(5, 6, 4.00),
(5, 7, 2.00),
(5, 8, 1.00),
(7, 1, 2.00),
(7, 2, 3.00),
(7, 3, 2.00),
(7, 4, 2.00),
(7, 5, 2.00),
(7, 6, 4.00),
(7, 7, 2.00),
(7, 8, 1.00),
(10, 3, 2.00),
(10, 4, 2.00),
(10, 5, 2.00),
(10, 6, 4.00),
(10, 7, 2.00),
(10, 8, 1.00),
(10, 9, 2.00),
(10, 10, 4.00),
(11, 3, 2.00),
(11, 4, 2.00),
(11, 6, 2.00),
(11, 7, 4.00),
(11, 8, 1.00),
(11, 9, 4.00),
(11, 10, 4.00),
(11, 11, 2.00),
(11, 13, 2.00),
(12, 3, 2.00),
(12, 4, 2.00),
(12, 5, 2.00),
(12, 6, 4.00),
(12, 7, 2.00),
(12, 8, 1.00),
(12, 9, 2.00),
(12, 10, 4.00),
(14, 3, 2.00),
(14, 4, 2.00),
(14, 5, 2.00),
(14, 6, 4.00),
(14, 7, 2.00),
(14, 8, 1.00),
(14, 9, 2.00),
(14, 10, 4.00);

-- --------------------------------------------------------

--
-- Structure de la table `coefficients`
--

CREATE TABLE `coefficients` (
  `id` int(11) NOT NULL,
  `matiere_id` int(11) NOT NULL,
  `valeur` int(11) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `deliberations`
--

CREATE TABLE `deliberations` (
  `id` int(11) NOT NULL,
  `classe_id` int(11) NOT NULL,
  `semestre_id` int(11) NOT NULL,
  `date_cloture` timestamp NOT NULL DEFAULT current_timestamp(),
  `responsable_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `eleves`
--

CREATE TABLE `eleves` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `classe_id` int(11) NOT NULL,
  `serie_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `eleves`
--

INSERT INTO `eleves` (`id`, `user_id`, `classe_id`, `serie_id`) VALUES
(18, 55, 1, NULL),
(19, 57, 1, NULL),
(20, 59, 3, NULL),
(21, 61, 3, NULL),
(22, 63, 5, NULL),
(23, 65, 5, NULL),
(24, 67, 7, NULL),
(25, 69, 7, NULL),
(26, 71, 9, NULL),
(27, 73, 9, NULL),
(28, 75, 16, NULL),
(29, 77, 16, NULL),
(30, 79, 10, NULL),
(31, 81, 10, NULL),
(32, 83, 15, NULL),
(33, 85, 15, NULL),
(34, 87, 11, NULL),
(35, 89, 11, NULL),
(36, 91, 17, NULL),
(37, 93, 17, NULL),
(38, 95, 18, NULL),
(39, 97, 18, NULL),
(40, 99, 18, NULL),
(41, 101, 12, NULL),
(42, 103, 12, NULL),
(43, 105, 13, NULL),
(45, 109, 13, NULL),
(46, 111, 20, NULL),
(47, 113, 20, NULL),
(48, 115, 19, NULL),
(49, 117, 14, NULL),
(50, 119, 14, NULL);

-- --------------------------------------------------------

--
-- Structure de la table `enseignants`
--

CREATE TABLE `enseignants` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `matiere` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `enseignants`
--

INSERT INTO `enseignants` (`id`, `user_id`, `matiere`) VALUES
(4, 121, 'Maths'),
(5, 122, 'Histoire & Géographie'),
(6, 123, 'SVT'),
(7, 124, 'Anglais'),
(8, 125, 'Communication écrite / Lecture');

-- --------------------------------------------------------

--
-- Structure de la table `enseignant_classe`
--

CREATE TABLE `enseignant_classe` (
  `enseignant_id` int(11) NOT NULL,
  `classe_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `enseignant_classe`
--

INSERT INTO `enseignant_classe` (`enseignant_id`, `classe_id`) VALUES
(4, 1),
(4, 3),
(4, 5),
(4, 7),
(4, 9),
(4, 10),
(4, 11),
(4, 12),
(4, 13),
(4, 14),
(4, 15),
(4, 16),
(4, 17),
(4, 18),
(4, 19),
(4, 20),
(5, 1),
(5, 3),
(5, 5),
(5, 7),
(5, 9),
(5, 10),
(5, 11),
(5, 12),
(5, 13),
(5, 14),
(5, 15),
(5, 16),
(5, 17),
(5, 18),
(5, 19),
(5, 20),
(6, 1),
(6, 3),
(6, 5),
(6, 7),
(6, 9),
(6, 10),
(6, 11),
(6, 12),
(6, 13),
(6, 14),
(6, 15),
(6, 16),
(6, 17),
(6, 18),
(6, 19),
(6, 20),
(7, 1),
(7, 3),
(7, 5),
(7, 7),
(7, 9),
(7, 10),
(7, 11),
(7, 12),
(7, 13),
(7, 14),
(7, 15),
(7, 16),
(7, 17),
(7, 18),
(7, 19),
(7, 20),
(8, 1),
(8, 3),
(8, 5),
(8, 7);

-- --------------------------------------------------------

--
-- Structure de la table `evaluations`
--

CREATE TABLE `evaluations` (
  `id` int(11) NOT NULL,
  `matiere_id` int(11) NOT NULL,
  `eleve_id` int(11) NOT NULL,
  `semestre_id` int(11) NOT NULL,
  `valeur` decimal(5,2) NOT NULL,
  `date_eval` date DEFAULT curdate()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `matieres`
--

CREATE TABLE `matieres` (
  `id` int(11) NOT NULL,
  `nom` varchar(255) NOT NULL,
  `coefficient` int(11) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `matieres`
--

INSERT INTO `matieres` (`id`, `nom`, `coefficient`) VALUES
(1, 'Lecture', 2),
(2, 'Communication écrite', 3),
(3, 'Anglais', 2),
(4, 'SVT', 2),
(5, 'PCT', 2),
(6, 'Maths', 4),
(7, 'Histoire & Géographie', 2),
(8, 'EPS', 1),
(9, 'Philosophie', 2),
(10, 'Français', 4),
(11, 'Allemand', 2),
(12, 'Économie', 3),
(13, 'Espagnol', 2);

-- --------------------------------------------------------

--
-- Structure de la table `notes`
--

CREATE TABLE `notes` (
  `id` int(11) NOT NULL,
  `eleve_id` int(11) NOT NULL,
  `matiere_id` int(11) NOT NULL,
  `semestre_id` int(11) NOT NULL,
  `valeur` decimal(5,2) NOT NULL,
  `date_note` date DEFAULT curdate(),
  `statut` enum('BROUILLON','VALIDE') DEFAULT 'BROUILLON',
  `verrouille` tinyint(1) DEFAULT 0,
  `type_evaluation` enum('DEVOIR','INTERROGATION') DEFAULT 'DEVOIR',
  `numero_evaluation` tinyint(4) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `notes`
--

INSERT INTO `notes` (`id`, `eleve_id`, `matiere_id`, `semestre_id`, `valeur`, `date_note`, `statut`, `verrouille`, `type_evaluation`, `numero_evaluation`) VALUES
(9, 18, 2, 1, 15.00, '2025-12-28', 'VALIDE', 0, 'INTERROGATION', 1),
(10, 18, 2, 1, 14.00, '2025-12-28', 'VALIDE', 0, 'INTERROGATION', 2),
(11, 18, 2, 1, 12.00, '2025-12-28', 'VALIDE', 0, 'INTERROGATION', 3),
(12, 18, 2, 1, 13.00, '2025-12-28', 'VALIDE', 0, 'DEVOIR', 1),
(13, 18, 2, 1, 14.00, '2025-12-28', 'VALIDE', 0, 'DEVOIR', 2),
(14, 19, 2, 1, 19.00, '2025-12-28', 'VALIDE', 0, 'INTERROGATION', 1),
(15, 19, 2, 1, 16.00, '2025-12-28', 'VALIDE', 0, 'INTERROGATION', 2),
(16, 19, 2, 1, 10.00, '2025-12-28', 'VALIDE', 0, 'INTERROGATION', 3),
(17, 19, 2, 1, 12.00, '2025-12-28', 'VALIDE', 0, 'DEVOIR', 1),
(18, 19, 2, 1, 15.00, '2025-12-28', 'VALIDE', 0, 'DEVOIR', 2),
(19, 18, 1, 1, 12.00, '2025-12-28', 'VALIDE', 0, 'INTERROGATION', 1),
(20, 18, 1, 1, 13.00, '2025-12-28', 'VALIDE', 0, 'INTERROGATION', 2),
(21, 18, 1, 1, 16.00, '2025-12-28', 'VALIDE', 0, 'INTERROGATION', 3),
(22, 18, 1, 1, 18.00, '2025-12-28', 'VALIDE', 0, 'DEVOIR', 1),
(23, 18, 1, 1, 19.00, '2025-12-28', 'VALIDE', 0, 'DEVOIR', 2),
(24, 19, 1, 1, 14.00, '2025-12-28', 'VALIDE', 0, 'INTERROGATION', 1),
(25, 19, 1, 1, 15.00, '2025-12-28', 'VALIDE', 0, 'INTERROGATION', 2),
(26, 19, 1, 1, 16.00, '2025-12-28', 'VALIDE', 0, 'INTERROGATION', 3),
(27, 19, 1, 1, 2.00, '2025-12-28', 'VALIDE', 0, 'DEVOIR', 1),
(28, 19, 1, 1, 5.00, '2025-12-28', 'VALIDE', 0, 'DEVOIR', 2),
(29, 18, 1, 2, 10.00, '2025-12-28', 'VALIDE', 0, 'INTERROGATION', 1),
(30, 18, 1, 2, 11.00, '2025-12-28', 'VALIDE', 0, 'INTERROGATION', 2),
(31, 18, 1, 2, 12.00, '2025-12-28', 'VALIDE', 0, 'INTERROGATION', 3),
(32, 18, 1, 2, 14.00, '2025-12-28', 'VALIDE', 0, 'DEVOIR', 1),
(33, 18, 1, 2, 15.00, '2025-12-28', 'VALIDE', 0, 'DEVOIR', 2),
(34, 19, 1, 2, 4.00, '2025-12-28', 'VALIDE', 0, 'INTERROGATION', 1),
(35, 19, 1, 2, 5.00, '2025-12-28', 'VALIDE', 0, 'INTERROGATION', 2),
(36, 19, 1, 2, 6.00, '2025-12-28', 'VALIDE', 0, 'INTERROGATION', 3),
(37, 19, 1, 2, 7.00, '2025-12-28', 'VALIDE', 0, 'DEVOIR', 1),
(38, 19, 1, 2, 8.00, '2025-12-28', 'VALIDE', 0, 'DEVOIR', 2),
(39, 18, 2, 2, 12.00, '2025-12-28', 'VALIDE', 0, 'INTERROGATION', 1),
(40, 18, 2, 2, 13.00, '2025-12-28', 'VALIDE', 0, 'INTERROGATION', 2),
(41, 18, 2, 2, 11.00, '2025-12-28', 'VALIDE', 0, 'INTERROGATION', 3),
(42, 18, 2, 2, 12.00, '2025-12-28', 'VALIDE', 0, 'DEVOIR', 1),
(43, 18, 2, 2, 13.00, '2025-12-28', 'VALIDE', 0, 'DEVOIR', 2),
(44, 19, 2, 2, 14.00, '2025-12-28', 'VALIDE', 0, 'INTERROGATION', 1),
(45, 19, 2, 2, 12.00, '2025-12-28', 'VALIDE', 0, 'INTERROGATION', 2),
(46, 19, 2, 2, 20.00, '2025-12-28', 'VALIDE', 0, 'INTERROGATION', 3),
(47, 19, 2, 2, 10.00, '2025-12-28', 'VALIDE', 0, 'DEVOIR', 1),
(48, 19, 2, 2, 8.00, '2025-12-28', 'VALIDE', 0, 'DEVOIR', 2),
(49, 20, 2, 2, 15.00, '2025-12-28', 'VALIDE', 0, 'INTERROGATION', 1),
(50, 20, 2, 2, 12.00, '2025-12-28', 'VALIDE', 0, 'INTERROGATION', 2),
(51, 20, 2, 2, 18.00, '2025-12-28', 'VALIDE', 0, 'INTERROGATION', 3),
(52, 20, 2, 2, 14.00, '2025-12-28', 'VALIDE', 0, 'DEVOIR', 1),
(53, 20, 2, 2, 12.00, '2025-12-28', 'VALIDE', 0, 'DEVOIR', 2),
(54, 21, 2, 2, 12.75, '2025-12-28', 'VALIDE', 0, 'INTERROGATION', 1),
(55, 21, 2, 2, 15.00, '2025-12-28', 'VALIDE', 0, 'INTERROGATION', 2),
(56, 21, 2, 2, 14.25, '2025-12-28', 'VALIDE', 0, 'INTERROGATION', 3),
(57, 21, 2, 2, 16.00, '2025-12-28', 'VALIDE', 0, 'DEVOIR', 1),
(58, 21, 2, 2, 10.00, '2025-12-28', 'VALIDE', 0, 'DEVOIR', 2),
(59, 20, 2, 1, 14.00, '2025-12-28', 'VALIDE', 0, 'INTERROGATION', 1),
(60, 20, 2, 1, 12.00, '2025-12-28', 'VALIDE', 0, 'INTERROGATION', 2),
(61, 20, 2, 1, 10.00, '2025-12-28', 'VALIDE', 0, 'INTERROGATION', 3),
(62, 20, 2, 1, 11.00, '2025-12-28', 'VALIDE', 0, 'DEVOIR', 1),
(63, 20, 2, 1, 15.00, '2025-12-28', 'VALIDE', 0, 'DEVOIR', 2),
(64, 21, 2, 1, 12.00, '2025-12-28', 'VALIDE', 0, 'INTERROGATION', 1),
(65, 21, 2, 1, 15.00, '2025-12-28', 'VALIDE', 0, 'INTERROGATION', 2),
(66, 21, 2, 1, 9.00, '2025-12-28', 'VALIDE', 0, 'INTERROGATION', 3),
(67, 21, 2, 1, 12.00, '2025-12-28', 'VALIDE', 0, 'DEVOIR', 1),
(68, 21, 2, 1, 11.00, '2025-12-28', 'VALIDE', 0, 'DEVOIR', 2),
(69, 20, 1, 1, 12.00, '2025-12-28', 'VALIDE', 0, 'INTERROGATION', 1),
(70, 20, 1, 1, 13.00, '2025-12-28', 'VALIDE', 0, 'INTERROGATION', 2),
(71, 20, 1, 1, 14.00, '2025-12-28', 'VALIDE', 0, 'INTERROGATION', 3),
(72, 20, 1, 1, 15.00, '2025-12-28', 'VALIDE', 0, 'DEVOIR', 1),
(73, 20, 1, 1, 16.00, '2025-12-28', 'VALIDE', 0, 'DEVOIR', 2),
(74, 21, 1, 1, 10.00, '2025-12-28', 'VALIDE', 0, 'INTERROGATION', 1),
(75, 21, 1, 1, 11.00, '2025-12-28', 'VALIDE', 0, 'INTERROGATION', 2),
(76, 21, 1, 1, 12.00, '2025-12-28', 'VALIDE', 0, 'INTERROGATION', 3),
(77, 21, 1, 1, 13.00, '2025-12-28', 'VALIDE', 0, 'DEVOIR', 1),
(78, 21, 1, 1, 14.00, '2025-12-28', 'VALIDE', 0, 'DEVOIR', 2),
(79, 20, 1, 2, 20.00, '2025-12-28', 'VALIDE', 0, 'INTERROGATION', 1),
(80, 20, 1, 2, 19.00, '2025-12-28', 'VALIDE', 0, 'INTERROGATION', 2),
(81, 20, 1, 2, 18.00, '2025-12-28', 'VALIDE', 0, 'INTERROGATION', 3),
(82, 20, 1, 2, 17.00, '2025-12-28', 'VALIDE', 0, 'DEVOIR', 1),
(83, 20, 1, 2, 16.00, '2025-12-28', 'VALIDE', 0, 'DEVOIR', 2),
(84, 21, 1, 2, 16.00, '2025-12-28', 'VALIDE', 0, 'INTERROGATION', 1),
(85, 21, 1, 2, 17.00, '2025-12-28', 'VALIDE', 0, 'INTERROGATION', 2),
(86, 21, 1, 2, 18.00, '2025-12-28', 'VALIDE', 0, 'INTERROGATION', 3),
(87, 21, 1, 2, 19.00, '2025-12-28', 'VALIDE', 0, 'DEVOIR', 1),
(88, 21, 1, 2, 20.00, '2025-12-28', 'VALIDE', 0, 'DEVOIR', 2),
(89, 22, 2, 1, 15.00, '2025-12-28', 'VALIDE', 0, 'INTERROGATION', 1),
(90, 22, 2, 1, 14.00, '2025-12-28', 'VALIDE', 0, 'INTERROGATION', 2),
(91, 22, 2, 1, 13.00, '2025-12-28', 'VALIDE', 0, 'INTERROGATION', 3),
(92, 22, 2, 1, 12.00, '2025-12-28', 'VALIDE', 0, 'DEVOIR', 1),
(93, 22, 2, 1, 11.00, '2025-12-28', 'VALIDE', 0, 'DEVOIR', 2),
(94, 23, 2, 1, 9.00, '2025-12-28', 'VALIDE', 0, 'INTERROGATION', 1),
(95, 23, 2, 1, 10.00, '2025-12-28', 'VALIDE', 0, 'INTERROGATION', 2),
(96, 23, 2, 1, 11.00, '2025-12-28', 'VALIDE', 0, 'INTERROGATION', 3),
(97, 23, 2, 1, 12.00, '2025-12-28', 'VALIDE', 0, 'DEVOIR', 1),
(98, 23, 2, 1, 13.00, '2025-12-28', 'VALIDE', 0, 'DEVOIR', 2),
(99, 22, 2, 2, 10.00, '2025-12-28', 'VALIDE', 0, 'INTERROGATION', 1),
(100, 22, 2, 2, 11.00, '2025-12-28', 'VALIDE', 0, 'INTERROGATION', 2),
(101, 22, 2, 2, 12.00, '2025-12-28', 'VALIDE', 0, 'INTERROGATION', 3),
(102, 22, 2, 2, 9.00, '2025-12-28', 'VALIDE', 0, 'DEVOIR', 1),
(103, 22, 2, 2, 8.00, '2025-12-28', 'VALIDE', 0, 'DEVOIR', 2),
(104, 23, 2, 2, 12.00, '2025-12-28', 'VALIDE', 0, 'INTERROGATION', 1),
(105, 23, 2, 2, 13.00, '2025-12-28', 'VALIDE', 0, 'INTERROGATION', 2),
(106, 23, 2, 2, 14.00, '2025-12-28', 'VALIDE', 0, 'INTERROGATION', 3),
(107, 23, 2, 2, 12.00, '2025-12-28', 'VALIDE', 0, 'DEVOIR', 1),
(108, 23, 2, 2, 15.00, '2025-12-28', 'VALIDE', 0, 'DEVOIR', 2);

-- --------------------------------------------------------

--
-- Structure de la table `notifications`
--

CREATE TABLE `notifications` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `message` text NOT NULL,
  `type` enum('MAIL','WHATSAPP') DEFAULT 'MAIL',
  `statut` enum('EN_ATTENTE','ENVOYE','ECHEC') DEFAULT 'EN_ATTENTE',
  `date_envoi` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `parents`
--

CREATE TABLE `parents` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `telephone` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `parents`
--

INSERT INTO `parents` (`id`, `user_id`, `telephone`) VALUES
(3, 56, NULL),
(4, 58, NULL),
(5, 60, NULL),
(6, 62, NULL),
(7, 64, NULL),
(8, 66, NULL),
(9, 68, NULL),
(10, 70, NULL),
(11, 72, NULL),
(12, 74, NULL),
(13, 76, NULL),
(14, 78, NULL),
(15, 80, NULL),
(16, 82, NULL),
(17, 84, NULL),
(18, 86, NULL),
(19, 88, NULL),
(20, 90, NULL),
(21, 92, NULL),
(22, 94, NULL),
(23, 96, NULL),
(24, 98, NULL),
(25, 100, NULL),
(26, 102, NULL),
(27, 104, NULL),
(28, 106, NULL),
(29, 110, NULL),
(30, 112, NULL),
(31, 114, NULL),
(32, 116, NULL),
(33, 118, NULL),
(34, 120, NULL);

-- --------------------------------------------------------

--
-- Structure de la table `parent_eleve`
--

CREATE TABLE `parent_eleve` (
  `parent_id` int(11) NOT NULL,
  `eleve_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `parent_eleve`
--

INSERT INTO `parent_eleve` (`parent_id`, `eleve_id`) VALUES
(3, 18),
(4, 19),
(5, 20),
(6, 21),
(7, 22),
(8, 23),
(9, 24),
(10, 25),
(11, 26),
(12, 27),
(13, 28),
(14, 29),
(15, 30),
(16, 31),
(17, 32),
(18, 33),
(19, 34),
(20, 35),
(21, 36),
(22, 37),
(23, 38),
(24, 39),
(25, 40),
(26, 41),
(27, 42),
(28, 43),
(29, 45),
(30, 46),
(31, 47),
(32, 48),
(33, 49),
(34, 50);

-- --------------------------------------------------------

--
-- Structure de la table `responsables`
--

CREATE TABLE `responsables` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `fonction` varchar(255) DEFAULT 'Administrateur'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `responsables`
--

INSERT INTO `responsables` (`id`, `user_id`, `fonction`) VALUES
(1, 1, 'Admin');

-- --------------------------------------------------------

--
-- Structure de la table `semestres`
--

CREATE TABLE `semestres` (
  `id` int(11) NOT NULL,
  `nom` varchar(255) NOT NULL,
  `date_debut` date DEFAULT NULL,
  `date_fin` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `semestres`
--

INSERT INTO `semestres` (`id`, `nom`, `date_debut`, `date_fin`) VALUES
(1, 'Semestre 1', '2023-09-01', '2024-01-31'),
(2, 'Semestre 2', '2024-02-01', '2024-06-30');

-- --------------------------------------------------------

--
-- Structure de la table `series`
--

CREATE TABLE `series` (
  `id` int(11) NOT NULL,
  `nom` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `series`
--

INSERT INTO `series` (`id`, `nom`) VALUES
(1, 'A'),
(2, 'B'),
(3, 'C'),
(4, 'D');

-- --------------------------------------------------------

--
-- Structure de la table `statistiques`
--

CREATE TABLE `statistiques` (
  `id` int(11) NOT NULL,
  `eleve_id` int(11) NOT NULL,
  `moyenne` decimal(5,2) DEFAULT NULL,
  `rang` int(11) DEFAULT NULL,
  `annee_scolaire` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `nom` varchar(255) NOT NULL,
  `prenom` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `mot_de_passe` varchar(255) NOT NULL,
  `role` enum('RESPONSABLE','ENSEIGNANT','PARENT','ELEVE') NOT NULL,
  `date_creation` timestamp NOT NULL DEFAULT current_timestamp(),
  `doit_changer_mdp` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `users`
--

INSERT INTO `users` (`id`, `nom`, `prenom`, `email`, `mot_de_passe`, `role`, `date_creation`, `doit_changer_mdp`) VALUES
(1, 'Directeur', 'Admin', 'admin@gmail.com', '$2y$10$CerN86IYKnE1b9yvxKaZ.OvmiqFv3unbJrWwNTNLPfrvPbGsT2ONG', 'RESPONSABLE', '2025-12-27 19:06:31', 0),
(55, 'BAM', 'Ulrich', 'bam@Ulrich.com', '$2y$10$JxgtmM5ge3w7pIl1hYSX9uegZ73BxokuWcBG3N4aejw3qpHGk.aV6', 'ELEVE', '2025-12-28 12:08:11', 1),
(56, 'BAM', 'Parent', 'parent@bam.com', '$2y$10$JxgtmM5ge3w7pIl1hYSX9uegZ73BxokuWcBG3N4aejw3qpHGk.aV6', 'PARENT', '2025-12-28 12:08:11', 1),
(57, 'BAMI', 'Ulk', 'bami@ulk.com', '$2y$10$D2PfFsqgR2e5klTLZQw8M.0KrBkMHXj98MnReXDxFfx.rbS7S3YWG', 'ELEVE', '2025-12-28 12:09:19', 1),
(58, 'BAMI', 'Parent', 'parent@bami.com', '$2y$10$D2PfFsqgR2e5klTLZQw8M.0KrBkMHXj98MnReXDxFfx.rbS7S3YWG', 'PARENT', '2025-12-28 12:09:19', 1),
(59, 'AHIDAZAN', 'Ulrich', 'ahi@ulrich.com', '$2y$10$zEmyHJk/gZ7Wf5H98s5WOOTDduQrYBThHKGedy4LQ2sbHbxgg0wS2', 'ELEVE', '2025-12-28 12:11:13', 1),
(60, 'AHIDAZAN', 'Parent', 'parent@ahi.com', '$2y$10$zEmyHJk/gZ7Wf5H98s5WOOTDduQrYBThHKGedy4LQ2sbHbxgg0wS2', 'PARENT', '2025-12-28 12:11:13', 1),
(61, 'NTCHA', 'Jo', 'ntcha@jo.com', '$2y$10$Eh1QqybaxHcWPv6u3hiSFe0gQaApXhBEQJz3aJMI3EXo01a34g4pS', 'ELEVE', '2025-12-28 12:12:56', 1),
(62, 'NTCHA', 'Parent', 'parent@ntcha.com', '$2y$10$Eh1QqybaxHcWPv6u3hiSFe0gQaApXhBEQJz3aJMI3EXo01a34g4pS', 'PARENT', '2025-12-28 12:12:56', 1),
(63, 'NTCHA', 'Joseph', 'ntcha@joseph.com', '$2y$10$uXQYhIM2ZcOXE6GneDVTMOtBH2E.UvmDn3MyWhSUD4vhnM3LJ6HlS', 'ELEVE', '2025-12-28 12:14:41', 1),
(64, 'NTCHA', 'Parent', 'parent@joseph.com', '$2y$10$uXQYhIM2ZcOXE6GneDVTMOtBH2E.UvmDn3MyWhSUD4vhnM3LJ6HlS', 'PARENT', '2025-12-28 12:14:41', 1),
(65, 'BIG', 'Rolince', 'big@rolince.com', '$2y$10$bCxsd5as3WB.4B5UR0.FaOQ/PJ5yRa5QCa8cE0rO3r57jZNjeR/3u', 'ELEVE', '2025-12-28 12:16:11', 1),
(66, 'BIG', 'Parent', 'parent@rolince.com', '$2y$10$bCxsd5as3WB.4B5UR0.FaOQ/PJ5yRa5QCa8cE0rO3r57jZNjeR/3u', 'PARENT', '2025-12-28 12:16:11', 1),
(67, 'AG', 'Amir', 'ag@amir.com', '$2y$10$6XGr6SNNy0vX7eq28kh.NOB1OefinMmZa8qqrPhZKQTO3EtB0xnmO', 'ELEVE', '2025-12-28 12:16:58', 1),
(68, 'AG', 'Parent', 'parent@amir.com', '$2y$10$6XGr6SNNy0vX7eq28kh.NOB1OefinMmZa8qqrPhZKQTO3EtB0xnmO', 'PARENT', '2025-12-28 12:16:58', 1),
(69, 'DOSSOU', 'Charbel', 'dossou@charbel.com', '$2y$10$QTfftisCM9Y14GoyX9jb8OiqSi0oxosy7jWZtSouBP2Wwi3t5/EEK', 'ELEVE', '2025-12-28 12:19:23', 1),
(70, 'DOSSOU', 'Parent', 'parent@charbel.com', '$2y$10$QTfftisCM9Y14GoyX9jb8OiqSi0oxosy7jWZtSouBP2Wwi3t5/EEK', 'PARENT', '2025-12-28 12:19:23', 1),
(71, 'AGO', 'Josias', 'ago@josias.com', '$2y$10$mEi84Ok2E9rp9NYYqHnVguuBZtqoAksXJLQY0x1K/gEXguGWW7PVW', 'ELEVE', '2025-12-28 12:20:27', 1),
(72, 'AGO', 'Parent', 'parent@josias.com', '$2y$10$mEi84Ok2E9rp9NYYqHnVguuBZtqoAksXJLQY0x1K/gEXguGWW7PVW', 'PARENT', '2025-12-28 12:20:27', 1),
(73, 'AGOSSA', 'Man', 'agossa@man.com', '$2y$10$rHfsfOkwz0YbDbnOAHF/5eEVZzbs0R6tE7sQGRCz27wfggMhVqIgm', 'ELEVE', '2025-12-28 12:21:29', 1),
(74, 'AGOSSA', 'Parent', 'parent@man.com', '$2y$10$rHfsfOkwz0YbDbnOAHF/5eEVZzbs0R6tE7sQGRCz27wfggMhVqIgm', 'PARENT', '2025-12-28 12:21:29', 1),
(75, 'SGH', 'Melchior', 'sgh@melchior', '$2y$10$QNwsOwnIBbtAp2XRFoMPPubuiXiYGLdZXDyTUys5Ca06ECkELmqiO', 'ELEVE', '2025-12-28 12:42:13', 1),
(76, 'SGH', 'Parent', 'parent@melchior', '$2y$10$QNwsOwnIBbtAp2XRFoMPPubuiXiYGLdZXDyTUys5Ca06ECkELmqiO', 'PARENT', '2025-12-28 12:42:13', 1),
(77, 'AYI', 'Forlène', 'ayi@forlene.com', '$2y$10$wp.e9IBRsDatOFuodIuO4uJ/8GhOoHKshcch9U4i6zLUvOhxECY/S', 'ELEVE', '2025-12-28 12:43:46', 1),
(78, 'AYI', 'Parent', 'parent@forlene.com', '$2y$10$wp.e9IBRsDatOFuodIuO4uJ/8GhOoHKshcch9U4i6zLUvOhxECY/S', 'PARENT', '2025-12-28 12:43:46', 1),
(79, 'FORE', 'Epiou', 'fore@epiou.com', '$2y$10$WtZMv6bk3cIdAMFum9Fic.BA8Zd/4zos83Fvk6wZ9y4Hf2OTVZo32', 'ELEVE', '2025-12-28 12:44:33', 1),
(80, 'FORE', 'Parent', 'parent@epiou.com', '$2y$10$WtZMv6bk3cIdAMFum9Fic.BA8Zd/4zos83Fvk6wZ9y4Hf2OTVZo32', 'PARENT', '2025-12-28 12:44:33', 1),
(81, 'OLA', 'Mash', 'ola@mash.com', '$2y$10$kQMqH6GjtoubmB3ZlVuNe.yB3Gkxk4ub7HIgLKN2s50CUXBv5OKa6', 'ELEVE', '2025-12-28 12:46:42', 1),
(82, 'OLA', 'Parent', 'parent@mash.com', '$2y$10$kQMqH6GjtoubmB3ZlVuNe.yB3Gkxk4ub7HIgLKN2s50CUXBv5OKa6', 'PARENT', '2025-12-28 12:46:42', 1),
(83, 'ADE', 'Loan', 'loan@gmail.com', '$2y$10$x2zrbJ5Bip9KWWH3TvxOv.0wEoBCXdqzAwW1AAytCucJtEuZVAWGW', 'ELEVE', '2025-12-28 12:52:51', 1),
(84, 'ADE', 'Parent', 'ade@gmail.com', '$2y$10$x2zrbJ5Bip9KWWH3TvxOv.0wEoBCXdqzAwW1AAytCucJtEuZVAWGW', 'PARENT', '2025-12-28 12:52:51', 1),
(85, 'DOSSA', 'Charbel', 'charbel@gmail.com', '$2y$10$0osYi5xMQ3KV7rj2mEw6F.OxO2zIEU99bttxLAHutoZKbvZsr6F0O', 'ELEVE', '2025-12-28 12:53:49', 1),
(86, 'DOSSA', 'Parent', 'dossa@gmail.com', '$2y$10$0osYi5xMQ3KV7rj2mEw6F.OxO2zIEU99bttxLAHutoZKbvZsr6F0O', 'PARENT', '2025-12-28 12:53:49', 1),
(87, 'JAM', 'Jean', 'jean@gmail.com', '$2y$10$aPA6ebm9O/rF6ql4JJkN/.CGbU4eFf8d8osov8SDxGf/MevZLAKQC', 'ELEVE', '2025-12-28 12:54:16', 1),
(88, 'JAM', 'Parent', 'jam@gmail.com', '$2y$10$aPA6ebm9O/rF6ql4JJkN/.CGbU4eFf8d8osov8SDxGf/MevZLAKQC', 'PARENT', '2025-12-28 12:54:16', 1),
(89, 'DJAM', 'Deen', 'deen@gmail.com', '$2y$10$oMdMNyqLxLbjtprLSkBlF.Um75VmteD6BZhyvE/qzWMUY3.n3f4fC', 'ELEVE', '2025-12-28 12:55:27', 1),
(90, 'DJAM', 'Parent', 'djam@gmail.com', '$2y$10$oMdMNyqLxLbjtprLSkBlF.Um75VmteD6BZhyvE/qzWMUY3.n3f4fC', 'PARENT', '2025-12-28 12:55:27', 1),
(91, 'MAKOU', 'Anne', 'anne@gmail.com', '$2y$10$QTmfg9lPToNYPZuRI7vkMuFXfR.KkjbO32yjfSbZredX/yeMAXWle', 'ELEVE', '2025-12-28 12:56:32', 1),
(92, 'MAKOU', 'Parent', 'makou@gmail.com', '$2y$10$QTmfg9lPToNYPZuRI7vkMuFXfR.KkjbO32yjfSbZredX/yeMAXWle', 'PARENT', '2025-12-28 12:56:32', 1),
(93, 'HOUI', 'Marie', 'marie@gmail.com', '$2y$10$Y9ei65LKL73cbfFJARAqkO14bMII4vQ0yMX.PnbcLC2pERdrTTU8G', 'ELEVE', '2025-12-28 12:57:06', 1),
(94, 'HOUI', 'Parent', 'houi@gmail.com', '$2y$10$Y9ei65LKL73cbfFJARAqkO14bMII4vQ0yMX.PnbcLC2pERdrTTU8G', 'PARENT', '2025-12-28 12:57:06', 1),
(95, 'KASSA', 'Dado', 'dado@gmail.com', '$2y$10$BhQ/2gsTepNx4XGBgcUoEuJAfWS6QN0oR8mUjmHGc0OREJS70boZe', 'ELEVE', '2025-12-28 12:57:36', 1),
(96, 'KASSA', 'Parent', 'kassa@gmail.com', '$2y$10$BhQ/2gsTepNx4XGBgcUoEuJAfWS6QN0oR8mUjmHGc0OREJS70boZe', 'PARENT', '2025-12-28 12:57:36', 1),
(97, 'AKOBI', 'Jacob', 'jacob@gmail.com', '$2y$10$5kn/nvTgb2uk0zMm4f8WtOAQsau1yuV1jd5UCfK1Wsi0tHnJFCrXq', 'ELEVE', '2025-12-28 12:58:18', 1),
(98, 'AKOBI', 'Parent', 'akobi@gmail.com', '$2y$10$5kn/nvTgb2uk0zMm4f8WtOAQsau1yuV1jd5UCfK1Wsi0tHnJFCrXq', 'PARENT', '2025-12-28 12:58:18', 1),
(99, 'SOÏGBE', 'Géred', 'gered@gmail.com', '$2y$10$x4HaClrtVJF8gJM4I2yaLeNnIb/BN3FG/Ar8U3OM7G9TrmL/9P/pK', 'ELEVE', '2025-12-28 12:59:09', 1),
(100, 'SOÏGBE', 'Parent', 'soigbe@gmail.com', '$2y$10$x4HaClrtVJF8gJM4I2yaLeNnIb/BN3FG/Ar8U3OM7G9TrmL/9P/pK', 'PARENT', '2025-12-28 12:59:09', 1),
(101, 'BABO', 'Dim', 'dim@gmail.com', '$2y$10$JzvOh9DMPfqR8C9/yjyVUOJ8DCOEj0QoJC2nmBA9rrqCRdol3SkOG', 'ELEVE', '2025-12-28 12:59:35', 1),
(102, 'BABO', 'Parent', 'babo@gmail.com', '$2y$10$JzvOh9DMPfqR8C9/yjyVUOJ8DCOEj0QoJC2nmBA9rrqCRdol3SkOG', 'PARENT', '2025-12-28 12:59:35', 1),
(103, 'SUCCETTE', 'Bissap', 'bissap@gmail.com', '$2y$10$hf1bjPgctPB.SaNHh7PrMeo9H75u0.LlmmLAXdHnVOT3VY5rrao6u', 'ELEVE', '2025-12-28 12:59:59', 1),
(104, 'SUCCETTE', 'Parent', 'succette@gmail.com', '$2y$10$hf1bjPgctPB.SaNHh7PrMeo9H75u0.LlmmLAXdHnVOT3VY5rrao6u', 'PARENT', '2025-12-28 12:59:59', 1),
(105, 'JUS', 'Ananas', 'ananas@gmail.com', '$2y$10$SrXTsICrC9mpfFqWFqC34uw.0THH4TWUVTed5pfr71azj/.kZ0f2e', 'ELEVE', '2025-12-28 13:00:22', 1),
(106, 'JUS', 'Parent', 'jus@gmail.com', '$2y$10$SrXTsICrC9mpfFqWFqC34uw.0THH4TWUVTed5pfr71azj/.kZ0f2e', 'PARENT', '2025-12-28 13:00:22', 1),
(109, 'SUCCETTE', 'Caramelle', 'caramelle@gmail.com', '$2y$10$XYW9aS5GYpSFHFtPwdZzNuOeZFpP6T2DXu.cH8x5FgHsIqa5d16om', 'ELEVE', '2025-12-28 13:01:00', 1),
(110, 'SUCCETTE', 'Parent', 'succette+1@gmail.com', '$2y$10$XYW9aS5GYpSFHFtPwdZzNuOeZFpP6T2DXu.cH8x5FgHsIqa5d16om', 'PARENT', '2025-12-28 13:01:00', 1),
(111, 'IFRI', 'Labo', 'labo@gmail.com', '$2y$10$vjjQJxSmK/WCzeUgIGvAVeZAK6J1pJFeqgxcdCP9e3lLPYyi7nbyO', 'ELEVE', '2025-12-28 13:02:04', 1),
(112, 'IFRI', 'Parent', 'ifri@gmail.com', '$2y$10$vjjQJxSmK/WCzeUgIGvAVeZAK6J1pJFeqgxcdCP9e3lLPYyi7nbyO', 'PARENT', '2025-12-28 13:02:04', 1),
(113, 'AGBO', 'Camel', 'camel@gmail.com', '$2y$10$GgI9aQ7I3YHu/j2gzkzFieKaeL.6Cb2yqiAYDpntDFJr6xHs5el6K', 'ELEVE', '2025-12-28 13:03:33', 1),
(114, 'AGBO', 'Parent', 'agbo@gmail.com', '$2y$10$GgI9aQ7I3YHu/j2gzkzFieKaeL.6Cb2yqiAYDpntDFJr6xHs5el6K', 'PARENT', '2025-12-28 13:03:33', 1),
(115, 'ABOU', 'Florent', 'florent@gmail.com', '$2y$10$E6YY1atTtr.eK6mtXkOH/eID7b8AmRhgRbTrQu8lIrMW624bo4FxK', 'ELEVE', '2025-12-28 13:04:22', 1),
(116, 'ABOU', 'Parent', 'abou@gmail.com', '$2y$10$E6YY1atTtr.eK6mtXkOH/eID7b8AmRhgRbTrQu8lIrMW624bo4FxK', 'PARENT', '2025-12-28 13:04:22', 1),
(117, 'KALI', 'Félix', 'felix@gmail.com', '$2y$10$IxReyPSO7ZjAVjbu/UKNzOKCXO1qLVKd1ZscOxtgB9ErX4pg1GM9m', 'ELEVE', '2025-12-28 13:05:22', 1),
(118, 'KALI', 'Parent', 'kali@gmail.com', '$2y$10$IxReyPSO7ZjAVjbu/UKNzOKCXO1qLVKd1ZscOxtgB9ErX4pg1GM9m', 'PARENT', '2025-12-28 13:05:22', 1),
(119, 'ABISSI', 'Flore', 'flore@gmail.com', '$2y$10$ooKmwiIbwdCELGVXBbPIIunvT..5CNtW4VEDUzELqjdC3sNr6oz4S', 'ELEVE', '2025-12-28 13:06:39', 1),
(120, 'ABISSI', 'Parent', 'abissi@gmail.com', '$2y$10$ooKmwiIbwdCELGVXBbPIIunvT..5CNtW4VEDUzELqjdC3sNr6oz4S', 'PARENT', '2025-12-28 13:06:39', 1),
(121, 'KOUAKOU', 'Elshson', 'kouakou@yahoo.fr', '$2y$10$hvUhGmBKjktlSyfATYrXWOzTMh9lf8o.k/nXWQoIrfm5b3EiIevMS', 'ENSEIGNANT', '2025-12-28 13:12:05', 1),
(122, 'KPEKOU', 'Vad', 'vad@yahoo.fr', '$2y$10$jg.9XRTFxouqA7NLgP3Qeekvhh4E9/0ADmKyq8qNQwz7N3T7ii6Li', 'ENSEIGNANT', '2025-12-28 13:14:03', 1),
(123, 'SAGBO', 'Laurent', 'laurent@yahoo.fr', '$2y$10$eV0wYO62ey3REYnCxZi.LO8jCVGYufWrSfd7fEQ7H3Yl0UGHUn//C', 'ENSEIGNANT', '2025-12-28 13:19:25', 1),
(124, 'ALI', 'Boss', 'boss@yahoo.fr', '$2y$10$UnAo2LsTLao0syo6q50hFOM9NU5S6rE25yYRMUQFJTu38nTNkRIsq', 'ENSEIGNANT', '2025-12-28 13:19:54', 1),
(125, 'AKOWE', 'Kalil', 'kalil@yahoo.fr', '$2y$10$q0ZaYVb413KkW9Yx4qBo6uZlhEAMw6YDGRLHdT0qI3K7FtzoVlYM2', 'ENSEIGNANT', '2025-12-28 13:26:45', 0);

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `bulletins`
--
ALTER TABLE `bulletins`
  ADD PRIMARY KEY (`id`),
  ADD KEY `eleve_id` (`eleve_id`);

--
-- Index pour la table `classes`
--
ALTER TABLE `classes`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `classe_matiere_coeff`
--
ALTER TABLE `classe_matiere_coeff`
  ADD PRIMARY KEY (`classe_id`,`matiere_id`),
  ADD KEY `matiere_id` (`matiere_id`);

--
-- Index pour la table `coefficients`
--
ALTER TABLE `coefficients`
  ADD PRIMARY KEY (`id`),
  ADD KEY `matiere_id` (`matiere_id`);

--
-- Index pour la table `deliberations`
--
ALTER TABLE `deliberations`
  ADD PRIMARY KEY (`id`),
  ADD KEY `classe_id` (`classe_id`),
  ADD KEY `semestre_id` (`semestre_id`),
  ADD KEY `responsable_id` (`responsable_id`);

--
-- Index pour la table `eleves`
--
ALTER TABLE `eleves`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user_id` (`user_id`),
  ADD KEY `classe_id` (`classe_id`),
  ADD KEY `serie_id` (`serie_id`);

--
-- Index pour la table `enseignants`
--
ALTER TABLE `enseignants`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user_id` (`user_id`);

--
-- Index pour la table `enseignant_classe`
--
ALTER TABLE `enseignant_classe`
  ADD PRIMARY KEY (`enseignant_id`,`classe_id`),
  ADD KEY `classe_id` (`classe_id`);

--
-- Index pour la table `evaluations`
--
ALTER TABLE `evaluations`
  ADD PRIMARY KEY (`id`),
  ADD KEY `matiere_id` (`matiere_id`),
  ADD KEY `eleve_id` (`eleve_id`),
  ADD KEY `semestre_id` (`semestre_id`);

--
-- Index pour la table `matieres`
--
ALTER TABLE `matieres`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `notes`
--
ALTER TABLE `notes`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_note_eval` (`eleve_id`,`matiere_id`,`semestre_id`,`type_evaluation`,`numero_evaluation`),
  ADD KEY `matiere_id` (`matiere_id`),
  ADD KEY `semestre_id` (`semestre_id`);

--
-- Index pour la table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Index pour la table `parents`
--
ALTER TABLE `parents`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user_id` (`user_id`);

--
-- Index pour la table `parent_eleve`
--
ALTER TABLE `parent_eleve`
  ADD PRIMARY KEY (`parent_id`,`eleve_id`),
  ADD KEY `eleve_id` (`eleve_id`);

--
-- Index pour la table `responsables`
--
ALTER TABLE `responsables`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user_id` (`user_id`);

--
-- Index pour la table `semestres`
--
ALTER TABLE `semestres`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `series`
--
ALTER TABLE `series`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `statistiques`
--
ALTER TABLE `statistiques`
  ADD PRIMARY KEY (`id`),
  ADD KEY `eleve_id` (`eleve_id`);

--
-- Index pour la table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `bulletins`
--
ALTER TABLE `bulletins`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `classes`
--
ALTER TABLE `classes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT pour la table `coefficients`
--
ALTER TABLE `coefficients`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `deliberations`
--
ALTER TABLE `deliberations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT pour la table `eleves`
--
ALTER TABLE `eleves`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=51;

--
-- AUTO_INCREMENT pour la table `enseignants`
--
ALTER TABLE `enseignants`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT pour la table `evaluations`
--
ALTER TABLE `evaluations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `matieres`
--
ALTER TABLE `matieres`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT pour la table `notes`
--
ALTER TABLE `notes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=109;

--
-- AUTO_INCREMENT pour la table `notifications`
--
ALTER TABLE `notifications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT pour la table `parents`
--
ALTER TABLE `parents`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=35;

--
-- AUTO_INCREMENT pour la table `responsables`
--
ALTER TABLE `responsables`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT pour la table `semestres`
--
ALTER TABLE `semestres`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT pour la table `series`
--
ALTER TABLE `series`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT pour la table `statistiques`
--
ALTER TABLE `statistiques`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=126;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `bulletins`
--
ALTER TABLE `bulletins`
  ADD CONSTRAINT `bulletins_ibfk_1` FOREIGN KEY (`eleve_id`) REFERENCES `eleves` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `classe_matiere_coeff`
--
ALTER TABLE `classe_matiere_coeff`
  ADD CONSTRAINT `classe_matiere_coeff_ibfk_1` FOREIGN KEY (`classe_id`) REFERENCES `classes` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `classe_matiere_coeff_ibfk_2` FOREIGN KEY (`matiere_id`) REFERENCES `matieres` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `coefficients`
--
ALTER TABLE `coefficients`
  ADD CONSTRAINT `coefficients_ibfk_1` FOREIGN KEY (`matiere_id`) REFERENCES `matieres` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `deliberations`
--
ALTER TABLE `deliberations`
  ADD CONSTRAINT `deliberations_ibfk_1` FOREIGN KEY (`classe_id`) REFERENCES `classes` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `deliberations_ibfk_2` FOREIGN KEY (`semestre_id`) REFERENCES `semestres` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `deliberations_ibfk_3` FOREIGN KEY (`responsable_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `eleves`
--
ALTER TABLE `eleves`
  ADD CONSTRAINT `eleves_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `eleves_ibfk_2` FOREIGN KEY (`classe_id`) REFERENCES `classes` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `eleves_ibfk_3` FOREIGN KEY (`serie_id`) REFERENCES `series` (`id`) ON DELETE SET NULL;

--
-- Contraintes pour la table `enseignants`
--
ALTER TABLE `enseignants`
  ADD CONSTRAINT `enseignants_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `enseignant_classe`
--
ALTER TABLE `enseignant_classe`
  ADD CONSTRAINT `enseignant_classe_ibfk_1` FOREIGN KEY (`enseignant_id`) REFERENCES `enseignants` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `enseignant_classe_ibfk_2` FOREIGN KEY (`classe_id`) REFERENCES `classes` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `evaluations`
--
ALTER TABLE `evaluations`
  ADD CONSTRAINT `evaluations_ibfk_1` FOREIGN KEY (`matiere_id`) REFERENCES `matieres` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `evaluations_ibfk_2` FOREIGN KEY (`eleve_id`) REFERENCES `eleves` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `evaluations_ibfk_3` FOREIGN KEY (`semestre_id`) REFERENCES `semestres` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `notes`
--
ALTER TABLE `notes`
  ADD CONSTRAINT `notes_ibfk_1` FOREIGN KEY (`eleve_id`) REFERENCES `eleves` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `notes_ibfk_2` FOREIGN KEY (`matiere_id`) REFERENCES `matieres` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `notes_ibfk_3` FOREIGN KEY (`semestre_id`) REFERENCES `semestres` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `notifications`
--
ALTER TABLE `notifications`
  ADD CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `parents`
--
ALTER TABLE `parents`
  ADD CONSTRAINT `parents_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `parent_eleve`
--
ALTER TABLE `parent_eleve`
  ADD CONSTRAINT `parent_eleve_ibfk_1` FOREIGN KEY (`parent_id`) REFERENCES `parents` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `parent_eleve_ibfk_2` FOREIGN KEY (`eleve_id`) REFERENCES `eleves` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `responsables`
--
ALTER TABLE `responsables`
  ADD CONSTRAINT `responsables_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `statistiques`
--
ALTER TABLE `statistiques`
  ADD CONSTRAINT `statistiques_ibfk_1` FOREIGN KEY (`eleve_id`) REFERENCES `eleves` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
