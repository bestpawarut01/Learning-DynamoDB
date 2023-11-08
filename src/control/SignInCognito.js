const AmazonCognitoIdentity = require("amazon-cognito-identity-js");

const poolData = {
	UserPoolId: process.env.AWS_COGNITO_USER_POOL_ID,
	ClientId: process.env.AWS_COGNITO_CLIENT_ID,
};
const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

// AWS Cognito
const asyncAuthenticateUser = (
	cognitoUser,
	cognitoAuthenticationDetails,
	newPassword
) => {
	return new Promise(function (resolve, reject) {
		cognitoUser.authenticateUser(cognitoAuthenticationDetails, {
			onSuccess: resolve,
			onFailure: reject,
			newPasswordRequired: (userAttributes, requiredAttributes) => {
				//the api doesn't accept this field back
				Object.keys(userAttributes).forEach(function (key) {
					if (key != "email") {
						delete userAttributes[key];
					}
				});

				cognitoUser.completeNewPasswordChallenge(
					newPassword,
					userAttributes,
					{
						onSuccess: resolve,
						onFailure: reject,
					}
				);
			},
		});
	});
};

exports.login = async (req, res) => {
	// console.log('Service AWSlogin')

	const { username, password, newPassword } = {
		username: req.body.username,
		password: req.body.password,
		newPassword: req.body.newPassword,
	};

	let userData = {
		Username: username,
		Pool: userPool,
	};

	let authenticationData = {
		Username: username,
		Password: password,
	};

	let authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(
		authenticationData
	);
	let cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);

	try {
		let result = await asyncAuthenticateUser(
			cognitoUser,
			authenticationDetails,
			newPassword
		);
		// console.log('Service')
		// console.log(result)
		if (result) {
			let accessToken = result.getAccessToken().getJwtToken();
			let idToken = result.getIdToken().getJwtToken();
			let refreshToken = result.getRefreshToken().getToken();

			return res.status(200).send({ accessToken, idToken, refreshToken });
		}
	} catch (error) {
		if (error.message === "New password is required.") {
			return res.status(200).send("New password is required");
		} else if (/Password does not conform to policy/.test(error.message)) {
			return res.status(200).send("InvalidPasswordException");
		}
		return res.status(200).send({ message: error.message, status: 400 });
	}
};
