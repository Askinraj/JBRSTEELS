class APIFeatures{
    constructor(query,querystr){
        this.query = query;
        this.querystr = querystr;

    }

    search(){
        var keyword = this.querystr.keyword ? {
            name:{
                $regex: this.querystr.keyword,
                $options: 'i'
            }
        } : {};
        this.query.find({...keyword})
        return this;
    }
}

module.exports = APIFeatures;