/**
 * @license
 * Copyright (c) 2026-2027 Ahmed Ramadan Fouad Ahmed Rabei — ROBYTE — All Rights Reserved.
 * Official Programming & Artificial Intelligence Curriculum Bank (Language Schools — Egyptian Baccalaureate 2nd Year)
 * Aligned with Units 1–4 (14 Lessons) & Weekly Assessments (100 Comprehensive Questions across 4 Worlds x 5 Stages).
 */

import { World, PlayerCharacter, Weapon, Armor, StagePerk } from '../types/gameTypes';

export const WORLDS_DATA: World[] = [
  // ============================================================================
  // WORLD 1: Unit 1 — Information Technology and Society
  // ============================================================================
  {
    id: 1,
    title: "AI Metropolis",
    subTitle: "Unit 1: Information Technology and Society",
    description: "Explore IT's historical evolution, Moore's Law, emerging technologies (Edge Computing, AR/VR, Quantum Computing), how AI and neural networks work, and ethical AI principles.",
    iconName: "Cpu",
    badge: "Unit 1",
    accentColor: "#00f5ff",
    borderColor: "border-cyan-500",
    themeType: 'ai-metropolis',
    lessons: [
      "Lesson 1-1: Development of IT and Social Transformation",
      "Lesson 1-2: How AI Works",
      "Lesson 1-3: AI in Daily Life and Industry",
      "Lesson 1-4: Ethical Issues with AI"
    ],
    boss: {
      name: "Core of Algorithmic Bias",
      title: "Commander of Distorted Data",
      description: "An unexplainable AI black-box guardian firing biased inference waves.",
      avatar: "🤖",
      maxHp: 500
    },
    subStages: [
      // Stage 1: Easy — Lesson 1-1 (IT History, Social Transformations & Moore's Law)
      {
        id: 1,
        name: "Origins of Computing",
        tagline: "From ENIAC to Social Transformations",
        difficulty: "easy",
        difficultyArabic: "Easy",
        description: "Clear the entry perimeter and master the historical eras and social shifts of Information Technology.",
        curriculumFocus: "Lesson 1-1: Development of IT and Social Transformation",
        questions: [
          {
            id: "w1-s1-q1",
            worldId: 1,
            subStageId: 1,
            questionIndex: 1,
            question: "Electronic computers began to emerge and were mainly used for military purposes and scientific calculations, such as the ENIAC, which used vacuum tubes, during which period?",
            options: ["The 1940s (to 1960s)", "The 1970s and 1980s", "The 1990s", "The 2000s"],
            correctAnswer: 0,
            explanation: "Official Curriculum (Lesson 1-1 / Model C Q1): In the 1940s–1960s, vacuum-tube electronic computers like ENIAC emerged mainly for military and scientific calculations.",
            difficulty: "easy",
            difficultyArabic: "Easy",
            type: "mcq",
            lesson: "Lesson 1-1: Development of IT and Social Transformation"
          },
          {
            id: "w1-s1-q2",
            worldId: 1,
            subStageId: 1,
            questionIndex: 2,
            question: "Which of the following options represents the main technology or event associated with the 1970s and 1980s?",
            options: [
              "The emergence of smartphones",
              "The widespread use of personal computers (PCs)",
              "The spread of cloud computing",
              "The availability of the Internet for commercial use and the emergence of the World Wide Web"
            ],
            correctAnswer: 1,
            explanation: "Official Curriculum (Lesson 1-1 Objective Q1): The 1970s–1980s witnessed the widespread use of personal computers (PCs), before the commercial Internet & World Wide Web emerged in the 1990s.",
            difficulty: "easy",
            difficultyArabic: "Easy",
            type: "mcq",
            lesson: "Lesson 1-1: Development of IT and Social Transformation"
          },
          {
            id: "w1-s1-q3",
            worldId: 1,
            subStageId: 1,
            questionIndex: 3,
            question: "During which period did the Internet become available for commercial use and the World Wide Web emerge, leading to wider global access to information?",
            options: [
              "The 1940s and 1960s",
              "The 1990s",
              "The 1970s and 1980s",
              "From the second decade of the 21st century onward"
            ],
            correctAnswer: 1,
            explanation: "Official Curriculum (Lesson 1-1 Model A Q1): The 1990s brought commercial Internet and the World Wide Web; the 2000s brought smartphones and mobile Internet; the 2010s onward brought cloud computing.",
            difficulty: "easy",
            difficultyArabic: "Easy",
            type: "mcq",
            lesson: "Lesson 1-1: Development of IT and Social Transformation"
          },
          {
            id: "w1-s1-q4",
            worldId: 1,
            subStageId: 1,
            questionIndex: 4,
            question: "What term refers to a working style in which a person performs their tasks from home or another remote location using communication technologies and the Internet?",
            options: ["Online Learning", "E-commerce", "Remote Work", "Cashless Payment"],
            correctAnswer: 2,
            explanation: "Official Curriculum (Lesson 1-1 Homework Q1 / Model C Q4): Remote Work lets individuals perform work outside traditional offices using the Internet, alongside Online Learning, E-commerce, SNS, and Cashless Payment.",
            difficulty: "easy",
            difficultyArabic: "Easy",
            type: "mcq",
            lesson: "Lesson 1-1: Development of IT and Social Transformation"
          },
          {
            id: "w1-s1-q5",
            worldId: 1,
            subStageId: 1,
            questionIndex: 5,
            question: "What is the empirical observation that describes a historical trend in which the number of transistors in integrated circuits approximately doubles every two years?",
            options: ["Cloud computing", "Moore's Law", "Edge computing", "Quantum superposition"],
            correctAnswer: 1,
            explanation: "Official Curriculum (Lesson 1-1 Objective Q2): Moore's Law is an empirical observation—not a fixed law of physics—that the number of transistors on an integrated circuit doubles roughly every two years.",
            difficulty: "easy",
            difficultyArabic: "Easy",
            type: "mcq",
            lesson: "Lesson 1-1: Development of IT and Social Transformation"
          }
        ]
      },
      // Stage 2: Easy-Medium — Lesson 1-1 (Cloud Computing, Moore's Law Limits, Edge, AR/VR, Quantum)
      {
        id: 2,
        name: "Emerging Compute Matrix",
        tagline: "Cloud, Edge, AR/VR & Quantum Horizons",
        difficulty: "easy-medium",
        difficultyArabic: "Easy–Medium",
        description: "Navigate elevated cyber platforms and master emerging computing technologies.",
        curriculumFocus: "Lesson 1-1: Emerging Technologies & Social Change",
        questions: [
          {
            id: "w1-s2-q1",
            worldId: 1,
            subStageId: 2,
            questionIndex: 1,
            question: "Which term refers to information technology resources provided as a service over the Internet to support big data analysis and artificial intelligence (popularized from the 2010s onward)?",
            options: ["Cloud Computing", "Edge Computing", "Classical Bit", "Quantum Superposition"],
            correctAnswer: 0,
            explanation: "Official Curriculum (Lesson 1-1 Model A Q3): From the 2010s onward, Cloud Computing transformed computing into IT resources provided as a service over the Internet.",
            difficulty: "easy-medium",
            difficultyArabic: "Easy–Medium",
            type: "mcq",
            lesson: "Lesson 1-1: Development of IT and Social Transformation"
          },
          {
            id: "w1-s2-q2",
            worldId: 1,
            subStageId: 2,
            questionIndex: 2,
            question: "Which engineering and physical challenges face the continued miniaturization of circuit components described by Moore's Law?",
            options: [
              "Lack of electrical outlets in homes",
              "Leakage currents, quantum effects, and the quantum tunneling effect",
              "Monitor screen refresh limits",
              "Too many keyboard keys"
            ],
            correctAnswer: 1,
            explanation: "Official Curriculum (Lesson 1-1 Model B Essay #2): As circuits shrink toward atomic limits, leakage currents and quantum tunneling challenge traditional miniaturization.",
            difficulty: "easy-medium",
            difficultyArabic: "Easy–Medium",
            type: "mcq",
            lesson: "Lesson 1-1: Development of IT and Social Transformation"
          },
          {
            id: "w1-s2-q3",
            worldId: 1,
            subStageId: 2,
            questionIndex: 3,
            question: "In Autonomous Driving—where a vehicle uses cameras, sensors, and AI to make immediate driving decisions—which technology processes data directly on the device instead of sending it to the cloud in order to reduce delays?",
            options: ["Cloud Computing", "Quantum Computing", "Edge Computing", "Social Networking Services"],
            correctAnswer: 2,
            explanation: "Official Curriculum (Lesson 1-1, 2nd Period Q1 & Model A Q2): Edge Computing processes data locally on the vehicle/device so even a tiny delay (such as 0.1 seconds) does not cause an accident.",
            difficulty: "easy-medium",
            difficultyArabic: "Easy–Medium",
            type: "application",
            lesson: "Lesson 1-1: Development of IT and Social Transformation"
          },
          {
            id: "w1-s2-q4",
            worldId: 1,
            subStageId: 2,
            questionIndex: 4,
            question: "Which statement accurately compares Augmented Reality (AR) and Virtual Reality (VR)?",
            options: [
              "AR adds digital elements or information to a real-world scene, whereas VR places the user in a computer-generated virtual environment",
              "AR places users inside a purely dark virtual room without any real-world view",
              "VR means paying with QR codes while AR means online shopping",
              "There is no difference between AR and VR"
            ],
            correctAnswer: 0,
            explanation: "Official Curriculum (Lesson 1-1, 2nd Period Q2 & Model A Q4): AR overlays digital information onto real-world images, while VR immerses the user in a fully computer-generated virtual world.",
            difficulty: "easy-medium",
            difficultyArabic: "Easy–Medium",
            type: "mcq",
            lesson: "Lesson 1-1: Development of IT and Social Transformation"
          },
          {
            id: "w1-s2-q5",
            worldId: 1,
            subStageId: 2,
            questionIndex: 5,
            question: "What distinguishes a (qubit) from a classical bit in quantum computing?",
            options: [
              "It holds one definite state, either 0 or 1, at any given time",
              "It uses the principle of quantum superposition to exist as a combination of 0 and 1 at the same time",
              "It relies only on traditional integrated circuits and a stable electric current",
              "Its use is limited exclusively to simple arithmetic"
            ],
            correctAnswer: 1,
            explanation: "Official Curriculum (Lesson 1-1 Homework Q1): Unlike a classical bit (strictly 0 or 1), a qubit leverages quantum superposition to represent a combination of 0 and 1 simultaneously.",
            difficulty: "easy-medium",
            difficultyArabic: "Easy–Medium",
            type: "mcq",
            lesson: "Lesson 1-1: Development of IT and Social Transformation"
          }
        ]
      },
      // Stage 3: Medium — Lesson 1-2 (How AI Works: Hierarchy, ML, ANN, Narrow AI, GenAI & Hallucination)
      {
        id: 3,
        name: "Neural Pipeline Sky-Bridge",
        tagline: "Inside Machine Learning & Generative AI",
        difficulty: "medium",
        difficultyArabic: "Medium",
        description: "Ascend the sky-bridge and trace how modern AI, neural networks, and Generative AI work.",
        curriculumFocus: "Lesson 1-2: How AI Works",
        questions: [
          {
            id: "w1-s3-q1",
            worldId: 1,
            subStageId: 3,
            questionIndex: 1,
            question: "Which statement accurately describes the relationship among Artificial Intelligence (AI), Machine Learning, Deep Learning, and Generative AI?",
            options: [
              "Generative AI is the broadest category enclosing Artificial Intelligence",
              "AI is the broad field; Machine Learning is a branch of AI; Deep Learning is a Machine Learning style using multi-layer neural networks; and Generative AI relies on Deep Learning to create new content",
              "Machine Learning and Deep Learning are unrelated to Artificial Intelligence",
              "Deep Learning means programming computers strictly with fixed manual rules"
            ],
            correctAnswer: 1,
            explanation: "Official Curriculum (Lesson 1-2 Hierarchy): AI > Machine Learning > Deep Learning > Generative AI, each representing a progressively specialized layer.",
            difficulty: "medium",
            difficultyArabic: "Medium",
            type: "mcq",
            lesson: "Lesson 1-2: How AI Works"
          },
          {
            id: "w1-s3-q2",
            worldId: 1,
            subStageId: 3,
            questionIndex: 2,
            question: "What is Machine Learning in the context of AI technologies?",
            options: [
              "A branch of AI in which models learn patterns from data to make predictions or classifications without explicitly programming every rule",
              "A system for generating videos exclusively without training data",
              "A set of strictly programmed and fixed rules written manually",
              "An unconnected set of vacuum-tube switches"
            ],
            correctAnswer: 0,
            explanation: "Official Curriculum (Lesson 1-2, 1st Period Q2 & Model A Q1): Unlike traditional rule-based programs, Machine Learning extracts patterns from data (e.g., spam filters and product recommendations).",
            difficulty: "medium",
            difficultyArabic: "Medium",
            type: "mcq",
            lesson: "Lesson 1-2: How AI Works"
          },
          {
            id: "w1-s3-q3",
            worldId: 1,
            subStageId: 3,
            questionIndex: 3,
            question: "What are the basic components of an Artificial Neural Network (ANN) that enable it to learn complex patterns from data?",
            options: [
              "Connected layers (input layer, hidden layers, and output layer) containing neurons whose weights change during training",
              "A set of vacuum tubes and simple electrical resistors",
              "Fixed programming rules written using purely linear steps",
              "Manual switches controlling power flow to the display"
            ],
            correctAnswer: 0,
            explanation: "Official Curriculum (Lesson 1-2 Homework Q2 & Model B Q3): Inspired in a simplified way by brain neurons, ANNs connect input, hidden, and output layers whose connection weights adjust during training.",
            difficulty: "medium",
            difficultyArabic: "Medium",
            type: "mcq",
            lesson: "Lesson 1-2: How AI Works"
          },
          {
            id: "w1-s3-q4",
            worldId: 1,
            subStageId: 3,
            questionIndex: 4,
            question: "Most current Artificial Intelligence systems are designed to perform:",
            options: [
              "A specific task or a limited set of tasks (Narrow AI)",
              "Every human mental capability in all fields without limitations",
              "Only mechanical assembly of old household devices",
              "Global military telephone switching exclusively"
            ],
            correctAnswer: 0,
            explanation: "Official Curriculum (Lesson 1-2 Model C Q1): Nearly all current AI systems specialize in a focused task or limited task set (known as Narrow AI).",
            difficulty: "medium",
            difficultyArabic: "Medium",
            type: "mcq",
            lesson: "Lesson 1-2: How AI Works"
          },
          {
            id: "w1-s3-q5",
            worldId: 1,
            subStageId: 3,
            questionIndex: 5,
            question: "When Generative AI (such as text or image tools like ChatGPT) produces text that appears reasonable and logical but is factually incorrect, what is this called, and what should learners do?",
            options: [
              "Compression; copy and submit the output directly without reading",
              "Hallucination; always verify the outputs and check their original sources and references",
              "Superposition; delete all books and reliable school sources",
              "Compilation; treat every AI output as an absolute scientific fact"
            ],
            correctAnswer: 1,
            explanation: "Official Curriculum (Lesson 1-2 Model A Q4, Model B Q4 & Model C Q4): Generative AI can exhibit hallucination, producing plausible falsehoods—so learners must always verify outputs and review sources.",
            difficulty: "medium",
            difficultyArabic: "Medium",
            type: "application",
            lesson: "Lesson 1-2: How AI Works"
          }
        ]
      },
      // Stage 4: Hard — Lesson 1-3 (AI in Daily Life and Industry & Precautions)
      {
        id: 4,
        name: "Tensor Industrial Sector",
        tagline: "Daily Life, Industry & AI Precautions",
        difficulty: "hard",
        difficultyArabic: "Hard",
        description: "Analyze AI roles across everyday services and major industrial sectors while guarding against AI limits.",
        curriculumFocus: "Lesson 1-3: AI in Daily Life and Industry",
        questions: [
          {
            id: "w1-s4-q1",
            worldId: 1,
            subStageId: 4,
            questionIndex: 1,
            question: "Which everyday AI services correspond to (1) predicting preferences on YouTube and Amazon, (2) executing commands like Siri and Google Assistant, and (3) unlocking smartphones & detecting faces in photos?",
            options: [
              "Recommendation System, Voice Assistant, and Facial Recognition (alongside Machine Translation)",
              "Predictive Maintenance, Route Optimization, and Pest Detection",
              "Firewall, DMZ, and Zero Trust",
              "Wireframe, Persona, and Bounce Rate"
            ],
            correctAnswer: 0,
            explanation: "Official Curriculum (Lesson 1-3 pp. 17–22): Lesson 1-3 identifies four key everyday AI services: Recommendation Systems, Voice Assistants, Machine Translation, and Facial Recognition.",
            difficulty: "hard",
            difficultyArabic: "Hard",
            type: "mcq",
            lesson: "Lesson 1-3: AI in Daily Life and Industry"
          },
          {
            id: "w1-s4-q2",
            worldId: 1,
            subStageId: 4,
            questionIndex: 2,
            question: "Which industry uses Artificial Intelligence to detect diseases from X-ray and CT scan images and support drug discovery, yet still requires confirmation by a human physician?",
            options: ["Healthcare", "Logistics", "Manufacturing", "Agriculture"],
            correctAnswer: 0,
            explanation: "Official Curriculum (Lesson 1-3, 2nd Period Q1 & Model B Essay #4): In Healthcare, AI supports image-based diagnosis (X-rays & CT scans) and drug discovery, while the human doctor remains essential for final judgment and confirmation.",
            difficulty: "hard",
            difficultyArabic: "Hard",
            type: "application",
            lesson: "Lesson 1-3: AI in Daily Life and Industry"
          },
          {
            id: "w1-s4-q3",
            worldId: 1,
            subStageId: 4,
            questionIndex: 3,
            question: "Which option accurately identifies AI's main applications in the Agriculture and Manufacturing sectors?",
            options: [
              "Agriculture: predicting harvest time and detecting pests and diseases; Manufacturing: product quality inspection and predictive maintenance",
              "Agriculture: unlocking smartphones; Manufacturing: translating languages",
              "Both sectors use AI solely for movie recommendations",
              "Manufacturing uses AI to eliminate doctors from hospitals"
            ],
            correctAnswer: 0,
            explanation: "Official Curriculum (Lesson 1-3, 2nd Period Q2 & Model A Q2): Agriculture applies AI for harvest timing and pest/disease detection; Manufacturing uses it for automated quality inspection and predicting machine failures (predictive maintenance).",
            difficulty: "hard",
            difficultyArabic: "Hard",
            type: "mcq",
            lesson: "Lesson 1-3: AI in Daily Life and Industry"
          },
          {
            id: "w1-s4-q4",
            worldId: 1,
            subStageId: 4,
            questionIndex: 4,
            question: "Which industrial sector is directly associated with using Artificial Intelligence for the optimization of delivery routes?",
            options: ["Healthcare", "Agriculture", "Manufacturing", "Logistics"],
            correctAnswer: 3,
            explanation: "Official Curriculum (Lesson 1-3 Homework Q2 & Model B Q2): The Logistics sector uses AI to optimize delivery routes and improve distribution efficiency.",
            difficulty: "hard",
            difficultyArabic: "Hard",
            type: "mcq",
            lesson: "Lesson 1-3: AI in Daily Life and Industry"
          },
          {
            id: "w1-s4-q5",
            worldId: 1,
            subStageId: 4,
            questionIndex: 5,
            question: "Among the precautions for using AI, what is meant by the 'Black-Box Problem', and what does AI truly excel at?",
            options: [
              "Black-Box Problem = lack of clarity about how an AI reached its judgment; AI excels at recognizing patterns and probabilistic inference rather than autonomous ethical decisions",
              "Black-Box Problem = slow keyboard speed; AI excels at making absolute ethical judgments without human oversight",
              "Black-Box Problem = using copyright works; AI automatically protects all personal data confidentially",
              "Black-Box Problem = turning off the screen; AI never suffers from training data bias"
            ],
            correctAnswer: 0,
            explanation: "Official Curriculum (Lesson 1-3 Homework Q2 & Model A Q4): AI excels at pattern recognition and probabilistic inference, whereas the Black-Box problem—plus bias, hallucination, copyright, privacy, and final ethical decisions—requires human caution.",
            difficulty: "hard",
            difficultyArabic: "Hard",
            type: "mcq",
            lesson: "Lesson 1-3: AI in Daily Life and Industry"
          }
        ]
      },
      // Stage 5: Boss — Lesson 1-4 (Ethical Issues with AI)
      {
        id: 5,
        name: "Core of Algorithmic Bias",
        tagline: "Boss Battle: Bias, Privacy, XAI & AI Ethics",
        difficulty: "very-hard",
        difficultyArabic: "Boss Stage",
        description: "Confront the Core of Algorithmic Bias and enforce the 4 Principles of AI Ethics!",
        curriculumFocus: "Lesson 1-4: Ethical Issues with AI",
        bossName: "Core of Algorithmic Bias",
        questions: [
          {
            id: "w1-s5-q1",
            worldId: 1,
            subStageId: 5,
            questionIndex: 1,
            question: "Which of the following is an INCORRECT reason for the emergence of Algorithmic Bias (such as an AI hiring system favoring one group or facial recognition with lower accuracy for certain groups)?",
            options: [
              "Biased training data",
              "Reflection of prior discriminatory biases or proxy variables in the data",
              "The computer's processing speed is slow",
              "Insufficient data on certain characteristics"
            ],
            correctAnswer: 2,
            explanation: "Official Curriculum (Lesson 1-4, 1st Period Q1 & Model C Q4): Algorithmic bias arises from biased or insufficient training data, past discriminatory tendencies, or inappropriate proxy variables—NOT slow processor speed.",
            difficulty: "very-hard",
            difficultyArabic: "Boss Stage",
            type: "application",
            lesson: "Lesson 1-4: Ethical Issues with AI"
          },
          {
            id: "w1-s5-q2",
            worldId: 1,
            subStageId: 5,
            questionIndex: 2,
            question: "Which technique enables humans to understand the factors and reasons that led an Artificial Intelligence system to make a specific decision, helping overcome the Black-Box problem?",
            options: [
              "Cloud Computing",
              "Explainable Artificial Intelligence (XAI)",
              "Edge Computing",
              "Algorithmic Bias"
            ],
            correctAnswer: 1,
            explanation: "Official Curriculum (Lesson 1-4, 2nd Period Q1 & Model A Q2): Explainable Artificial Intelligence (XAI) helps humans understand why an AI reached a result and detect errors.",
            difficulty: "very-hard",
            difficultyArabic: "Boss Stage",
            type: "mcq",
            lesson: "Lesson 1-4: Ethical Issues with AI"
          },
          {
            id: "w1-s5-q3",
            worldId: 1,
            subStageId: 5,
            questionIndex: 3,
            question: "What is the fundamental difference between 'Responsibility' and 'Accountability' in AI systems, as explained in Lesson 1-4?",
            options: [
              "There is no difference between them; they are synonymous terms",
              "Responsibility relates to defining the roles and duties of the parties (developer, operator, user), whereas accountability entails identifying the entities that can be held answerable based on their roles",
              "Accountability means collecting training data, whereas responsibility means deleting logs",
              "Responsibility applies only to machines while accountability applies only to browsers"
            ],
            correctAnswer: 1,
            explanation: "Official Curriculum (Lesson 1-4, 2nd Period Q2): Responsibility defines each party's roles and duties (developer, operator, user), whereas accountability identifies who can be held answerable based on those roles.",
            difficulty: "very-hard",
            difficultyArabic: "Boss Stage",
            type: "mcq",
            lesson: "Lesson 1-4: Ethical Issues with AI"
          },
          {
            id: "w1-s5-q4",
            worldId: 1,
            subStageId: 5,
            questionIndex: 4,
            question: "Which privacy concern is associated with the spread of Artificial Intelligence technologies in society?",
            options: [
              "Identifying and tracking individuals in public spaces using facial recognition and collecting large amounts of online behavioral data",
              "Increasing microprocessor clock frequency",
              "Organizing personal folders on a local desktop",
              "Editing landscape photos for better brightness"
            ],
            correctAnswer: 0,
            explanation: "Official Curriculum (Lesson 1-4 Homework Q2 p. 24 & Model C Q2 p. 28): Widespread facial recognition in public places and mass behavioral data collection raise serious Privacy Protection concerns.",
            difficulty: "very-hard",
            difficultyArabic: "Boss Stage",
            type: "mcq",
            lesson: "Lesson 1-4: Ethical Issues with AI"
          },
          {
            id: "w1-s5-q5",
            worldId: 1,
            subStageId: 5,
            questionIndex: 5,
            question: "Which four fundamental principles form the ethical framework for responsible AI use in Lesson 1-4?",
            options: [
              "Speed, Profit, Secrecy, and Automation",
              "Fairness, Transparency, Privacy Protection, and Accountability",
              "Graphics, Storage, Bandwidth, and Hardware",
              "Compilation, Execution, Debugging, and Hosting"
            ],
            correctAnswer: 1,
            explanation: "Official Curriculum (Lesson 1-4 pp. 25–29): The four principles of AI ethics are Fairness (non-discrimination), Transparency (clear system & limitation details), Privacy Protection, and Accountability.",
            difficulty: "very-hard",
            difficultyArabic: "Boss Stage",
            type: "mcq",
            lesson: "Lesson 1-4: Ethical Issues with AI"
          }
        ]
      }
    ]
  },

  // ============================================================================
  // WORLD 2: Unit 2 — Cybersecurity
  // ============================================================================
  {
    id: 2,
    title: "Cyber Fortress",
    subTitle: "Unit 2: Cybersecurity",
    description: "Defend the fortress with HTTPS & TLS handshakes, symmetric & public-key cryptography, digital certificates & signatures, 2FA/MFA, Firewall/VPN/DMZ/Defense-in-Depth/Zero Trust, and 6-stage Incident Response.",
    iconName: "ShieldAlert",
    badge: "Unit 2",
    accentColor: "#10b981",
    borderColor: "border-emerald-500",
    themeType: 'cyber-fortress',
    lessons: [
      "Lesson 2-1: Cryptographic Technologies and Authentication",
      "Lesson 2-2: Network Security Design",
      "Lesson 2-3: Incident Response and Risk Management"
    ],
    boss: {
      name: "Hydra Ransomware Bot",
      title: "Overseer of Security Incidents",
      description: "An adversarial ransomware threat testing your incident response order and risk prioritization.",
      avatar: "🐉",
      maxHp: 600
    },
    subStages: [
      // Stage 1: Easy — Lesson 2-1 (HTTPS, TLS Handshake, Cryptography, Digital Certificate & Signature)
      {
        id: 1,
        name: "Encryption Bastion",
        tagline: "HTTPS, TLS, Keys & Digital Signatures",
        difficulty: "easy",
        difficultyArabic: "Easy",
        description: "Verify TLS handshakes, key roles, certificates, and signatures along the outer wall.",
        curriculumFocus: "Lesson 2-1: Cryptographic Technologies",
        questions: [
          {
            id: "w2-s1-q1",
            worldId: 2,
            subStageId: 1,
            questionIndex: 1,
            question: "The HTTP protocol transmitted over a secure TLS connection, providing data confidentiality and integrity during transit, is known as:",
            options: ["HTTPS", "FTP", "SMTP", "DNS"],
            correctAnswer: 0,
            explanation: "Official Curriculum (Lesson 2-1 Model A Q1 p. 33): HTTPS runs HTTP over TLS (Transport Layer Security) so third parties cannot read or alter transmitted data.",
            difficulty: "easy",
            difficultyArabic: "Easy",
            type: "mcq",
            lesson: "Lesson 2-1: Cryptographic Technologies and Authentication"
          },
          {
            id: "w2-s1-q2",
            worldId: 2,
            subStageId: 1,
            questionIndex: 2,
            question: "During an HTTPS connection, which cryptographic technology is used to encrypt session data quickly and efficiently AFTER the TLS handshake and key exchange are completed?",
            options: [
              "Public-key cryptography only for the whole session",
              "Symmetric (common-key) cryptography",
              "Manual paper keys",
              "Unencrypted plain text"
            ],
            correctAnswer: 1,
            explanation: "Official Curriculum (Lesson 2-1, 1st Period Q1 & Model B Essay #2): TLS uses public-key cryptography during the initial handshake to share a secret, then switches to fast symmetric cryptography for bulk session data.",
            difficulty: "easy",
            difficultyArabic: "Easy",
            type: "mcq",
            lesson: "Lesson 2-1: Cryptographic Technologies and Authentication"
          },
          {
            id: "w2-s1-q3",
            worldId: 2,
            subStageId: 1,
            questionIndex: 3,
            question: "Which technology helps the browser verify the identity of the server and the match between the domain name and its public key during a TLS connection?",
            options: [
              "Symmetric cryptography",
              "Digital certificate",
              "Classical bit",
              "Push notification"
            ],
            correctAnswer: 1,
            explanation: "Official Curriculum (Lesson 2-1, 2nd Period Q1 & Model B Q2): A Digital Certificate issued via a Certificate Authority (CA) lets the browser verify server identity and hostname match.",
            difficulty: "easy",
            difficultyArabic: "Easy",
            type: "mcq",
            lesson: "Lesson 2-1: Cryptographic Technologies and Authentication"
          },
          {
            id: "w2-s1-q4",
            worldId: 2,
            subStageId: 1,
            questionIndex: 4,
            question: "Which technology detects tampering and impersonation, and provides evidence supporting non-repudiation?",
            options: [
              "Symmetric cryptography",
              "Digital signature",
              "Cloud computing",
              "Bounce rate"
            ],
            correctAnswer: 1,
            explanation: "Official Curriculum (Lesson 2-1, 2nd Period Q2 & Model A Q3): A Digital Signature verifies who created the data, detects tampering/impersonation, and provides proof of non-repudiation.",
            difficulty: "easy",
            difficultyArabic: "Easy",
            type: "mcq",
            lesson: "Lesson 2-1: Cryptographic Technologies and Authentication"
          },
          {
            id: "w2-s1-q5",
            worldId: 2,
            subStageId: 1,
            questionIndex: 5,
            question: "What are the steps for establishing a secure connection, verifying the server's identity, and agreeing on shared secrets from which session keys are derived called?",
            options: [
              "TLS handshake",
              "Symmetric cryptography",
              "Digital signature",
              "Two-factor authentication"
            ],
            correctAnswer: 0,
            explanation: "Official Curriculum (Lesson 2-1, 1st Period Q2 & Model C Q1 p. 35): The TLS handshake authenticates the server and derives shared session secrets before encrypted data flow begins.",
            difficulty: "easy",
            difficultyArabic: "Easy",
            type: "mcq",
            lesson: "Lesson 2-1: Cryptographic Technologies and Authentication"
          }
        ]
      },
      // Stage 2: Easy-Medium — Lesson 2-1 (2FA, MFA Factor Categories & Combined Security)
      {
        id: 2,
        name: "Identity Verification Gate",
        tagline: "Mastering 2FA & Multi-Factor Categories",
        difficulty: "easy-medium",
        difficultyArabic: "Easy–Medium",
        description: "Audit authentication factors and eliminate invalid single-category security setups.",
        curriculumFocus: "Lesson 2-1: Authentication Factors (2FA & MFA)",
        questions: [
          {
            id: "w2-s2-q1",
            worldId: 2,
            subStageId: 2,
            questionIndex: 1,
            question: "Which of the following options accurately represents the three categories of Multi-Factor Authentication (MFA) factors?",
            options: [
              "Knowledge, possession, and biometric traits",
              "Speed, efficiency, and cost",
              "Public key, private key, and password",
              "Wireless connectivity, local network, and cloud"
            ],
            correctAnswer: 0,
            explanation: "Official Curriculum (Lesson 2-1 Model A Q4 p. 33): True 2FA/MFA combines independent factors across three categories: Knowledge, Possession, and Biometric traits.",
            difficulty: "easy-medium",
            difficultyArabic: "Easy–Medium",
            type: "mcq",
            lesson: "Lesson 2-1: Cryptographic Technologies and Authentication"
          },
          {
            id: "w2-s2-q2",
            worldId: 2,
            subStageId: 2,
            questionIndex: 2,
            question: "Which of the following is an INCORRECT example of two-factor authentication (2FA) because it relies on the SAME category of factor (knowledge)?",
            options: [
              "Password + a one-time password (OTP) sent to the phone",
              "Password + fingerprint",
              "Password + a second secret password",
              "Password + code from an authentication app"
            ],
            correctAnswer: 2,
            explanation: "Official Curriculum (Lesson 2-1 Homework Q2 p. 32): A password and a second secret password (or secret question) are both 'Knowledge' factors—true 2FA requires factors from different categories.",
            difficulty: "easy-medium",
            difficultyArabic: "Easy–Medium",
            type: "application",
            lesson: "Lesson 2-1: Cryptographic Technologies and Authentication"
          },
          {
            id: "w2-s2-q3",
            worldId: 2,
            subStageId: 2,
            questionIndex: 3,
            question: "Which of the following options represents a valid example of the 'possession' factor in two-factor authentication?",
            options: [
              "Knowing a secret question",
              "A one-time password (OTP) sent to the phone or a smart card",
              "User fingerprint",
              "Facial recognition"
            ],
            correctAnswer: 1,
            explanation: "Official Curriculum (Lesson 2-1 Model B Q3 p. 34): Something you possess includes an OTP sent to your phone/app, a smart card, or an ATM card—whereas secret questions are Knowledge.",
            difficulty: "easy-medium",
            difficultyArabic: "Easy–Medium",
            type: "mcq",
            lesson: "Lesson 2-1: Cryptographic Technologies and Authentication"
          },
          {
            id: "w2-s2-q4",
            worldId: 2,
            subStageId: 2,
            questionIndex: 4,
            question: "Which of the following is an example of the 'Biometric traits' factor in authentication?",
            options: [
              "Text password",
              "Fingerprint or facial recognition",
              "ATM card",
              "SMS verification code"
            ],
            correctAnswer: 1,
            explanation: "Official Curriculum (Lesson 2-1 Model C Q3 p. 35): Biometric traits verify 'who you are' using physical characteristics such as fingerprint or facial recognition.",
            difficulty: "easy-medium",
            difficultyArabic: "Easy–Medium",
            type: "mcq",
            lesson: "Lesson 2-1: Cryptographic Technologies and Authentication"
          },
          {
            id: "w2-s2-q5",
            worldId: 2,
            subStageId: 2,
            questionIndex: 5,
            question: "How do online stores and banking services protect registration and payment processes effectively?",
            options: [
              "Relying on a single technology such as a simple password alone",
              "Combining encryption, digital certificates, digital signatures, and two-factor authentication to mitigate multiple risks",
              "Eliminating all public and private keys",
              "Relying only on symmetric encryption without authentication"
            ],
            correctAnswer: 1,
            explanation: "Official Curriculum (Lesson 2-1 Model B Q4 p. 34 & Model C Q4 p. 35): No single technology protects everything—secure online services combine cryptography, certificates, signatures, and 2FA.",
            difficulty: "easy-medium",
            difficultyArabic: "Easy–Medium",
            type: "application",
            lesson: "Lesson 2-1: Cryptographic Technologies and Authentication"
          }
        ]
      },
      // Stage 3: Medium — Lesson 2-2 (Network Security: Firewall, VPN, DMZ, Defense in Depth, Zero Trust)
      {
        id: 3,
        name: "DMZ & Zero-Trust Corridor",
        tagline: "Defense in Depth Across Every Layer",
        difficulty: "medium",
        difficultyArabic: "Medium",
        description: "Configure firewalls, VPN tunnels, DMZ isolation zones, 4-layer Defense in Depth, and Zero Trust.",
        curriculumFocus: "Lesson 2-2: Network Security Design",
        questions: [
          {
            id: "w2-s3-q1",
            worldId: 2,
            subStageId: 3,
            questionIndex: 1,
            question: "What is the term used for a system or program that monitors network traffic and allows or blocks it according to specific security rules?",
            options: [
              "Virtual Private Network (VPN)",
              "Demilitarized Zone (DMZ)",
              "Firewall",
              "Zero Trust Approach"
            ],
            correctAnswer: 2,
            explanation: "Official Curriculum (Lesson 2-2, 1st Period Q2 p. 36 & Model A Q1 p. 39): A Firewall inspects incoming/outgoing traffic at the network boundary and permits or blocks connections by rule (for instance, protecting internal databases).",
            difficulty: "medium",
            difficultyArabic: "Medium",
            type: "mcq",
            lesson: "Lesson 2-2: Network Security Design"
          },
          {
            id: "w2-s3-q2",
            worldId: 2,
            subStageId: 3,
            questionIndex: 2,
            question: "What is the term for a private, logical connection over a public network (such as the Internet) that uses encryption and tunneling to safely connect remote employees or branch offices over public Wi-Fi?",
            options: [
              "Virtual Private Network (VPN)",
              "Security Perimeter",
              "Firewall",
              "Peripheral Devices"
            ],
            correctAnswer: 0,
            explanation: "Official Curriculum (Lesson 2-2 Homework Q1–Q2 p. 37 & Model C Q4 p. 42): A VPN creates an encrypted virtual tunnel over public networks to protect against eavesdropping.",
            difficulty: "medium",
            difficultyArabic: "Medium",
            type: "application",
            lesson: "Lesson 2-2: Network Security Design"
          },
          {
            id: "w2-s3-q3",
            worldId: 2,
            subStageId: 3,
            questionIndex: 3,
            question: "What is the purpose of a Demilitarized Zone (DMZ) in network security architecture?",
            options: [
              "A fully open public zone giving attackers direct access to internal databases",
              "A zone where servers exposed to the external network (such as web and mail servers) are placed separately from the organization's internal network",
              "Malicious software that alters firewall rules automatically",
              "Disconnecting the company from the Internet permanently"
            ],
            correctAnswer: 1,
            explanation: "Official Curriculum (Lesson 2-2, 2nd Period Q1 p. 38 & Model A Q2 p. 39): Placing public web/mail servers in a DMZ isolates them from the internal network if an external attack compromises them.",
            difficulty: "medium",
            difficultyArabic: "Medium",
            type: "mcq",
            lesson: "Lesson 2-2: Network Security Design"
          },
          {
            id: "w2-s3-q4",
            worldId: 2,
            subStageId: 3,
            questionIndex: 4,
            question: "In the four layers of 'Defense in Depth' (1: Network Entry Point = Firewall, 2: Communication Path = VPN, 3: Server Placement = DMZ), which layer is directly associated with installing antivirus software and updating the operating system?",
            options: [
              "Network Entry Point",
              "Communication Path",
              "Server Placement",
              "Peripheral devices (Endpoints)"
            ],
            correctAnswer: 3,
            explanation: "Official Curriculum (Lesson 2-2 Homework Q2 p. 38 & Model B Q2 p. 40): Defense in Depth stacks multiple security layers so remaining layers still reduce risk if one fails; Layer 4 protects Peripheral devices / endpoints.",
            difficulty: "medium",
            difficultyArabic: "Medium",
            type: "mcq",
            lesson: "Lesson 2-2: Network Security Design"
          },
          {
            id: "w2-s3-q5",
            worldId: 2,
            subStageId: 3,
            questionIndex: 5,
            question: "How does the 'Zero Trust Approach' differ from the traditional 'Security Perimeter' assumption (which has been blurred by cloud services and remote work)?",
            options: [
              "Zero Trust automatically trusts every user and device inside the office",
              "Zero Trust does NOT automatically trust a user or device simply because it is inside the network or owned by the organization—it verifies identity, permissions, and context",
              "Zero Trust relies strictly on an outer firewall and disables internal verification",
              "Zero Trust removes encryption when working from home"
            ],
            correctAnswer: 1,
            explanation: "Official Curriculum (Lesson 2-2, 2nd Period Q2 p. 38 & Model B Essay #3): Because cloud services and remote work blurred the boundary between inside and outside, Zero Trust verifies identity and context on every request.",
            difficulty: "medium",
            difficultyArabic: "Medium",
            type: "mcq",
            lesson: "Lesson 2-2: Network Security Design"
          }
        ]
      },
      // Stage 4: Hard — Lesson 2-3 (Security Incidents & the 6 Incident Response Stages)
      {
        id: 4,
        name: "Incident Response Command",
        tagline: "The 6 Stages of Incident Handling",
        difficulty: "hard",
        difficultyArabic: "Hard",
        description: "Execute the six incident response stages in proper order to contain and eradicate threats.",
        curriculumFocus: "Lesson 2-3: Incident Response Stages",
        questions: [
          {
            id: "w2-s4-q1",
            worldId: 2,
            subStageId: 4,
            questionIndex: 1,
            question: "What defines a 'security incident', and what are the three typical examples covered in Lesson 2-3?",
            options: [
              "A routine operating system update",
              "An event affecting confidentiality, integrity, or availability—such as information leakage, data tampering (unauthorized modification), and service disruption",
              "Changing screen brightness during a meeting",
              "Setting up response procedures in advance"
            ],
            correctAnswer: 1,
            explanation: "Official Curriculum (Lesson 2-3 Model A Q1 p. 45 & Model B Essay #4 p. 46): Security incidents include information leakage, unauthorized data modification (data tampering), and service disruption.",
            difficulty: "hard",
            difficultyArabic: "Hard",
            type: "mcq",
            lesson: "Lesson 2-3: Incident Response and Risk Management"
          },
          {
            id: "w2-s4-q2",
            worldId: 2,
            subStageId: 4,
            questionIndex: 2,
            question: "Which sequence shows the six stages of incident response in the correct sequential order?",
            options: [
              "Recovery → Containment → Detection → Preparation → Eradication → Lessons Learned and Improvement",
              "Preparation → Detection → Containment → Eradication → Recovery → Lessons Learned and Improvement",
              "Eradication → Preparation → Recovery → Containment → Detection → Lessons Learned",
              "Detection → Recovery → Preparation → Eradication → Containment → Lessons Learned"
            ],
            correctAnswer: 1,
            explanation: "Official Curriculum (Lesson 2-3 Model A Essay #2 p. 45): The 6 stages follow: Preparation → Detection → Containment → Eradication → Recovery → Lessons Learned and Improvement.",
            difficulty: "hard",
            difficultyArabic: "Hard",
            type: "mcq",
            lesson: "Lesson 2-3: Incident Response and Risk Management"
          },
          {
            id: "w2-s4-q3",
            worldId: 2,
            subStageId: 4,
            questionIndex: 3,
            question: "Why should the 'Containment' stage (isolating the affected part to limit impact) be carried out BEFORE 'Eradication'?",
            options: [
              "To prevent the problem or threat from spreading to other parts of the system while the root cause is being removed",
              "Because Eradication means restoring systems from clean backups first",
              "Because Detection happens after Recovery",
              "To publish confidential information publicly"
            ],
            correctAnswer: 0,
            explanation: "Official Curriculum (Lesson 2-3, 2nd Period Essay #2 p. 44 & Model C Essay #2 p. 47): Containment stops the spread immediately before teams eradicate the malware or threat cause.",
            difficulty: "hard",
            difficultyArabic: "Hard",
            type: "application",
            lesson: "Lesson 2-3: Incident Response and Risk Management"
          },
          {
            id: "w2-s4-q4",
            worldId: 2,
            subStageId: 4,
            questionIndex: 4,
            question: "What are the respective goals of the 'Eradication' stage and the 'Recovery' stage?",
            options: [
              "Eradication removes the threat and its root causes (such as deleting malware); Recovery restores systems and services safely to normal operation (possibly from a clean backup)",
              "Eradication documents lessons learned; Recovery disconnects network cables",
              "Recovery creates the threat; Eradication hides detection logs",
              "Both stages mean ignoring the incident completely"
            ],
            correctAnswer: 0,
            explanation: "Official Curriculum (Lesson 2-3, 2nd Period Q1 p. 44 & Model A Q4 p. 45): Threats must be removed in Eradication before cleanly restoring services in Recovery.",
            difficulty: "hard",
            difficultyArabic: "Hard",
            type: "mcq",
            lesson: "Lesson 2-3: Incident Response and Risk Management"
          },
          {
            id: "w2-s4-q5",
            worldId: 2,
            subStageId: 4,
            questionIndex: 5,
            question: "Which stage concludes the six stages of incident response by analyzing what happened, documenting lessons learned, and improving controls to reduce future recurrence?",
            options: [
              "Preparation stage",
              "Detection stage",
              "Containment stage",
              "Lessons Learned and Improvement stage"
            ],
            correctAnswer: 3,
            explanation: "Official Curriculum (Lesson 2-3, 2nd Period Q2 p. 44 & Model C Q2 p. 47): The final stage evaluates the incident and feeds improvements back into future security readiness.",
            difficulty: "hard",
            difficultyArabic: "Hard",
            type: "mcq",
            lesson: "Lesson 2-3: Incident Response and Risk Management"
          }
        ]
      },
      // Stage 5: Boss — Lesson 2-3 (Risk Assessment Matrix, Impact/Likelihood & Incident Scenarios)
      {
        id: 5,
        name: "Hydra Ransomware Citadel",
        tagline: "Boss Battle: Risk Matrix & Crisis Handling",
        difficulty: "very-hard",
        difficultyArabic: "Boss Stage",
        description: "Neutralize Hydra Ransomware Bot by applying risk formulas, matrices, and incident response!",
        curriculumFocus: "Lesson 2-3: Risk Management & Crisis Response",
        bossName: "Hydra Ransomware Bot",
        questions: [
          {
            id: "w2-s5-q1",
            worldId: 2,
            subStageId: 5,
            questionIndex: 1,
            question: "How is the risk level calculated in the simplified Risk Assessment model presented in Lesson 2-3?",
            options: [
              "Impact + Likelihood",
              "Impact × Likelihood",
              "Impact − Likelihood",
              "Impact ÷ Likelihood"
            ],
            correctAnswer: 1,
            explanation: "Official Curriculum (Lesson 2-3 Homework Q2 p. 44 & Model B Q3 p. 46): The simplified risk level combines Impact × Likelihood.",
            difficulty: "very-hard",
            difficultyArabic: "Boss Stage",
            type: "mcq",
            lesson: "Lesson 2-3: Incident Response and Risk Management"
          },
          {
            id: "w2-s5-q2",
            worldId: 2,
            subStageId: 5,
            questionIndex: 2,
            question: "In risk assessment, what do 'Impact' and 'Likelihood' mean respectively?",
            options: [
              "Impact = the speed of response; Likelihood = number of servers",
              "Impact = the amount of expected harm if the risk occurs; Likelihood = the probability of the event or risk occurring",
              "Both measure total Internet download speed",
              "Impact measures the firewall size; Likelihood measures monitor brightness"
            ],
            correctAnswer: 1,
            explanation: "Official Curriculum (Lesson 2-3 Homework Q2 p. 45 & Model B Q4 p. 46): Impact quantifies potential harm if the incident occurs, while Likelihood evaluates how probable the threat is.",
            difficulty: "very-hard",
            difficultyArabic: "Boss Stage",
            type: "mcq",
            lesson: "Lesson 2-3: Incident Response and Risk Management"
          },
          {
            id: "w2-s5-q3",
            worldId: 2,
            subStageId: 5,
            questionIndex: 3,
            question: "According to the Risk Assessment Matrix, which risks represent the highest priority to address first, and how are 'high impact and low likelihood' risks usually classified?",
            options: [
              "Low impact and low likelihood are handled first; high impact + low likelihood = Zero risk",
              "High impact and high likelihood receive top priority first; high impact and low likelihood are usually classified as Medium risk",
              "Medium impact and zero likelihood receive top priority",
              "Low impact and high likelihood equal Critical risk above all others"
            ],
            correctAnswer: 1,
            explanation: "Official Curriculum (Lesson 2-3 Homework Q1 p. 44 & Model C Q3 p. 47): High impact + high likelihood are top-priority critical risks; high impact + low likelihood classify as Medium risk.",
            difficulty: "very-hard",
            difficultyArabic: "Boss Stage",
            type: "application",
            lesson: "Lesson 2-3: Incident Response and Risk Management"
          },
          {
            id: "w2-s5-q4",
            worldId: 2,
            subStageId: 5,
            questionIndex: 4,
            question: "Which of the following is a typical example of a security incident that directly affects service Availability?",
            options: [
              "Establishing response procedures in advance",
              "Service disruption caused by attacks on a server",
              "Updating operating system security patches cleanly",
              "Enabling two-factor authentication"
            ],
            correctAnswer: 1,
            explanation: "Official Curriculum (Lesson 2-3, 1st Period Q1 p. 43): Service disruption caused by server attacks violates Availability (alongside leakage harming Confidentiality and tampering harming Integrity).",
            difficulty: "very-hard",
            difficultyArabic: "Boss Stage",
            type: "application",
            lesson: "Lesson 2-3: Incident Response and Risk Management"
          },
          {
            id: "w2-s5-q5",
            worldId: 2,
            subStageId: 5,
            questionIndex: 5,
            question: "True or False: During real-world incident handling (such as a ransomware attack), the six incident response stages never overlap and teams can never return to an earlier stage once passed.",
            options: ["True", "False"],
            correctAnswer: 1,
            explanation: "Official Curriculum (Lesson 2-3 Homework Essay #2 p. 44 & Model C Essay #3 p. 47): False! While the six stages follow a logical order, real incident handling often involves overlap or repeating earlier stages as new infections are found.",
            difficulty: "very-hard",
            difficultyArabic: "Boss Stage",
            type: "true-false",
            lesson: "Lesson 2-3: Incident Response and Risk Management"
          }
        ]
      }
    ]
  },

  // ============================================================================
  // WORLD 3: Unit 3 — Web Applications
  // ============================================================================
  {
    id: 3,
    title: "Web App Realm",
    subTitle: "Unit 3: Web Applications",
    description: "Traverse the 3-tier web architecture (Frontend, Backend, Database), master Client-Server communication, HTTP/HTTPS, GET/POST, Status Codes (200/404/500), APIs & JSON, plus HTML/CSS/JS, Semantic HTML, Responsive design, and React/Vue/Next.js.",
    iconName: "Globe",
    badge: "Unit 3",
    accentColor: "#3b82f6",
    borderColor: "border-blue-500",
    themeType: 'web-realm',
    lessons: [
      "Lesson 3-1: The Overall Structure of Web Applications",
      "Lesson 3-2: Web Application Communication Methods",
      "Lesson 3-3: Fundamentals of Frontend Technology"
    ],
    boss: {
      name: "500 Stack Corruptor",
      title: "Corruptor of APIs & State",
      description: "A rogue server daemon intercepting HTTP payloads and breaking client-server communication.",
      avatar: "🕷️",
      maxHp: 700
    },
    subStages: [
      // Stage 1: Easy — Lesson 3-1 (Overall Structure of Web Applications)
      {
        id: 1,
        name: "Three-Tier Citadel",
        tagline: "Frontend, Backend & Database Cooperation",
        difficulty: "easy",
        difficultyArabic: "Easy",
        description: "Map how user requests travel across the three cooperating layers of a modern web application.",
        curriculumFocus: "Lesson 3-1: The Overall Structure of Web Applications",
        questions: [
          {
            id: "w3-s1-q1",
            worldId: 3,
            subStageId: 1,
            questionIndex: 1,
            question: "Which of the following is an accurate example of a Web Application (rather than a local desktop program installed on a device)?",
            options: [
              "A local video player program installed on a device",
              "An online map website (or video-sharing / E-commerce / webmail app used in a browser)",
              "A desktop calculator application",
              "An offline image editing program"
            ],
            correctAnswer: 1,
            explanation: "Official Curriculum (Lesson 3-1 Model B Q1 p. 51 & Model C Q3 p. 52): Web applications run over the Internet through a web browser without needing dedicated local installation.",
            difficulty: "easy",
            difficultyArabic: "Easy",
            type: "mcq",
            lesson: "Lesson 3-1: The Overall Structure of Web Applications"
          },
          {
            id: "w3-s1-q2",
            worldId: 3,
            subStageId: 1,
            questionIndex: 2,
            question: "What is the main idea behind the overall structure of modern web applications?",
            options: [
              "The application is built from only one layer inside the monitor",
              "Cooperation of three layers together: Frontend, Backend, and Database",
              "Each layer works separately with zero communication",
              "Relying only on the browser without any server or database"
            ],
            correctAnswer: 1,
            explanation: "Official Curriculum (Lesson 3-1 Model A Q4 p. 50 & Model B Q4 p. 51): Web applications are typically structured from three collaborating tiers: Frontend, Backend, and Database.",
            difficulty: "easy",
            difficultyArabic: "Easy",
            type: "mcq",
            lesson: "Lesson 3-1: The Overall Structure of Web Applications"
          },
          {
            id: "w3-s1-q3",
            worldId: 3,
            subStageId: 1,
            questionIndex: 3,
            question: "Which layer of a web application is responsible for displaying screens/content and receiving user data and actions?",
            options: ["Backend", "Database", "Frontend", "Processing server"],
            correctAnswer: 2,
            explanation: "Official Curriculum (Lesson 3-1, 1st Period Q2 p. 48 & Model A Q1 p. 50): The Frontend presents interfaces (like search screens and timelines) and collects user inputs.",
            difficulty: "easy",
            difficultyArabic: "Easy",
            type: "mcq",
            lesson: "Lesson 3-1: The Overall Structure of Web Applications"
          },
          {
            id: "w3-s1-q4",
            worldId: 3,
            subStageId: 1,
            questionIndex: 4,
            question: "In real services (video-sharing, SNS, and E-commerce websites), which layer handles counting views, selecting recommended videos, controlling push notifications, verifying logins, and handling payment requests?",
            options: ["Frontend", "Backend", "Database", "Monitor screen"],
            correctAnswer: 1,
            explanation: "Official Curriculum (Lesson 3-1 pp. 49–52 Objective Questions): Server-side processing, login verification, recommendations, notifications, and payment logic belong to the Backend layer.",
            difficulty: "easy",
            difficultyArabic: "Easy",
            type: "application",
            lesson: "Lesson 3-1: The Overall Structure of Web Applications"
          },
          {
            id: "w3-s1-q5",
            worldId: 3,
            subStageId: 1,
            questionIndex: 5,
            question: "In a video-sharing website, SNS, or E-commerce store, which layer stores and retrieves order logs, post data, follower relationships, messages, and viewing history?",
            options: ["Search screens", "Backend only", "Frontend", "Database layer"],
            correctAnswer: 3,
            explanation: "Official Curriculum (Lesson 3-1 pp. 49–52 Objective Questions): Storing and retrieving organized records—posts, followers, viewing history, and order logs—is the core role of the Database layer.",
            difficulty: "easy",
            difficultyArabic: "Easy",
            type: "mcq",
            lesson: "Lesson 3-1: The Overall Structure of Web Applications"
          }
        ]
      },
      // Stage 2: Easy-Medium — Lesson 3-2 (Client-Server, HTTP/HTTPS, GET/POST, Status Codes)
      {
        id: 2,
        name: "HTTP Protocol Highway",
        tagline: "Client-Server, GET/POST & Status Codes",
        difficulty: "easy-medium",
        difficultyArabic: "Easy–Medium",
        description: "Route client-server communication cleanly and decode HTTP methods and response status codes.",
        curriculumFocus: "Lesson 3-2: Web Application Communication Methods",
        questions: [
          {
            id: "w3-s2-q1",
            worldId: 3,
            subStageId: 2,
            questionIndex: 1,
            question: "What represents the 'Client' in the web application Client-Server model?",
            options: [
              "The server that processes requests",
              "The program or device (browser) that sends requests to obtain data",
              "The database storing order history",
              "The physical network cable"
            ],
            correctAnswer: 1,
            explanation: "Official Curriculum (Lesson 3-2, 1st Period Q1 p. 53 & Model A Q1 p. 55): The Client initiates communication by sending requests, while the Server processes those requests and returns responses.",
            difficulty: "easy-medium",
            difficultyArabic: "Easy–Medium",
            type: "mcq",
            lesson: "Lesson 3-2: Web Application Communication Methods"
          },
          {
            id: "w3-s2-q2",
            worldId: 3,
            subStageId: 2,
            questionIndex: 2,
            question: "When sending login information or form data to register a new user, which HTTP method is preferable, and with which protocol should it be combined?",
            options: [
              "GET with plain HTTP",
              "POST combined with HTTPS (TLS encryption) to prevent eavesdropping",
              "Status code 404 without encryption",
              "CSS styling over HTTP"
            ],
            correctAnswer: 1,
            explanation: "Official Curriculum (Lesson 3-2, 1st Period Q2 p. 53, Model B Q2 p. 56 & Model C Q4 p. 57): POST sends form payloads instead of appending credentials to the URL, and HTTPS uses TLS encryption to prevent eavesdropping.",
            difficulty: "easy-medium",
            difficultyArabic: "Easy–Medium",
            type: "application",
            lesson: "Lesson 3-2: Web Application Communication Methods"
          },
          {
            id: "w3-s2-q3",
            worldId: 3,
            subStageId: 2,
            questionIndex: 3,
            question: "What does HTTP status code 200 indicate when returned by the server?",
            options: [
              "Internal server error",
              "Successful request",
              "Resource not found",
              "Unauthorized request"
            ],
            correctAnswer: 1,
            explanation: "Official Curriculum (Lesson 3-2 Homework Q1 p. 53 & Model B Q1 p. 56): Status code 200 confirms that the HTTP request succeeded normally.",
            difficulty: "easy-medium",
            difficultyArabic: "Easy–Medium",
            type: "mcq",
            lesson: "Lesson 3-2: Web Application Communication Methods"
          },
          {
            id: "w3-s2-q4",
            worldId: 3,
            subStageId: 2,
            questionIndex: 4,
            question: "What does HTTP status code 404 indicate?",
            options: [
              "Successful request",
              "Internal server error",
              "The requested resource does not exist (Not found)",
              "Secure TLS connection established"
            ],
            correctAnswer: 2,
            explanation: "Official Curriculum (Lesson 3-2 Homework Q2 p. 54 & Model A Q4 p. 55): Status code 404 indicates that the requested webpage or resource could not be found on the server.",
            difficulty: "easy-medium",
            difficultyArabic: "Easy–Medium",
            type: "mcq",
            lesson: "Lesson 3-2: Web Application Communication Methods"
          },
          {
            id: "w3-s2-q5",
            worldId: 3,
            subStageId: 2,
            questionIndex: 5,
            question: "Which HTTP status code indicates an Internal Server Error?",
            options: ["200", "302", "404", "500"],
            correctAnswer: 3,
            explanation: "Official Curriculum (Lesson 3-2 Model C Q1 p. 56): Status code 500 signals an unexpected internal server error while handling the client's request.",
            difficulty: "easy-medium",
            difficultyArabic: "Easy–Medium",
            type: "mcq",
            lesson: "Lesson 3-2: Web Application Communication Methods"
          }
        ]
      },
      // Stage 3: Medium — Lesson 3-2 (APIs, JSON, GET & 3-Tier Data Flow)
      {
        id: 3,
        name: "JSON & API Hub",
        tagline: "Structured Data Exchange Across Services",
        difficulty: "medium",
        difficultyArabic: "Medium",
        description: "Master API rules, JSON object/array payloads, and multi-layer request routing.",
        curriculumFocus: "Lesson 3-2: APIs, JSON & Request Routing",
        questions: [
          {
            id: "w3-s3-q1",
            worldId: 3,
            subStageId: 3,
            questionIndex: 1,
            question: "What is an API (Application Programming Interface) in web application development?",
            options: [
              "A database table for user passwords",
              "A set of rules and interface mechanisms allowing different software programs to communicate and exchange data",
              "A graphic design color palette",
              "A physical USB cable"
            ],
            correctAnswer: 1,
            explanation: "Official Curriculum (Lesson 3-2 Homework Q1 p. 54 & Model B Q3 p. 56): An API defines standardized rules enabling different applications or services to talk and exchange data.",
            difficulty: "medium",
            difficultyArabic: "Medium",
            type: "mcq",
            lesson: "Lesson 3-2: Web Application Communication Methods"
          },
          {
            id: "w3-s3-q2",
            worldId: 3,
            subStageId: 3,
            questionIndex: 2,
            question: "What is JSON format used for in web applications?",
            options: [
              "Designing page colors and fonts",
              "Exchanging structured data between applications",
              "Encrypting Wi-Fi signals",
              "Printing paper newspapers"
            ],
            correctAnswer: 1,
            explanation: "Official Curriculum (Lesson 3-2, 2nd Period Q2 p. 54 & Model A Q3 p. 55): JSON (JavaScript Object Notation) is the standard text format for exchanging structured data across Web APIs.",
            difficulty: "medium",
            difficultyArabic: "Medium",
            type: "mcq",
            lesson: "Lesson 3-2: Web Application Communication Methods"
          },
          {
            id: "w3-s3-q3",
            worldId: 3,
            subStageId: 3,
            questionIndex: 3,
            question: "How does the JSON text format represent structured data for web applications?",
            options: [
              "Using objects and arrays",
              "Using analog audio waves",
              "Using vacuum tubes and relays",
              "Using unformatted images"
            ],
            correctAnswer: 0,
            explanation: "Official Curriculum (Lesson 3-2 Model C Q3 p. 57): JSON represents structured data cleanly using objects (`{}`) and arrays (`[]`), readable by both humans and programs.",
            difficulty: "medium",
            difficultyArabic: "Medium",
            type: "mcq",
            lesson: "Lesson 3-2: Web Application Communication Methods"
          },
          {
            id: "w3-s3-q4",
            worldId: 3,
            subStageId: 3,
            questionIndex: 4,
            question: "When a customer searches for a product in an online store, which layer sends the data query request directly to the Database?",
            options: ["Frontend", "Backend", "The Database itself", "The user's monitor"],
            correctAnswer: 1,
            explanation: "Official Curriculum (Lesson 3-1 Model A Q2 p. 50): The Frontend sends the search input to the Backend; the Backend validates the request, queries the Database, and returns formatted results to the Frontend.",
            difficulty: "medium",
            difficultyArabic: "Medium",
            type: "application",
            lesson: "Lesson 3-1: The Overall Structure of Web Applications"
          },
          {
            id: "w3-s3-q5",
            worldId: 3,
            subStageId: 3,
            questionIndex: 5,
            question: "When requesting a web page, viewing public information, or fetching search results from the server, which HTTP method is typically used?",
            options: ["POST", "GET", "500", "API"],
            correctAnswer: 1,
            explanation: "Official Curriculum (Lesson 3-2 Homework Q2 p. 54 & Model C Q2 p. 56): GET is typically used to retrieve web pages, public data, and search results from the server.",
            difficulty: "medium",
            difficultyArabic: "Medium",
            type: "mcq",
            lesson: "Lesson 3-2: Web Application Communication Methods"
          }
        ]
      },
      // Stage 4: Hard — Lesson 3-3 (HTML, CSS, JavaScript, Semantic HTML & Responsive Design)
      {
        id: 4,
        name: "Frontend Triad Forge",
        tagline: "HTML, CSS, JS & Semantic Structure",
        difficulty: "hard",
        difficultyArabic: "Hard",
        description: "Rebuild semantic web pages combining HTML structure, CSS styling, and JavaScript interactivity.",
        curriculumFocus: "Lesson 3-3: Fundamentals of Frontend Technology",
        questions: [
          {
            id: "w3-s4-q1",
            worldId: 3,
            subStageId: 4,
            questionIndex: 1,
            question: "How are responsibilities divided among the three core frontend technologies?",
            options: [
              "HTML = basic structure of the page; CSS = visual appearance and styling; JavaScript = interactive behavior",
              "HTML = styling; CSS = databases; JavaScript = server hardware",
              "CSS = structure; HTML = network encryption; JavaScript = static images",
              "All three do identical tasks and cannot work together"
            ],
            correctAnswer: 0,
            explanation: "Official Curriculum (Lesson 3-3 pp. 58–62): HTML defines structure, CSS defines visual appearance and layout, and JavaScript adds interactive behavior.",
            difficulty: "hard",
            difficultyArabic: "Hard",
            type: "mcq",
            lesson: "Lesson 3-3: Fundamentals of Frontend Technology"
          },
          {
            id: "w3-s4-q2",
            worldId: 3,
            subStageId: 4,
            questionIndex: 2,
            question: "Which of the following is NOT an HTML semantic element?",
            options: ["<header>", "<e-mail>", "<main>", "<footer>"],
            correctAnswer: 1,
            explanation: "Official Curriculum (Lesson 3-3, 1st Period Q2 p. 58): Valid semantic elements include <header>, <nav>, <main>, and <footer>; '<e-mail>' is NOT a standard HTML semantic tag.",
            difficulty: "hard",
            difficultyArabic: "Hard",
            type: "mcq",
            lesson: "Lesson 3-3: Fundamentals of Frontend Technology"
          },
          {
            id: "w3-s4-q3",
            worldId: 3,
            subStageId: 4,
            questionIndex: 3,
            question: "Which pairing correctly matches Semantic HTML tags with their purposes in a web page?",
            options: [
              "<header> = page header; <nav> = navigation links; <main> = main content section; <footer> = bottom footer",
              "<nav> = page footer; <footer> = top navigation menu",
              "<main> = hidden CSS color rules; <header> = database query",
              "<header> = main article body only; <main> = page copyright bar"
            ],
            correctAnswer: 0,
            explanation: "Official Curriculum (Lesson 3-3 pp. 59–62 Objective Questions): <header> defines the header, <nav> defines navigation, <main> defines the main content section, and <footer> defines the bottom footer.",
            difficulty: "hard",
            difficultyArabic: "Hard",
            type: "mcq",
            lesson: "Lesson 3-3: Fundamentals of Frontend Technology"
          },
          {
            id: "w3-s4-q4",
            worldId: 3,
            subStageId: 4,
            questionIndex: 4,
            question: "What are the two major benefits of using Semantic HTML elements cleanly when building web pages?",
            options: [
              "Improving Accessibility for assistive tools (such as screen readers) and helping search engines understand the page structure",
              "Increasing server hard drive capacity",
              "Encrypting credit card numbers automatically without TLS",
              "Replacing JavaScript completely"
            ],
            correctAnswer: 0,
            explanation: "Official Curriculum (Lesson 3-3 Model B Essay #2 & Model C Essay #2 p. 61): Semantic tags give meaning to sections so screen readers (accessibility) and search engines navigate content accurately.",
            difficulty: "hard",
            difficultyArabic: "Hard",
            type: "application",
            lesson: "Lesson 3-3: Fundamentals of Frontend Technology"
          },
          {
            id: "w3-s4-q5",
            worldId: 3,
            subStageId: 4,
            questionIndex: 5,
            question: "What does 'Responsive Design' mean in frontend web development?",
            options: [
              "Making the page work only on large desktop monitors",
              "Automatically adjusting the layout according to different screen sizes (desktops, tablets, and smartphones)",
              "Hiding important content from smartphone users",
              "Disabling CSS styling on mobile browsers"
            ],
            correctAnswer: 1,
            explanation: "Official Curriculum (Lesson 3-3, 2nd Period Q2 p. 59 & Model A Q3 p. 60): Responsive design adapts page layout fluidly across different device screen sizes.",
            difficulty: "hard",
            difficultyArabic: "Hard",
            type: "mcq",
            lesson: "Lesson 3-3: Fundamentals of Frontend Technology"
          }
        ]
      },
      // Stage 5: Boss — Lesson 3-3 (Mobile-First, React, Next.js, Vue & Unit Integration)
      {
        id: 5,
        name: "500 Stack Corruptor",
        tagline: "Boss Battle: Mobile-First & UI Frameworks",
        difficulty: "very-hard",
        difficultyArabic: "Boss Stage",
        description: "Defeat the 500 Stack Corruptor with Mobile-First mastery and React, Next.js, and Vue knowledge!",
        curriculumFocus: "Lesson 3-3: Mobile-First & Modern Frameworks",
        bossName: "500 Stack Corruptor",
        questions: [
          {
            id: "w3-s5-q1",
            worldId: 3,
            subStageId: 5,
            questionIndex: 1,
            question: "What does the term 'mobile-first' in responsive web design mean?",
            options: [
              "Designing the page first for desktop computers and ignoring smartphones",
              "Designing the page first for small screens such as smartphones, then enhancing it for larger screens",
              "Using JavaScript to replace HTML headings",
              "Increasing server network speed only"
            ],
            correctAnswer: 1,
            explanation: "Official Curriculum (Lesson 3-3 Model C Q3 p. 62 & Model B Essay #3 p. 61): Mobile-first builds a clean, usable experience for constrained smartphone screens first before expanding for larger viewports.",
            difficulty: "very-hard",
            difficultyArabic: "Boss Stage",
            type: "mcq",
            lesson: "Lesson 3-3: Fundamentals of Frontend Technology"
          },
          {
            id: "w3-s5-q2",
            worldId: 3,
            subStageId: 5,
            questionIndex: 2,
            question: "What is React primarily used for in modern frontend development?",
            options: [
              "A JavaScript library for building user interfaces with reusable components",
              "Managing backend relational databases only",
              "Encrypting TLS network certificates",
              "Replacing HTML browsers completely"
            ],
            correctAnswer: 0,
            explanation: "Official Curriculum (Lesson 3-3 Homework Q1 p. 59 & Model A Q4 p. 60): React is a JavaScript library focused on building dynamic UIs from reusable components.",
            difficulty: "very-hard",
            difficultyArabic: "Boss Stage",
            type: "mcq",
            lesson: "Lesson 3-3: Fundamentals of Frontend Technology"
          },
          {
            id: "w3-s5-q3",
            worldId: 3,
            subStageId: 5,
            questionIndex: 3,
            question: "Which framework is built on React and provides built-in routing and page rendering features?",
            options: ["Next.js", "Vue", "HTML", "CSS"],
            correctAnswer: 0,
            explanation: "Official Curriculum (Lesson 3-3 Homework Q2 p. 59 & Model B Q4 p. 61): Next.js is a framework built on top of React adding routing and advanced page rendering capabilities.",
            difficulty: "very-hard",
            difficultyArabic: "Boss Stage",
            type: "mcq",
            lesson: "Lesson 3-3: Fundamentals of Frontend Technology"
          },
          {
            id: "w3-s5-q4",
            worldId: 3,
            subStageId: 5,
            questionIndex: 4,
            question: "Which of the following is a JavaScript framework that enables building web applications progressively (incrementally)?",
            options: ["Vue", "CSS", "HTML", "SQL"],
            correctAnswer: 0,
            explanation: "Official Curriculum (Lesson 3-3 Model C Q4 p. 62): Vue is a progressive JavaScript framework that teams can adopt incrementally.",
            difficulty: "very-hard",
            difficultyArabic: "Boss Stage",
            type: "mcq",
            lesson: "Lesson 3-3: Fundamentals of Frontend Technology"
          },
          {
            id: "w3-s5-q5",
            worldId: 3,
            subStageId: 5,
            questionIndex: 5,
            question: "Which statement explains why an online login or user registration page must combine both Unit 3 communication methods and Unit 2 security?",
            options: [
              "Using GET over plain HTTP displays credentials cleanly for debugging",
              "Using the POST method with HTTPS (TLS encryption) protects login and registration data in transit against eavesdropping, supported by backend verification",
              "Databases should let frontend browsers bypass the backend directly",
              "JavaScript alone replaces server authentication"
            ],
            correctAnswer: 1,
            explanation: "Official Curriculum (Lessons 3-1, 3-2 & Unit 2 Integration): Sensitive forms use POST over HTTPS (TLS encryption) alongside server-side Backend validation and protected Databases.",
            difficulty: "very-hard",
            difficultyArabic: "Boss Stage",
            type: "application",
            lesson: "Lesson 3-2: Web Application Communication Methods"
          }
        ]
      }
    ]
  },

  // ============================================================================
  // WORLD 4: Unit 4 — Web and Media Design
  // ============================================================================
  {
    id: 4,
    title: "UX & Media Kingdom",
    subTitle: "Unit 4: Web and Media Design",
    description: "Master strategic media selection (TV, Radio, Newspaper, Website, SNS, Email), User-Centered Design (Personas & Wireframes), CRAP visual principles, Quantitative/Qualitative UX evaluation (PV, Bounce Rate, CVR, Heuristics), and PDCA / Design Thinking / A-B Testing.",
    iconName: "Layout",
    badge: "Unit 4",
    accentColor: "#f59e0b",
    borderColor: "border-amber-500",
    themeType: 'ux-kingdom',
    lessons: [
      "Lesson 4-1: Types and Characteristics of Media",
      "Lesson 4-2: Information Design and User Experience for Websites",
      "Lesson 4-3: Methods for Evaluating Websites",
      "Lesson 4-4: The Iterative Improvement Process for Websites"
    ],
    boss: {
      name: "Usability Entropy Phantom",
      title: "Avatar of High Bounce Rates",
      description: "A chaotic design phantom spreading poor alignment, weak contrast, and untested website assumptions.",
      avatar: "👁️‍🗨️",
      maxHp: 850
    },
    subStages: [
      // Stage 1: Easy — Lesson 4-1 (Types and Characteristics of Media)
      {
        id: 1,
        name: "Media Spectrum Gate",
        tagline: "Comparing & Combining Communication Media",
        difficulty: "easy",
        difficultyArabic: "Easy",
        description: "Compare traditional broadcast/print media with Websites, SNS, and direct messaging.",
        curriculumFocus: "Lesson 4-1: Types and Characteristics of Media",
        questions: [
          {
            id: "w4-s1-q1",
            worldId: 4,
            subStageId: 1,
            questionIndex: 1,
            question: "Which medium conveys sound only, is generally one-way, and can be received anywhere while carrying out other tasks (subject to coverage)?",
            options: ["Television", "Radio", "Newspaper", "Website"],
            correctAnswer: 1,
            explanation: "Official Curriculum (Lesson 4-1, 1st Period Q1 p. 63 & Model B Q1 p. 66): Radio communicates audio-only one-way broadcasts that listeners can follow while driving or performing other tasks.",
            difficulty: "easy",
            difficultyArabic: "Easy",
            type: "mcq",
            lesson: "Lesson 4-1: Types and Characteristics of Media"
          },
          {
            id: "w4-s1-q2",
            worldId: 4,
            subStageId: 1,
            questionIndex: 2,
            question: "How does a printed Newspaper differ from Television in Lesson 4-1?",
            options: [
              "Television combines video and sound for wide simultaneous reach, while a Newspaper is a physical printed medium (text and images) that can be read without an Internet connection",
              "Newspapers allow instant live two-way video replies on paper",
              "Television requires an active search query by every viewer before turning on",
              "Newspapers convey sound only"
            ],
            correctAnswer: 0,
            explanation: "Official Curriculum (Lesson 4-1 Model A Q1 p. 65 & Model C Q1 p. 67): TV pairs video+sound one-way to reach large audiences at once, whereas newspapers provide durable offline printed text and images.",
            difficulty: "easy",
            difficultyArabic: "Easy",
            type: "mcq",
            lesson: "Lesson 4-1: Types and Characteristics of Media"
          },
          {
            id: "w4-s1-q3",
            worldId: 4,
            subStageId: 1,
            questionIndex: 3,
            question: "Which option accurately pairs a strength and a constraint of Websites?",
            options: [
              "Strength: detailed information structured across pages and updatable anytime with two-way forms/comments; Constraint: normally requires Internet and users must actively open it unless notifications exist",
              "Strength: works without electricity anywhere; Constraint: cannot display images or video",
              "Strength: cannot be updated after publishing; Constraint: always two-way audio only",
              "Websites have no constraints at all"
            ],
            correctAnswer: 0,
            explanation: "Official Curriculum (Lesson 4-1 pp. 63, 65, 66, 67): Websites store deep structured content updatable anytime with two-way forms/comments, but depend on Internet access and active user visits.",
            difficulty: "easy",
            difficultyArabic: "Easy",
            type: "mcq",
            lesson: "Lesson 4-1: Types and Characteristics of Media"
          },
          {
            id: "w4-s1-q4",
            worldId: 4,
            subStageId: 1,
            questionIndex: 4,
            question: "Which two digital channels match (1) rapid spreading through user sharing and word of mouth, and (2) direct individual delivery to specific people?",
            options: [
              "(1) SNS (Social Networking Services) and (2) Email or direct messaging",
              "(1) Printed Newspaper and (2) Radio",
              "(1) Radio and (2) Television",
              "(1) Wireframe and (2) Firewall"
            ],
            correctAnswer: 0,
            explanation: "Official Curriculum (Lesson 4-1 pp. 63, 64, 66): SNS spreads information rapidly via posting and sharing, while Email / direct messaging delivers campaign info individually to target recipients.",
            difficulty: "easy",
            difficultyArabic: "Easy",
            type: "mcq",
            lesson: "Lesson 4-1: Types and Characteristics of Media"
          },
          {
            id: "w4-s1-q5",
            worldId: 4,
            subStageId: 1,
            questionIndex: 5,
            question: "When selecting suitable media for an information campaign, which principle should organizations follow?",
            options: [
              "Always use printed newspapers exclusively for every audience",
              "No single medium is best for every purpose; choose based on purpose, target audience, and available resources, and combine complementary media (e.g., TV/SNS + Website)",
              "Avoid Internet-based media in all cases",
              "Replace websites entirely with radio ads"
            ],
            correctAnswer: 1,
            explanation: "Official Curriculum (Lesson 4-1, 2nd Period Q2 p. 65 & Model B Q4 p. 67): Effective communication evaluates purpose, audience, and resources, often combining reach channels (TV/SNS) with detailed Websites.",
            difficulty: "easy",
            difficultyArabic: "Easy",
            type: "application",
            lesson: "Lesson 4-1: Types and Characteristics of Media"
          }
        ]
      },
      // Stage 2: Easy-Medium — Lesson 4-2 (UCD, Personas, Wireframes, Usability, Accessibility & RTL Alignment)
      {
        id: 2,
        name: "Persona & Wireframe Studio",
        tagline: "UCD, Personas, Wireframes & Inclusive UX",
        difficulty: "easy-medium",
        difficultyArabic: "Easy–Medium",
        description: "Plan information structure using Personas, Wireframes, Usability, Accessibility, and language-aware Alignment.",
        curriculumFocus: "Lesson 4-2: Information Design and UX for Websites",
        questions: [
          {
            id: "w4-s2-q1",
            worldId: 4,
            subStageId: 2,
            questionIndex: 1,
            question: "What does good web design start with under the User-Centered Design (UCD) approach?",
            options: [
              "Choosing colors and luxury decorations first",
              "Understanding the users, their needs, and their usage context, rather than relying on the designer's personal taste",
              "Optimizing only for the convenience of the website creator and developers",
              "Skipping evaluation with real users"
            ],
            correctAnswer: 1,
            explanation: "Official Curriculum (Lesson 4-2 Model A Q1 p. 71 & Q4 p. 72): UCD bases design decisions on real users, their needs, and context of use instead of creator assumptions.",
            difficulty: "easy-medium",
            difficultyArabic: "Easy–Medium",
            type: "mcq",
            lesson: "Lesson 4-2: Information Design and User Experience for Websites"
          },
          {
            id: "w4-s2-q2",
            worldId: 4,
            subStageId: 2,
            questionIndex: 2,
            question: "When creating a target user Persona (a research-based representation helping teams discuss user needs without guessing), which piece of information does NOT belong?",
            options: [
              "The user's purpose for using the website",
              "The performance of the website's server",
              "The user's age and occupation",
              "The challenges the user faces"
            ],
            correctAnswer: 1,
            explanation: "Official Curriculum (Lesson 4-2 Homework Q2 p. 70 & Model B Q1 p. 72): Personas describe user purpose, age, occupation, needs, and challenges—not backend server hardware performance.",
            difficulty: "easy-medium",
            difficultyArabic: "Easy–Medium",
            type: "application",
            lesson: "Lesson 4-2: Information Design and User Experience for Websites"
          },
          {
            id: "w4-s2-q3",
            worldId: 4,
            subStageId: 2,
            questionIndex: 3,
            question: "What is a Wireframe, and why is visual styling (colors, decorative fonts, images) delayed until after wireframing?",
            options: [
              "A preliminary rough layout with minimal detail to agree on placement and priority of information before personal visual preferences distract stakeholders",
              "A backend algorithm for database storage",
              "A mobile Internet bandwidth speed test",
              "The final polished graphical skin with full colors"
            ],
            correctAnswer: 0,
            explanation: "Official Curriculum (Lesson 4-2, 1st Period Q2 p. 68 & Model C Q3 p. 74): Wireframes focus stakeholder agreement cleanly on content hierarchy and placement prior to visual decoration.",
            difficulty: "easy-medium",
            difficultyArabic: "Easy–Medium",
            type: "mcq",
            lesson: "Lesson 4-2: Information Design and User Experience for Websites"
          },
          {
            id: "w4-s2-q4",
            worldId: 4,
            subStageId: 2,
            questionIndex: 4,
            question: "What is the key difference between 'Usability' and 'Accessibility' in web design?",
            options: [
              "Usability refers to how easily users can navigate and achieve their goals; Accessibility ensures people with disabilities can use and interact with the website",
              "Both measure hosting fees and server CPU speed",
              "Usability groups photos together; Accessibility chooses button colors",
              "Accessibility only applies to printed newspapers"
            ],
            correctAnswer: 0,
            explanation: "Official Curriculum (Lesson 4-2 Homework Q1–Q2 p. 69 & Model B Q4 p. 73): Studying both improves ease of task completion and enables people with disabilities to interact effectively.",
            difficulty: "easy-medium",
            difficultyArabic: "Easy–Medium",
            type: "mcq",
            lesson: "Lesson 4-2: Information Design and User Experience for Websites"
          },
          {
            id: "w4-s2-q5",
            worldId: 4,
            subStageId: 2,
            questionIndex: 5,
            question: "Which statement accurately describes the rule of 'Alignment' when designing an Arabic-language web interface?",
            options: [
              "Always align all main Arabic text strictly left-to-right",
              "Place words randomly across the screen without a common baseline",
              "Follow the language direction and design grid, keeping main Arabic text consistently right-to-left (RTL)",
              "Hide text inside nested menus"
            ],
            correctAnswer: 2,
            explanation: "Official Curriculum (Lesson 4-2, 2nd Period Q2 p. 70 & Model C Q4 p. 74): Alignment aligns elements on a common baseline following the language reading direction—right-to-left (RTL) for Arabic interfaces.",
            difficulty: "easy-medium",
            difficultyArabic: "Easy–Medium",
            type: "application",
            lesson: "Lesson 4-2: Information Design and User Experience for Websites"
          }
        ]
      },
      // Stage 3: Medium — Lesson 4-2 (The 4 CRAP Design Principles)
      {
        id: 3,
        name: "CRAP Visual Grid Tower",
        tagline: "Contrast, Repetition, Alignment & Proximity",
        difficulty: "medium",
        difficultyArabic: "Medium",
        description: "Organize clear visual hierarchy using the four CRAP principles of information design.",
        curriculumFocus: "Lesson 4-2: CRAP Design Principles",
        questions: [
          {
            id: "w4-s3-q1",
            worldId: 4,
            subStageId: 3,
            questionIndex: 1,
            question: "What do the four CRAP design principles for organizing web page appearance stand for?",
            options: [
              "Code, Render, API, Protocol",
              "Contrast, Repetition, Alignment, and Proximity",
              "Color, Resolution, Audio, Speed",
              "Click, Scroll, Refresh, Upload"
            ],
            correctAnswer: 1,
            explanation: "Official Curriculum (Lesson 4-2 Homework Essay #1 p. 70 & Model A Essay #3 p. 71): The four CRAP principles are Contrast, Repetition, Alignment, and Proximity.",
            difficulty: "medium",
            difficultyArabic: "Medium",
            type: "mcq",
            lesson: "Lesson 4-2: Information Design and User Experience for Websites"
          },
          {
            id: "w4-s3-q2",
            worldId: 4,
            subStageId: 3,
            questionIndex: 2,
            question: "What is the primary purpose of applying the principle of 'Contrast' in web page design?",
            options: [
              "Making headings clear and highlighting important elements immediately through visual differences",
              "Standardizing the font and color of headings across all pages",
              "Grouping related items close together",
              "Aligning text along a common baseline"
            ],
            correctAnswer: 0,
            explanation: "Official Curriculum (Lesson 4-2 Model A Q3 p. 71): Contrast uses visual distinction to clarify information priority and draw attention immediately while preserving readability.",
            difficulty: "medium",
            difficultyArabic: "Medium",
            type: "application",
            lesson: "Lesson 4-2: Information Design and User Experience for Websites"
          },
          {
            id: "w4-s3-q3",
            worldId: 4,
            subStageId: 3,
            questionIndex: 3,
            question: "Which CRAP design principle involves grouping related information—such as product photos, names, and prices—close together while leaving meaningful space between unrelated groups?",
            options: ["Contrast", "Repetition", "Alignment", "Proximity"],
            correctAnswer: 3,
            explanation: "Official Curriculum (Lesson 4-2 Homework Q1 p. 70 & Model C Q1 p. 74): Proximity places related items close together so users perceive each cluster as a unified group at a glance.",
            difficulty: "medium",
            difficultyArabic: "Medium",
            type: "mcq",
            lesson: "Lesson 4-2: Information Design and User Experience for Websites"
          },
          {
            id: "w4-s3-q4",
            worldId: 4,
            subStageId: 3,
            questionIndex: 4,
            question: "Which action is an appropriate application of the 'Repetition' principle in web-page design?",
            options: [
              "Making headings large and changing their color randomly on every page",
              "Standardizing selected properties—such as the font, size, and color of headings and bullet icons—across all pages to create consistency",
              "Scattering unrelated elements across the screen",
              "Hiding primary navigation buttons inside complex submenus"
            ],
            correctAnswer: 1,
            explanation: "Official Curriculum (Lesson 4-2, 2nd Period Q1 p. 70 & Model B Q3 p. 72): Repetition repeats consistent design properties across pages to build visual unity and support navigation.",
            difficulty: "medium",
            difficultyArabic: "Medium",
            type: "mcq",
            lesson: "Lesson 4-2: Information Design and User Experience for Websites"
          },
          {
            id: "w4-s3-q5",
            worldId: 4,
            subStageId: 3,
            questionIndex: 5,
            question: "Which of the four CRAP principles involves aligning elements along a common baseline to give the screen a sense of order?",
            options: ["Contrast", "Repetition", "Alignment", "Proximity"],
            correctAnswer: 2,
            explanation: "Official Curriculum (Lesson 4-2 Model B Q2 p. 72): Alignment connects elements visually along shared horizontal and vertical baselines so pages feel orderly and scannable.",
            difficulty: "medium",
            difficultyArabic: "Medium",
            type: "mcq",
            lesson: "Lesson 4-2: Information Design and User Experience for Websites"
          }
        ]
      },
      // Stage 4: Hard — Lesson 4-3 (Qualitative vs Quantitative Evaluation, PV, Bounce Rate, CVR & Heuristics)
      {
        id: 4,
        name: "Analytics & Heuristics Lab",
        tagline: "Quantitative Metrics Meet Qualitative Research",
        difficulty: "hard",
        difficultyArabic: "Hard",
        description: "Measure website effectiveness using Web Analytics metrics, Usability Testing, Interviews, and Heuristics.",
        curriculumFocus: "Lesson 4-3: Methods for Evaluating Websites",
        questions: [
          {
            id: "w4-s4-q1",
            worldId: 4,
            subStageId: 4,
            questionIndex: 1,
            question: "How do Quantitative evaluation and Qualitative evaluation differ when assessing a website?",
            options: [
              "Quantitative measures behavior using numerical data & metrics (Web analytics, A/B testing), whereas Qualitative focuses on understanding experiences and reasons behind user behavior (Usability testing, Interviews, Heuristic evaluation)",
              "Qualitative relies only on server hit counts, while Quantitative relies on verbal interviews",
              "Quantitative only measures font colors",
              "Qualitative and Quantitative can never be combined"
            ],
            correctAnswer: 0,
            explanation: "Official Curriculum (Lesson 4-3, 1st Period Q1–Q2 p. 75 & Model A Q1 p. 77): Quantitative shows numerical outcomes, while Qualitative uncovers user voices and why issues happen.",
            difficulty: "hard",
            difficultyArabic: "Hard",
            type: "mcq",
            lesson: "Lesson 4-3: Methods for Evaluating Websites"
          },
          {
            id: "w4-s4-q2",
            worldId: 4,
            subStageId: 4,
            questionIndex: 2,
            question: "In web analytics, what does the Page Views (PV) metric represent?",
            options: [
              "The proportion of visits that achieved a target action",
              "The total number of times a page has been viewed",
              "The proportion of visits that ended after viewing only the first page",
              "A rule of thumb checked by UI experts"
            ],
            correctAnswer: 1,
            explanation: "Official Curriculum (Lesson 4-3 Homework Q1 p. 76 & Model A Q2 p. 78): Page Views (PV) counts the total number of times pages were viewed.",
            difficulty: "hard",
            difficultyArabic: "Hard",
            type: "mcq",
            lesson: "Lesson 4-3: Methods for Evaluating Websites"
          },
          {
            id: "w4-s4-q3",
            worldId: 4,
            subStageId: 4,
            questionIndex: 3,
            question: "Which pair correctly defines 'Bounce Rate' and 'Conversion Rate (CVR)' in web analytics?",
            options: [
              "Bounce rate = % of sessions leaving after viewing only the first page; Conversion rate (CVR) = % of visits achieving a target action such as a purchase or registration",
              "Bounce rate = total server crashes; Conversion rate = page loading time",
              "Both metrics measure only total clicks on images",
              "Bounce rate = successful purchases; Conversion rate = visitors leaving immediately"
            ],
            correctAnswer: 0,
            explanation: "Official Curriculum (Lesson 4-3 Homework Q2 p. 76 & Q1 p. 77 & Model B Q4 p. 79): Bounce rate tracks single-page exits (interpreted per tool definition), while CVR tracks goal completion.",
            difficulty: "hard",
            difficultyArabic: "Hard",
            type: "mcq",
            lesson: "Lesson 4-3: Methods for Evaluating Websites"
          },
          {
            id: "w4-s4-q4",
            worldId: 4,
            subStageId: 4,
            questionIndex: 4,
            question: "When web analytics show a high Page Views (PV) count paired with a low Conversion Rate (CVR), what does this indicate?",
            options: [
              "All visitors have completed their purchases smoothly",
              "Many users reach the page, but do not complete the intended target action—signaling a need for qualitative evaluation (like usability testing or interviews) to find out why",
              "The website has received zero visits",
              "The design is complete and requires no further evaluation"
            ],
            correctAnswer: 1,
            explanation: "Official Curriculum (Lesson 4-3 Homework Q2 p. 77 & Model A Essay #4): High PV + low CVR reveals traffic arrives without converting, so qualitative testing is needed to uncover why.",
            difficulty: "hard",
            difficultyArabic: "Hard",
            type: "application",
            lesson: "Lesson 4-3: Methods for Evaluating Websites"
          },
          {
            id: "w4-s4-q5",
            worldId: 4,
            subStageId: 4,
            questionIndex: 5,
            question: "What is 'Heuristic Evaluation', and which three UI heuristics are introduced in Lesson 4-3?",
            options: [
              "A method where experts inspect a user interface by rules of thumb; Consistency, Visibility of system status, and Error prevention",
              "A quantitative metric dividing PV by Bounce Rate",
              "Observing random traffic with A/B button colors",
              "Writing server SQL queries"
            ],
            correctAnswer: 0,
            explanation: "Official Curriculum (Lesson 4-3, 2nd Period Q1–Q2 p. 76, Model B Essay #3 p. 78 & Model C Q4 p. 80): Experts review interfaces using three key heuristics: Consistency, Visibility of system status, and Error prevention.",
            difficulty: "hard",
            difficultyArabic: "Hard",
            type: "mcq",
            lesson: "Lesson 4-3: Methods for Evaluating Websites"
          }
        ]
      },
      // Stage 5: Boss — Lesson 4-4 (PDCA Cycle, Design Thinking, A/B Testing & Continuous Improvement)
      {
        id: 5,
        name: "Usability Entropy Citadel",
        tagline: "Boss Battle: PDCA, Design Thinking & A/B Testing",
        difficulty: "very-hard",
        difficultyArabic: "Boss Stage",
        description: "Banish the Usability Entropy Phantom through scientific PDCA cycles, Design Thinking, and controlled A/B tests!",
        curriculumFocus: "Lesson 4-4: The Iterative Improvement Process",
        bossName: "Usability Entropy Phantom",
        questions: [
          {
            id: "w4-s5-q1",
            worldId: 4,
            subStageId: 5,
            questionIndex: 1,
            question: "In the PDCA Cycle (Plan → Do → Check → Act), which action corresponds to the 'Check' stage?",
            options: [
              "Set the goal of reducing the bounce rate by 10%",
              "Change the design of the homepage immediately",
              "Measure results (such as bounce rate or completion rate) after the change and compare them with the baseline",
              "Adopt or extend the change across the whole site"
            ],
            correctAnswer: 2,
            explanation: "Official Curriculum (Lesson 4-4 Model B Q1 p. 85): Plan sets the goal and change; Do applies it; Check measures results against the baseline; Act approves/expands what worked or revises the plan.",
            difficulty: "very-hard",
            difficultyArabic: "Boss Stage",
            type: "mcq",
            lesson: "Lesson 4-4: The Iterative Improvement Process for Websites"
          },
          {
            id: "w4-s5-q2",
            worldId: 4,
            subStageId: 5,
            questionIndex: 2,
            question: "What does the 'Act' step in the PDCA cycle mean when the implemented change achieves the desired goal?",
            options: [
              "Canceling the website and deleting all analytics",
              "Approving (adopting) or expanding the change",
              "Ignoring the goal completely",
              "Stopping all future evaluation permanently"
            ],
            correctAnswer: 1,
            explanation: "Official Curriculum (Lesson 4-4 Homework Q1 p. 82): When Check confirms the goal is achieved, Act adopts or expands the improvement (whereas unmet goals lead to revising the next Plan).",
            difficulty: "very-hard",
            difficultyArabic: "Boss Stage",
            type: "application",
            lesson: "Lesson 4-4: The Iterative Improvement Process for Websites"
          },
          {
            id: "w4-s5-q3",
            worldId: 4,
            subStageId: 5,
            questionIndex: 3,
            question: "Which five flexible (non-linear) steps make up Design Thinking, and what occurs in 'Empathize' and 'Test'?",
            options: [
              "Empathize → Define → Ideate → Prototype → Test; Empathize understands users via observation & questions, and Test lets users try the quick Prototype to gather feedback",
              "Plan → Delete → Encrypt → Print → Close; cannot revisit earlier stages",
              "Empathize → Test → Delete → Ignore → Lock",
              "Build → Advertise → Stop → Wait → Reboot"
            ],
            correctAnswer: 0,
            explanation: "Official Curriculum (Lesson 4-4, 1st Period Q1–Q2 p. 82, Model A Q4 p. 84 & Model C Q1–Q2 p. 86): Teams move flexibly across Empathize, Define, Ideate, Prototype, and Test as user feedback refines earlier insights.",
            difficulty: "very-hard",
            difficultyArabic: "Boss Stage",
            type: "mcq",
            lesson: "Lesson 4-4: The Iterative Improvement Process for Websites"
          },
          {
            id: "w4-s5-q4",
            worldId: 4,
            subStageId: 5,
            questionIndex: 4,
            question: "Which practice is INAPPROPRIATE when conducting a valid A/B test intended to isolate the effect of ONE element (such as a purchase button color)?",
            options: [
              "Preparing two versions (A and B) differing only in that target element",
              "Changing multiple elements at the same time",
              "Making decisions only after collecting a sufficient amount of data",
              "Showing versions randomly to actual users and comparing via a predefined metric"
            ],
            correctAnswer: 1,
            explanation: "Official Curriculum (Lesson 4-4 Homework Q2 p. 83 & Model B Q2 p. 85): Changing several elements simultaneously measures the combined package instead of isolating that one element.",
            difficulty: "very-hard",
            difficultyArabic: "Boss Stage",
            type: "mcq",
            lesson: "Lesson 4-4: The Iterative Improvement Process for Websites"
          },
          {
            id: "w4-s5-q5",
            worldId: 4,
            subStageId: 5,
            questionIndex: 5,
            question: "Which statement best describes the core philosophy of the website iterative improvement process?",
            options: [
              "Once an initial website is published, no further improvement is ever needed",
              "It is important to improve gradually by repeating evaluation and improvement cycles (using PDCA, Design Thinking, and A/B testing)",
              "It is enough to change only visual decorations blindly",
              "Developer intuition alone should override all user feedback and data"
            ],
            correctAnswer: 1,
            explanation: "Official Curriculum (Lesson 4-4 Homework Q2 p. 82 & Model B Q3 p. 85): Continuous improvement treats launch as a baseline, improving websites gradually through repeated cycles.",
            difficulty: "very-hard",
            difficultyArabic: "Boss Stage",
            type: "mcq",
            lesson: "Lesson 4-4: The Iterative Improvement Process for Websites"
          }
        ]
      }
    ]
  }
];

// ============================================================================
// Stage Victory Perks Pool (3 offered after each sub-stage clear)
// ============================================================================
export const STAGE_PERKS_POOL: StagePerk[] = [
  {
    id: 'perk_deflect_wide',
    title: 'Wide Deflector Arc',
    subtitle: 'Broad Plasma Counter-Angle',
    description: 'Expands your weapon deflection arc by +50 degrees, making incoming laser reflection effortless.',
    icon: '🛡️',
    category: 'deflect',
    statBoost: '+50° Deflect Angle'
  },
  {
    id: 'perk_rocket_boots',
    title: 'Cyber Rocket Boots',
    subtitle: 'Hyper Movement Velocity',
    description: 'Increases horizontal dash speed and evasion responsiveness by +35% across combat platforms.',
    icon: '🚀',
    category: 'speed',
    statBoost: '+35% Speed'
  },
  {
    id: 'perk_triple_blade',
    title: 'Triple Prism Emitter',
    subtitle: 'Three-Way Neon Spread',
    description: 'Upgrade your primary weapon to fire three wide energy bolts simultaneously toward barriers and turrets.',
    icon: '🔱',
    category: 'firepower',
    statBoost: '3x Multi-Shot'
  },
  {
    id: 'perk_matrix_slowmo',
    title: 'Matrix Time Dilation',
    subtitle: 'Decelerates Enemy Rounds',
    description: 'Slows incoming enemy lasers and homing missiles by 28% so you can time heroic deflections easily.',
    icon: '⏱️',
    category: 'time',
    statBoost: '-28% Enemy Shot Speed'
  },
  {
    id: 'perk_nano_repair',
    title: 'Nano Shield Matrix',
    subtitle: 'Expanded Vitality & Armor',
    description: 'Boosts maximum Health (+20 HP) and active Shield Capacity (+50) for tougher boss encounters.',
    icon: '💖',
    category: 'defense',
    statBoost: '+20 HP · +50 Shield'
  },
  {
    id: 'perk_cognitive_boost',
    title: 'Neural Coin Multiplier',
    subtitle: '2x Study Rewards',
    description: 'Doubles (2x) coins and XP earned when decoding curriculum question terminals!',
    icon: '🧠',
    category: 'learning',
    statBoost: '2x Quiz Coins & XP'
  },
  {
    id: 'perk_double_jump',
    title: 'Dual Jet Thrusters',
    subtitle: 'Mid-Air Double Jump',
    description: 'Enables responsive mid-air double jumps to reach high sky-bridge terminals and evade ground mines.',
    icon: '🪽',
    category: 'speed',
    statBoost: 'Double Jump Unlocked'
  }
];

// ============================================================================
// Unlockable Heroes, Weapons & Armors
// ============================================================================
export const CHARACTERS_DATA: PlayerCharacter[] = [
  {
    id: 'char_roblox_noob',
    name: 'Cyber Cadet',
    title: 'Agile Systems Recruit',
    avatar: '🟦',
    description: 'Balanced cyber explorer equipped for fast platforming and crisp laser deflections.',
    speedMultiplier: 1.0,
    shieldBonus: 0,
    unlockedByDefault: true,
    cost: 0,
    unlockCondition: 'Starter Hero',
    robloxSkin: {
      headColor: '#facc15',
      torsoColor: '#2563eb',
      leftArmColor: '#facc15',
      rightArmColor: '#facc15',
      legsColor: '#16a34a',
      shirtPattern: 'classic',
      faceType: 'smile',
      accessory: 'headphones'
    }
  },
  {
    id: 'char_ai_architect',
    name: 'Neural Architect',
    title: 'AI Pipeline Specialist',
    avatar: '🤖',
    description: 'Enhanced neural reflex suit with +15% movement agility and reinforced plasma shielding.',
    speedMultiplier: 1.15,
    shieldBonus: 35,
    unlockedByDefault: false,
    cost: 250,
    unlockCondition: '250 Coins',
    robloxSkin: {
      headColor: '#e2e8f0',
      torsoColor: '#0ea5e9',
      leftArmColor: '#38bdf8',
      rightArmColor: '#38bdf8',
      legsColor: '#1e293b',
      shirtPattern: 'armor',
      faceType: 'cyber-visor',
      accessory: 'visor'
    }
  },
  {
    id: 'char_zero_trust',
    name: 'Zero-Trust Ninja',
    title: 'Cyber Fortress Sentinel',
    avatar: '🥷',
    description: 'Stealth network defender built for high-speed dodging through dense missile volleys.',
    speedMultiplier: 1.25,
    shieldBonus: 45,
    unlockedByDefault: false,
    cost: 450,
    unlockCondition: '450 Coins',
    robloxSkin: {
      headColor: '#1e293b',
      torsoColor: '#10b981',
      leftArmColor: '#0f172a',
      rightArmColor: '#0f172a',
      legsColor: '#064e3b',
      shirtPattern: 'ninja',
      faceType: 'cool',
      accessory: 'ninja-mask'
    }
  },
  {
    id: 'char_quantum_dev',
    name: 'Quantum UX Master',
    title: 'Full-Stack Legend',
    avatar: '⚡',
    description: 'Elite quantum-armored innovator uniting speed (+30%) and massive shield durability (+70).',
    speedMultiplier: 1.3,
    shieldBonus: 70,
    unlockedByDefault: false,
    cost: 700,
    unlockCondition: '700 Coins',
    robloxSkin: {
      headColor: '#fef08a',
      torsoColor: '#a855f7',
      leftArmColor: '#f59e0b',
      rightArmColor: '#f59e0b',
      legsColor: '#312e81',
      shirtPattern: 'hoodie',
      faceType: 'cyber-visor',
      accessory: 'headphones'
    }
  }
];

export const WEAPONS_DATA: Weapon[] = [
  {
    id: 'wep_deflector_saber',
    name: 'Cyan Deflector Blade',
    description: 'Standard precision pulse blade with reliable 120° bullet reflection arc.',
    color: '#00f5ff',
    fireRate: 260,
    damage: 34,
    projectileSpeed: 10,
    bulletType: 'laser',
    cost: 0,
    unlockedByDefault: true,
    deflectAngle: 120,
    deflectMultiplier: 1.75
  },
  {
    id: 'wep_tls_cannon',
    name: 'TLS Prism Carbine',
    description: 'High-velocity encrypted plasma bursts that shatter shield barricades rapidly.',
    color: '#10b981',
    fireRate: 210,
    damage: 44,
    projectileSpeed: 12,
    bulletType: 'plasma',
    cost: 300,
    unlockedByDefault: false,
    deflectAngle: 135,
    deflectMultiplier: 2.0
  },
  {
    id: 'wep_neural_disruptor',
    name: 'Neural Pulse Rifle',
    description: 'Rapid-fire tensor emitter with wide 150° counter-deflection field.',
    color: '#a855f7',
    fireRate: 170,
    damage: 52,
    projectileSpeed: 13,
    bulletType: 'pulse',
    cost: 550,
    unlockedByDefault: false,
    deflectAngle: 150,
    deflectMultiplier: 2.2
  },
  {
    id: 'wep_quantum_nova',
    name: 'Quantum Supernova',
    description: 'Supreme 170° reflection arc and heavy quantum bolts capable of melting bosses.',
    color: '#f59e0b',
    fireRate: 145,
    damage: 66,
    projectileSpeed: 15,
    bulletType: 'quantum',
    cost: 850,
    unlockedByDefault: false,
    deflectAngle: 170,
    deflectMultiplier: 2.5
  }
];

export const ARMORS_DATA: Armor[] = [
  {
    id: 'arm_standard',
    name: 'Firewall Vest v1',
    description: 'Light starter cyber plating offering +25 baseline shield points.',
    shieldPoints: 25,
    deflectChance: 0.1,
    cost: 0,
    unlockedByDefault: true
  },
  {
    id: 'arm_dmz_plate',
    name: 'DMZ Perimeter Plate',
    description: 'Reinforced isolation armor adding +75 shield capacity and improved energy absorption.',
    shieldPoints: 75,
    deflectChance: 0.2,
    cost: 280,
    unlockedByDefault: false
  },
  {
    id: 'arm_zero_trust_exo',
    name: 'Zero-Trust Exosuit',
    description: 'Military-grade reactive armor granting +130 shield capacity and high deflection synergy.',
    shieldPoints: 130,
    deflectChance: 0.35,
    cost: 520,
    unlockedByDefault: false
  },
  {
    id: 'arm_quantum_aegis',
    name: 'Quantum Aegis Matrix',
    description: 'Peak defensive nanotechnology providing +200 shield points for the toughest stages.',
    shieldPoints: 200,
    deflectChance: 0.5,
    cost: 800,
    unlockedByDefault: false
  }
];
