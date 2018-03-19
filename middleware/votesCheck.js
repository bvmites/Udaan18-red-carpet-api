module.exports = (request, response, next) => {
    try {
        const votes = request.body;
        let result = {};
        let flag = false;
        votes.forEach((i) => {
            if (result.hasOwnProperty(i.categoryId)) {
                flag = true;
            }
            else {
                result[i.categoryId] = true;
            }
        });
        if (flag) {
            throw new Error()
        }
        next();
    } catch (e) {
        console.log("two category ids found");
        response.status(401).json({message: "Two Category id Found!!!"});
    }
};