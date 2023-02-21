const {responseHandle} = require('../utils/response-handle.util')

exports.apiHandler = (asyncCb) => {
    return async (req, res, next) => {
        // console.log(req, "req");
        try {
            const { lang } = req.headers
            const { user, auth_provider } = req
            const data = { user, auth_provider, ...req.body, ...req.query,...req.params, lang, next }
            const result = await asyncCb(data)
            await responseHandle(result, req, res)

        } catch (error) {
            next(error)
        }
    }
}

exports.apiFilesHandler = (asyncCb) => {
    return async (req, res, next) => {
        try {
            const { lang } = req.headers
            const result = await asyncCb({req, next, lang})
            await responseHandle(result, req, res)
        } catch (error) {
            next(error)
        }
    }
}
