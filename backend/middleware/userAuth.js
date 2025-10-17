import jwt from "jsonwebtoken";

// Middleware to authenticate user using JWT
const userAuth = (req, res, next) => {
  const { token } = req.cookies; // Get token from cookies

  if (!token) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user ID to request object
    req.userId = decoded.id;

    next();

  } catch (error) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }
};

export default userAuth;
