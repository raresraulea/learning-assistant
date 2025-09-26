using RandomSubjectsApi.Models;

namespace RandomSubjectsApi.Data;

public static class DataSeeder
{
    public static void SeedData(ApplicationDbContext context)
    {
        // Check if we already have data
        if (context.Exercises.Any())
        {
            return; // Database has been seeded
        }

        var exercises = new List<Exercise>
        {
            new Exercise
            {
                Title = "JavaScript Fundamentals",
                Description = "Learn the basics of JavaScript programming language",
                Content = "JavaScript is a versatile programming language that runs in browsers and servers. It supports dynamic typing, first-class functions, and prototype-based object-oriented programming. Key concepts include variables (var, let, const), functions, objects, arrays, and event handling. Modern JavaScript (ES6+) introduced features like arrow functions, template literals, destructuring, classes, modules, and async/await for handling asynchronous operations.",
                Tags = new List<string> { "JavaScript", "Programming", "Web Development", "ES6", "Frontend" },
                CreatedAt = DateTime.UtcNow.AddDays(-30),
                UpdatedAt = DateTime.UtcNow.AddDays(-30)
            },
            new Exercise
            {
                Title = "React Component Lifecycle",
                Description = "Understanding React component lifecycle methods and hooks",
                Content = "React components have a lifecycle that includes mounting, updating, and unmounting phases. In class components, lifecycle methods like componentDidMount, componentDidUpdate, and componentWillUnmount manage these phases. With React Hooks, useEffect replaces these methods, allowing functional components to perform side effects. The useEffect hook can handle component mounting with empty dependency array, updates with specific dependencies, and cleanup with return functions.",
                Tags = new List<string> { "React", "Frontend", "JavaScript", "Hooks", "Lifecycle" },
                CreatedAt = DateTime.UtcNow.AddDays(-25),
                UpdatedAt = DateTime.UtcNow.AddDays(-25)
            },
            new Exercise
            {
                Title = "RESTful API Design Principles",
                Description = "Best practices for designing RESTful APIs",
                Content = "REST (Representational State Transfer) is an architectural style for web services. Key principles include: stateless communication, uniform interface using HTTP methods (GET, POST, PUT, DELETE), resource identification through URIs, and representation through JSON or XML. Best practices include using proper HTTP status codes, implementing pagination for large datasets, versioning APIs, providing clear documentation, handling errors gracefully, and implementing proper authentication and authorization mechanisms.",
                Tags = new List<string> { "REST", "API", "Backend", "HTTP", "Web Services" },
                CreatedAt = DateTime.UtcNow.AddDays(-20),
                UpdatedAt = DateTime.UtcNow.AddDays(-20)
            },
            new Exercise
            {
                Title = "SQL Database Normalization",
                Description = "Database normalization forms and optimization techniques",
                Content = "Database normalization is the process of organizing data to reduce redundancy and improve data integrity. First Normal Form (1NF) requires atomic values and unique rows. Second Normal Form (2NF) eliminates partial dependencies on composite keys. Third Normal Form (3NF) removes transitive dependencies. BCNF (Boyce-Codd Normal Form) handles anomalies in 3NF. Higher forms like 4NF and 5NF address multi-valued dependencies. Proper normalization improves data consistency, reduces storage space, and simplifies updates while potentially requiring more complex queries.",
                Tags = new List<string> { "SQL", "Database", "Normalization", "Data Modeling", "RDBMS" },
                CreatedAt = DateTime.UtcNow.AddDays(-15),
                UpdatedAt = DateTime.UtcNow.AddDays(-15)
            },
            new Exercise
            {
                Title = "Git Version Control Workflow",
                Description = "Git branching strategies and collaborative development",
                Content = "Git is a distributed version control system that tracks changes in source code. Common workflows include Git Flow with feature, develop, and master branches, and GitHub Flow with feature branches and pull requests. Essential commands include git clone, add, commit, push, pull, merge, and rebase. Branching allows parallel development, while merging integrates changes. Conflict resolution requires manual intervention when changes overlap. Best practices include writing descriptive commit messages, using atomic commits, and regular synchronization with remote repositories.",
                Tags = new List<string> { "Git", "Version Control", "Collaboration", "Branching", "DevOps" },
                CreatedAt = DateTime.UtcNow.AddDays(-10),
                UpdatedAt = DateTime.UtcNow.AddDays(-10)
            },
            new Exercise
            {
                Title = "Agile Software Development",
                Description = "Agile methodologies and Scrum framework principles",
                Content = "Agile software development emphasizes iterative development, collaboration, and adaptability. The Agile Manifesto values individuals over processes, working software over documentation, customer collaboration over contracts, and responding to change over following plans. Scrum is a popular Agile framework with roles (Product Owner, Scrum Master, Development Team), events (Sprint Planning, Daily Standups, Sprint Review, Retrospective), and artifacts (Product Backlog, Sprint Backlog, Increment). Sprints are time-boxed iterations typically lasting 1-4 weeks.",
                Tags = new List<string> { "Agile", "Scrum", "Project Management", "Software Development", "Methodology" },
                CreatedAt = DateTime.UtcNow.AddDays(-8),
                UpdatedAt = DateTime.UtcNow.AddDays(-8)
            },
            new Exercise
            {
                Title = "CSS Grid and Flexbox Layout",
                Description = "Modern CSS layout techniques for responsive design",
                Content = "CSS Grid and Flexbox are powerful layout systems for modern web design. Flexbox excels at one-dimensional layouts (row or column) with properties like justify-content, align-items, and flex-grow. CSS Grid handles two-dimensional layouts with grid-template-columns, grid-template-rows, and grid-area. Both support responsive design through media queries and flexible units. Grid is ideal for page layouts, while Flexbox works well for component layouts. They can be combined for complex, responsive designs that adapt to different screen sizes and devices.",
                Tags = new List<string> { "CSS", "Layout", "Grid", "Flexbox", "Responsive Design" },
                CreatedAt = DateTime.UtcNow.AddDays(-5),
                UpdatedAt = DateTime.UtcNow.AddDays(-5)
            },
            new Exercise
            {
                Title = "Microservices Architecture",
                Description = "Design patterns and challenges in microservices systems",
                Content = "Microservices architecture decomposes applications into small, independent services that communicate over networks. Benefits include scalability, technology diversity, fault isolation, and team autonomy. Challenges include distributed system complexity, network latency, data consistency, service discovery, and monitoring. Key patterns include API Gateway for routing, Circuit Breaker for fault tolerance, Event Sourcing for data management, and CQRS for read/write separation. Container orchestration with Docker and Kubernetes facilitates deployment and scaling.",
                Tags = new List<string> { "Microservices", "Architecture", "Distributed Systems", "Docker", "Kubernetes" },
                CreatedAt = DateTime.UtcNow.AddDays(-3),
                UpdatedAt = DateTime.UtcNow.AddDays(-3)
            },
            new Exercise
            {
                Title = "Machine Learning Fundamentals",
                Description = "Introduction to machine learning algorithms and concepts",
                Content = "Machine Learning enables computers to learn patterns from data without explicit programming. Supervised learning uses labeled data for classification and regression tasks. Unsupervised learning finds patterns in unlabeled data through clustering and dimensionality reduction. Reinforcement learning learns through rewards and penalties. Common algorithms include linear regression, decision trees, neural networks, k-means clustering, and support vector machines. The ML pipeline involves data collection, preprocessing, feature engineering, model training, validation, and deployment.",
                Tags = new List<string> { "Machine Learning", "AI", "Data Science", "Algorithms", "Python" },
                CreatedAt = DateTime.UtcNow.AddDays(-1),
                UpdatedAt = DateTime.UtcNow.AddDays(-1)
            },
            new Exercise
            {
                Title = "Software Testing Strategies",
                Description = "Testing methodologies and quality assurance practices",
                Content = "Software testing ensures application quality through various strategies. Unit tests validate individual components, integration tests verify component interactions, and end-to-end tests simulate user workflows. Test-Driven Development (TDD) writes tests before code, while Behavior-Driven Development (BDD) focuses on user stories. Testing pyramid suggests many unit tests, fewer integration tests, and minimal UI tests. Continuous Integration automates test execution. Tools include Jest for JavaScript, pytest for Python, and Selenium for browser automation.",
                Tags = new List<string> { "Testing", "TDD", "BDD", "Quality Assurance", "Automation" },
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            }
        };

        context.Exercises.AddRange(exercises);
        context.SaveChanges();

        // Create sample tests
        var tests = new List<Test>
        {
            new Test
            {
                Name = "Frontend Development Fundamentals",
                Description = "Test covering JavaScript, React, and CSS concepts",
                ExerciseCount = 3,
                Tags = new List<string> { "Frontend", "JavaScript", "React", "CSS" },
                CreatedAt = DateTime.UtcNow.AddDays(-7),
                UpdatedAt = DateTime.UtcNow.AddDays(-7)
            },
            new Test
            {
                Name = "Backend and Database Concepts",
                Description = "Test covering REST APIs, databases, and server-side development",
                ExerciseCount = 2,
                Tags = new List<string> { "Backend", "API", "Database", "SQL" },
                CreatedAt = DateTime.UtcNow.AddDays(-5),
                UpdatedAt = DateTime.UtcNow.AddDays(-5)
            },
            new Test
            {
                Name = "Software Engineering Practices",
                Description = "Test covering development methodologies and best practices",
                ExerciseCount = 4,
                Tags = new List<string> { "Software Engineering", "Testing", "Git", "Agile" },
                CreatedAt = DateTime.UtcNow.AddDays(-2),
                UpdatedAt = DateTime.UtcNow.AddDays(-2)
            }
        };

        context.Tests.AddRange(tests);
        context.SaveChanges();

        // Create test-exercise relationships
        var testExercises = new List<TestExercise>
        {
            // Frontend Development Fundamentals test
            new TestExercise { TestId = tests[0].Id, ExerciseId = exercises[0].Id, Order = 1 }, // JavaScript
            new TestExercise { TestId = tests[0].Id, ExerciseId = exercises[1].Id, Order = 2 }, // React
            new TestExercise { TestId = tests[0].Id, ExerciseId = exercises[6].Id, Order = 3 }, // CSS

            // Backend and Database Concepts test
            new TestExercise { TestId = tests[1].Id, ExerciseId = exercises[2].Id, Order = 1 }, // REST API
            new TestExercise { TestId = tests[1].Id, ExerciseId = exercises[3].Id, Order = 2 }, // SQL

            // Software Engineering Practices test
            new TestExercise { TestId = tests[2].Id, ExerciseId = exercises[4].Id, Order = 1 }, // Git
            new TestExercise { TestId = tests[2].Id, ExerciseId = exercises[5].Id, Order = 2 }, // Agile
            new TestExercise { TestId = tests[2].Id, ExerciseId = exercises[9].Id, Order = 3 }, // Testing
            new TestExercise { TestId = tests[2].Id, ExerciseId = exercises[7].Id, Order = 4 }, // Microservices
        };

        context.TestExercises.AddRange(testExercises);
        context.SaveChanges();
    }
}