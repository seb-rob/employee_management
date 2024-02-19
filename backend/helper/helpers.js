const jwt = require("jsonwebtoken")

// SEND GRID SET UP
const sgMail = require("@sendgrid/mail")
sgMail.setApiKey(process.env.SENDGRID_API_KEY)


// TOKEN GENERATOR
exports.tokenGenerator = (payload, validUpTo) => {
    return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: validUpTo
    })
}


// EMAIL SENDER
exports.sendEmail = async (to, subject, html) => {
    const msg = {
        to: to,
        from: 'sebastianrobi29@gmail.com', 
        subject: subject,
        html: html
    }

    const val = sgMail.send(msg)
        .then(response => {
            if (response[0].statusCode >= 200 || response[0].statusCode <= 300) {
                return { success: 1, error: {} }
            }
        }).catch(error => {
            return {success: 0, error: error}
        })
    return val
}