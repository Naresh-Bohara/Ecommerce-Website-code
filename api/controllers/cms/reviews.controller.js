const { errorMsg } = require("@/lib")
const { Review } = require("@/models")

class ReviewsCtrl {

index = async(req, res, next)=>{
    try{
      let reviews = await Review.aggregate([
        {$lookup:{from:"products", localField:"productId", foreignField:"_id", as:"product"}},
        {$lookup:{from:"users", localField:"userId", foreignField:"_id", as:"user"}}
      ])

      for(let i in reviews){
        reviews[i].product = reviews[i].product[0]
        reviews[i].user = reviews[i].user[0]
      }

      res.send(reviews)
    }catch(err){
       return errorMsg(err, next)
    }
}

destroy = async(req, res, next)=>{
    try{
      await Review.findByIdAndDelete(req.params.id)

      res.send({
        message: "Review deleted successfully."
      })
    }catch(err){
       return errorMsg(err, next)
    }
}
}

module.exports = new ReviewsCtrl