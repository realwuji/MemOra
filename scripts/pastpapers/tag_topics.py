"""
Step 2 of tagging the Computer Science questions by chapter: turn the text from ocr_questions.py
into one chapter per question and write it into the index (src/data/computer-science-past-papers.js).

How a question gets its chapter
  1. Each of the 22 chapters has a list of keyword patterns with weights (RULES below). A pattern
     counts once however often it appears. Specific terms ("round robin", "two's complement")
     weigh more than generic ones ("table", "data").
  2. The paper decides the component (Paper 1 and AS Paper 1 are Component 1, Paper 2 and AS Paper 2
     are Component 2). Chapters in the same component get a small bonus, so a Component 1 question
     is not pulled into a Component 2 chapter by one stray word.
  3. The highest score wins. If it is too low to trust (CONFIDENT), the other parts of the same
     question (same sitting, paper and question number, such as 3(a), 3(b)) vote instead: they
     share a scenario, so they almost always share a chapter.
  4. If the whole question has no signal, the question goes to its component's default chapter
     (DEFAULTS). A question is never left without a chapter.

What it prints: how many questions were decided by their own text, by their neighbours, or by
default; how many each chapter got; and a random sample for a human check. Whatever it cannot
decide well is the first thing to read when spot-checking (see examconversion.md).

Run from the repo root, after ocr_questions.py:
    python3 scripts/pastpapers/tag_topics.py <ocr.json> [--sample 70] [--write]
Without --write it only reports. With --write it rewrites the index (topic is added to every row).
"""
import argparse
import collections
import json
import pathlib
import random
import re
import subprocess

ROOT = pathlib.Path(__file__).resolve().parents[2]
INDEX = ROOT / "src" / "data" / "computer-science-past-papers.js"

C1 = "Component 1: Computer Systems"
C2 = "Component 2: Algorithms and Programming"

# chapter -> component, using the names the notes and the chapter picker use
CHAPTERS = {
    "Structure and Function of the Processor": C1,
    "Types of Processor": C1,
    "Input, Output and Storage": C1,
    "Systems Software": C1,
    "Applications Generation (Translators)": C1,
    "Software Development Methodologies": C1,
    "Compression, Encryption and Hashing": C1,
    "Databases": C1,
    "Networks": C1,
    "Web Technologies": C1,
    "Data Types and Number Representation": C1,
    "Data Structures": C1,
    "Boolean Algebra": C1,
    "Assembly Language and the Little Man Computer": C1,
    "Programming Paradigms": C1,
    "Object-Oriented Programming": C1,
    "Legal, Moral, Cultural and Ethical Issues": C1,
    "Elements of Computational Thinking": C2,
    "Programming Techniques": C2,
    "Computational Methods": C2,
    "Algorithm Complexity (Big O)": C2,
    "Algorithms: Searching, Sorting & Graph Traversal": C2,
}

OVERRIDES_FILE = ROOT / "scripts" / "pastpapers" / "topic-overrides.json"
DEFAULTS = {C1: "Systems Software", C2: "Programming Techniques"}
SAME_COMPONENT_BONUS = 1
CONFIDENT = 4  # a score below this is not trusted on its own
NEIGHBOUR_SHARE = 0.12  # how much of the other parts' scores (same question) each part inherits

# (regex, weight). Matched against lower-case text. \b keeps "or" out of "register".
RULES = {
    "Structure and Function of the Processor": [
        (r"\balu\b|arithmetic logic unit", 4), (r"control unit", 4), (r"\bregisters?\b", 2),
        (r"program counter|\bpc\b", 3), (r"\bmar\b|memory address register", 4), (r"\bmdr\b|memory data register", 4),
        (r"\bcir\b|current instruction register", 4), (r"accumulator", 3), (r"fetch.{0,6}decode.{0,6}execute|fetch-execute", 5),
        (r"\bfetch\b|\bdecode\b", 2), (r"clock speed|clock cycle|\bclock\b", 2), (r"\bcache\b", 3),
        (r"\bcores?\b", 2), (r"address bus|data bus|control bus|\bbuses\b|\bbus\b", 3), (r"von neumann|harvard", 5),
        (r"pipelin", 3), (r"instruction set", 2), (r"\bcpu\b|\bprocessor\b", 2), (r"word length|bus width", 2),
    ],
    "Types of Processor": [
        (r"\brisc\b|\bcisc\b", 6), (r"\bgpu\b|graphics processing", 5), (r"multicore|multi-core|multiple cores", 4),
        (r"parallel processing|parallel processor", 4), (r"co-?processor", 4), (r"\bsimd\b|\bmimd\b|array processor", 5),
    ],
    "Input, Output and Storage": [
        (r"input device|output device|\binput devices\b|\boutput devices\b", 4), (r"\bram\b|\brom\b", 3), (r"\bram\b.{0,60}\brom\b|\brom\b.{0,60}\bram\b", 6),
        (r"virtual storage|secondary storage|primary storage|cloud storage", 4), (r"magnetic|optical|solid.state|\bssd\b|flash memory", 4),
        (r"hard (disk|drive)|\bhdd\b|usb|memory stick", 3), (r"barcode|scanner|touch.?screen|sensor|\bqr code\b|\brfid\b", 2),
        (r"embedded system", 4), (r"storage (capacity|device|medium|media)", 3), (r"\bstorage\b", 1), (r"memory (card|chip)", 2),
    ],
    "Systems Software": [
        (r"operating system|\bos\b", 4), (r"memory management|\bpaging\b|segmentation|virtual memory", 5),
        (r"scheduling|round robin|shortest job|shortest remaining|first come first served|multi-?level feedback", 6),
        (r"interrupt|\bisr\b", 4), (r"device driver|\bdrivers?\b", 3), (r"virtual machine", 4),
        (r"utility|defragment|disk clean|backup software|anti-?virus", 3), (r"\bbios\b|boot ?strap|\bboot\b", 3),
        (r"multi-?tasking|multi-?user|real.time operating|distributed operating", 4), (r"user interface|\bgui\b|command line", 2),
        (r"open source|proprietary|licen[cs]e", 1), (r"system software|application software", 3),
    ],
    "Applications Generation (Translators)": [
        (r"compiler|interpreter|assembler|\btranslators?\b", 5), (r"bytecode|byte code", 4), (r"source code|object code|machine code", 3),
        (r"lexical|syntax analysis|code generation|optimi[sz]ation", 5), (r"intermediate code", 4), (r"\blinker\b|\bloader\b", 4),
        (r"\blibrary\b|libraries", 4), (r"library files?|library routines?", 6), (r"\bide\b|debugger|code editor|syntax highlight|auto.?complet", 2), (r"\bdll\b|dynamic link", 3),
    ],
    "Software Development Methodologies": [
        (r"waterfall|\bagile\b|extreme programming|spiral model|rapid application development|\brad\b", 6),
        (r"prototyp", 3), (r"development methodolog", 6), (r"\biterative\b|incremental", 3),
        (r"\balpha testing\b|\bbeta testing\b|acceptance test", 4), (r"feasibility|requirements|analysis stage|design stage|maintenance stage", 3),
        (r"software development|development life ?cycle|life ?cycle", 3), (r"\bclient\b.*\bstakeholder|stakeholder", 2),
        (r"testing (strategy|plan)|test plan|test data|unit test|white.box|black.box", 2),
    ],
    "Compression, Encryption and Hashing": [
        (r"compress", 5), (r"\blossy\b|lossless", 5), (r"run.length|\brle\b", 5), (r"huffman|dictionary (coding|compression)", 5),
        (r"encrypt|decrypt|cipher|caesar|vernam|one.time pad", 5), (r"symmetric|asymmetric|public key|private key", 4),
        (r"\bhash(ing|es|ed)?\b|hash function", 3), (r"digital signature|digital certificate|certificate authority", 4),
    ],
    "Databases": [
        (r"\bdatabase", 4), (r"\bsql\b", 5), (r"select\b.*\bfrom\b|\bwhere\b.*=|\binsert into\b|\bupdate\b.*\bset\b", 3),
        (r"primary key|foreign key|composite key|secondary key|candidate key", 5), (r"relational|flat.file", 4),
        (r"\bentit(y|ies)\b|entity relationship|\ber diagram|\ber model", 4), (r"normali[sz]|normal form|\b1nf\b|\b2nf\b|\b3nf\b", 5),
        (r"\bacid\b|atomicity|record lock|transaction processing|referential integrity", 5), (r"\bqueries\b|\bquery\b", 2),
        (r"\bjoin\b|\bindex(es|ing)?\b|\bfield\b|\brecords?\b|\btable\b", 1),
    ],
    "Networks": [
        (r"\bnetwork", 3), (r"protocol|tcp/?ip|\btcp\b|\budp\b|\bhttps?\b|\bftp\b|\bsmtp\b|\bpop3\b|\bimap\b", 3),
        (r"packet", 4), (r"\brouter\b|\bswitch\b|\bhub\b|gateway|\bbridge\b", 3), (r"\blan\b|\bwan\b|\bvpn\b|\bwi-?fi\b|ethernet|wireless", 3),
        (r"\btopology\b|star network|mesh|bus network", 4), (r"bandwidth|latency|bit ?rate", 2), (r"\bdns\b|domain name|\bip address|mac address|\bisp\b", 4),
        (r"firewall|proxy", 3), (r"client.server|peer.to.peer|\bp2p\b", 4), (r"packet switching|circuit switching", 5), (r"\bthin client\b|\bthick client\b", 3),
    ],
    "Web Technologies": [
        (r"\bhtml\b|\bcss\b|javascript|\bjs\b|\bphp\b", 5), (r"web ?page|web ?site|webpage|web browser|\bbrowser\b", 3), (r"search engine|page ?rank", 5),
        (r"server.side|client.side", 4), (r"\bcookies?\b", 4), (r"\bdom\b|\bajax\b|\bhyperlink", 3), (r"\burl\b|\bweb\b", 2),
    ],
    "Data Types and Number Representation": [
        (r"binary|hexadecimal|\bhex\b|denary|decimal", 3), (r"two.?s complement|sign and magnitude|sign.and.magnitude|signed", 5),
        (r"floating point|fixed point|mantissa|exponent|normalis", 5), (r"\bascii\b|unicode|character set", 5),
        (r"\binteger\b|\breal\b|\bboolean\b|\bcharacter\b|\bstring\b", 1), (r"\bbits?\b|\bbytes?\b|kilobyte|megabyte|\bnibble\b", 2),
        (r"overflow|rounding error|\bprecision\b", 3), (r"bitwise|logical shift|arithmetic shift|\bmask(ing)?\b|\bshift\b", 4),
        (r"data type|number system|base ?(2|10|16)", 3),
    ],
    "Data Structures": [
        (r"\barrays?\b", 3), (r"linked list|\blist\b", 3), (r"\bstack\b", 5), (r"\bqueue\b", 5), (r"\btree\b|binary tree|\bnodes?\b|\broot\b", 3),
        (r"hash table", 5), (r"\bgraph\b|vertex|vertices|\bedges?\b|adjacency", 3), (r"\btuples?\b|\bdictionary\b|\bdictionaries\b|\brecord\b", 2),
        (r"\bpointers?\b", 3), (r"\bpush\b|\bpop\b|enqueue|dequeue|\bpeek\b", 4), (r"circular queue|priority queue", 5),
        (r"data structure", 5), (r"in-?order|pre-?order|post-?order", 5), (r"traversal", 2),
    ],
    "Boolean Algebra": [
        (r"logic gate|\bgates?\b", 4), (r"truth table", 5), (r"boolean (expression|algebra)|logic (circuit|diagram|expression)", 5),
        (r"karnaugh|k-?map|de ?morgan", 6), (r"half adder|full adder|flip.?flop|d-?type|latch", 6), (r"\bxor\b|\bnand\b|\bnor\b", 3),
        (r"simplify.{0,40}(expression|boolean)", 3), (r"\band\b.{0,12}\bor\b.{0,12}\bnot\b", 1), (r"∧|∨|¬", 2),
    ],
    "Assembly Language and the Little Man Computer": [
        (r"little man|\blmc\b", 7), (r"assembly language|\bassembly\b", 5), (r"mnemonic|opcode|operand", 4),
        (r"addressing mode|immediate addressing|direct (memory )?addressing|indirect addressing|indexed addressing|\baddressing\b", 6),
        (r"\blda\b|\bsta\b|\bbrp\b|\bbrz\b|\bbra\b|\binp\b|\bhlt\b|\bdat\b", 4), (r"mailbox", 4),
    ],
    "Programming Paradigms": [
        (r"paradigm", 8), (r"procedural|declarative|imperative|functional programming|logic programming", 5),
        (r"low.level|high.level", 3), (r"\bprolog\b|\bhaskell\b", 5),
    ],
    "Object-Oriented Programming": [
        (r"\bclass(es)?\b", 3), (r"\bobjects?\b", 2), (r"inheritance|inherits? from|inherited (class|method)|sub-?class|super-?class", 6), (r"polymorphi", 5), (r"encapsulat", 5),
        (r"\bmethods?\b|\battributes?\b|\bconstructor\b|instantiat|getter|setter|override|overload", 3),
        (r"object.oriented|\boop\b", 6), (r"class diagram|\bprivate\b|\bpublic\b|\bprotected\b|abstract class", 3),
    ],
    "Legal, Moral, Cultural and Ethical Issues": [
        (r"data protection|\bgdpr\b|computer misuse|copyright|freedom of information|regulation of investigatory|patents? act", 6),
        (r"ethic|moral|cultural|privacy|surveillance|censor", 4), (r"legislation|\blaw\b|\blegal\b|\bact\b", 2),
        (r"environmental|e-?waste|digital divide|social media|automated decision", 3), (r"artificial intelligence|\bai\b|\bbias", 5),
        (r"\bstakeholder", 1), (r"monitor(ing)? (of )?(employees|staff|workers)|employee monitoring", 4),
    ],
    "Elements of Computational Thinking": [
        (r"abstraction|abstract", 3), (r"decompos", 5), (r"thinking (ahead|procedurally|logically|concurrently)", 7), (r"computational thinking", 7),
        (r"problem recogni|pre.?condition|\bcaching\b|reusable|visuali[sz]ation", 3), (r"concurren", 3), (r"stages? of a problem|break (a|the) problem", 3),
    ],
    "Programming Techniques": [
        (r"\bvariables?\b|\bconstants?\b|\bassign", 2), (r"\bselection\b|\biteration\b|\bsequence\b|\bloop\b|\bwhile\b|\bfor\b.{0,15}\bto\b|\bendwhile\b|\bnext\b", 2),
        (r"subroutine|\bfunction\b|\bprocedure\b|\bparameters?\b|\barguments?\b|\breturn\b", 3), (r"local variable|global variable|\bscope\b", 4),
        (r"recursi", 3), (r"\bcasting\b|string handling|substring|\.length|\.left|\.right", 3), (r"file handling|open\(|read ?line|write ?line", 3),
        (r"pseudocode|\bpseudo-code\b|trace table|dry run", 3), (r"\bif\b.{0,40}\bthen\b|\belse\b|\bendif\b|\bendfunction\b|\bendprocedure\b", 3),
        (r"validation|validate|\binput\(|print\(", 2), (r"modular|programming (technique|construct|language)", 3), (r"\bprogram\b|\bcode\b|\balgorithm\b", 1),
        (r"\bstructured programming\b|\bmain program\b|\bexception", 3),
    ],
    "Computational Methods": [
        (r"backtracking", 7), (r"heuristic", 6), (r"divide and conquer", 6), (r"data mining", 6), (r"performance model|visuali[sz]ation", 4),
        (r"simulation|\bmodel(l)?ing\b", 3), (r"intractab|feasib|computable|halting problem|\bnp\b", 4), (r"problem.solving|solve (a|the) problem", 2),
        (r"\bpipelining\b|dijkstra|a\*", 1),
    ],
    "Algorithm Complexity (Big O)": [
        (r"big.?o\b|\bo\s?[\(\{\[]\s*(n|l|log|1|2)", 8), (r"time complexi|space complexi|\bcomplexi", 6),
        (r"polynomial|exponential|logarithmic|linear time|constant time|factorial", 4), (r"efficien", 1),
    ],
    "Algorithms: Searching, Sorting & Graph Traversal": [
        (r"binary search(?! tree)|linear search|serial search", 7), (r"bubble sort|merge sort|insertion sort|quick ?sort|selection sort", 7),
        (r"depth.first|breadth.first|dijkstra|\ba\*|a star|graph traversal|shortest path", 7), (r"sorting|searching", 4),
        (r"\bsort\b|\bsorted\b|\bsearch\b", 3), (r"\balgorithm\b", 1), (r"pass(es)? (through|of)|\bswap\b|\bpivot\b", 2),
    ],
}

COMPILED = {c: [(re.compile(p), w) for p, w in rules] for c, rules in RULES.items()}


def component_of(paper):
    return C1 if re.search(r"Paper 1$", paper) else C2


def score(text, component):
    t = text.lower()
    out = {}
    for chapter, rules in COMPILED.items():
        s = sum(w for rx, w in rules if rx.search(t))
        out[chapter] = s + (SAME_COMPONENT_BONUS if s and CHAPTERS[chapter] == component else 0)
    return out


def question_root(row):
    """3(b)(ii) -> '3': the parts of one question share a scenario."""
    return (row["set"], row["paper"], re.match(r"\d+", row["q"]).group(0))


def best(scores):
    ranked = sorted(scores.items(), key=lambda kv: -kv[1])
    return ranked[0][0], ranked[0][1], ranked[1][1] if len(ranked) > 1 else 0


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("ocr")
    ap.add_argument("--sample", type=int, default=70)
    ap.add_argument("--seed", type=int, default=11)
    ap.add_argument("--write", action="store_true")
    args = ap.parse_args()

    ocr = json.loads(pathlib.Path(args.ocr).read_text())
    rows = json.loads(
        subprocess.run(
            ["node", "-e", "import('./src/data/computer-science-past-papers.js').then(m=>console.log(JSON.stringify(m.default)))"],
            capture_output=True, text=True, check=True, cwd=ROOT,
        ).stdout
    )

    own = {}
    groups = collections.defaultdict(collections.Counter)
    for r in rows:
        sc = score(ocr[r["num"]], component_of(r["paper"]))
        own[r["num"]] = sc
        for chapter, s in sc.items():
            groups[question_root(r)][chapter] += s
    # each part's working score: its own text plus a share of what the question's other parts say
    per_row = {}
    for r in rows:
        g = groups[question_root(r)]
        per_row[r["num"]] = {c: own[r["num"]][c] + NEIGHBOUR_SHARE * (g[c] - own[r["num"]][c]) for c in CHAPTERS}

    how = collections.Counter()
    chosen = {}
    for r in rows:
        comp = component_of(r["paper"])
        sc = per_row[r["num"]]
        top, s, runner_up = best(sc)
        if s >= CONFIDENT and s > runner_up:
            chosen[r["num"]] = (top, "own text")
            how["own text"] += 1
            continue
        g = groups[question_root(r)]
        # the neighbours vote, restricted to chapters of this component
        vote = sorted(((c, v) for c, v in g.items() if CHAPTERS[c] == comp and v > 0), key=lambda kv: -kv[1])
        if vote and (vote[0][1] >= CONFIDENT * 2):
            chosen[r["num"]] = (vote[0][0], "neighbouring parts")
            how["neighbouring parts"] += 1
        elif s > 0:
            chosen[r["num"]] = (top, "weak own text")
            how["weak own text"] += 1
        else:
            chosen[r["num"]] = (DEFAULTS[comp], "default for the component")
            how["default for the component"] += 1

    # Human corrections win over the rules. topic-overrides.json maps a question number to a chapter
    # name; it is how a spot-check finding is recorded without touching the rules.
    overrides = json.loads(OVERRIDES_FILE.read_text()) if OVERRIDES_FILE.exists() else {}
    for num, chapter in overrides.items():
        if num.startswith("_"):
            continue
        assert chapter in CHAPTERS, f"override for {num}: unknown chapter {chapter!r}"
        chosen[num] = (chapter, "human correction")
    if overrides:
        how["human correction"] = sum(1 for k in overrides if not k.startswith("_"))
    by_chapter = collections.Counter(c for c, _ in chosen.values())
    print("decided by:", dict(how))
    print()
    for chapter in CHAPTERS:
        print(f"{by_chapter[chapter]:4d}  {chapter}")
    empty = [c for c in CHAPTERS if by_chapter[c] == 0]
    print("\nchapters with no questions:", empty or "none")

    random.seed(args.seed)
    print(f"\n--- random sample of {args.sample} for a human check ---")
    for r in random.sample(rows, args.sample):
        topic, why = chosen[r["num"]]
        print(f"[{r['num']}] {r['set']} {r['paper']} Q{r['q']} -> {topic}  ({why})")
        print("      " + ocr[r["num"]][:200].replace("\n", " "))

    if args.write:
        header = INDEX.read_text().split("export default")[0]
        for r in rows:
            r["topic"] = chosen[r["num"]][0]
        INDEX.write_text(header + "export default " + json.dumps(rows, separators=(",", ":")) + "\n")
        print(f"\nwrote topic into {len(rows)} rows of {INDEX.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
