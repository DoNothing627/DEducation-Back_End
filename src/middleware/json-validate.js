const Ajv = require("ajv");
const statusCode = require("http-status-codes");
const ajv = new Ajv(); // options can be passed, e.g. {allErrors: true}

const jsonValidate = (schema) => {
  const validate = ajv.compile(schema);

  return (req, res, next) => {
    const data = { ...req.body, ...req.query };
    const { lang } = req.headers;
    // if (!["en", "vi", "th"].includes(String(lang))) {
    //     return res.status(statusCode.UNPROCESSABLE_ENTITY).json({
    //         msg: `lang = ${lang} - incorrect`
    //     });
    // }
    const valid = validate(data);
    if (!valid) {
      console.log(validate);
      console.log(validate.errors[0]);
      console.log(
        validate.errors[0].instancePath + " " + validate.errors[0].message
      );

      let error = validate.errors[0];
      if (error.instancePath == "") {
        error = [
          {
            src: error.params.missingProperty,
            err: "Must have required property " + error.params.missingProperty,
            ...error.params,
          },
        ];
      } else {
        error = [
          {
            src: error.instancePath.substring(1, error.instancePath.length),
            err: error.message,
            ...error.params,
          },
        ];
      }
      res.status(statusCode.UNPROCESSABLE_ENTITY).json({
        msg: validate.errors[0].instancePath + " " + validate.errors[0].message,
        errs: error,
      });
    } else {
      return next();
    }
  };
};

const _jsonValidate = (validate, data) => {
  const valid = validate(data);
  if (!valid) {
    console.log(validate);
    console.log(validate.errors[0]);
    console.log(
      validate.errors[0].instancePath + " " + validate.errors[0].message
    );

    let error = validate.errors[0];
    if (error.instancePath == "") {
      error = [
        {
          src: error.params.missingProperty,
          err: "Must have required property " + error.params.missingProperty,
          ...error.params,
        },
      ];
    } else {
      error = [
        {
          src: error.instancePath.substring(1, error.instancePath.length),
          err: error.message,
          ...error.params,
        },
      ];
    }
    return [
      false,
      {
        msg: validate.errors[0].instancePath + " " + validate.errors[0].message,
        errs: error,
      },
    ];
  } else {
    return [true, "OK"];
  }
};

const jsonValidates = (schemas) => {
  if (!Array.isArray(schemas)) {
    schemas = [schemas];
  }
  const validates = schemas.map((schema) => {
    return ajv.compile(schema);
  });

  return (req, res, next) => {
    const data = { ...req.body, ...req.query };
    const { lang } = req.headers;
    if (!["en", "vi", "th"].includes(String(lang))) {
      return res.status(statusCode.UNPROCESSABLE_ENTITY).json({
        msg: `lang = ${lang} - incorrect`,
      });
    }

    let errors = [];
    for (let i = 0; i < validates.length; i++) {
      // console.log(validates[i])
      const validate = validates[i];
      let result = _jsonValidate(validate, data);
      // console.log(result)
      if (result[0] == true) {
        return next();
      }
      errors.push(result[1]);
    }

    res.status(statusCode.UNPROCESSABLE_ENTITY).json(errors);
  };
};

module.exports = { jsonValidate, jsonValidates };
