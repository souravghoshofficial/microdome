import { useEffect, useState } from "react";
import axios from "axios";
import { BuyNowCard, CourseSyllabus } from "../components";
import { loadRazorpayScript } from "../utils/razorpay";
import { useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import { useParams, useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { login } from "../features/auth/authSlice";

const syllabus = {
  semester_i: [
    {
      subject: "Programming Fundamentals and Object Oriented Concepts",

      topics: [
        "Procedural Programming Using C: Arrays, Functions, Pointers",
        "Structures and IO Handling",
        "File Operations and Pre-processing",
        "Introduction to Object Oriented Programming and C++",
        "Classes, Objects, Inheritance, Polymorphism",
        "File Handling, Exception Handling, Templates and Namespaces",
        "Introduction to STL and Case Studies",
      ],
    },
    {
      subject: "Mathematical Foundations",
      topics: [
        "Procedural Programming Using C: Arrays, Functions, Pointers",
        "Structures and IO Handling",
        "File Operations and Pre-processing",
        "Introduction to Object Oriented Programming and C++",
        "Classes, Objects, Inheritance, Polymorphism",
        "File Handling, Exception Handling, Templates and Namespaces",
        "Introduction to STL and Case Studies",
      ],
    },
    {
      subject: "Management Information Systems",
      topics: [
        "Procedural Programming Using C: Arrays, Functions, Pointers",
        "Structures and IO Handling",
        "File Operations and Pre-processing",
        "Introduction to Object Oriented Programming and C++",
        "Classes, Objects, Inheritance, Polymorphism",
        "File Handling, Exception Handling, Templates and Namespaces",
        "Introduction to STL and Case Studies",
      ],
    },
    {
      subject: "Digital Systems",
      topics: [
        "Procedural Programming Using C: Arrays, Functions, Pointers",
        "Structures and IO Handling",
        "File Operations and Pre-processing",
        "Introduction to Object Oriented Programming and C++",
        "Classes, Objects, Inheritance, Polymorphism",
        "File Handling, Exception Handling, Templates and Namespaces",
        "Introduction to STL and Case Studies",
      ],
    },
  ],

  semester_ii: [
    {
      subject: "Data Structures and Algorithms",
      topics: [
        "Introduction, elementary data structures and their applications",
        "Lists: ordered lists, representation of arrays, singly, doubly and circular linked lists, stacks, queues, dequeues, multiple stacks and queues, generalized lists",
        "Applications: polynomial arithmetic, infix, postfix and prefix arithmetic expression conversion and evaluations",
        "Trees: General and binary trees, traversals, threaded binary tree, Binary Search Trees, AVL trees, B Tree, B+ tree",
        "Searching & Sorting: Linear Search, Hashing, Internal and External sort, Insertion sort, Bubble sort, Selection sort",
        "Complexity Analysis: Complexity measures, Worst, Best and Average Case, Upper and Lower bounds, Order Notations",
        "Divide and Conquer: Binary Search, Merge Sort, Quick Sort, Multiplication of Large Integers",
        "Greedy Algorithms: Minimum spanning tree, Dijkstra’s Algorithm, Fractional Knapsack Problem, Scheduling problems",
        "Dynamic Programming: Making change problem, 0-1 Knapsack Problem, Floyd’s algorithm, Chained Matrix Multiplication",
        "NP-Completeness: Space and Time Complexity, P, NP, NP-hard, NP-complete, Concept of Reduction",
      ],
    },
    {
      subject: "Advanced Programming (JAVA and Python)",
      topics: [
        "Java: Properties of Java, JVM",
        "OOP in Java: Classes, Objects, Methods, Constructors, Inheritance, Polymorphism, Packages, Interfaces, Wrapper Classes",
        "Java Exception Handling",
        "Java Threads and Synchronization",
        "Java File Handling",
        "Java GUI: Buttons, text fields, radio button, checkbox, list, event handling",
        "Java Collection Classes",
        "Python: Variables, Operators, Conditionals",
        "Python Loops and Functions: While, For, Break, Recursion, Scope",
        "Python Data Structures: List, Tuple, Set, Dictionary",
        "Python String Operations",
        "Python Modules: Importing, Standard Libraries, Namespaces, Packages",
        "Python File and Exception Handling, System Commands (os, shutil, glob, etc.)",
        "Python OOP: Class, Attributes, Methods, Inheritance, Overloading, Data Hiding",
        "Python Regular Expressions",
        "Python for Data Analysis: NumPy, Pandas, Matplotlib",
      ],
    },
    {
      subject: "Computer Organization and Architecture",
      topics: [
        "Basic structures and operational concepts, Instruction formats and execution, Addressing modes, Stacks, Queues, Subroutines",
        "Control unit: Fetch/store, Register transfers, Hardwired and microprogrammed control, Pipelining",
        "Fixed point and Floating point Arithmetic, Bit-slice processors, Emulation",
        "Memory: RAM, ROM, Cache, Memory hierarchy, Virtual memory, Address translation, Secondary memories",
        "I/O organization: Memory mapped and isolated I/O, DMA, Interrupts, Buses",
        "RISC processors and Parallel processing",
      ],
    },
    {
      subject: "Operating Systems",
      topics: [
        "Introduction to Operating Systems",
        "Batch-processing, Multiprogramming, Time sharing, Real-time systems",
        "Process Management: PCB, Process states, Scheduling algorithms (FCFS, SJF, RR, etc.)",
        "Threads: Kernel vs User threads, Multithreading models",
        "Inter-process Communication (IPC): Shared memory, message passing, FIFO, semaphore, monitor",
        "Process Synchronization: Critical section, Semaphores, Monitors, Deadlocks, Banker’s algorithm",
        "Memory Management: Paging, Segmentation, Virtual memory, Page replacement (FIFO, LRU, Optimal), Thrashing",
        "File Management: File operations, Allocation, Directory structures, File protection",
        "Device Management: Disk scheduling (FCFS, SSTF, SCAN, etc.), RAID concepts",
        "Protection and Security: Domains, Access control, Cryptography, User authentication",
        "Case Studies",
      ],
    },
    {
      subject: "Database Management Systems",
      topics: [
        "Introduction: DBMS advantages, Data abstraction levels, Data independence",
        "Database Models and Functional Components",
        "Relational Model: Relations, Keys, Constraints",
        "ER and EER Diagram Design",
        "Relational Algebra and Relational Calculus",
        "Structured Query Language (SQL)",
        "Functional Dependencies and Normalization",
        "Storage: Fixed/Variable records, File operations",
        "Indexing: Primary, Clustering, Secondary, Multilevel, B/B+ Trees, Hashing",
        "Query Optimization: Search strategies, Join strategies",
        "Database Security",
        "Oracle Architecture: PL/SQL, Triggers",
        "Transaction and Recovery: Logging, Checkpoints",
        "Concurrency Control: Locking, Timestamp protocols, Scheduling",
        "Advanced DB Concepts: OODBMS, Other Query Languages",
      ],
    },
  ],

  semester_iii: [
    {
      subject: "Data Structures and Algorithms",
      topics: [
        "Introduction, elementary data structures and their applications",
        "Lists: ordered lists, representation of arrays, singly, doubly and circular linked lists, stacks, queues, dequeues, multiple stacks and queues, generalized lists",
        "Applications: polynomial arithmetic, infix, postfix and prefix arithmetic expression conversion and evaluations",
        "Trees: General and binary trees, traversals, threaded binary tree, Binary Search Trees, AVL trees, B Tree, B+ tree",
        "Searching & Sorting: Linear Search, Hashing, Internal and External sort, Insertion sort, Bubble sort, Selection sort",
        "Complexity Analysis: Complexity measures, Worst, Best and Average Case, Upper and Lower bounds, Order Notations",
        "Divide and Conquer: Binary Search, Merge Sort, Quick Sort, Multiplication of Large Integers",
        "Greedy Algorithms: Minimum spanning tree, Dijkstra’s Algorithm, Fractional Knapsack Problem, Scheduling problems",
        "Dynamic Programming: Making change problem, 0-1 Knapsack Problem, Floyd’s algorithm, Chained Matrix Multiplication",
        "NP-Completeness: Space and Time Complexity, P, NP, NP-hard, NP-complete, Concept of Reduction",
      ],
    },
    {
      subject: "Advanced Programming (JAVA and Python)",
      topics: [
        "Java: Properties of Java, JVM",
        "OOP in Java: Classes, Objects, Methods, Constructors, Inheritance, Polymorphism, Packages, Interfaces, Wrapper Classes",
        "Java Exception Handling",
        "Java Threads and Synchronization",
        "Java File Handling",
        "Java GUI: Buttons, text fields, radio button, checkbox, list, event handling",
        "Java Collection Classes",
        "Python: Variables, Operators, Conditionals",
        "Python Loops and Functions: While, For, Break, Recursion, Scope",
        "Python Data Structures: List, Tuple, Set, Dictionary",
        "Python String Operations",
        "Python Modules: Importing, Standard Libraries, Namespaces, Packages",
        "Python File and Exception Handling, System Commands (os, shutil, glob, etc.)",
        "Python OOP: Class, Attributes, Methods, Inheritance, Overloading, Data Hiding",
        "Python Regular Expressions",
        "Python for Data Analysis: NumPy, Pandas, Matplotlib",
      ],
    },
    {
      subject: "Computer Organization and Architecture",
      topics: [
        "Basic structures and operational concepts, Instruction formats and execution, Addressing modes, Stacks, Queues, Subroutines",
        "Control unit: Fetch/store, Register transfers, Hardwired and microprogrammed control, Pipelining",
        "Fixed point and Floating point Arithmetic, Bit-slice processors, Emulation",
        "Memory: RAM, ROM, Cache, Memory hierarchy, Virtual memory, Address translation, Secondary memories",
        "I/O organization: Memory mapped and isolated I/O, DMA, Interrupts, Buses",
        "RISC processors and Parallel processing",
      ],
    },
    {
      subject: "Operating Systems",
      topics: [
        "Introduction to Operating Systems",
        "Batch-processing, Multiprogramming, Time sharing, Real-time systems",
        "Process Management: PCB, Process states, Scheduling algorithms (FCFS, SJF, RR, etc.)",
        "Threads: Kernel vs User threads, Multithreading models",
        "Inter-process Communication (IPC): Shared memory, message passing, FIFO, semaphore, monitor",
        "Process Synchronization: Critical section, Semaphores, Monitors, Deadlocks, Banker’s algorithm",
        "Memory Management: Paging, Segmentation, Virtual memory, Page replacement (FIFO, LRU, Optimal), Thrashing",
        "File Management: File operations, Allocation, Directory structures, File protection",
        "Device Management: Disk scheduling (FCFS, SSTF, SCAN, etc.), RAID concepts",
        "Protection and Security: Domains, Access control, Cryptography, User authentication",
        "Case Studies",
      ],
    },
    {
      subject: "Database Management Systems",
      topics: [
        "Introduction: DBMS advantages, Data abstraction levels, Data independence",
        "Database Models and Functional Components",
        "Relational Model: Relations, Keys, Constraints",
        "ER and EER Diagram Design",
        "Relational Algebra and Relational Calculus",
        "Structured Query Language (SQL)",
        "Functional Dependencies and Normalization",
        "Storage: Fixed/Variable records, File operations",
        "Indexing: Primary, Clustering, Secondary, Multilevel, B/B+ Trees, Hashing",
        "Query Optimization: Search strategies, Join strategies",
        "Database Security",
        "Oracle Architecture: PL/SQL, Triggers",
        "Transaction and Recovery: Logging, Checkpoints",
        "Concurrency Control: Locking, Timestamp protocols, Scheduling",
        "Advanced DB Concepts: OODBMS, Other Query Languages",
      ],
    },
  ],

  semester_iv: [
    {
      subject: "Data Structures and Algorithms",
      topics: [
        "Introduction, elementary data structures and their applications",
        "Lists: ordered lists, representation of arrays, singly, doubly and circular linked lists, stacks, queues, dequeues, multiple stacks and queues, generalized lists",
        "Applications: polynomial arithmetic, infix, postfix and prefix arithmetic expression conversion and evaluations",
        "Trees: General and binary trees, traversals, threaded binary tree, Binary Search Trees, AVL trees, B Tree, B+ tree",
        "Searching & Sorting: Linear Search, Hashing, Internal and External sort, Insertion sort, Bubble sort, Selection sort",
        "Complexity Analysis: Complexity measures, Worst, Best and Average Case, Upper and Lower bounds, Order Notations",
        "Divide and Conquer: Binary Search, Merge Sort, Quick Sort, Multiplication of Large Integers",
        "Greedy Algorithms: Minimum spanning tree, Dijkstra’s Algorithm, Fractional Knapsack Problem, Scheduling problems",
        "Dynamic Programming: Making change problem, 0-1 Knapsack Problem, Floyd’s algorithm, Chained Matrix Multiplication",
        "NP-Completeness: Space and Time Complexity, P, NP, NP-hard, NP-complete, Concept of Reduction",
      ],
    },
    {
      subject: "Advanced Programming (JAVA and Python)",
      topics: [
        "Java: Properties of Java, JVM",
        "OOP in Java: Classes, Objects, Methods, Constructors, Inheritance, Polymorphism, Packages, Interfaces, Wrapper Classes",
        "Java Exception Handling",
        "Java Threads and Synchronization",
        "Java File Handling",
        "Java GUI: Buttons, text fields, radio button, checkbox, list, event handling",
        "Java Collection Classes",
        "Python: Variables, Operators, Conditionals",
        "Python Loops and Functions: While, For, Break, Recursion, Scope",
        "Python Data Structures: List, Tuple, Set, Dictionary",
        "Python String Operations",
        "Python Modules: Importing, Standard Libraries, Namespaces, Packages",
        "Python File and Exception Handling, System Commands (os, shutil, glob, etc.)",
        "Python OOP: Class, Attributes, Methods, Inheritance, Overloading, Data Hiding",
        "Python Regular Expressions",
        "Python for Data Analysis: NumPy, Pandas, Matplotlib",
      ],
    },
    {
      subject: "Computer Organization and Architecture",
      topics: [
        "Basic structures and operational concepts, Instruction formats and execution, Addressing modes, Stacks, Queues, Subroutines",
        "Control unit: Fetch/store, Register transfers, Hardwired and microprogrammed control, Pipelining",
        "Fixed point and Floating point Arithmetic, Bit-slice processors, Emulation",
        "Memory: RAM, ROM, Cache, Memory hierarchy, Virtual memory, Address translation, Secondary memories",
        "I/O organization: Memory mapped and isolated I/O, DMA, Interrupts, Buses",
        "RISC processors and Parallel processing",
      ],
    },
    {
      subject: "Operating Systems",
      topics: [
        "Introduction to Operating Systems",
        "Batch-processing, Multiprogramming, Time sharing, Real-time systems",
        "Process Management: PCB, Process states, Scheduling algorithms (FCFS, SJF, RR, etc.)",
        "Threads: Kernel vs User threads, Multithreading models",
        "Inter-process Communication (IPC): Shared memory, message passing, FIFO, semaphore, monitor",
        "Process Synchronization: Critical section, Semaphores, Monitors, Deadlocks, Banker’s algorithm",
        "Memory Management: Paging, Segmentation, Virtual memory, Page replacement (FIFO, LRU, Optimal), Thrashing",
        "File Management: File operations, Allocation, Directory structures, File protection",
        "Device Management: Disk scheduling (FCFS, SSTF, SCAN, etc.), RAID concepts",
        "Protection and Security: Domains, Access control, Cryptography, User authentication",
        "Case Studies",
      ],
    },
    {
      subject: "Database Management Systems",
      topics: [
        "Introduction: DBMS advantages, Data abstraction levels, Data independence",
        "Database Models and Functional Components",
        "Relational Model: Relations, Keys, Constraints",
        "ER and EER Diagram Design",
        "Relational Algebra and Relational Calculus",
        "Structured Query Language (SQL)",
        "Functional Dependencies and Normalization",
        "Storage: Fixed/Variable records, File operations",
        "Indexing: Primary, Clustering, Secondary, Multilevel, B/B+ Trees, Hashing",
        "Query Optimization: Search strategies, Join strategies",
        "Database Security",
        "Oracle Architecture: PL/SQL, Triggers",
        "Transaction and Recovery: Logging, Checkpoints",
        "Concurrency Control: Locking, Timestamp protocols, Scheduling",
        "Advanced DB Concepts: OODBMS, Other Query Languages",
      ],
    },
  ],

  semester_v: [
    {
      subject: "Data Structures and Algorithms",
      topics: [
        "Introduction, elementary data structures and their applications",
        "Lists: ordered lists, representation of arrays, singly, doubly and circular linked lists, stacks, queues, dequeues, multiple stacks and queues, generalized lists",
        "Applications: polynomial arithmetic, infix, postfix and prefix arithmetic expression conversion and evaluations",
        "Trees: General and binary trees, traversals, threaded binary tree, Binary Search Trees, AVL trees, B Tree, B+ tree",
        "Searching & Sorting: Linear Search, Hashing, Internal and External sort, Insertion sort, Bubble sort, Selection sort",
        "Complexity Analysis: Complexity measures, Worst, Best and Average Case, Upper and Lower bounds, Order Notations",
        "Divide and Conquer: Binary Search, Merge Sort, Quick Sort, Multiplication of Large Integers",
        "Greedy Algorithms: Minimum spanning tree, Dijkstra’s Algorithm, Fractional Knapsack Problem, Scheduling problems",
        "Dynamic Programming: Making change problem, 0-1 Knapsack Problem, Floyd’s algorithm, Chained Matrix Multiplication",
        "NP-Completeness: Space and Time Complexity, P, NP, NP-hard, NP-complete, Concept of Reduction",
      ],
    },
    {
      subject: "Advanced Programming (JAVA and Python)",
      topics: [
        "Java: Properties of Java, JVM",
        "OOP in Java: Classes, Objects, Methods, Constructors, Inheritance, Polymorphism, Packages, Interfaces, Wrapper Classes",
        "Java Exception Handling",
        "Java Threads and Synchronization",
        "Java File Handling",
        "Java GUI: Buttons, text fields, radio button, checkbox, list, event handling",
        "Java Collection Classes",
        "Python: Variables, Operators, Conditionals",
        "Python Loops and Functions: While, For, Break, Recursion, Scope",
        "Python Data Structures: List, Tuple, Set, Dictionary",
        "Python String Operations",
        "Python Modules: Importing, Standard Libraries, Namespaces, Packages",
        "Python File and Exception Handling, System Commands (os, shutil, glob, etc.)",
        "Python OOP: Class, Attributes, Methods, Inheritance, Overloading, Data Hiding",
        "Python Regular Expressions",
        "Python for Data Analysis: NumPy, Pandas, Matplotlib",
      ],
    },
    {
      subject: "Computer Organization and Architecture",
      topics: [
        "Basic structures and operational concepts, Instruction formats and execution, Addressing modes, Stacks, Queues, Subroutines",
        "Control unit: Fetch/store, Register transfers, Hardwired and microprogrammed control, Pipelining",
        "Fixed point and Floating point Arithmetic, Bit-slice processors, Emulation",
        "Memory: RAM, ROM, Cache, Memory hierarchy, Virtual memory, Address translation, Secondary memories",
        "I/O organization: Memory mapped and isolated I/O, DMA, Interrupts, Buses",
        "RISC processors and Parallel processing",
      ],
    },
    {
      subject: "Operating Systems",
      topics: [
        "Introduction to Operating Systems",
        "Batch-processing, Multiprogramming, Time sharing, Real-time systems",
        "Process Management: PCB, Process states, Scheduling algorithms (FCFS, SJF, RR, etc.)",
        "Threads: Kernel vs User threads, Multithreading models",
        "Inter-process Communication (IPC): Shared memory, message passing, FIFO, semaphore, monitor",
        "Process Synchronization: Critical section, Semaphores, Monitors, Deadlocks, Banker’s algorithm",
        "Memory Management: Paging, Segmentation, Virtual memory, Page replacement (FIFO, LRU, Optimal), Thrashing",
        "File Management: File operations, Allocation, Directory structures, File protection",
        "Device Management: Disk scheduling (FCFS, SSTF, SCAN, etc.), RAID concepts",
        "Protection and Security: Domains, Access control, Cryptography, User authentication",
        "Case Studies",
      ],
    },
    {
      subject: "Database Management Systems",
      topics: [
        "Introduction: DBMS advantages, Data abstraction levels, Data independence",
        "Database Models and Functional Components",
        "Relational Model: Relations, Keys, Constraints",
        "ER and EER Diagram Design",
        "Relational Algebra and Relational Calculus",
        "Structured Query Language (SQL)",
        "Functional Dependencies and Normalization",
        "Storage: Fixed/Variable records, File operations",
        "Indexing: Primary, Clustering, Secondary, Multilevel, B/B+ Trees, Hashing",
        "Query Optimization: Search strategies, Join strategies",
        "Database Security",
        "Oracle Architecture: PL/SQL, Triggers",
        "Transaction and Recovery: Logging, Checkpoints",
        "Concurrency Control: Locking, Timestamp protocols, Scheduling",
        "Advanced DB Concepts: OODBMS, Other Query Languages",
      ],
    },
  ],

  semester_vi: [
    {
      subject: "Data Structures and Algorithms",
      topics: [
        "Introduction, elementary data structures and their applications",
        "Lists: ordered lists, representation of arrays, singly, doubly and circular linked lists, stacks, queues, dequeues, multiple stacks and queues, generalized lists",
        "Applications: polynomial arithmetic, infix, postfix and prefix arithmetic expression conversion and evaluations",
        "Trees: General and binary trees, traversals, threaded binary tree, Binary Search Trees, AVL trees, B Tree, B+ tree",
        "Searching & Sorting: Linear Search, Hashing, Internal and External sort, Insertion sort, Bubble sort, Selection sort",
        "Complexity Analysis: Complexity measures, Worst, Best and Average Case, Upper and Lower bounds, Order Notations",
        "Divide and Conquer: Binary Search, Merge Sort, Quick Sort, Multiplication of Large Integers",
        "Greedy Algorithms: Minimum spanning tree, Dijkstra’s Algorithm, Fractional Knapsack Problem, Scheduling problems",
        "Dynamic Programming: Making change problem, 0-1 Knapsack Problem, Floyd’s algorithm, Chained Matrix Multiplication",
        "NP-Completeness: Space and Time Complexity, P, NP, NP-hard, NP-complete, Concept of Reduction",
      ],
    },
    {
      subject: "Advanced Programming (JAVA and Python)",
      topics: [
        "Java: Properties of Java, JVM",
        "OOP in Java: Classes, Objects, Methods, Constructors, Inheritance, Polymorphism, Packages, Interfaces, Wrapper Classes",
        "Java Exception Handling",
        "Java Threads and Synchronization",
        "Java File Handling",
        "Java GUI: Buttons, text fields, radio button, checkbox, list, event handling",
        "Java Collection Classes",
        "Python: Variables, Operators, Conditionals",
        "Python Loops and Functions: While, For, Break, Recursion, Scope",
        "Python Data Structures: List, Tuple, Set, Dictionary",
        "Python String Operations",
        "Python Modules: Importing, Standard Libraries, Namespaces, Packages",
        "Python File and Exception Handling, System Commands (os, shutil, glob, etc.)",
        "Python OOP: Class, Attributes, Methods, Inheritance, Overloading, Data Hiding",
        "Python Regular Expressions",
        "Python for Data Analysis: NumPy, Pandas, Matplotlib",
      ],
    },
    {
      subject: "Computer Organization and Architecture",
      topics: [
        "Basic structures and operational concepts, Instruction formats and execution, Addressing modes, Stacks, Queues, Subroutines",
        "Control unit: Fetch/store, Register transfers, Hardwired and microprogrammed control, Pipelining",
        "Fixed point and Floating point Arithmetic, Bit-slice processors, Emulation",
        "Memory: RAM, ROM, Cache, Memory hierarchy, Virtual memory, Address translation, Secondary memories",
        "I/O organization: Memory mapped and isolated I/O, DMA, Interrupts, Buses",
        "RISC processors and Parallel processing",
      ],
    },
    {
      subject: "Operating Systems",
      topics: [
        "Introduction to Operating Systems",
        "Batch-processing, Multiprogramming, Time sharing, Real-time systems",
        "Process Management: PCB, Process states, Scheduling algorithms (FCFS, SJF, RR, etc.)",
        "Threads: Kernel vs User threads, Multithreading models",
        "Inter-process Communication (IPC): Shared memory, message passing, FIFO, semaphore, monitor",
        "Process Synchronization: Critical section, Semaphores, Monitors, Deadlocks, Banker’s algorithm",
        "Memory Management: Paging, Segmentation, Virtual memory, Page replacement (FIFO, LRU, Optimal), Thrashing",
        "File Management: File operations, Allocation, Directory structures, File protection",
        "Device Management: Disk scheduling (FCFS, SSTF, SCAN, etc.), RAID concepts",
        "Protection and Security: Domains, Access control, Cryptography, User authentication",
        "Case Studies",
      ],
    },
    {
      subject: "Database Management Systems",
      topics: [
        "Introduction: DBMS advantages, Data abstraction levels, Data independence",
        "Database Models and Functional Components",
        "Relational Model: Relations, Keys, Constraints",
        "ER and EER Diagram Design",
        "Relational Algebra and Relational Calculus",
        "Structured Query Language (SQL)",
        "Functional Dependencies and Normalization",
        "Storage: Fixed/Variable records, File operations",
        "Indexing: Primary, Clustering, Secondary, Multilevel, B/B+ Trees, Hashing",
        "Query Optimization: Search strategies, Join strategies",
        "Database Security",
        "Oracle Architecture: PL/SQL, Triggers",
        "Transaction and Recovery: Logging, Checkpoints",
        "Concurrency Control: Locking, Timestamp protocols, Scheduling",
        "Advanced DB Concepts: OODBMS, Other Query Languages",
      ],
    },
  ],
};

const courseFeatures = [
  "Live interactive classes led by top educators.",
  "Unlimited access to recorded lectures after each live session.",
  "Dedicated doubt-clearing sessions and personalized mentoring.",
  "Detailed, well-structured notes provided for every topic.",
  "Practice with previous year questions and full-length mock tests.",
];

const ApiUrl = import.meta.env.VITE_BACKEND_URL;

const SemesterCourseLayout = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const semester = id.replace(/-/g, "_");
  console.log(semester);
  const isLoggedIn = useSelector((state) => state.auth.status);
  const userData = useSelector((state) => state.auth.userData);
  const [courseDetails, setCourseDetails] = useState(null);

  useEffect(() => {
    axios
      .post(
        `${ApiUrl}/api/v1/courses/get-course-details`,
        { linkAddress: id },
        { withCredentials: true }
      )
      .then((res) => {
        console.log(res.data.courseDetails);
        setCourseDetails(res.data.courseDetails);
      })
      .catch(() => console.log("Error fetching course details"));
  }, []);

  const isEnrolled = userData?.enrolledCourses.includes(courseDetails?._id);

  const handlePayment = async () => {
    if (isEnrolled) {
      navigate(`/my-courses/${courseDetails?._id}`);
      return;
    }
    if (!isLoggedIn) {
      toast.warn("Login to enroll");
      return;
    }
    try {
      const res = await axios.post(
        `${ApiUrl}/api/v1/orders/create-order`,
        {
          courseId: courseDetails?._id,
          amount: courseDetails?.discountedPrice,
        },
        {
          withCredentials: true,
        }
      );

      const isScriptLoaded = await loadRazorpayScript();
      if (!isScriptLoaded) {
        alert("Razorpay SDK failed to load. Please try again later.");
        return;
      }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: 100 * courseDetails?.discountedPrice,
        currency: "INR",
        name: "Microdome Classes",
        description: `Payment for ${courseDetails.courseTitle}`,
        image:
          "http://res.cloudinary.com/deljukiyr/image/upload/v1748880241/qi2txlfzapvqkqle8baa.jpg",
        order_id: res.data.order.id,
        handler: async function (response) {
          try {
            const res = await axios.get(`${ApiUrl}/api/v1/users/current-user`, {
              withCredentials: true,
            });
            dispatch(login(res.data.data));
            navigate("/payment-success", {
              state: { paymentId: response.razorpay_payment_id },
            });
          } catch (err) {
            console.log("Failed to refresh user:", err.message);
          }
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="w-full flex items-center justify-center">
      <div className="mt-8 w-full lg:w-[92%] flex flex-col-reverse lg:flex-row justify-center lg:gap-10 lg:px-12 lg:py-6 mb-16">
        <ToastContainer />
        <div className="w-[90%] mx-auto lg:w-[60%] z-20 mt-16">
          <h3 className="mt-2 leading-10 text-2xl md:text-3xl font-bold">
            {courseDetails?.courseTitle}
          </h3>
          <h5 className="mt-2 w-[95%] text-[17px]">
            {courseDetails?.courseDescription}
          </h5>
          <div className="w-full mt-4">
            <CourseSyllabus syllabus={syllabus[semester]} />
          </div>
        </div>
        <div className="mt-16 lg:sticky h-fit top-32 w-[90%] mx-auto md:w-[50%] lg:w-[36%] z-20">
          <BuyNowCard
            courseFeatures={courseFeatures}
            actualPrice={courseDetails?.actualPrice}
            discountedPrice={courseDetails?.discountedPrice}
            imageUrl={courseDetails?.courseImage}
            handlePayment={handlePayment}
            isEnrolled={isEnrolled}
          />
        </div>
      </div>
    </div>
  );
};

export default SemesterCourseLayout;
