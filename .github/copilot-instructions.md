Students are beginners learning the basics of JavaScript and React.

We provide the simplest, beginner-friendly code possible.

We use template literals for string formatting, and const and let for variables.

We provide comments to help students understand each part of the generated code, especially when debugging.

We make the code accessible, with proper HTML structure and ARIA attributes. We use semantic HTML elements (like <header>, <main>, <footer>, <article>) for better accessibility and SEO. We use CSS for styling, avoiding inline styles in HTML.

We use React functional components and hooks, avoiding class components.
We use the latest JavaScript features, like arrow functions and destructuring, to keep the code modern and clean.
We avoid complex patterns and libraries, focusing on core React concepts like state and props.
We provide clear and concise error messages, avoiding technical jargon, to help students understand what went wrong.
We avoid using advanced features like context, reducers, or custom hooks in beginner-level code.
We use simple, descriptive variable and function names to make the code easy to read and understand.

To keep user inputs even after a page refresh, we use `localStorage` for storing data in the browser. We use this for all form inputs and checkboxes.
We avoid using sessionStorage for simplicity, as localStorage is more commonly used and easier to understand

We use index.css to store global CSS variables for colors, fonts, and other styles. This helps maintain consistency across the application and makes it easier to update styles in one place.

We use the `classnames` library to conditionally apply CSS classes based on component state or props. This makes it easier to manage styles dynamically without cluttering the code with multiple class names.
We use the `react-icons` library to include icons in the application, which provides a wide range of icons and is easy to use. We avoid using SVGs directly in the code to keep the codebase cleaner and more maintainable.
We use the `react-router-dom` library for routing in the application, which is beginner-friendly and widely used in the React community. This allows us to create a single-page application with multiple views without reloading the page.
We use the `axios` library for making HTTP requests, which is simple and easy to use for beginners. It provides a clean API for handling requests and responses, making it easier to work with APIs.

We use composition and props to create reusable components, which helps keep the code organized and maintainable. This allows us to break down complex UIs into smaller, manageable pieces that can be reused across the application.
We use the `useState` and `useEffect` hooks for managing state and side effects in functional components. This keeps the code simple and avoids the complexity of class components, making it easier for beginners to understand.

We use separation of concerns by keeping styles in separate CSS files and using CSS modules when necessary. This helps maintain a clean codebase and makes it easier to manage styles independently of the component logic.
We also use separation of concerns by keeping code organized into components, with each component handling its own logic and presentation. This makes it easier to understand the flow of the application and promotes reusability.

We use extreme modularity by breaking down the application into small, focused components. Each component should have a single responsibility, making it easier to test and maintain. This approach also promotes reusability across the application.
The Templates folder contains reusable components that can be used across different parts of the application. These components are designed to be flexible and customizable, allowing students to understand how to create and use reusable components effectively.

We use tailwindcss for styling, which is beginner-friendly and allows for rapid development of responsive designs. It provides utility-first CSS classes that can be easily applied to elements, making it easier for students to understand how to style components without writing custom CSS.

We don't use magic strings or numbers in the code. Instead, we define constants for any values that are used multiple times or that have specific meanings. This makes the code more readable and maintainable, as it avoids confusion about what certain values represent.
