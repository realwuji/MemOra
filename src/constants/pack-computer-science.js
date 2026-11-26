/*
  The Computer Science (OCR H446 A-level) revision pack, assembled: the base content plus every
  batch written for it since (flashcards, questions, notes, diagrams), with repeats
  dropped. One module per subject so the app can load a subject only when it is
  studied (see packs.js); library.js assembles all of them for scripts.
*/
import { CS_EXTRA_MCQ } from './cs-extra'
import { CS_EXTRA_MCQ_2, CS_EXTRA_FLASHCARDS_2 } from './cs-extra-2'
import { CS_NOTES } from './cs-notes'
import { CS_PAST_PAPER_QUESTIONS } from './cs-past-papers'
import { mergeNotes } from './notes-merge'
import { CS_EXTRA_DEPTH } from './cs-notes-extra'
import { CS_COMP1_NOTES } from './cs-notes-comp1'
import { CS_COMP2_NOTES } from './cs-notes-comp2'
import { CS_COMP3_NOTES } from './cs-notes-comp3'
import { CS_EXTRA_DEPTH_2 } from './cs-notes-depth-2'
import { CS_EXTRA_FLASHCARDS_4, CS_EXTRA_MCQ_4 } from './cs-extra-4'
import { CS_PROCESSOR_NOTES } from './cs-notes-processor'
import { CS_PROCESSOR_FLASHCARDS } from './cs-flashcards-processor'
import { tagWithDiagrams, appendDiagramsToNotes, CS_CHAPTER_DIAGRAMS } from './diagram-map'
import { CS_DIAGRAM_CARDS } from './diagram-cards'
import { CS_MCQ_3 } from './cs-extra-3'
import { dedupeContent } from './pack-dedupe'

const BASE = {
    "id": "computer-science",
    "name": "Computer Science",
    "topics": [
      "Structure and Function of the Processor",
      "Types of Processor",
      "Input, Output and Storage",
      "Systems Software",
      "Applications Generation (Translators)",
      "Software Development Methodologies",
      "Compression, Encryption and Hashing",
      "Databases",
      "Networks",
      "Web Technologies",
      "Data Types and Number Representation",
      "Data Structures",
      "Boolean Algebra",
      "Algorithms: Searching, Sorting & Graph Traversal",
      "Elements of Computational Thinking",
      "Programming Techniques",
      "Computational Methods",
      "Programming Paradigms",
      "Legal, Moral, Cultural and Ethical Issues",
      "Assembly Language and the Little Man Computer",
      "Algorithm Complexity (Big O)",
      "Object-Oriented Programming"
    ],
    "flashcards": [
      {
        "front": "RAM stands for?",
        "back": "Random Access Memory (volatile)",
        "topic": "Input, Output and Storage"
      },
      {
        "front": "ROM stands for?",
        "back": "Read Only Memory (non-volatile)",
        "topic": "Input, Output and Storage"
      },
      {
        "front": "Is RAM volatile or non-volatile?",
        "back": "Volatile: contents lost when power is removed",
        "topic": "Input, Output and Storage"
      },
      {
        "front": "Give an example of magnetic storage",
        "back": "Hard disk drive (HDD)",
        "topic": "Input, Output and Storage"
      },
      {
        "front": "Give an example of solid state storage",
        "back": "SSD / USB flash drive",
        "topic": "Input, Output and Storage"
      },
      {
        "front": "One advantage of SSD over HDD?",
        "back": "Faster access times and more durable (no moving parts)",
        "topic": "Input, Output and Storage"
      },
      {
        "front": "What is virtual memory?",
        "back": "Secondary storage used as an extension of RAM when RAM is full",
        "topic": "Input, Output and Storage"
      },
      {
        "front": "What is \"thrashing\"?",
        "back": "Excessive swapping between RAM and virtual memory that severely degrades performance",
        "topic": "Input, Output and Storage"
      },
      {
        "front": "What is a buffer used for?",
        "back": "Temporary storage to compensate for speed differences between two devices",
        "topic": "Input, Output and Storage"
      },
      {
        "front": "Why is ROM used for the BIOS/bootstrap loader?",
        "back": "It is non-volatile, so it retains the startup instructions even with no power",
        "topic": "Input, Output and Storage"
      },
      {
        "front": "Give an example of an input device",
        "back": "Keyboard, mouse, scanner, or a sensor",
        "topic": "Input, Output and Storage"
      },
      {
        "front": "Give an example of an output device",
        "back": "Monitor, printer, or speakers",
        "topic": "Input, Output and Storage"
      },
      {
        "front": "What does a sensor do?",
        "back": "Converts a real-world physical quantity (e.g. temperature, light) into a digital signal for a computer to process",
        "topic": "Input, Output and Storage"
      },
      {
        "front": "Why might optical storage suit mass-produced software/media distribution?",
        "back": "It is cheap to mass-produce and read-only is sufficient for distributing finished content",
        "topic": "Input, Output and Storage"
      },
      {
        "front": "Name three functions of an operating system",
        "back": "Any three of: memory management, process scheduling, peripheral/device management, interrupt handling, security, user interface",
        "topic": "Systems Software"
      },
      {
        "front": "What is an interrupt?",
        "back": "A signal to the CPU indicating an event needs immediate attention, pausing current execution",
        "topic": "Systems Software"
      },
      {
        "front": "What is a device driver?",
        "back": "Software that lets the OS communicate with a specific piece of hardware",
        "topic": "Systems Software"
      },
      {
        "front": "What is paging?",
        "back": "Dividing memory into fixed-size blocks (pages) for memory management",
        "topic": "Systems Software"
      },
      {
        "front": "What is segmentation?",
        "back": "Dividing memory into variable-sized logical units (segments)",
        "topic": "Systems Software"
      },
      {
        "front": "Describe round robin scheduling",
        "back": "Each process is given a fixed, equal time slice in turn, cycled through fairly",
        "topic": "Systems Software"
      },
      {
        "front": "What is a virtual machine?",
        "back": "Software emulation of a physical computer, running its own OS",
        "topic": "Systems Software"
      },
      {
        "front": "Difference between Type 1 and Type 2 hypervisors?",
        "back": "Type 1 runs directly on hardware; Type 2 runs on top of a host OS",
        "topic": "Systems Software"
      },
      {
        "front": "Why does the CPU use interrupts rather than polling?",
        "back": "More efficient: avoids wasting CPU cycles repeatedly checking devices that usually have nothing to report",
        "topic": "Systems Software"
      },
      {
        "front": "What is FCFS scheduling?",
        "back": "First Come First Served: processes run strictly in the order they arrive",
        "topic": "Systems Software"
      },
      {
        "front": "Why do interrupts have priorities?",
        "back": "So the most critical/urgent interrupt (e.g. a hardware failure) is serviced before less urgent ones (e.g. routine input)",
        "topic": "Systems Software"
      },
      {
        "front": "What is starvation in scheduling?",
        "back": "When a low-priority process waits indefinitely because higher-priority processes are always chosen first",
        "topic": "Systems Software"
      },
      {
        "front": "What does a compiler do?",
        "back": "Translates the entire source code into machine code before execution",
        "topic": "Applications Generation (Translators)"
      },
      {
        "front": "What does an interpreter do?",
        "back": "Translates and executes source code line by line at runtime",
        "topic": "Applications Generation (Translators)"
      },
      {
        "front": "What does an assembler do?",
        "back": "Translates assembly language into machine code",
        "topic": "Applications Generation (Translators)"
      },
      {
        "front": "Advantage of a compiler over an interpreter?",
        "back": "Compiled programs run faster since there is no translation overhead at runtime",
        "topic": "Applications Generation (Translators)"
      },
      {
        "front": "Advantage of an interpreter over a compiler?",
        "back": "Easier to debug: errors are reported immediately, line by line",
        "topic": "Applications Generation (Translators)"
      },
      {
        "front": "What is a linker?",
        "back": "Combines object files/library code into a single executable",
        "topic": "Applications Generation (Translators)"
      },
      {
        "front": "What is a loader?",
        "back": "Loads a program into memory ready for execution",
        "topic": "Applications Generation (Translators)"
      },
      {
        "front": "What are the stages of compilation, in order?",
        "back": "Lexical analysis, syntax analysis, semantic analysis, code generation, (optimisation)",
        "topic": "Applications Generation (Translators)"
      },
      {
        "front": "What does lexical analysis do?",
        "back": "Breaks source code into tokens",
        "topic": "Applications Generation (Translators)"
      },
      {
        "front": "What does syntax analysis check?",
        "back": "That tokens follow the language's grammar rules, building a parse tree",
        "topic": "Applications Generation (Translators)"
      },
      {
        "front": "What does semantic analysis check?",
        "back": "Logical consistency, e.g. type checking and correct variable usage",
        "topic": "Applications Generation (Translators)"
      },
      {
        "front": "What is a forward reference in assembly?",
        "back": "A label used before it has been defined in the code",
        "topic": "Applications Generation (Translators)"
      },
      {
        "front": "What does the first pass of a two-pass assembler build?",
        "back": "A symbol table of labels and their addresses",
        "topic": "Applications Generation (Translators)"
      },
      {
        "front": "Give an example of a semantic error",
        "back": "Adding a string to an integer without conversion (type mismatch): grammatically valid but logically inconsistent",
        "topic": "Applications Generation (Translators)"
      },
      {
        "front": "Describe the waterfall model in one sentence",
        "back": "A linear sequential process where each development stage must be fully completed before the next begins",
        "topic": "Software Development Methodologies"
      },
      {
        "front": "Key feature of agile development?",
        "back": "Iterative, incremental development with frequent collaboration and flexibility to change requirements",
        "topic": "Software Development Methodologies"
      },
      {
        "front": "What is a \"sprint\" in agile/Scrum?",
        "back": "A fixed time period (e.g. 2-4 weeks) in which a set amount of work is completed",
        "topic": "Software Development Methodologies"
      },
      {
        "front": "What is pair programming?",
        "back": "Two programmers work together at one workstation: one writing code, one reviewing it",
        "topic": "Software Development Methodologies"
      },
      {
        "front": "One advantage of waterfall?",
        "back": "Clear structure, easy to manage and document",
        "topic": "Software Development Methodologies"
      },
      {
        "front": "One disadvantage of waterfall?",
        "back": "Inflexible to changing requirements; testing happens late",
        "topic": "Software Development Methodologies"
      },
      {
        "front": "One advantage of agile?",
        "back": "Flexible to changing requirements, frequent delivery of working software",
        "topic": "Software Development Methodologies"
      },
      {
        "front": "What does RAD prioritise?",
        "back": "Quick prototyping and iterative delivery over extensive upfront planning",
        "topic": "Software Development Methodologies"
      },
      {
        "front": "What does the spiral model add to iterative development?",
        "back": "A strong emphasis on risk analysis at each cycle",
        "topic": "Software Development Methodologies"
      },
      {
        "front": "What is a \"throwaway\" prototype?",
        "back": "An early demonstration version built to clarify requirements, then discarded once its purpose is served",
        "topic": "Software Development Methodologies"
      },
      {
        "front": "What is an \"evolutionary\" prototype?",
        "back": "An early working version that is progressively refined into the final system, rather than discarded",
        "topic": "Software Development Methodologies"
      },
      {
        "front": "Why might a regulated industry (e.g. banking) prefer waterfall?",
        "back": "Its extensive documentation at each stage supports audit/compliance requirements",
        "topic": "Software Development Methodologies"
      },
      {
        "front": "Difference between lossy and lossless compression?",
        "back": "Lossy permanently removes some data (smaller file, quality loss); lossless keeps all data, fully reversible",
        "topic": "Compression, Encryption and Hashing"
      },
      {
        "front": "What is Run Length Encoding?",
        "back": "Replaces repeated consecutive data with a count and value (e.g. AAAA → 4A)",
        "topic": "Compression, Encryption and Hashing"
      },
      {
        "front": "What is Huffman coding?",
        "back": "Assigns shorter binary codes to more frequent symbols, based on their frequency",
        "topic": "Compression, Encryption and Hashing"
      },
      {
        "front": "What is symmetric encryption?",
        "back": "The same key is used to encrypt and decrypt",
        "topic": "Compression, Encryption and Hashing"
      },
      {
        "front": "What is asymmetric encryption?",
        "back": "A public key encrypts, a different private key decrypts",
        "topic": "Compression, Encryption and Hashing"
      },
      {
        "front": "What is a hash function?",
        "back": "A function that converts an input into a fixed-size output (hash/digest)",
        "topic": "Compression, Encryption and Hashing"
      },
      {
        "front": "Is hashing reversible?",
        "back": "No: it is a one-way process",
        "topic": "Compression, Encryption and Hashing"
      },
      {
        "front": "What is a hash collision?",
        "back": "When two different inputs produce the same hash output",
        "topic": "Compression, Encryption and Hashing"
      },
      {
        "front": "Why is hashing (not encryption) used for storing passwords?",
        "back": "So the actual password is never stored anywhere and cannot be reversed/recovered even if the hash is stolen",
        "topic": "Compression, Encryption and Hashing"
      },
      {
        "front": "Main advantage of asymmetric over symmetric encryption for key exchange?",
        "back": "The private key never needs to be shared, removing the risk of it being intercepted",
        "topic": "Compression, Encryption and Hashing"
      },
      {
        "front": "What is a \"salt\" in password hashing?",
        "back": "Random data added to a password before hashing, so identical passwords produce different hashes",
        "topic": "Compression, Encryption and Hashing"
      },
      {
        "front": "Why does salting defeat rainbow table attacks?",
        "back": "A precomputed lookup table of common password hashes no longer matches, since each password now hashes uniquely with its own salt",
        "topic": "Compression, Encryption and Hashing"
      },
      {
        "front": "What kind of data is Run Length Encoding most effective on?",
        "back": "Data with long runs of repeated consecutive values (e.g. simple images with large blocks of one colour)",
        "topic": "Compression, Encryption and Hashing"
      },
      {
        "front": "What is a primary key?",
        "back": "A unique identifier for each record in a table",
        "topic": "Databases"
      },
      {
        "front": "What is a foreign key?",
        "back": "A field in one table that references the primary key of another table",
        "topic": "Databases"
      },
      {
        "front": "What does normalisation aim to reduce?",
        "back": "Data redundancy and the risk of update/insertion/deletion anomalies",
        "topic": "Databases"
      },
      {
        "front": "What does 1NF require?",
        "back": "No repeating groups; each cell holds a single atomic value",
        "topic": "Databases"
      },
      {
        "front": "What does 2NF add on top of 1NF?",
        "back": "No partial dependency: non-key attributes depend on the whole primary key",
        "topic": "Databases"
      },
      {
        "front": "What does 3NF add on top of 2NF?",
        "back": "No transitive dependency: non-key attributes depend only on the primary key",
        "topic": "Databases"
      },
      {
        "front": "What does ACID stand for?",
        "back": "Atomicity, Consistency, Isolation, Durability",
        "topic": "Databases"
      },
      {
        "front": "What is record locking?",
        "back": "Preventing simultaneous conflicting edits to the same record by multiple users",
        "topic": "Databases"
      },
      {
        "front": "SQL keyword to retrieve data?",
        "back": "SELECT",
        "topic": "Databases"
      },
      {
        "front": "SQL keyword to combine data from two tables?",
        "back": "JOIN",
        "topic": "Databases"
      },
      {
        "front": "What is a composite key?",
        "back": "A primary key formed of two or more combined fields",
        "topic": "Databases"
      },
      {
        "front": "What is an ERD?",
        "back": "Entity Relationship Diagram: visually models entities/tables and the relationships between them",
        "topic": "Databases"
      },
      {
        "front": "Name the three types of relationship shown on an ERD",
        "back": "One-to-one, one-to-many, many-to-many",
        "topic": "Databases"
      },
      {
        "front": "What does the \"Isolation\" property of ACID mean?",
        "back": "Concurrent transactions do not interfere with each other",
        "topic": "Databases"
      },
      {
        "front": "What does the \"Durability\" property of ACID mean?",
        "back": "Once a transaction is committed, its changes persist even after a system failure",
        "topic": "Databases"
      },
      {
        "front": "LAN stands for?",
        "back": "Local Area Network",
        "topic": "Networks"
      },
      {
        "front": "WAN stands for?",
        "back": "Wide Area Network",
        "topic": "Networks"
      },
      {
        "front": "Describe a star topology",
        "back": "All devices connect to a central switch/hub",
        "topic": "Networks"
      },
      {
        "front": "One advantage of star topology?",
        "back": "A single cable failure only affects that one device",
        "topic": "Networks"
      },
      {
        "front": "One disadvantage of star topology?",
        "back": "If the central switch/hub fails, the whole network goes down",
        "topic": "Networks"
      },
      {
        "front": "In client-server, what does the server do?",
        "back": "Provides centralised resources/services to client devices on request",
        "topic": "Networks"
      },
      {
        "front": "Key feature of peer-to-peer networks?",
        "back": "No central server: each device can act as both client and server",
        "topic": "Networks"
      },
      {
        "front": "What does TCP/IP stand for?",
        "back": "Transmission Control Protocol / Internet Protocol",
        "topic": "Networks"
      },
      {
        "front": "Function of a router?",
        "back": "Connects different networks and forwards packets based on IP address",
        "topic": "Networks"
      },
      {
        "front": "Function of a switch?",
        "back": "Forwards data to the correct device on the same network based on MAC address",
        "topic": "Networks"
      },
      {
        "front": "Difference between MAC and IP address?",
        "back": "MAC is a fixed physical hardware address; IP is a logical, potentially changeable network address",
        "topic": "Networks"
      },
      {
        "front": "What is packet switching?",
        "back": "Data is broken into packets, sent independently (possibly via different routes), and reassembled at the destination",
        "topic": "Networks"
      },
      {
        "front": "Which TCP/IP layer do HTTP and FTP operate at?",
        "back": "Application layer",
        "topic": "Networks"
      },
      {
        "front": "Which TCP/IP layer handles addressing and routing between networks?",
        "back": "Internet layer (IP)",
        "topic": "Networks"
      },
      {
        "front": "Which TCP/IP layer ensures reliable, ordered delivery of data?",
        "back": "Transport layer (TCP)",
        "topic": "Networks"
      },
      {
        "front": "What does HTTPS add compared to HTTP?",
        "back": "Encryption, making the connection secure",
        "topic": "Networks"
      },
      {
        "front": "What does HTML stand for?",
        "back": "HyperText Markup Language",
        "topic": "Web Technologies"
      },
      {
        "front": "What is HTML used for?",
        "back": "Structuring content on a web page",
        "topic": "Web Technologies"
      },
      {
        "front": "What is CSS used for?",
        "back": "Styling the appearance of a web page",
        "topic": "Web Technologies"
      },
      {
        "front": "What is JavaScript typically used for?",
        "back": "Adding interactivity/dynamic behaviour (client-side scripting)",
        "topic": "Web Technologies"
      },
      {
        "front": "Where does client-side processing run?",
        "back": "In the user's browser",
        "topic": "Web Technologies"
      },
      {
        "front": "Where does server-side processing run?",
        "back": "On the web server, before the page is sent to the user",
        "topic": "Web Technologies"
      },
      {
        "front": "Give an example of when server-side processing is needed",
        "back": "Checking login credentials against a database",
        "topic": "Web Technologies"
      },
      {
        "front": "What does a search engine crawler/spider do?",
        "back": "Automatically browses the web following links to discover and index pages",
        "topic": "Web Technologies"
      },
      {
        "front": "What is a cookie?",
        "back": "A small piece of data stored by a website on the user's browser to remember information between visits",
        "topic": "Web Technologies"
      },
      {
        "front": "Difference between a session cookie and a persistent cookie?",
        "back": "Session cookies are deleted when the browser closes; persistent cookies remain stored for a set period even after closing",
        "topic": "Web Technologies"
      },
      {
        "front": "What does PageRank consider when ranking a page?",
        "back": "The number and quality of other pages linking to it",
        "topic": "Web Technologies"
      },
      {
        "front": "What is two's complement used for?",
        "back": "Representing negative numbers in binary",
        "topic": "Data Types and Number Representation"
      },
      {
        "front": "How do you find the two's complement of a binary number?",
        "back": "Invert all bits, then add 1",
        "topic": "Data Types and Number Representation"
      },
      {
        "front": "What does a floating point number consist of?",
        "back": "A mantissa and an exponent",
        "topic": "Data Types and Number Representation"
      },
      {
        "front": "What is normalisation in floating point representation?",
        "back": "Adjusting the mantissa so exactly one non-zero digit is before the binary point, maximising precision",
        "topic": "Data Types and Number Representation"
      },
      {
        "front": "How many bits does standard ASCII use?",
        "back": "7 bits (128 characters)",
        "topic": "Data Types and Number Representation"
      },
      {
        "front": "Why was Unicode developed?",
        "back": "To represent characters from many more languages/symbols than ASCII allows",
        "topic": "Data Types and Number Representation"
      },
      {
        "front": "What causes binary overflow?",
        "back": "A calculation produces a result too large to fit in the available number of bits",
        "topic": "Data Types and Number Representation"
      },
      {
        "front": "How many binary bits does one hexadecimal digit represent?",
        "back": "4 bits",
        "topic": "Data Types and Number Representation"
      },
      {
        "front": "Why can floating point representation cause rounding errors?",
        "back": "Only a finite number of bits are available for the mantissa, so many real numbers can't be represented exactly",
        "topic": "Data Types and Number Representation"
      },
      {
        "front": "How many bits are in a byte?",
        "back": "8 bits",
        "topic": "Data Types and Number Representation"
      },
      {
        "front": "How many bits are in a nibble?",
        "back": "4 bits (one hex digit)",
        "topic": "Data Types and Number Representation"
      },
      {
        "front": "What happens to precision if you increase the number of bits in the mantissa?",
        "back": "Precision increases (more significant digits can be stored)",
        "topic": "Data Types and Number Representation"
      },
      {
        "front": "What happens to range if you increase the number of bits in the exponent?",
        "back": "Range increases (larger and smaller magnitude numbers can be represented)",
        "topic": "Data Types and Number Representation"
      },
      {
        "front": "What does LIFO stand for, and which structure uses it?",
        "back": "Last In First Out: a stack",
        "topic": "Data Structures"
      },
      {
        "front": "What does FIFO stand for, and which structure uses it?",
        "back": "First In First Out: a queue",
        "topic": "Data Structures"
      },
      {
        "front": "What operations does a stack support?",
        "back": "Push (add to top) and pop (remove from top)",
        "topic": "Data Structures"
      },
      {
        "front": "What operations does a queue support?",
        "back": "Enqueue (add to back) and dequeue (remove from front)",
        "topic": "Data Structures"
      },
      {
        "front": "What is a record?",
        "back": "A structure grouping related fields of possibly different data types together",
        "topic": "Data Structures"
      },
      {
        "front": "Difference between an array and a record?",
        "back": "Array holds multiple items of the same type; record holds related fields of potentially different types",
        "topic": "Data Structures"
      },
      {
        "front": "What is a binary search tree?",
        "back": "A binary tree where left child < parent < right child, enabling efficient searching",
        "topic": "Data Structures"
      },
      {
        "front": "What is a graph (data structure)?",
        "back": "Nodes (vertices) connected by edges, which may be directed/undirected and weighted/unweighted",
        "topic": "Data Structures"
      },
      {
        "front": "What is a hash table?",
        "back": "A structure using a hash function to map keys to array indices for fast lookup",
        "topic": "Data Structures"
      },
      {
        "front": "How can a hash collision be resolved?",
        "back": "Chaining (linked list at that index) or open addressing (find next free slot)",
        "topic": "Data Structures"
      },
      {
        "front": "What is a circular queue?",
        "back": "A queue that wraps around to reuse freed space at the front once the end is reached",
        "topic": "Data Structures"
      },
      {
        "front": "What does each node in a linked list contain?",
        "back": "Data plus a pointer/reference to the next node",
        "topic": "Data Structures"
      },
      {
        "front": "One advantage of a linked list over an array?",
        "back": "Can grow/shrink dynamically without needing contiguous memory",
        "topic": "Data Structures"
      },
      {
        "front": "One disadvantage of a linked list compared to an array?",
        "back": "No direct/instant access by index: must traverse from the start",
        "topic": "Data Structures"
      },
      {
        "front": "What order does in-order traversal visit a binary tree?",
        "back": "Left subtree, then root, then right subtree",
        "topic": "Data Structures"
      },
      {
        "front": "What order does pre-order traversal visit a binary tree?",
        "back": "Root, then left subtree, then right subtree",
        "topic": "Data Structures"
      },
      {
        "front": "When is the output of an AND gate 1?",
        "back": "Only when both inputs are 1",
        "topic": "Boolean Algebra"
      },
      {
        "front": "When is the output of an OR gate 1?",
        "back": "When at least one input is 1",
        "topic": "Boolean Algebra"
      },
      {
        "front": "What does a NOT gate do?",
        "back": "Inverts the input (1→0, 0→1)",
        "topic": "Boolean Algebra"
      },
      {
        "front": "When is the output of an XOR gate 1?",
        "back": "When the inputs are different",
        "topic": "Boolean Algebra"
      },
      {
        "front": "When is the output of a NAND gate 0?",
        "back": "Only when both inputs are 1 (inverted AND)",
        "topic": "Boolean Algebra"
      },
      {
        "front": "De Morgan's first law?",
        "back": "NOT(A AND B) = NOT A OR NOT B",
        "topic": "Boolean Algebra"
      },
      {
        "front": "De Morgan's second law?",
        "back": "NOT(A OR B) = NOT A AND NOT B",
        "topic": "Boolean Algebra"
      },
      {
        "front": "What does a half adder produce?",
        "back": "A sum output and a carry output, from adding two bits",
        "topic": "Boolean Algebra"
      },
      {
        "front": "What extra input does a full adder have compared to a half adder?",
        "back": "A carry-in input, allowing three bits to be added",
        "topic": "Boolean Algebra"
      },
      {
        "front": "What is a Karnaugh map used for?",
        "back": "Visually simplifying Boolean expressions by grouping adjacent 1s",
        "topic": "Boolean Algebra"
      },
      {
        "front": "The absorption law states A + A.B = ?",
        "back": "A",
        "topic": "Boolean Algebra"
      },
      {
        "front": "What two gates build a half adder?",
        "back": "An XOR gate (for the sum) and an AND gate (for the carry)",
        "topic": "Boolean Algebra"
      },
      {
        "front": "What is \"Sum of Products\" form?",
        "back": "A Boolean expression written as an OR of AND terms, one for each row of the truth table where the output is 1",
        "topic": "Boolean Algebra"
      },
      {
        "front": "Why simplify a Boolean expression before building a circuit?",
        "back": "Reduces the number of logic gates needed, making the circuit cheaper, smaller and faster",
        "topic": "Boolean Algebra"
      },
      {
        "front": "Time complexity of linear search (worst case)?",
        "back": "O(n)",
        "topic": "Algorithms: Searching, Sorting & Graph Traversal"
      },
      {
        "front": "Time complexity of binary search (worst case)?",
        "back": "O(log n)",
        "topic": "Algorithms: Searching, Sorting & Graph Traversal"
      },
      {
        "front": "Precondition for binary search to work?",
        "back": "The list/array must be sorted",
        "topic": "Algorithms: Searching, Sorting & Graph Traversal"
      },
      {
        "front": "Time complexity of bubble sort (worst case)?",
        "back": "O(n²)",
        "topic": "Algorithms: Searching, Sorting & Graph Traversal"
      },
      {
        "front": "Time complexity of merge sort (worst case)?",
        "back": "O(n log n)",
        "topic": "Algorithms: Searching, Sorting & Graph Traversal"
      },
      {
        "front": "What technique does merge sort use?",
        "back": "Divide and conquer: splits the list, sorts, then merges",
        "topic": "Algorithms: Searching, Sorting & Graph Traversal"
      },
      {
        "front": "What does BFS stand for, and what structure does it use?",
        "back": "Breadth-First Search: uses a queue",
        "topic": "Algorithms: Searching, Sorting & Graph Traversal"
      },
      {
        "front": "What does DFS stand for, and what structure does it use?",
        "back": "Depth-First Search: uses a stack (or recursion)",
        "topic": "Algorithms: Searching, Sorting & Graph Traversal"
      },
      {
        "front": "What problem does Dijkstra's algorithm solve?",
        "back": "Finding the shortest path between nodes in a weighted graph",
        "topic": "Algorithms: Searching, Sorting & Graph Traversal"
      },
      {
        "front": "What is Big O notation used for?",
        "back": "Describing how an algorithm's time/space requirements grow as input size increases",
        "topic": "Algorithms: Searching, Sorting & Graph Traversal"
      },
      {
        "front": "What does A* search add on top of Dijkstra's algorithm?",
        "back": "A heuristic estimate of distance to the goal, to focus the search more efficiently",
        "topic": "Algorithms: Searching, Sorting & Graph Traversal"
      },
      {
        "front": "Worst-case time complexity of quicksort, and why does it occur?",
        "back": "O(n²): occurs when the pivot chosen is consistently the smallest/largest element, giving very unbalanced partitions",
        "topic": "Algorithms: Searching, Sorting & Graph Traversal"
      },
      {
        "front": "When is insertion sort particularly efficient?",
        "back": "On data that is already nearly sorted",
        "topic": "Algorithms: Searching, Sorting & Graph Traversal"
      },
      {
        "front": "How many comparisons does binary search need for a list of 1000 items (approx, worst case)?",
        "back": "About 10 (log₂1000 ≈ 10)",
        "topic": "Algorithms: Searching, Sorting & Graph Traversal"
      },
      {
        "front": "What is the time complexity of insertion sort in the worst case?",
        "back": "O(n²)",
        "topic": "Algorithms: Searching, Sorting & Graph Traversal"
      },
      {
        "front": "What is abstraction (computational thinking)?",
        "back": "Removing unnecessary detail to focus on the essential features of a problem",
        "topic": "Elements of Computational Thinking"
      },
      {
        "front": "What is decomposition?",
        "back": "Breaking a complex problem into smaller, more manageable sub-problems",
        "topic": "Elements of Computational Thinking"
      },
      {
        "front": "What is algorithmic thinking?",
        "back": "Devising a clear step-by-step sequence of instructions to solve a problem",
        "topic": "Elements of Computational Thinking"
      },
      {
        "front": "What does \"thinking ahead\" involve?",
        "back": "Anticipating the inputs/outputs and pre-conditions needed before writing an algorithm",
        "topic": "Elements of Computational Thinking"
      },
      {
        "front": "What does \"thinking concurrently\" involve?",
        "back": "Considering how tasks could run simultaneously to improve efficiency",
        "topic": "Elements of Computational Thinking"
      },
      {
        "front": "What does \"thinking procedurally\" involve?",
        "back": "Identifying the required steps and their correct order to solve a problem",
        "topic": "Elements of Computational Thinking"
      },
      {
        "front": "What does \"thinking logically\" involve?",
        "back": "Identifying similarities between problems and reasoning carefully about conditions/decisions",
        "topic": "Elements of Computational Thinking"
      },
      {
        "front": "Give a real-world example of abstraction",
        "back": "A tube map, which simplifies real geography into stations and lines; or a car steering wheel abstracting the mechanics of turning wheels",
        "topic": "Elements of Computational Thinking"
      },
      {
        "front": "Are computational thinking skills only useful for programming?",
        "back": "No: they are transferable to problem-solving in many fields, e.g. science, engineering, business",
        "topic": "Elements of Computational Thinking"
      },
      {
        "front": "Give an example of decomposition applied to a timetabling system",
        "back": "Splitting the problem into assigning teachers, assigning rooms, avoiding clashes, and respecting subject requirements as separate sub-problems",
        "topic": "Elements of Computational Thinking"
      },
      {
        "front": "Difference between a variable and a constant?",
        "back": "A variable's value can change during execution; a constant's value is fixed",
        "topic": "Programming Techniques"
      },
      {
        "front": "Difference between a procedure and a function?",
        "back": "A function returns a value; a procedure does not (necessarily)",
        "topic": "Programming Techniques"
      },
      {
        "front": "What is recursion?",
        "back": "A subroutine/function that calls itself to solve a smaller instance of the same problem",
        "topic": "Programming Techniques"
      },
      {
        "front": "What must every recursive function have to avoid infinite recursion?",
        "back": "A base case (terminating condition)",
        "topic": "Programming Techniques"
      },
      {
        "front": "Difference between passing a parameter by value and by reference?",
        "back": "By value passes a copy (original unchanged); by reference passes the actual memory address (original can be changed)",
        "topic": "Programming Techniques"
      },
      {
        "front": "What is a local variable?",
        "back": "A variable only accessible within the subroutine/block it is declared in",
        "topic": "Programming Techniques"
      },
      {
        "front": "What is a global variable?",
        "back": "A variable accessible from anywhere in the program",
        "topic": "Programming Techniques"
      },
      {
        "front": "What is the purpose of exception handling?",
        "back": "To gracefully handle runtime errors without the program crashing",
        "topic": "Programming Techniques"
      },
      {
        "front": "Name two useful IDE features for development",
        "back": "Any two of: syntax highlighting, breakpoints/debugging, autocomplete, code formatting",
        "topic": "Programming Techniques"
      },
      {
        "front": "Difference between a WHILE loop and a DO-WHILE loop?",
        "back": "WHILE checks the condition before each iteration (may run 0 times); DO-WHILE checks after (always runs at least once)",
        "topic": "Programming Techniques"
      },
      {
        "front": "What does count-controlled iteration mean, and which loop type is it?",
        "back": "A loop that repeats a known, fixed number of times: a FOR loop",
        "topic": "Programming Techniques"
      },
      {
        "front": "Give an example of a runtime error that exception handling could catch",
        "back": "Division by zero, array index out of bounds, or opening a file that doesn't exist",
        "topic": "Programming Techniques"
      },
      {
        "front": "Why should a file always be closed after use?",
        "back": "To free system resources and ensure any written data is properly saved",
        "topic": "Programming Techniques"
      },
      {
        "front": "What does string concatenation mean?",
        "back": "Joining two or more strings together",
        "topic": "Programming Techniques"
      },
      {
        "front": "Where are pending recursive calls stored while waiting for a deeper call to return?",
        "back": "On the call stack",
        "topic": "Programming Techniques"
      },
      {
        "front": "What is the divide and conquer approach?",
        "back": "Breaking a problem into smaller sub-problems, solving each, then combining the results",
        "topic": "Computational Methods"
      },
      {
        "front": "Give an example of a divide and conquer algorithm",
        "back": "Merge sort, quicksort, or binary search",
        "topic": "Computational Methods"
      },
      {
        "front": "What is backtracking?",
        "back": "Trying a possible solution, and if it fails, undoing the last step and trying an alternative",
        "topic": "Computational Methods"
      },
      {
        "front": "What is a heuristic?",
        "back": "A rule-of-thumb / approximate method that finds a good, but not necessarily optimal, solution quickly",
        "topic": "Computational Methods"
      },
      {
        "front": "Why use a heuristic instead of an exact algorithm?",
        "back": "When the exact solution would take too long to compute; trades optimality for speed",
        "topic": "Computational Methods"
      },
      {
        "front": "What is data mining?",
        "back": "Analysing large datasets to discover patterns and relationships",
        "topic": "Computational Methods"
      },
      {
        "front": "What is performance modelling?",
        "back": "Simulating a system to predict its performance before building it",
        "topic": "Computational Methods"
      },
      {
        "front": "What is visualisation (as a computational method)?",
        "back": "Representing data or processes graphically to aid human understanding",
        "topic": "Computational Methods"
      },
      {
        "front": "Give a classic example problem solved using backtracking",
        "back": "The N-Queens problem, Sudoku, or maze solving",
        "topic": "Computational Methods"
      },
      {
        "front": "Give a real-world (non-CPU) example of pipelining",
        "back": "A car factory assembly line processing multiple cars simultaneously at different stages",
        "topic": "Computational Methods"
      },
      {
        "front": "What is a class in OOP?",
        "back": "A blueprint/template defining the attributes and methods for objects",
        "topic": "Programming Paradigms"
      },
      {
        "front": "What is an object in OOP?",
        "back": "An instance of a class",
        "topic": "Programming Paradigms"
      },
      {
        "front": "What is inheritance?",
        "back": "A class (subclass) can inherit attributes/methods from another class (superclass)",
        "topic": "Programming Paradigms"
      },
      {
        "front": "What is encapsulation?",
        "back": "Bundling data and methods together and restricting direct external access to some of an object's components",
        "topic": "Programming Paradigms"
      },
      {
        "front": "What is polymorphism?",
        "back": "Different classes responding differently to the same method call/interface",
        "topic": "Programming Paradigms"
      },
      {
        "front": "What is procedural programming?",
        "back": "Programming based on a sequence of instructions organised into procedures/functions",
        "topic": "Programming Paradigms"
      },
      {
        "front": "What is declarative programming?",
        "back": "Programming that states facts and rules, letting the system determine how to reach a goal, rather than specifying exact steps",
        "topic": "Programming Paradigms"
      },
      {
        "front": "Give an example of a declarative programming language",
        "back": "Prolog or SQL",
        "topic": "Programming Paradigms"
      },
      {
        "front": "What relationship does inheritance typically model?",
        "back": "An \"is-a\" relationship (e.g. a Dog \"is-a\" Animal)",
        "topic": "Programming Paradigms"
      },
      {
        "front": "What is method overriding?",
        "back": "A subclass providing its own specific implementation of a method already defined in its superclass",
        "topic": "Programming Paradigms"
      },
      {
        "front": "What is method overloading?",
        "back": "Multiple methods in the same class sharing a name but differing in their parameters",
        "topic": "Programming Paradigms"
      },
      {
        "front": "What access modifier restricts a data member to only be accessed within its own class?",
        "back": "Private",
        "topic": "Programming Paradigms"
      },
      {
        "front": "What access modifier allows a data member to be accessed from outside the class?",
        "back": "Public",
        "topic": "Programming Paradigms"
      },
      {
        "front": "What does the Computer Misuse Act (1990) cover?",
        "back": "Makes unauthorised access, unauthorised modification, and related offences against computer systems/data illegal",
        "topic": "Legal, Moral, Cultural and Ethical Issues"
      },
      {
        "front": "What does the Data Protection Act / UK GDPR cover?",
        "back": "Regulates how personal data must be collected, stored and processed, giving individuals rights over their data",
        "topic": "Legal, Moral, Cultural and Ethical Issues"
      },
      {
        "front": "What does the Copyright, Designs and Patents Act protect?",
        "back": "Original work (including software) from being copied or distributed without permission",
        "topic": "Legal, Moral, Cultural and Ethical Issues"
      },
      {
        "front": "Difference between open source and proprietary software?",
        "back": "Open source: source code is publicly available and can be modified/redistributed; proprietary: source code is closed and usage is restricted by licence",
        "topic": "Legal, Moral, Cultural and Ethical Issues"
      },
      {
        "front": "What is algorithmic bias?",
        "back": "When AI/algorithms reflect or amplify biases present in their training data, causing unfair outcomes",
        "topic": "Legal, Moral, Cultural and Ethical Issues"
      },
      {
        "front": "What is the \"digital divide\"?",
        "back": "The gap between those who have easy access to computers/internet and those who do not",
        "topic": "Legal, Moral, Cultural and Ethical Issues"
      },
      {
        "front": "Give one environmental issue related to computing",
        "back": "E-waste from discarded devices, or high energy consumption of data centres",
        "topic": "Legal, Moral, Cultural and Ethical Issues"
      },
      {
        "front": "Name one right an individual has under GDPR",
        "back": "The right to access their data, have it corrected, or request its erasure",
        "topic": "Legal, Moral, Cultural and Ethical Issues"
      },
      {
        "front": "Does the Computer Misuse Act require actual damage to have occurred for an offence to be committed?",
        "back": "No: unauthorised access alone is an offence regardless of damage caused",
        "topic": "Legal, Moral, Cultural and Ethical Issues"
      },
      {
        "front": "What is meant by \"localisation\" of software?",
        "back": "Adapting software for a specific culture/region, e.g. language, date formats, symbols",
        "topic": "Legal, Moral, Cultural and Ethical Issues"
      },
      {
        "front": "Give an example of a cultural issue in interface design",
        "back": "A colour that has a positive meaning in one culture but a negative/offensive meaning in another",
        "topic": "Legal, Moral, Cultural and Ethical Issues"
      },
      {
        "front": "Can copying a company database without authorisation break more than one law at once?",
        "back": "Yes: e.g. it could breach both the Computer Misuse Act and the Data Protection Act/GDPR simultaneously",
        "topic": "Legal, Moral, Cultural and Ethical Issues"
      }
    ],
    "mcq": [
      {
        "question": "What does the Program Counter (PC) hold?",
        "options": [
          "The current instruction",
          "The address of the next instruction to fetch",
          "The result of the last calculation",
          "The address of the last memory access"
        ],
        "answer": 1,
        "explanation": "The PC always holds the address of the next instruction to be fetched, and is incremented during the fetch stage.",
        "topic": "Structure and Function of the Processor"
      },
      {
        "question": "Which register holds the address of the memory location currently being accessed?",
        "options": [
          "MDR",
          "CIR",
          "MAR",
          "ACC"
        ],
        "answer": 2,
        "explanation": "The Memory Address Register (MAR) holds the address of the memory location currently being read from or written to.",
        "topic": "Structure and Function of the Processor"
      },
      {
        "question": "What is the correct order of the fetch-decode-execute cycle?",
        "options": [
          "Decode, Fetch, Execute",
          "Fetch, Decode, Execute",
          "Execute, Fetch, Decode",
          "Fetch, Execute, Decode"
        ],
        "answer": 1,
        "explanation": "Instructions are always fetched first, then decoded to determine the operation, then executed.",
        "topic": "Structure and Function of the Processor"
      },
      {
        "question": "Which processor type typically uses simpler, fixed-length instructions?",
        "options": [
          "CISC",
          "RISC",
          "GPU",
          "ALU"
        ],
        "answer": 1,
        "explanation": "RISC (Reduced Instruction Set Computer) uses a small set of simple, fixed-length instructions, usually executed in one clock cycle.",
        "topic": "Types of Processor"
      },
      {
        "question": "What does SIMD stand for?",
        "options": [
          "Single Instruction Multiple Data",
          "Single Instruction Multiple Devices",
          "Sequential Instruction Multiple Data",
          "Single Input Multiple Data"
        ],
        "answer": 0,
        "explanation": "SIMD (Single Instruction, Multiple Data) applies one instruction to many data items simultaneously, as GPUs do.",
        "topic": "Types of Processor"
      },
      {
        "question": "What is the main benefit of pipelining?",
        "options": [
          "Reduces the number of registers needed",
          "Increases instruction throughput by overlapping stages",
          "Removes the need for a control unit",
          "Increases clock speed automatically"
        ],
        "answer": 1,
        "explanation": "Pipelining overlaps the fetch/decode/execute stages of consecutive instructions, increasing overall throughput.",
        "topic": "Types of Processor"
      },
      {
        "question": "Which type of memory is volatile?",
        "options": [
          "ROM",
          "RAM",
          "SSD",
          "HDD"
        ],
        "answer": 1,
        "explanation": "RAM loses its contents when power is removed, unlike ROM, SSD or HDD which are non-volatile.",
        "topic": "Input, Output and Storage"
      },
      {
        "question": "What is one key advantage of SSD over HDD?",
        "options": [
          "Cheaper per GB",
          "Faster access times, no moving parts",
          "Larger maximum capacity always",
          "Uses magnetic storage"
        ],
        "answer": 1,
        "explanation": "SSDs have no moving parts, giving faster access times and greater durability than HDDs.",
        "topic": "Input, Output and Storage"
      },
      {
        "question": "What is virtual memory used for?",
        "options": [
          "Permanently storing the OS",
          "Extending RAM using secondary storage when RAM is full",
          "Speeding up the CPU clock",
          "Replacing cache memory"
        ],
        "answer": 1,
        "explanation": "Virtual memory lets the OS use secondary storage as an extension of RAM when physical RAM is full.",
        "topic": "Input, Output and Storage"
      },
      {
        "question": "Which scheduling algorithm gives each process an equal time slice in turn?",
        "options": [
          "FCFS",
          "Round robin",
          "Priority scheduling",
          "Shortest job first"
        ],
        "answer": 1,
        "explanation": "Round robin cycles through processes, giving each a fixed, equal time slice in turn.",
        "topic": "Systems Software"
      },
      {
        "question": "What is the purpose of an interrupt?",
        "options": [
          "To permanently stop a process",
          "To signal the CPU that an event needs immediate attention",
          "To increase clock speed",
          "To allocate more RAM"
        ],
        "answer": 1,
        "explanation": "An interrupt signals the CPU to pause its current task and respond to an event, more efficient than constant polling.",
        "topic": "Systems Software"
      },
      {
        "question": "What does a device driver do?",
        "options": [
          "Increases the device's processing power",
          "Allows the OS to communicate with specific hardware",
          "Encrypts data sent to the device",
          "Schedules CPU processes"
        ],
        "answer": 1,
        "explanation": "A device driver translates OS commands into device-specific instructions.",
        "topic": "Systems Software"
      },
      {
        "question": "Which translator converts source code into machine code all at once before execution?",
        "options": [
          "Interpreter",
          "Compiler",
          "Assembler",
          "Linker"
        ],
        "answer": 1,
        "explanation": "A compiler translates the entire program into machine code before it runs, producing an executable.",
        "topic": "Applications Generation (Translators)"
      },
      {
        "question": "What is the main advantage of an interpreter over a compiler?",
        "options": [
          "Faster execution",
          "Errors are found immediately, line by line",
          "Produces a standalone executable",
          "Requires less memory always"
        ],
        "answer": 1,
        "explanation": "An interpreter executes line by line, so errors are reported immediately during development, easing debugging.",
        "topic": "Applications Generation (Translators)"
      },
      {
        "question": "What does a linker do?",
        "options": [
          "Converts assembly to machine code",
          "Combines object code and library code into one executable",
          "Breaks source code into tokens",
          "Checks syntax rules"
        ],
        "answer": 1,
        "explanation": "A linker combines compiled object code with any required library code into a single executable file.",
        "topic": "Applications Generation (Translators)"
      },
      {
        "question": "Which methodology follows strict sequential stages with no going back?",
        "options": [
          "Agile",
          "Waterfall",
          "Extreme Programming",
          "RAD"
        ],
        "answer": 1,
        "explanation": "Waterfall is a linear model where each stage must be completed before the next begins.",
        "topic": "Software Development Methodologies"
      },
      {
        "question": "Pair programming is a defining feature of which methodology?",
        "options": [
          "Waterfall",
          "Extreme Programming",
          "Spiral model",
          "RAD"
        ],
        "answer": 1,
        "explanation": "Extreme Programming (XP) emphasises technical practices like pair programming and test-driven development.",
        "topic": "Software Development Methodologies"
      },
      {
        "question": "What is a key disadvantage of the waterfall model?",
        "options": [
          "Too flexible",
          "Difficult and costly to revisit earlier stages once progressed",
          "No documentation produced",
          "No testing stage"
        ],
        "answer": 1,
        "explanation": "Waterfall's rigid sequence makes it expensive to accommodate changing requirements once development has moved on.",
        "topic": "Software Development Methodologies"
      },
      {
        "question": "Which type of compression permanently removes some data?",
        "options": [
          "Lossless",
          "Lossy",
          "Run length encoding",
          "Huffman coding"
        ],
        "answer": 1,
        "explanation": "Lossy compression permanently discards some data to shrink file size, unlike lossless compression.",
        "topic": "Compression, Encryption and Hashing"
      },
      {
        "question": "What is the key difference between symmetric and asymmetric encryption?",
        "options": [
          "Symmetric uses two keys, asymmetric uses one",
          "Symmetric uses the same key to encrypt and decrypt; asymmetric uses a key pair",
          "Asymmetric is always faster",
          "They are the same thing"
        ],
        "answer": 1,
        "explanation": "Symmetric encryption uses one shared key; asymmetric uses a public key to encrypt and a private key to decrypt.",
        "topic": "Compression, Encryption and Hashing"
      },
      {
        "question": "Why is hashing used to store passwords rather than encryption?",
        "options": [
          "It's reversible if needed",
          "It is one-way, so the original password can't be recovered from the stored hash",
          "It compresses the password",
          "It requires a public key"
        ],
        "answer": 1,
        "explanation": "Hashing is a one-way process, so even if the stored hash is leaked, the original password cannot be directly recovered.",
        "topic": "Compression, Encryption and Hashing"
      },
      {
        "question": "What is the purpose of a primary key?",
        "options": [
          "Encrypts the table",
          "Uniquely identifies each record in a table",
          "Links two databases",
          "Sorts records alphabetically"
        ],
        "answer": 1,
        "explanation": "A primary key uniquely identifies every record in a table.",
        "topic": "Databases"
      },
      {
        "question": "What does normalisation aim to reduce?",
        "options": [
          "The number of tables",
          "Data redundancy and update anomalies",
          "The number of users",
          "Query speed"
        ],
        "answer": 1,
        "explanation": "Normalisation organises data to minimise redundancy and prevent update/insertion/deletion anomalies.",
        "topic": "Databases"
      },
      {
        "question": "Which SQL keyword retrieves data from a table?",
        "options": [
          "INSERT",
          "SELECT",
          "UPDATE",
          "DELETE"
        ],
        "answer": 1,
        "explanation": "SELECT is used to query and retrieve data from one or more tables.",
        "topic": "Databases"
      },
      {
        "question": "In a star topology, what happens if the central switch fails?",
        "options": [
          "Only one device is affected",
          "The whole network goes down",
          "Nothing changes",
          "Data speed increases"
        ],
        "answer": 1,
        "explanation": "Since every device connects through the central switch, its failure takes down the whole network.",
        "topic": "Networks"
      },
      {
        "question": "What does a router do?",
        "options": [
          "Forwards data to devices on the same network using MAC address",
          "Connects different networks and routes packets using IP address",
          "Encrypts network traffic",
          "Stores web pages"
        ],
        "answer": 1,
        "explanation": "A router connects separate networks and forwards packets based on their destination IP address.",
        "topic": "Networks"
      },
      {
        "question": "What is packet switching?",
        "options": [
          "Sending an entire file as one continuous block",
          "Breaking data into packets sent independently and reassembled at the destination",
          "A type of network topology",
          "A form of encryption"
        ],
        "answer": 1,
        "explanation": "Packet switching splits data into packets that travel independently, possibly via different routes, and are reassembled on arrival.",
        "topic": "Networks"
      },
      {
        "question": "What is CSS primarily used for?",
        "options": [
          "Structuring content",
          "Styling the appearance of a web page",
          "Server-side processing",
          "Database queries"
        ],
        "answer": 1,
        "explanation": "CSS controls the visual presentation of a web page, separate from its HTML content.",
        "topic": "Web Technologies"
      },
      {
        "question": "Where does client-side scripting run?",
        "options": [
          "On the web server",
          "In the user's browser",
          "In the database",
          "On the router"
        ],
        "answer": 1,
        "explanation": "Client-side scripts (e.g. JavaScript) execute in the user's browser, not on the server.",
        "topic": "Web Technologies"
      },
      {
        "question": "What is a cookie used for?",
        "options": [
          "Encrypting a website",
          "Storing small pieces of data to remember information between visits",
          "Compressing images",
          "Running server-side code"
        ],
        "answer": 1,
        "explanation": "Cookies are small pieces of data stored by a website in the browser to remember information between visits.",
        "topic": "Web Technologies"
      },
      {
        "question": "How do you find the two's complement of a binary number?",
        "options": [
          "Add 1 only",
          "Invert all bits, then add 1",
          "Reverse the bit order",
          "Multiply by -1"
        ],
        "answer": 1,
        "explanation": "Two's complement is found by inverting every bit (one's complement) and then adding 1.",
        "topic": "Data Types and Number Representation"
      },
      {
        "question": "What does a floating point number consist of?",
        "options": [
          "Sign and magnitude only",
          "A mantissa and an exponent",
          "Two integers",
          "A hash and a checksum"
        ],
        "answer": 1,
        "explanation": "Floating point numbers represent real numbers using a mantissa (significant digits) and an exponent.",
        "topic": "Data Types and Number Representation"
      },
      {
        "question": "How many bits does standard ASCII use?",
        "options": [
          "8",
          "7",
          "16",
          "4"
        ],
        "answer": 1,
        "explanation": "Standard ASCII uses 7 bits, representing 128 characters.",
        "topic": "Data Types and Number Representation"
      },
      {
        "question": "Which principle does a stack follow?",
        "options": [
          "First In First Out",
          "Last In First Out",
          "Random access",
          "Sorted order"
        ],
        "answer": 1,
        "explanation": "A stack is Last In, First Out (LIFO): the most recently added item is removed first.",
        "topic": "Data Structures"
      },
      {
        "question": "Which data structure uses First In First Out?",
        "options": [
          "Stack",
          "Queue",
          "Tree",
          "Graph"
        ],
        "answer": 1,
        "explanation": "A queue is First In, First Out (FIFO): items are removed in the order they were added.",
        "topic": "Data Structures"
      },
      {
        "question": "In a binary search tree, where are values smaller than a node's value stored?",
        "options": [
          "Right child",
          "Left child",
          "Root",
          "Anywhere"
        ],
        "answer": 1,
        "explanation": "In a BST, the left child subtree holds values smaller than the parent node.",
        "topic": "Data Structures"
      },
      {
        "question": "When is the output of an AND gate 1?",
        "options": [
          "When at least one input is 1",
          "Only when both inputs are 1",
          "When both inputs are 0",
          "Always"
        ],
        "answer": 1,
        "explanation": "An AND gate only outputs 1 when every input is 1.",
        "topic": "Boolean Algebra"
      },
      {
        "question": "What is the output of an XOR gate when both inputs are the same?",
        "options": [
          "1",
          "0",
          "Undefined",
          "Depends on order"
        ],
        "answer": 1,
        "explanation": "XOR outputs 1 only when the inputs differ; identical inputs give 0.",
        "topic": "Boolean Algebra"
      },
      {
        "question": "What does De Morgan's law state for NOT(A AND B)?",
        "options": [
          "NOT A AND NOT B",
          "NOT A OR NOT B",
          "A OR B",
          "A AND B"
        ],
        "answer": 1,
        "explanation": "De Morgan's first law: NOT(A AND B) = NOT A OR NOT B.",
        "topic": "Boolean Algebra"
      },
      {
        "question": "What is the precondition for binary search to work correctly?",
        "options": [
          "Data must be in an array",
          "Data must be sorted",
          "Data must be numeric",
          "Data must be unique"
        ],
        "answer": 1,
        "explanation": "Binary search relies on repeatedly halving a sorted list; it doesn't work on unsorted data.",
        "topic": "Algorithms: Searching, Sorting & Graph Traversal"
      },
      {
        "question": "What is the time complexity of binary search in the worst case?",
        "options": [
          "O(n)",
          "O(log n)",
          "O(n²)",
          "O(1)"
        ],
        "answer": 1,
        "explanation": "Binary search halves the search space each step, giving O(log n) worst-case time.",
        "topic": "Algorithms: Searching, Sorting & Graph Traversal"
      },
      {
        "question": "Which data structure does breadth-first search use to track nodes to visit?",
        "options": [
          "Stack",
          "Queue",
          "Tree",
          "Hash table"
        ],
        "answer": 1,
        "explanation": "BFS uses a queue so nodes are visited level by level, in the order they were discovered.",
        "topic": "Algorithms: Searching, Sorting & Graph Traversal"
      },
      {
        "question": "What is decomposition?",
        "options": [
          "Removing unnecessary detail",
          "Breaking a complex problem into smaller sub-problems",
          "Writing an algorithm",
          "Testing a program"
        ],
        "answer": 1,
        "explanation": "Decomposition breaks a large problem into smaller, more manageable sub-problems.",
        "topic": "Elements of Computational Thinking"
      },
      {
        "question": "What is abstraction?",
        "options": [
          "Breaking a problem into parts",
          "Removing unnecessary detail to focus on the essentials",
          "Running a program repeatedly",
          "Debugging code"
        ],
        "answer": 1,
        "explanation": "Abstraction focuses on the essential features of a problem, ignoring irrelevant detail.",
        "topic": "Elements of Computational Thinking"
      },
      {
        "question": "What does \"thinking ahead\" involve in computational thinking?",
        "options": [
          "Writing code as fast as possible",
          "Anticipating inputs, outputs and reusable components before implementation",
          "Ignoring edge cases",
          "Testing only after release"
        ],
        "answer": 1,
        "explanation": "Thinking ahead means anticipating what an algorithm will need before writing it, reducing rework later.",
        "topic": "Elements of Computational Thinking"
      },
      {
        "question": "What is required in a recursive function to avoid infinite recursion?",
        "options": [
          "A loop",
          "A base case",
          "A global variable",
          "A parameter"
        ],
        "answer": 1,
        "explanation": "A base case stops the recursive calls once a terminating condition is reached.",
        "topic": "Programming Techniques"
      },
      {
        "question": "What is the key difference between passing a parameter by value and by reference?",
        "options": [
          "By value passes a copy; by reference passes the actual memory address",
          "They are identical",
          "By reference is always slower",
          "By value modifies the original"
        ],
        "answer": 0,
        "explanation": "By value copies the argument (original unaffected); by reference passes the address, so changes affect the original.",
        "topic": "Programming Techniques"
      },
      {
        "question": "What does a while loop check before each iteration begins?",
        "options": [
          "Nothing",
          "The loop condition",
          "It only ever runs once",
          "The array length"
        ],
        "answer": 1,
        "explanation": "A while loop checks its condition before every iteration, so it may run zero times if false immediately.",
        "topic": "Programming Techniques"
      },
      {
        "question": "What is backtracking?",
        "options": [
          "Always moving forward through a problem",
          "Trying a solution, and undoing the last step if it fails, then trying an alternative",
          "A sorting algorithm",
          "A type of encryption"
        ],
        "answer": 1,
        "explanation": "Backtracking tries a possible path and reverses ('backtracks') when it hits a dead end, trying another option.",
        "topic": "Computational Methods"
      },
      {
        "question": "What is a heuristic?",
        "options": [
          "An exact, always-optimal algorithm",
          "A rule-of-thumb method that finds a good, but not necessarily optimal, solution quickly",
          "A type of data structure",
          "A network protocol"
        ],
        "answer": 1,
        "explanation": "A heuristic trades guaranteed optimality for speed, useful when an exact solution would take too long.",
        "topic": "Computational Methods"
      },
      {
        "question": "What technique does merge sort use?",
        "options": [
          "Backtracking",
          "Divide and conquer",
          "Heuristics",
          "Data mining"
        ],
        "answer": 1,
        "explanation": "Merge sort recursively divides the list, sorts the pieces, then merges them back together.",
        "topic": "Computational Methods"
      },
      {
        "question": "What is encapsulation in OOP?",
        "options": [
          "Making all data public",
          "Bundling data and methods together, restricting direct access",
          "Copying a class",
          "Deleting an object"
        ],
        "answer": 1,
        "explanation": "Encapsulation bundles data with its methods and restricts direct external access, protecting data integrity.",
        "topic": "Programming Paradigms"
      },
      {
        "question": "What does inheritance allow a subclass to do?",
        "options": [
          "Delete the superclass",
          "Gain the attributes and methods of its superclass",
          "Become private",
          "Run faster automatically"
        ],
        "answer": 1,
        "explanation": "Inheritance lets a subclass automatically gain the attributes and methods of its superclass, promoting reuse.",
        "topic": "Programming Paradigms"
      },
      {
        "question": "What is declarative programming?",
        "options": [
          "Specifying exact steps to follow",
          "Stating facts and rules, letting the system determine how to reach a goal",
          "Only used for making games",
          "The same as procedural programming"
        ],
        "answer": 1,
        "explanation": "Declarative programming states WHAT the outcome should be, leaving the HOW to the underlying system.",
        "topic": "Programming Paradigms"
      },
      {
        "question": "What does the Computer Misuse Act make illegal?",
        "options": [
          "Only hacking for financial profit",
          "Unauthorised access to computer systems or data",
          "Only spreading computer viruses",
          "Only accessing government systems"
        ],
        "answer": 1,
        "explanation": "The Computer Misuse Act makes any unauthorised access to a computer system or data an offence, regardless of intent or damage.",
        "topic": "Legal, Moral, Cultural and Ethical Issues"
      },
      {
        "question": "What right does GDPR give individuals regarding their personal data?",
        "options": [
          "No rights over their own data",
          "The right to access, correct, or request erasure of their data",
          "Only the right to sell their data",
          "It only applies to companies, not individuals"
        ],
        "answer": 1,
        "explanation": "GDPR gives individuals rights including access to their data, correction of inaccuracies, and erasure.",
        "topic": "Legal, Moral, Cultural and Ethical Issues"
      },
      {
        "question": "What is a key characteristic of open source software?",
        "options": [
          "Source code is always kept secret",
          "Source code is publicly available and can be modified or redistributed",
          "It is always more expensive than proprietary software",
          "It cannot be used commercially"
        ],
        "answer": 1,
        "explanation": "Open source software makes its source code publicly available for anyone to view, modify and redistribute.",
        "topic": "Legal, Moral, Cultural and Ethical Issues"
      }
    ],
    "groups": [
      {
        "label": "Component 1: Computer Systems",
        "subgroups": [
          {
            "label": "1.1 The Processor & Hardware",
            "topics": [
              "Structure and Function of the Processor",
              "Types of Processor",
              "Input, Output and Storage"
            ]
          },
          {
            "label": "1.2 Software and Software Development",
            "topics": [
              "Systems Software",
              "Applications Generation (Translators)",
              "Software Development Methodologies",
              "Assembly Language and the Little Man Computer",
              "Programming Paradigms",
              "Object-Oriented Programming"
            ]
          },
          {
            "label": "1.3 Exchanging Data",
            "topics": [
              "Compression, Encryption and Hashing",
              "Databases",
              "Networks",
              "Web Technologies"
            ]
          },
          {
            "label": "1.4 Data Types, Data Structures and Boolean Algebra",
            "topics": [
              "Data Types and Number Representation",
              "Data Structures",
              "Boolean Algebra"
            ]
          },
          {
            "label": "1.5 Legal, Moral, Cultural and Ethical Issues",
            "topics": [
              "Legal, Moral, Cultural and Ethical Issues"
            ]
          }
        ]
      },
      {
        "label": "Component 2: Algorithms and Programming",
        "subgroups": [
          {
            "label": "2.1 Elements of Computational Thinking",
            "topics": [
              "Elements of Computational Thinking"
            ]
          },
          {
            "label": "2.2 Problem Solving and Programming",
            "topics": [
              "Programming Techniques",
              "Computational Methods"
            ]
          },
          {
            "label": "2.3 Algorithms",
            "topics": [
              "Algorithm Complexity (Big O)",
              "Algorithms: Searching, Sorting & Graph Traversal"
            ]
          }
        ]
      }
    ]
}

const withExtras = (pack) => {
  return {
    ...pack,
    flashcards: tagWithDiagrams([...pack.flashcards, ...CS_EXTRA_FLASHCARDS_2, ...CS_DIAGRAM_CARDS, ...CS_EXTRA_FLASHCARDS_4, ...CS_PROCESSOR_FLASHCARDS], 'Computer Science'),
    mcq: tagWithDiagrams([...pack.mcq, ...CS_EXTRA_MCQ, ...CS_EXTRA_MCQ_2, ...CS_MCQ_3, ...CS_EXTRA_MCQ_4], 'Computer Science'),
    // The real OCR questions converted from the question-bank PDFs (see examconversion.md). Shown with
    // the same exam sheet as maths; examImages tells the runner to use it.
    examQuestions: CS_PAST_PAPER_QUESTIONS,
    examImages: true,
    notes: appendDiagramsToNotes(mergeNotes({ ...CS_NOTES, ...CS_COMP1_NOTES, ...CS_COMP2_NOTES, ...CS_COMP3_NOTES, ...CS_PROCESSOR_NOTES }, CS_EXTRA_DEPTH, CS_EXTRA_DEPTH_2), CS_CHAPTER_DIAGRAMS),
  }
}

export default dedupeContent(withExtras(BASE))
