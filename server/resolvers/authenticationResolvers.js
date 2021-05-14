const passwordHash = require("password-hash");
const crypto = require("crypto");

const nodemailer = require("nodemailer");

const transport = {
	host: "smtp.gmail.com",
	auth: {
		user: process.env.EMAIL_USER,
		pass: process.env.EMAIL_PASS,
	},
};

const transporter = nodemailer.createTransport(transport);

transporter.verify((error, success) => {
	if (error) {
		console.log(error);
	} else {
		console.log("Nodemailer connected!");
	}
});

const resolvers = {
	Query: {
		login: async (root, {username, password}, {models, loggedIn}) => {
			if (loggedIn) return {success: false, token: null};
			const user = await models.User.findOne({
				where: {
					name: username,
				},
			});

			if (user) {
				if (passwordHash.verify(password, user.password)) {
					const token = crypto.randomBytes(64).toString("hex");
					const session = await models.Session.create({
						token,
						user_id: Number(user.id),
					});
					session.save();
					return {success: true, token};
				}
			}
			throw new Error("Username and or password given was not correct.");
		},
		logout: async (root, args, {models, loggedIn, user, token}) => {
			if (!loggedIn || !user || !token) return false;
			await models.Session.destroy({
				where: {
					token,
				},
			});
			return true;
		},
		verifyEmailToken: async (root, {token}, {models}) => {
			const emailToken = await models.EmailToken.findOne({
				where: {
					token,
				},
			});
			if (emailToken) {
				return {success: true, email: emailToken.email};
			}
			throw new Error("The given token was not found.");
		},
		isAuthenticated: async (root, args, {loggedIn}) => {
			return loggedIn;
		},
		getAuthenticatedUser: async (root, args, {loggedIn, user}) => {
			if (!loggedIn) return null;
			return user;
		},
	},
	Mutation: {
		sendVerifyEmail: async (root, {email}, {models}) => {
			const token = crypto.randomBytes(64).toString("hex");
			const user = await models.User.findOne({
				where: {
					email,
				},
			});
			if (!user) {
				const port =
					process.env.NODE_ENV === "production"
						? process.env.SERVER_PORT
						: "3000";
				return transporter
					.sendMail({
						from: "NielzosFilms Knowledge Base",
						to: email,
						subject:
							"Confirm email address to create your account!",

						html: `<a href="http://${process.env.HOST}:${port}/create-user/token/${token}">Click here to create your account</a>`,
					})
					.then(async (res) => {
						await models.EmailToken.destroy({
							where: {
								email,
							},
						});

						let expiration = new Date();
						expiration.setHours(expiration.getHours() + 1);
						const emailToken = await models.EmailToken.create({
							token,
							email,
							expiration,
						});
						await emailToken.save();
						return true;
					})
					.catch((error) => {
						console.log(error);
						throw new Error("The email was invalid.");
					});
			} else {
				throw new Error("A user was found with this email address.");
			}
		},
	},
};

module.exports = resolvers;
