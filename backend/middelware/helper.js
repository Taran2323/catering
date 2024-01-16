const jwt = require("jsonwebtoken");
const users = require("../model/userSchema");
const secret = "testingEncription123@";
module.exports = {

  checkValidation: async (v) => {
    var errorsResponse;

    await v.check().then(function (matched) {
      if (!matched) {
        var valdErrors = v.errors;
        var respErrors = [];
        Object.keys(valdErrors).forEach(function (key) {
          if (valdErrors && valdErrors[key] && valdErrors[key].message) {
            respErrors.push(valdErrors[key].message);
          }
        });
        errorsResponse = respErrors.join(", ");
      }
    });
    return errorsResponse;
  },

  failed: (res, message = "") => {
    message =
      typeof message === "object"
        ? message.message
          ? message.message
          : ""
        : message;
    return res.status(400).json({
      success: false,
      code: 400,
      message: message,
      body: {},
    });
  },
  success: (res, message = "", body = {}) => {
    return res.status(200).json({
      success: true,
      code: 200,
      message: message,
      body: body,
    });
    node;
  },
  async fileUpload(files, folder = "users") {
    const file_name_string = files.name;
    const file_name_array = file_name_string.split(".");
    const file_ext = file_name_array[file_name_array.length - 1];

    const letters = "ABCDE1234567890FGHJK1234567890MNPQRSTUXY";
    let result = "";

    while (result.length < 28) {
      const rand_int = Math.floor(Math.random() * 19 + 1);
      const rand_chr = letters[rand_int];
      if (result.substr(-1, 1) !== rand_chr) result += rand_chr;
    }

    const resultExt = `${result}.${file_ext}`;

    console.log("🚀 ~ file: file.js:2--1 ~ fileUpload ~ resultExt:", resultExt);
    await files.mv(`public/images/${folder}/${resultExt}`, function (err) {
      if (err) {
        throw err;
      }
    });

    return resultExt;
  },

  error: function (res, err, req) {
    console.log(err, "===========================>error");
    let code = typeof err === "object" ? (err.code ? err.code : 403) : 403;
    let message =
      typeof err === "object" ? (err.message ? err.message : "") : err;

    if (req) {
      req.flash("flashMessage", {
        color: "error",
        message,
      });

      const originalUrl = req.originalUrl.split("/")[1];
      return res.redirect(`/${originalUrl}`);
    }

    return res.status(code).json({
      success: false,
      message: message,
      code: code,
      body: {},
    });
  },
  authenticateJWT: async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
      const token = authHeader.split(" ")[1];

      jwt.verify(token, secret, async (err, user) => {
        if (err) {
          return res.sendStatus(403);
        }
        let userInfo = await users.findOne({
          _id: user._id,
        });
        if (userInfo) {
          userInfo = JSON.parse(JSON.stringify(userInfo));
          req.user = userInfo;
          console.log(req.user);
          next();
        } else {
          return helper.error(res, "Please Login First");
        }
      });
    } else {
      res.sendStatus(401);
    }
  },
};
