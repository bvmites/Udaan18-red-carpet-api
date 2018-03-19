module.exports = (request, response, next) => {
    try {
        let result = [];
        let flag = true;
        result.forEach((id) => {
            id = request.body.categoryId;
        });
        console.log(result);
        request.body.forEach((i) => {
            if (i.categoryId in result) {
                throw new Error()
            } else {
                flag = false;
            }
        });
        if (flag === false) {
            throw new Error()
        }
        next();
    } catch (e) {
        console.log("two category ids found");
        response.sendStatus(401).json({message: "Two Category id Found!!!"});
    }
};