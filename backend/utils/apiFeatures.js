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

    filter(){
        const queryStrCpy = {...this.querystr};
        //before
       // console.log(queryStrCpy);

        //Removing fields from query
        const RemoveFields = ['keyword','limit','page'];
        RemoveFields.forEach( field => delete queryStrCpy[field]);

         //after
         //console.log(queryStrCpy);
         var querystr = JSON.stringify(queryStrCpy);
         querystr = querystr.replace(/\b(gt|gte|lt|lte)/g, match => `$${match}`);

        console.log(querystr)

         this.query.find(JSON.parse(querystr));
         return this;
    }

    paginate(resPerPage){
        const currentPage = Number(this.querystr.page) || 1;
        const skip = resPerPage * (currentPage-1);
        this.query.limit(resPerPage).skip(skip);
        return this;
    }
}

module.exports = APIFeatures;