import jwt from 'jsonwebtoken'

export const sendToken = (user, res) => {
    const token = jwt.sign(
        {id:user._id, role:user.role},
        process.env.JWT_SECRET,
        {expiresIn:'7d'}
    )
    
    res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
    })

    return token
} 