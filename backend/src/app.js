import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import userRouter from './routes/user.routes.js';
import productRouter from './routes/product.routes.js';
import authRouter from './routes/auth.routes.js';
import orderRouter from './routes/order.routes.js';

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
}));

app.use(express.json({limit: "16kb"}));
app.use(express.urlencoded({extended: true, limit: "16kb"}));
app.use(express.static("public"));
app.use(cookieParser());

//routes
app.use("/api/v1/user", userRouter);
app.use("/api/v1/product", productRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/orders", orderRouter);
export default app;

//app.use - when you want to use a middleware function in your Express application. It allows you to define functions that will be executed for every incoming request to the server, or for specific routes if specified. This is useful for tasks such as parsing request bodies, handling cookies, enabling CORS, and serving static files.
//cors - Cross-Origin Resource Sharing (CORS) is a security feature implemented by web browsers that restricts web pages from making requests to a different domain than the one that served the web page. The cors middleware in Express allows you to configure your server to accept requests from specified origins, enabling cross-origin requests while maintaining security.
//cookie-parser - cookie-parser is a middleware for Express that parses cookies attached to the client request object. It populates req.cookies with an object keyed by the cookie names, making it easier to access and manipulate cookies in your application.
//express.json() - This middleware is used to parse incoming requests with JSON payloads. It makes the parsed data available on req.body, allowing you to easily access and work with JSON data sent in the request body.
//express.urlencoded() - This middleware is used to parse incoming requests with URL-encoded payloads, typically from HTML form submissions. It also populates req.body with the parsed data, allowing you to access form data easily.
//express.static() - This middleware is used to serve static files such as HTML, CSS, JavaScript, and images from a specified directory. It allows you to define a folder (in this case, 'public') from which static assets can be served directly to clients without needing additional route handling.
//middleware - Middleware functions are functions that have access to the request object (req), the response object (res), and the next middleware function in the application’s request-response cycle. They can execute code, make changes to the request and response objects, end the request-response cycle, or call the next middleware function in the stack. Middleware is commonly used for tasks such as logging, authentication, error handling, and data parsing.
//config - In the context of an Express application, "config" typically refers to configuration settings that define how the application behaves. This can include settings for middleware, database connections, environment variables, and other application-specific options. Configuration helps manage different environments (development, testing, production) and allows for easier maintenance and scalability of the application.