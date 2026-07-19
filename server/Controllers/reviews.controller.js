// import Review from '../Models/reviews.model.js'

// const ReviewController = {

//     getReviews: async (req, res)=>{
//         try{
//             const reviews = await Review.find({})
//             res.status(200).json(reviews)
//         }
//         catch(err){
//             res.status(500).json({error: err})
//         } 
        
//     },


//     deleteReview: async (req, res) => {
//           const id = req.params.id
    
//         try{
//             await Review.findByIdAndDelete(id)
//             const review = await Review.find({})
//             res.json(review)
//         }catch(err){
//             res.status(500).json({error: err})
//         }  
//     },



//     getReviewById: async (req, res) => {
//       try {
//           const id = req.params.id;
//           const review = await Review.findById(id)

//         if (!review) {
//             return res.status(404).json({ message: "Review not found" })
//         }

//         res.status(200).json(review)
//         } catch (error) {
//             res.status(500).json({ error: error })
//         }
//     },

//     addReview: async (req, res)=>{
//         const {text, numStars, date} = req.body
    
//         try{
//             const newReview = new Review({
//             text, 
//             numStars, 
//             date
//         })
    
//         await newReview.save()
    
//         const review = await Review.find({})
//         res.status(200).json(review)
    
//         }catch(err){
//             console.log(err)
//             res.status(500).json({error: err})
//         }
//     },

//     updateReview: async (req, res)=>{
//         const id = req.params.id
//         const {text, numStars, date} = req.body
    
//         try{
//             const findReview = await Review.findById(id)
    
//             if(!findReview){
//                 return res.status(404).json({message: "Review not found"})
//             }
    
//             findReview.text=text
//             findReview.numStars=numStars
//             findReview.date=date
            
            
            
//             await findReview.save()
    
//             const update = await Review.find({})
            
//             res.status(200).json(update)
//         }
//         catch(err){
//             res.status(500).json({error: err})
//         }
//     }

// }



// export default ReviewController;

