import jwt from "jsonwebtoken"

export const requireAuth = (req, res, next) => {

    const authHeader = req.headers.authorization

    if (!authHeader) {
        return res.status(401).json({ message: "No token provided" })
    }
  
    const token = authHeader.split(" ")[1]

    if (!token) {
        return res.status(401).json({ message: "Invalid token format" })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        req.user = decoded
        next()
        

    } catch (err) {
        return res.status(401).json({ message: "Token invalid or expired" })
    }
}

export const requireAdmin = (req, res, next) => {

    const roles = req.user?.roles || []

    if (!roles.includes("admin")) {
        return res.status(403).json({ message: "Admins only" })
    }

    next()
}

export const optionalAuth = (req, res, next) => {
      const token = req.headers.authorization?.split(" ")[1]
    
      if (!token) {
        req.user = null
        return next()
      }
    
      try {
        req.user = jwt.verify(token, process.env.JWT_SECRET)
      } catch (err) {
        req.user = null
      }
    
      next()
}

