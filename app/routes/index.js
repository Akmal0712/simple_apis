const router = (app) => {
  const passport = require("passport");
  const fileUpload = require("express-fileupload");
  const bodyParser = require("body-parser");

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(fileUpload());
  require("../middleware/pass")(passport);
  app.use(passport.initialize());

  const rolesMiddleware = require("../middleware/rolesMiddleware");

  const filesApi = require("./api/file");
  app.use("/api/file",
    passport.authenticate("jwt", { session: false }),
    rolesMiddleware,
    filesApi
  );

  const auth = require("./auth");
  app.use("/", auth);
};

module.exports = router;