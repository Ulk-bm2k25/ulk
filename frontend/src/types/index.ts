// src/types/index.ts

export interface StatsGenerales {
  effectif_total: number;
  nombre_garcons: number;
  nombre_filles: number;
  age_moyen: number;
  taux_presence_global: number;
}

export interface StatMatiere {
  matiere: string;
  moyenne: number;
  min: number;
  max: number;
}

export interface StatsAcademiques {
  moyenne_classe: number;
  plus_forte_moyenne: number;
  plus_faible_moyenne: number;
  stats_par_matiere: StatMatiere[];
}

export interface RepartitionNotes {
  admis: number;
  en_difficulte: number;
  taux_reussite: number;
}

export interface StatsProgression {
  en_progression: number;
  en_regression: number;
  stables: number;
}

export interface StatsDiscipline {
  absences_non_justifiees: number;
  retards: number;
  taux_absenteisme: number;
}

export interface StatsResponse {
  generales: StatsGenerales;
  academiques: StatsAcademiques;
  repartition: RepartitionNotes;
  progression?: StatsProgression;
  discipline: StatsDiscipline;
}