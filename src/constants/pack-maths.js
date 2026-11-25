/*
  The Maths (Edexcel A-level) revision pack, assembled: the base content plus every
  batch written for it since (formula flashcards, past paper questions, notes, diagrams), with
  repeats dropped. One module per subject so the app can load a subject only when it is
  studied (see packs.js); library.js assembles all of them for scripts.
*/
import { MATHS_FORMULAE } from './maths-formulae'
import { PAST_PAPER_QUESTIONS } from './maths-past-papers'
import { mergeNotes } from './notes-merge'
import { MATHS_EXTRA_WORKED } from './maths-notes-extra'
import { MATHS_EXTRA_WORKED_2 } from './maths-notes-extra2'
import { appendDiagramsToNotes, MATHS_CHAPTER_DIAGRAMS } from './diagram-map'
import { MATHS_NOTES } from './maths-notes'
import { MATHS_NOTES_2 } from './maths-notes-2'
import { MATHS_PURE1_NOTES } from './maths-notes-pure1'
import { MATHS_PURE2_NOTES } from './maths-notes-pure2'
import { MATHS_APPLIED_NOTES } from './maths-notes-applied'
import { dedupeContent } from './pack-dedupe'

const BASE = {
    "id": "maths",
    "name": "Maths",
    "topics": [
      "Algebraic Expressions",
      "Quadratics",
      "Equations and Inequalities",
      "Graphs and Transformations",
      "Straight Line Graphs",
      "Circles",
      "Algebraic Methods (Proof & Division)",
      "The Binomial Expansion",
      "Trigonometric Ratios",
      "Trigonometric Identities and Equations",
      "Vectors (2D)",
      "Differentiation",
      "Integration",
      "Exponentials and Logarithms",
      "Algebraic Methods (Partial Fractions)",
      "Functions and Graphs",
      "Sequences and Series",
      "The Binomial Expansion (General n)",
      "Radians",
      "Trigonometric Functions",
      "Trigonometry and Modelling",
      "Parametric Equations",
      "Differentiation (Year 2)",
      "Numerical Methods",
      "Integration (Year 2)",
      "Vectors (3D)",
      "Statistical Sampling",
      "Data Presentation and Interpretation",
      "Probability",
      "Statistical Distributions (Binomial)",
      "Statistical Hypothesis Testing",
      "Regression, Correlation and Hypothesis Testing",
      "Conditional Probability",
      "The Normal Distribution",
      "Modelling in Mechanics",
      "Constant Acceleration (SUVAT)",
      "Forces and Newton's Laws",
      "Variable Acceleration",
      "Moments",
      "Forces and Friction",
      "Projectiles",
      "Application of Forces",
      "Further Kinematics"
    ],
    "flashcards": [],
    "mcq": [],
    "examQuestions": [],
    "groups": [
      {
        "label": "Pure Mathematics",
        "subgroups": [
          {
            "label": "Year 1 (AS)",
            "topics": [
              "Algebraic Expressions",
              "Quadratics",
              "Equations and Inequalities",
              "Graphs and Transformations",
              "Straight Line Graphs",
              "Circles",
              "Algebraic Methods (Proof & Division)",
              "The Binomial Expansion",
              "Trigonometric Ratios",
              "Trigonometric Identities and Equations",
              "Vectors (2D)",
              "Differentiation",
              "Integration",
              "Exponentials and Logarithms"
            ]
          },
          {
            "label": "Year 2 (A2)",
            "topics": [
              "Algebraic Methods (Partial Fractions)",
              "Functions and Graphs",
              "Sequences and Series",
              "The Binomial Expansion (General n)",
              "Radians",
              "Trigonometric Functions",
              "Trigonometry and Modelling",
              "Parametric Equations",
              "Differentiation (Year 2)",
              "Numerical Methods",
              "Integration (Year 2)",
              "Vectors (3D)"
            ]
          }
        ]
      },
      {
        "label": "Statistics",
        "subgroups": [
          {
            "label": "Year 1 (AS)",
            "topics": [
              "Statistical Sampling",
              "Data Presentation and Interpretation",
              "Probability",
              "Statistical Distributions (Binomial)",
              "Statistical Hypothesis Testing"
            ]
          },
          {
            "label": "Year 2 (A2)",
            "topics": [
              "Regression, Correlation and Hypothesis Testing",
              "Conditional Probability",
              "The Normal Distribution"
            ]
          }
        ]
      },
      {
        "label": "Mechanics",
        "subgroups": [
          {
            "label": "Year 1 (AS)",
            "topics": [
              "Modelling in Mechanics",
              "Constant Acceleration (SUVAT)",
              "Forces and Newton's Laws",
              "Variable Acceleration"
            ]
          },
          {
            "label": "Year 2 (A2)",
            "topics": [
              "Moments",
              "Forces and Friction",
              "Projectiles",
              "Application of Forces",
              "Further Kinematics"
            ]
          }
        ]
      }
    ]
}

/*
  Maths has no multiple choice: its practice is the exam questions and the past
  papers (see PastPapers.jsx), so `mcq` is empty and the MCQ method is not offered.
*/

const withExtras = (pack) => {
  return {
    ...pack,
    pastPapers: true,
    // Flashcards are for memorising formulae only.
    flashcards: MATHS_FORMULAE,
    mcq: [],
    // The exam questions are the real past paper questions, filed by chapter (the Past papers
    // method lists the same ones by paper). Their mark schemes and examiner's reports sit under each.
    examQuestions: PAST_PAPER_QUESTIONS,
    // MATHS_NOTES_2 second, so its full chapters override the one-line
    // placeholders MATHS_NOTES holds for every A2, Statistics and
    // Mechanics Year 2 topic.
    notes: appendDiagramsToNotes(mergeNotes({ ...MATHS_NOTES, ...MATHS_NOTES_2, ...MATHS_PURE1_NOTES, ...MATHS_PURE2_NOTES, ...MATHS_APPLIED_NOTES }, MATHS_EXTRA_WORKED, MATHS_EXTRA_WORKED_2), MATHS_CHAPTER_DIAGRAMS),
  }
}

export default dedupeContent(withExtras(BASE))
