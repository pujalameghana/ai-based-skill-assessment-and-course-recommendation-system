import { Question, Course } from './types';

export const defaultQuestions: Question[] = [
  // --- PYTHON ---
  {
    id: 'py1',
    domain: 'Python',
    question: 'What is the correct way to load a JSON string into a Python dictionary?',
    options: ['json.dumps(string)', 'json.loads(string)', 'json.load(string)', 'json.dict(string)'],
    answerIndex: 1
  },
  {
    id: 'py2',
    domain: 'Python',
    question: 'Which of the following data structures in Python is mutable?',
    options: ['Tuple', 'String', 'List', 'FrozenSet'],
    answerIndex: 2
  },
  {
    id: 'py3',
    domain: 'Python',
    question: 'What is the purpose of the "with" statement in Python file handling?',
    options: ['To speed up file operations', 'To automatically close files and handle exceptions', 'To lock the file for editing', 'To declare a global scope'],
    answerIndex: 1
  },
  {
    id: 'py4',
    domain: 'Python',
    question: 'Which keyword is used to define dynamic generators in Python that yield values lazily?',
    options: ['return', 'emit', 'generate', 'yield'],
    answerIndex: 3
  },
  {
    id: 'py5',
    domain: 'Python',
    question: 'What does *args represent in a Python function definition?',
    options: ['A dictionary of keyword arguments', 'A list of keyword arguments', 'A variable-length list of non-keyword positional arguments', 'A static array pointer'],
    answerIndex: 2
  },
  {
    id: 'py6',
    domain: 'Python',
    question: 'Which python module is standard for executing regular expressions?',
    options: ['regex', 're', 'expr', 'match'],
    answerIndex: 1
  },
  {
    id: 'py7',
    domain: 'Python',
    question: 'How do you initialize a set with items in Python?',
    options: ['set = (1, 2, 3)', 'set = {1, 2, 3}', 'set = [1, 2, 3]', 'set = <1, 2, 3>'],
    answerIndex: 1
  },
  {
    id: 'py8',
    domain: 'Python',
    question: 'What is the correct output of 2 ** 3 in Python?',
    options: ['6', '5', '8', '9'],
    answerIndex: 2
  },
  {
    id: 'py9',
    domain: 'Python',
    question: 'Which built-in function returns a list of attributes and methods belonging to an object?',
    options: ['help()', 'inspect()', 'dir()', 'type()'],
    answerIndex: 2
  },
  {
    id: 'py10',
    domain: 'Python',
    question: 'What is the name of python’s package manager?',
    options: ['npm', 'pip', 'pkg', 'apt-get'],
    answerIndex: 1
  },

  // --- JAVA ---
  {
    id: 'jav1',
    domain: 'Java',
    question: 'Which of these access specifiers allows class members to be visible ONLY within its package and subclasses?',
    options: ['private', 'public', 'protected', 'default (package-private)'],
    answerIndex: 2
  },
  {
    id: 'jav2',
    domain: 'Java',
    question: 'Which collection type does not allow duplicate elements and does not guarantee ordering?',
    options: ['ArrayList', 'HashSet', 'LinkedList', 'TreeMap'],
    answerIndex: 1
  },
  {
    id: 'jav3',
    domain: 'Java',
    question: 'What is the lifecycle state of a thread that has been created but not yet started?',
    options: ['WAITING', 'RUNNABLE', 'BLOCKED', 'NEW'],
    answerIndex: 3
  },
  {
    id: 'jav4',
    domain: 'Java',
    question: 'Which Java memory area stores objects and arrays during runtime?',
    options: ['Stack Memory', 'Heap Memory', 'Method Area', 'PC Register'],
    answerIndex: 1
  },
  {
    id: 'jav5',
    domain: 'Java',
    question: 'Which keyword prevents a class from being inherited or extended by another class?',
    options: ['static', 'final', 'abstract', 'volatile'],
    answerIndex: 1
  },
  {
    id: 'jav6',
    domain: 'Java',
    question: 'Which of the following is NOT a functional interface introduced in Java 8?',
    options: ['Predicate', 'Consumer', 'Thread', 'Supplier'],
    answerIndex: 2
  },
  {
    id: 'jav7',
    domain: 'Java',
    question: 'What is the standard root parent class of all classes in Java?',
    options: ['Class', 'System', 'Object', 'Main'],
    answerIndex: 2
  },
  {
    id: 'jav8',
    domain: 'Java',
    question: 'What is the purpose of the JVM (Java Virtual Machine)?',
    options: ['Translate Java source code into bytecode', 'Compile assembly files', 'Executecompiled Java bytecode on the host operating system', 'Speed up internet download speeds'],
    answerIndex: 2
  },
  {
    id: 'jav9',
    domain: 'Java',
    question: 'How do you handle runtime exceptions in Java safely?',
    options: ['throws clause only', 'import java.error', 'try-catch blocks', 'assert statement'],
    answerIndex: 2
  },
  {
    id: 'jav10',
    domain: 'Java',
    question: 'Which keyword calls the constructor of the parent class in Java?',
    options: ['this', 'super', 'base', 'parent'],
    answerIndex: 1
  },

  // --- DBMS ---
  {
    id: 'db1',
    domain: 'DBMS',
    question: 'Which transaction property ensures that either all database changes succeed or none do?',
    options: ['Consistency', 'Isolation', 'Durability', 'Atomicity'],
    answerIndex: 3
  },
  {
    id: 'db2',
    domain: 'DBMS',
    question: 'Which normal form addresses and eliminates transitive dependencies?',
    options: ['1NF', '2NF', '3NF', 'BCNF'],
    answerIndex: 2
  },
  {
    id: 'db3',
    domain: 'DBMS',
    question: 'What is a foreign key?',
    options: ['A key that uniquely identifies a row in its own table', 'A primary key of another table mapped locally to create relationships', 'An encrypted password field', 'A key to lookup metadata external files'],
    answerIndex: 1
  },
  {
    id: 'db4',
    domain: 'DBMS',
    question: 'Which SQL join returns all matched records plus all unmatched records from the left table?',
    options: ['INNER JOIN', 'RIGHT OUTER JOIN', 'LEFT OUTER JOIN', 'CROSS JOIN'],
    answerIndex: 2
  },
  {
    id: 'db5',
    domain: 'DBMS',
    question: 'Which relational algebra symbol denotes the Project operation (selecting specific columns)?',
    options: ['Sigma (σ)', 'Pi (π)', 'Rho (ρ)', 'Theta (θ)'],
    answerIndex: 1
  },
  {
    id: 'db6',
    domain: 'DBMS',
    question: 'Which constraint ensures that every value in a column is different?',
    options: ['PRIMARY KEY', 'UNIQUE', 'NOT NULL', 'CHECK'],
    answerIndex: 1
  },
  {
    id: 'db7',
    domain: 'DBMS',
    question: 'What does the acronym ACID stand for?',
    options: ['Automated Consistency In Database', 'Atomicity Consistency Isolation Durability', 'Active Catalog Indexing Directory', 'Atomic Constraint Index Definition'],
    answerIndex: 1
  },
  {
    id: 'db8',
    domain: 'DBMS',
    question: 'Which aggregate function is used to find the average value of a numeric column in SQL?',
    options: ['AVG()', 'MEAN()', 'SUM_DIV()', 'COUNT_AVG()'],
    answerIndex: 0
  },
  {
    id: 'db9',
    domain: 'DBMS',
    question: 'What is the purpose of an index in a database?',
    options: ['To add additional security layers', 'To compress the stored table file size', 'To accelerate speed of data retrieval queries', 'To define foreign key constraints'],
    answerIndex: 2
  },
  {
    id: 'db10',
    domain: 'DBMS',
    question: 'Which statement removes a table structure completely from the database?',
    options: ['DELETE TABLE', 'TRUNCATE TABLE', 'DROP TABLE', 'REMOVE TABLE'],
    answerIndex: 2
  },

  // --- DATA STRUCTURES ---
  {
    id: 'ds1',
    domain: 'Data Structures',
    question: 'What is the worst-case time complexity of searching in a standard Binary Search Tree (BST)?',
    options: ['O(1)', 'O(log N)', 'O(N)', 'O(N log N)'],
    answerIndex: 2
  },
  {
    id: 'ds2',
    domain: 'Data Structures',
    question: 'Which underlying memory allocation paradigm is standard for a Singly Linked List?',
    options: ['Contiguous memory allocation', 'Sequential vector slots', 'Dynamic non-contiguous nodes linked by references', 'Static byte allocation'],
    answerIndex: 2
  },
  {
    id: 'ds3',
    domain: 'Data Structures',
    question: 'What data structure represents the LIFO (Last In First Out) mechanism?',
    options: ['Queue', 'Stack', 'Array', 'Graph'],
    answerIndex: 1
  },
  {
    id: 'ds4',
    domain: 'Data Structures',
    question: 'Which traversal visit order is Left node -> Root node -> Right node?',
    options: ['Preorder', 'Postorder', 'Inorder', 'Levelorder'],
    answerIndex: 2
  },
  {
    id: 'ds5',
    domain: 'Data Structures',
    question: 'What is a collision in a Hash Table?',
    options: ['When a hash function evaluates to two different values for the same key', 'When two different keys hash to the same bucket index', 'When the memory overflows', 'When a lookup query returns null'],
    answerIndex: 1
  },
  {
    id: 'ds6',
    domain: 'Data Structures',
    question: 'Which queue allows insertion and deletion from both ends of the queue?',
    options: ['Priority Queue', 'Deque (Double-Ended Queue)', 'Circular Queue', 'Linear Queue'],
    answerIndex: 1
  },
  {
    id: 'ds7',
    domain: 'Data Structures',
    question: 'Which algorithm solves the Single-Source Shortest Path problem in a weighted graph with positive weights?',
    options: ['Kruskal\'s Algorithm', 'Prim\'s Algorithm', 'Dijkstra\'s Algorithm', 'Bellman-Ford Algorithm'],
    answerIndex: 2
  },
  {
    id: 'ds8',
    domain: 'Data Structures',
    question: 'What is the balance factor constraint for a node in an AVL Tree?',
    options: ['Must be precisely 0', 'Must be between -1 and +1', 'Must be greater than 2', 'Must be negative'],
    answerIndex: 1
  },
  {
    id: 'ds9',
    domain: 'Data Structures',
    question: 'Which sorting algorithm has a guaranteed worst-case time complexity of O(N log N)?',
    options: ['Bubble Sort', 'Insertion Sort', 'Quick Sort', 'Merge Sort'],
    answerIndex: 3
  },
  {
    id: 'ds10',
    domain: 'Data Structures',
    question: 'What is the maximum number of children in a Binary Tree node?',
    options: ['1', '2', '3', 'Unlimited'],
    answerIndex: 1
  },

  // --- WEB DEVELOPMENT ---
  {
    id: 'web1',
    domain: 'Web Development',
    question: 'Which CSS layout method allows flexible alignment of items in a single dimension (row or column)?',
    options: ['CSS Grid', 'Float Layout', 'Flexbox', 'Relative Positioning'],
    answerIndex: 2
  },
  {
    id: 'web2',
    domain: 'Web Development',
    question: 'What does the HTTP error status status 403 represent?',
    options: ['Bad Request', 'Unauthorized', 'ForbiddenAccess', 'Internal Server Error'],
    answerIndex: 2
  },
  {
    id: 'web3',
    domain: 'Web Development',
    question: 'What does DOM stand for in Web Development?',
    options: ['Document Object Model', 'Data Object Mode', 'Directory Online Method', 'Domain Ownership Management'],
    answerIndex: 0
  },
  {
    id: 'web4',
    domain: 'Web Development',
    question: 'Which tag is correct for importing external Javascript in HTML5?',
    options: ['<script link="...">', '<js src="...">', '<script src="...">', '<link scripting="...">'],
    answerIndex: 2
  },
  {
    id: 'web5',
    domain: 'Web Development',
    question: 'What is the main advantage of client-side routing in single-page applications (SPAs)?',
    options: ['Secures files on the server', 'Provides navigation without reloading the entire document page', 'Removes the need of CSS assets', 'Guarantees 100% SEO visibility automatically'],
    answerIndex: 1
  },
  {
    id: 'web6',
    domain: 'Web Development',
    question: 'In Node.js, which built-in module is used to listen to server ports and parse HTTP queries?',
    options: ['fs', 'path', 'http', 'os'],
    answerIndex: 2
  },
  {
    id: 'web7',
    domain: 'Web Development',
    question: 'What is the purpose of CORS policy in modern browsers?',
    options: ['Compress files for optimization', 'Determine if client-side code is allowed to make network requests to alternative origins', 'Format visual fonts in styling sheets', 'Store cookies globally'],
    answerIndex: 1
  },
  {
    id: 'web8',
    domain: 'Web Development',
    question: 'Which react hook preserves values across renders WITHOUT triggering a re-render of components?',
    options: ['useState', 'useEffect', 'useMemo', 'useRef'],
    answerIndex: 3
  },
  {
    id: 'web9',
    domain: 'Web Development',
    question: 'Which status code is standard for a successful resource creation?',
    options: ['200 OK', '201 Created', '204 No Content', '302 Found'],
    answerIndex: 1
  },
  {
    id: 'web10',
    domain: 'Web Development',
    question: 'What is Semantic HTML?',
    options: ['HTML with integrated CSS styling tags', 'HTML that uses tags to describe its meaning rather than just visual representation', 'HTML translated from typescript files', 'A deprecated standards structure'],
    answerIndex: 1
  },

  // --- ARTIFICIAL INTELLIGENCE ---
  {
    id: 'ai1',
    domain: 'Artificial Intelligence',
    question: 'Which algorithm is a simple, distance-based lazy learner for classification and regression?',
    options: ['Support Vector Machine (SVM)', 'Decision Tree', 'K-Nearest Neighbors (KNN)', 'Random Forest'],
    answerIndex: 2
  },
  {
    id: 'ai2',
    domain: 'Artificial Intelligence',
    question: 'What is the name of the function that introduces non-linearity into neural networks?',
    options: ['Loss Function', 'Activation Function', 'Optimization Function', 'Normalization Function'],
    answerIndex: 1
  },
  {
    id: 'ai3',
    domain: 'Artificial Intelligence',
    question: 'What is Overfitting in Machine Learning?',
    options: ['When the model performs exceptionally on both training and test data', 'When the model fits training dataset extremely well but fails to generalize to unseen test data', 'When model learning takes weeks', 'When the input vectors have different sizes'],
    answerIndex: 1
  },
  {
    id: 'ai4',
    domain: 'Artificial Intelligence',
    question: 'Which of the following metrics is used to quantify the dispersion of predicted values in linear regressions?',
    options: ['F1 Score', 'Mean Squared Error (MSE)', 'Log Loss', 'Accuracy'],
    answerIndex: 1
  },
  {
    id: 'ai5',
    domain: 'Artificial Intelligence',
    question: 'What is the purpose of Backpropagation in neural training?',
    options: ['Shuffle the dataset arrays', 'To compute the gradients of loss function with respect to weights and perform gradient descent', 'Save weights into binary files', 'Prune unused connections'],
    answerIndex: 1
  },
  {
    id: 'ai6',
    domain: 'Artificial Intelligence',
    question: 'Which ML paradigm learns behaviors by interacting with environments through rewards or penalties?',
    options: ['Supervised Learning', 'Unsupervised Learning', 'Reinforcement Learning', 'Transfer Learning'],
    answerIndex: 2
  },
  {
    id: 'ai7',
    domain: 'Artificial Intelligence',
    question: 'What is a standard technique to prevent neural networks from overfitting by randomly disabling nodes?',
    options: ['L2 Standard Regularization', 'Batch Normalization', 'Dropout', 'Early Stopping'],
    answerIndex: 2
  },
  {
    id: 'ai8',
    domain: 'Artificial Intelligence',
    question: 'Which of the following is an Unsupervised Learning task?',
    options: ['Spam classification', 'Stock price forecasting', 'Customer segmentation clustering', 'Medical diagnostic tagging'],
    answerIndex: 2
  },
  {
    id: 'ai9',
    domain: 'Artificial Intelligence',
    question: 'What is the name of python’s premium science and tabular library?',
    options: ['Django', 'Flask', 'Pandas', 'Pydantic'],
    answerIndex: 2
  },
  {
    id: 'ai10',
    domain: 'Artificial Intelligence',
    question: 'Which of these is a popular ensemble classification model based on multiple decision tree estimators?',
    options: ['Linear Regression', 'Logistic regression', 'Random Forest Classifier', 'Naive Bayes'],
    answerIndex: 2
  }
];

export const defaultCourses: Course[] = [
  // PYTHON
  {
    id: 'c_py1',
    domain: 'Python',
    level: 'Beginner',
    title: 'Python Core Essentials',
    description: 'Master variables, loops, arrays, functions, file utilities, and basic automation.',
    url: 'https://developer.mozilla.org/en-US/docs/Glossary/Python'
  },
  {
    id: 'c_py2',
    domain: 'Python',
    level: 'Intermediate',
    title: 'Advanced Python OOP & Flask Web Services',
    description: 'Learn Object-Oriented Principles, decorators, generators, multi-threading, and backend systems.',
    url: 'https://flask.palletsprojects.com/'
  },
  {
    id: 'c_py3',
    domain: 'Python',
    level: 'Advanced',
    title: 'Python for Scientific Computing & Deep Learning',
    description: 'Build predictive architectures, numerical matrices, and custom data processing graphs.',
    url: 'https://scikit-learn.org/'
  },

  // JAVA
  {
    id: 'c_jav1',
    domain: 'Java',
    level: 'Beginner',
    title: 'Java basics & Object-Oriented Syntax',
    description: 'Master classes, variables, conditional syntax, compilation, memory variables, and runtimes.',
    url: 'https://docs.oracle.com/en/java/'
  },
  {
    id: 'c_jav2',
    domain: 'Java',
    level: 'Intermediate',
    title: 'Java Enterprise Collection Engine & Multithreading',
    description: 'Unlock Collections Framework, Predicates, streams, safe concurrency, and exception systems.',
    url: 'https://spring.io/'
  },
  {
    id: 'c_jav3',
    domain: 'Java',
    level: 'Advanced',
    title: 'Enterprise Java Architecture: Spring Boot Services',
    description: 'Build secure scalable cloud web-servers and integrate object-relation database maps.',
    url: 'https://spring.io/projects/spring-boot'
  },

  // DBMS
  {
    id: 'c_db1',
    domain: 'DBMS',
    level: 'Beginner',
    title: 'Relational Database Fundamentals & SQL Selectors',
    description: 'Comprehensive query design, table setup, aggregate functions, and check restrictions.',
    url: 'https://www.mysql.com/'
  },
  {
    id: 'c_db2',
    domain: 'DBMS',
    level: 'Intermediate',
    title: 'Third Normal Form & Relational Algebra Optimizer',
    description: 'Master normalization, foreign relationships, transitive reductions, indexing, and complex joins.',
    url: 'https://www.postgresql.org/'
  },
  {
    id: 'c_db3',
    domain: 'DBMS',
    level: 'Advanced',
    title: 'ACID Transactions, Firestore & Scale-To-Zero SQL',
    description: 'Enterprise lock scheduling, partitioning, cloud sql replicas, and firestore non-relational modeling.',
    url: 'https://firebase.google.com/docs/firestore'
  },

  // DATA STRUCTURES
  {
    id: 'c_ds1',
    domain: 'Data Structures',
    level: 'Beginner',
    title: 'Linear Data Collections: Stacks, Vectors & Lists',
    description: 'Dynamic reference allocation, pointer linked structures, stacks, and linear queues.',
    url: 'https://en.wikipedia.org/wiki/Data_structure'
  },
  {
    id: 'c_ds2',
    domain: 'Data Structures',
    level: 'Intermediate',
    title: 'Binary Search Trees & Sorting Algorithm Efficiencies',
    description: 'Master AVL balancing, collision hash maps, tree traversals, O(N log N) sorts, and graph queues.',
    url: 'https://visualgo.net/'
  },
  {
    id: 'c_ds3',
    domain: 'Data Structures',
    level: 'Advanced',
    title: 'Graph Pathfinders & Dynamic Program Optimization',
    description: 'Dijkstra shortest maps, Bellman models, Kruskal spanning structures, and memoization models.',
    url: 'https://leetcode.com/'
  },

  // WEB DEVELOPMENT
  {
    id: 'c_web1',
    domain: 'Web Development',
    level: 'Beginner',
    title: 'Semantic HTML5, CSS Flexbox & Responsive Styling',
    description: 'Grid layout structures, adaptive prefixes, media variables, modern DOM hierarchies.',
    url: 'https://developer.mozilla.org/en-US/'
  },
  {
    id: 'c_web2',
    domain: 'Web Development',
    level: 'Intermediate',
    title: 'React Single Page App Architectures & Client Routers',
    description: 'Build stateful functional frameworks, client hooks, effect pipelines, and useRef controls.',
    url: 'https://react.dev/'
  },
  {
    id: 'c_web3',
    domain: 'Web Development',
    level: 'Advanced',
    title: 'Production Full-Stack Express Server & CORS Protection',
    description: 'Develop high-performance backends, custom middlewares, build bundling, and secure secure tokens.',
    url: 'https://expressjs.com/'
  },

  // ARTIFICIAL INTELLIGENCE
  {
    id: 'c_ai1',
    domain: 'Artificial Intelligence',
    level: 'Beginner',
    title: 'Data Science Vectors with Python & NumPy Arrays',
    description: 'Tabular cleanups, basic statistics, matplotlib plots, linear regression matrices, KNN classifiers.',
    url: 'https://pandas.pydata.org/'
  },
  {
    id: 'c_ai2',
    domain: 'Artificial Intelligence',
    level: 'Intermediate',
    title: 'Random Forest Classifiers & Overfitting regularizers',
    description: 'Ensemble estimators, decision parameters, F1 metrics, dropout nodes, and cross validation.',
    url: 'https://scikit-learn.org/stable/'
  },
  {
    id: 'c_ai3',
    domain: 'Artificial Intelligence',
    level: 'Advanced',
    title: 'Deep Backpropagation & Large Generative AI Models',
    description: 'Deep neural networks, loss derivatives, gradient descent, self-attention, and Gemini API integration.',
    url: 'https://ai.google.dev/'
  }
];
