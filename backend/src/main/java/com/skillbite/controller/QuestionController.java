package com.skillbite.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/questions")
public class QuestionController {

    private static final Map<String, List<Map<String, Object>>> BANK = new HashMap<>();

    static {
        BANK.put("dsa", List.of(
            q("What is the time complexity of binary search?", new String[]{"O(n)","O(log n)","O(n²)","O(1)"}, 1),
            q("Which data structure uses LIFO principle?", new String[]{"Queue","Stack","Array","Tree"}, 1),
            q("What does 'DFS' stand for?", new String[]{"Data First Search","Depth First Search","Direct Flow Sort","Dynamic Find Search"}, 1),
            q("Which sorting algorithm has the best average case?", new String[]{"Bubble Sort","Selection Sort","Quick Sort","Insertion Sort"}, 2),
            q("Space complexity of merge sort?", new String[]{"O(1)","O(log n)","O(n)","O(n²)"}, 2),
            q("A linked list node contains:", new String[]{"Only data","Data and pointer","Only pointer","Index and data"}, 1),
            q("Hash tables average lookup:", new String[]{"O(n)","O(log n)","O(1)","O(n log n)"}, 2),
            q("Which traversal visits root first?", new String[]{"Inorder","Preorder","Postorder","Level order"}, 1),
            q("BFS uses which data structure?", new String[]{"Stack","Queue","Heap","Tree"}, 1),
            q("Worst case of quicksort occurs when:", new String[]{"Array is random","Pivot is median","Array is sorted","Array is empty"}, 2)
        ));
        BANK.put("aptitude", List.of(
            q("If 5x + 3 = 28, what is x?", new String[]{"3","5","7","4"}, 1),
            q("A train travels 120km in 2 hours. Speed?", new String[]{"50 km/h","60 km/h","70 km/h","80 km/h"}, 1),
            q("What is 15% of 200?", new String[]{"25","30","35","20"}, 1),
            q("If a:b = 2:3 and b:c = 4:5, then a:c = ?", new String[]{"8:15","2:5","6:10","4:15"}, 0),
            q("Complete: 2, 6, 18, 54, ?", new String[]{"108","162","126","72"}, 1),
            q("A can do work in 10 days, B in 15. Together?", new String[]{"5 days","6 days","7 days","8 days"}, 1),
            q("Profit % if CP=80, SP=100?", new String[]{"20%","25%","30%","15%"}, 1),
            q("Average of first 10 natural numbers?", new String[]{"5","5.5","6","4.5"}, 1),
            q("Simple interest on 1000 at 5% for 2 years?", new String[]{"50","100","150","200"}, 1),
            q("HCF of 12 and 18 is:", new String[]{"3","6","9","12"}, 1)
        ));
        BANK.put("english", List.of(
            q("Choose correct: 'She ___ to school every day.'", new String[]{"go","goes","going","gone"}, 1),
            q("Synonym of 'Eloquent':", new String[]{"Silent","Articulate","Confused","Angry"}, 1),
            q("Antonym of 'Benevolent':", new String[]{"Kind","Generous","Malevolent","Friendly"}, 2),
            q("Which sentence is grammatically correct?", new String[]{"He don't know","He doesn't knows","He doesn't know","He not know"}, 2),
            q("Identify the noun: 'The quick brown fox jumps'", new String[]{"quick","brown","fox","jumps"}, 2),
            q("'Serendipity' means:", new String[]{"Bad luck","Happy accident","Sadness","Anger"}, 1),
            q("Past tense of 'begin':", new String[]{"Begun","Began","Beginned","Beginning"}, 1),
            q("A 'metaphor' is:", new String[]{"A question","Direct comparison","An exaggeration","Sound words"}, 1),
            q("Fill in: 'Neither he ___ I was there.'", new String[]{"or","nor","and","but"}, 1),
            q("'Ubiquitous' means:", new String[]{"Rare","Found everywhere","Dangerous","Beautiful"}, 1)
        ));
        BANK.put("cs", List.of(
            q("What does CPU stand for?", new String[]{"Central Process Unit","Central Processing Unit","Computer Personal Unit","Central Program Unit"}, 1),
            q("Which is NOT an operating system?", new String[]{"Linux","Windows","Oracle","macOS"}, 2),
            q("RAM stands for:", new String[]{"Read Access Memory","Random Access Memory","Run All Memory","Read Any Memory"}, 1),
            q("HTTP is a protocol for:", new String[]{"Email","File transfer","Web communication","Database"}, 2),
            q("Which OSI layer is closest to hardware?", new String[]{"Application","Transport","Physical","Network"}, 2),
            q("SQL is used for:", new String[]{"Styling web pages","Programming AI","Managing databases","Network config"}, 2),
            q("What is a 'deadlock' in OS?", new String[]{"Fast execution","Circular waiting","Memory leak","CPU boost"}, 1),
            q("TCP ensures:", new String[]{"Fast delivery","Reliable delivery","Encrypted data","Compressed data"}, 1),
            q("Virtual memory extends:", new String[]{"CPU speed","RAM capacity","Disk speed","Network bandwidth"}, 1),
            q("A 'compiler' converts:", new String[]{"Binary to text","Source to machine code","HTML to CSS","Images to text"}, 1)
        ));
        BANK.put("webdev", List.of(
            q("HTML stands for:", new String[]{"Hyper Tool Markup Language","HyperText Markup Language","HighText Machine Language","Home Tool Markup Language"}, 1),
            q("Which CSS property sets text color?", new String[]{"font-color","text-style","color","foreground"}, 2),
            q("Which HTML tag defines a hyperlink?", new String[]{"<link>","<a>","<href>","<url>"}, 1),
            q("JavaScript runs primarily:", new String[]{"Only on servers","In the browser and on servers","Only in databases","Only in CSS files"}, 1),
            q("Responsive layouts often use:", new String[]{"Fixed px only","Media queries","Tables only","GIF images"}, 1),
            q("REST APIs use which verb for creating a resource?", new String[]{"GET","POST","HEAD","TRACE"}, 1),
            q("npm is mainly a:", new String[]{"CSS framework","Package manager for JS","Image editor","Database"}, 1),
            q("SPA stands for:", new String[]{"Simple Page App","Single Page Application","Server Public API","Static PHP Archive"}, 1)
        ));
        BANK.put("math", BANK.get("aptitude"));
        BANK.put("reasoning", BANK.get("aptitude"));
        BANK.put("aiml", List.of(
            q("Supervised learning requires:", new String[]{"Only unlabeled data","Labeled input-output pairs","No data","Random noise"}, 1),
            q("Basic building block in neural nets:", new String[]{"Neuron / node","Compiler","Router","Pixel"}, 0),
            q("Overfitting means the model:", new String[]{"Generalizes perfectly","Memorizes training too well","Never trains","Has zero parameters"}, 1),
            q("Training data is used to:", new String[]{"Tune model parameters","Only display UI","Replace backups","Compress video"}, 0),
            q("TensorFlow is best described as:", new String[]{"A spreadsheet app","An ML framework","A browser","A version of HTML"}, 1),
            q("NLP stands for:", new String[]{"Natural Language Processing","Neural Logic Program","Network Layer Protocol","Numeric Linear Pack"}, 0),
            q("GPUs help deep learning because they excel at:", new String[]{"Sequential text editing","Parallel matrix math","Printing","DNS lookup"}, 1),
            q("A 'feature' in ML is:", new String[]{"A bug fix","An input variable used by the model","The final prediction only","A database table name"}, 1)
        ));
        BANK.put("productivity", List.of(
            q("The Pomodoro technique uses:", new String[]{"Random breaks only","Timed focus blocks with short breaks","24h work sessions","No timers"}, 1),
            q("SMART goals are:", new String[]{"Vague dreams","Specific, measurable, achievable...","Only financial","Impossible by design"}, 1),
            q("Batching similar tasks reduces:", new String[]{"Sleep","Context switching cost","Keyboard size","Internet speed"}, 1),
            q("Deep work needs:", new String[]{"Constant notifications","Long uninterrupted focus","Multitasking always","Zero planning"}, 1),
            q("A weekly review helps with:", new String[]{"Forgetting tasks","Clarity and prioritization","Deleting email forever","Avoiding calendars"}, 1),
            q("Saying 'no' protects:", new String[]{"Spam filters","Your time and priorities","Only hardware","Compiler errors"}, 1),
            q("MIT in daily planning means:", new String[]{"Most Important Tasks","Maximum Internet Time","Manual Integration Test","Monday Is Thursday"}, 0),
            q("Inbox Zero is a method for:", new String[]{"Deleting the inbox","Processing email to a clear state","Ignoring mail","Buying storage"}, 1)
        ));
        BANK.put("fitness", List.of(
            q("Hydration mainly helps:", new String[]{"Overheating only","Performance, focus, and recovery","Replacing sleep fully","Skipping warm-ups"}, 1),
            q("A warm-up before exercise helps:", new String[]{"Guarantee records","Prepare body and reduce injury risk","Replace stretching forever","Remove need for rest"}, 1),
            q("Rest days allow:", new String[]{"Only weight gain","Recovery and adaptation","Muscle deletion","Loss of skill always"}, 1),
            q("Cardio training primarily improves:", new String[]{"Only flexibility","Heart and endurance","Bone density only","Eyesight"}, 1),
            q("Stretching regularly improves:", new String[]{"Only strength max","Flexibility and mobility","Screen resolution","Typing speed only"}, 1),
            q("Adults often need roughly:", new String[]{"2h sleep","7-9 hours sleep for recovery","No sleep on weekends","Sleep only after meals"}, 1),
            q("Protein after training supports:", new String[]{"Muscle repair and growth","Deleting calories only","Screen brightness","DNS caching"}, 0),
            q("Consistency in workouts beats:", new String[]{"Only intensity spikes with long gaps","All rest","Drinking water","Walking"}, 0)
        ));
        BANK.put("creativity", List.of(
            q("Classic brainstorming defers:", new String[]{"All ideas forever","Judgment while generating many ideas","Sleep","Color choice"}, 1),
            q("Analogies help creativity by:", new String[]{"Blocking ideas","Connecting distant concepts","Removing constraints","Deleting drafts"}, 1),
            q("Constraints can:", new String[]{"Always kill ideas","Sometimes spark creative solutions","Replace thinking","Guarantee copying"}, 1),
            q("A mind map usually branches from:", new String[]{"A random word list","A central idea","Only numbers","The footer"}, 1),
            q("Divergent thinking aims to:", new String[]{"Pick one answer fast","Generate many possible ideas","Avoid questions","Copy competitors only"}, 1),
            q("SCAMPER is used to:", new String[]{"Sort emails","Modify and stretch ideas","Compile code","Measure heart rate"}, 1),
            q("Incubation in creativity happens:", new String[]{"Only during exams","Away from the problem while subconscious works","Never","Only with music off"}, 1),
            q("Reframing changes:", new String[]{"Font size only","How you view the problem","Hardware drivers","Weather"}, 1)
        ));
        BANK.put("gk", List.of(
            q("Earth's largest ocean by area is:", new String[]{"Atlantic","Indian","Arctic","Pacific"}, 3),
            q("Chemical formula of water is:", new String[]{"CO2","NaCl","H2O","O2"}, 2),
            q("Plants absorb mainly for photosynthesis:", new String[]{"Nitrogen only","Carbon dioxide","Helium","Gold"}, 1),
            q("Capital of Japan is:", new String[]{"Seoul","Beijing","Tokyo","Bangkok"}, 2),
            q("The Sun is a:", new String[]{"Planet","Moon","Star","Asteroid belt"}, 2),
            q("Which gas makes up most of Earth's atmosphere?", new String[]{"Oxygen","Carbon dioxide","Nitrogen","Helium"}, 2),
            q("First human on the Moon:", new String[]{"Buzz Aldrin first step","Neil Armstrong","Yuri Gagarin on Moon","No one"}, 1),
            q("Photosynthesis produces oxygen and mainly:", new String[]{"Coal","Glucose / sugars","Steel","Plastic"}, 1)
        ));
        BANK.put("fun", List.of(
            q("A standard tic-tac-toe grid is:", new String[]{"4x4","3x3","5x5","2x2"}, 1),
            q("How many faces does a standard die have?", new String[]{"4","6","8","12"}, 1),
            q("Which month has at least 28 days?", new String[]{"Only February","All of them","None","Only leap years"}, 1),
            q("A palindrome reads the same:", new String[]{"Only in Spanish","Forwards and backwards","Upside down only","Never"}, 1),
            q("Rainbow (classic mnemonic) often lists:", new String[]{"3 colors","7 colors","12 colors","2 colors"}, 1),
            q("Rubik's Cube (3x3) has how many colored faces?", new String[]{"4","6","8","9"}, 1),
            q("Riddle: What has hands but cannot clap?", new String[]{"A cat","A clock","A river","A book"}, 1),
            q("Chess, each side starts with how many pawns?", new String[]{"6","8","10","16"}, 1)
        ));
        BANK.put("cooking", List.of(
            q("What is 'mise en place' in cooking?", new String[]{"Cooking fast","Preparing ingredients before cooking","Only French cuisine","Deep frying"}, 1),
            q("Safe temperature for cooked poultry (F)?", new String[]{"150F","165F","180F","200F"}, 1),
            q("What does 'al dente' mean for pasta?", new String[]{"Very soft","Firm to the bite","Burnt","Cold"}, 1),
            q("Baking powder is mainly used for:", new String[]{"Saltiness","Leavening / rising","Color only","Thickening only"}, 1),
            q("Cross-contamination is best prevented by:", new String[]{"Using one board for everything","Separating raw and cooked foods","Skipping hand washing","Storing meat above salad"}, 1),
            q("Simmering is usually:", new String[]{"Boiling violently","Gentle bubbles below a full boil","Only freezing","Microwave only"}, 1),
            q("What is a roux?", new String[]{"A herb","Cooking fat + flour as a thickener","A type of oven","Raw meat only"}, 1),
            q("Why rest meat after cooking?", new String[]{"To cool only","So juices redistribute for tenderness","To make it raw","To remove salt"}, 1),
            q("Common egg substitute in baking (vegan)?", new String[]{"Water only","Flax egg / applesauce","Only sugar","Vinegar alone"}, 1),
            q("What does 'fold' mean when mixing batter?", new String[]{"Stir hard","Gently combine without deflating air","Only use a fork","Blend in a blender"}, 1)
        ));
        List<Map<String, Object>> placement = new ArrayList<>();
        placement.addAll(BANK.get("dsa"));
        placement.addAll(BANK.get("aptitude"));
        BANK.put("placement", placement);
    }

    private static Map<String, Object> q(String question, String[] opts, int ans) {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("q", question);
        m.put("opts", opts);
        m.put("ans", ans);
        return m;
    }

    @GetMapping("/{category}")
    public ResponseEntity<?> getQuestions(@PathVariable String category) {
        List<Map<String, Object>> questions = BANK.get(category.toLowerCase());
        if (questions == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(questions);
    }
}
